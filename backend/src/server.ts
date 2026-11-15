import 'dotenv/config';
import cors from 'cors';
import express, { type ErrorRequestHandler, type Request, type Response } from 'express';
import { randomUUID } from 'node:crypto';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { rateLimit } from 'express-rate-limit';
import { healthCheck, prisma } from './config/database.js';
import { findNearbyPharmacies } from './services/pharmacy-discovery.service.js';

const app = express();
app.disable('x-powered-by');

const configuredOrigins = (process.env.ALLOWED_ORIGINS ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOrigins = configuredOrigins.length > 0
  ? configuredOrigins
  : process.env.NODE_ENV === 'production'
    ? []
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'];

app.use(cors({
  origin(origin, callback) {
    callback(null, !origin || allowedOrigins.includes(origin));
  },
  maxAge: 86_400,
}));

app.use((req, res, next) => {
  void req;
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'; base-uri 'none'");
  next();
});

app.use(express.json({ limit: '1mb' }));
app.use((req, res, next) => {
  void req;
  const requestId = randomUUID();
  res.setHeader('X-Request-Id', requestId);
  next();
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 120,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { success: false, error: { code: 'RATE_LIMITED', message: 'Too many requests. Try again later.' } },
});

app.get('/health/live', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/health/ready', async (_req, res) => {
  const ready = await healthCheck();
  res.status(ready ? 200 : 503).json({ status: ready ? 'ready' : 'not_ready' });
});

app.get('/api/v1/medicines', apiLimiter, async (req: Request, res: Response, next) => {
  try {
    const rawQuery = req.query.q;
    const rawLimit = req.query.limit;
    if ((rawQuery !== undefined && typeof rawQuery !== 'string') || (rawLimit !== undefined && typeof rawLimit !== 'string')) {
      res.status(400).json({ success: false, error: { code: 'INVALID_QUERY', message: 'Search parameters must be single values.' } });
      return;
    }

    const query = rawQuery?.trim() ?? '';
    if (query.length > 100) {
      res.status(400).json({ success: false, error: { code: 'INVALID_QUERY', message: 'Search text must be 100 characters or fewer.' } });
      return;
    }

    const limit = rawLimit === undefined ? 25 : Number(rawLimit);
    if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
      res.status(400).json({ success: false, error: { code: 'INVALID_LIMIT', message: 'Limit must be an integer from 1 to 50.' } });
      return;
    }

    const medicines = await prisma.medicine.findMany({
      ...(query ? { where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' as const } },
          { genericName: { contains: query, mode: 'insensitive' as const } },
        ],
      } } : {}),
      take: limit,
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        genericName: true,
        brand: { select: { name: true } },
        dosageForm: { select: { name: true } },
        category: { select: { name: true } },
        strength: { select: { amount: true, unit: true } },
      },
    });

    res.json({ success: true, data: medicines });
  } catch (error) {
    next(error);
  }
});

app.get('/api/v1/medicines/:id', apiLimiter, async (req: Request, res: Response, next) => {
  try {
    const medicineId = req.params.id;
    if (typeof medicineId !== 'string' || medicineId.length > 100) {
      res.status(400).json({ success: false, error: { code: 'INVALID_ID', message: 'Medicine ID is invalid.' } });
      return;
    }

    const medicine = await prisma.medicine.findUnique({
      where: { id: medicineId },
      select: {
        id: true,
        name: true,
        genericName: true,
        brand: { select: { name: true } },
        dosageForm: { select: { name: true } },
        category: { select: { name: true } },
        strength: { select: { amount: true, unit: true } },
      },
    });

    if (!medicine) {
      res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Medicine not found.' } });
      return;
    }
    res.json({ success: true, data: medicine });
  } catch (error) {
    next(error);
  }
});

app.get('/api/v1/pharmacies/nearby', apiLimiter, async (req: Request, res: Response, next) => {
  const getSingleValue = (value: unknown): string | null => typeof value === 'string' ? value : null;
  const rawLatitude = getSingleValue(req.query.lat);
  const rawLongitude = getSingleValue(req.query.lng);
  const rawRadius = getSingleValue(req.query.radius);
  const rawMinRating = getSingleValue(req.query.minRating);
  const rawJanAushadhi = getSingleValue(req.query.janAushadhi);
  const rawIsOpen = getSingleValue(req.query.isOpen);

  if (rawLatitude === null || rawLongitude === null || (req.query.radius !== undefined && rawRadius === null)
    || (req.query.minRating !== undefined && rawMinRating === null)
    || (req.query.janAushadhi !== undefined && rawJanAushadhi === null)
    || (req.query.isOpen !== undefined && rawIsOpen === null)) {
    res.status(400).json({ success: false, error: { code: 'INVALID_QUERY', message: 'Location and filter values must be single query parameters.' } });
    return;
  }

  const latitude = Number(rawLatitude);
  const longitude = Number(rawLongitude);
  const radiusKm = rawRadius === null ? 5 : Number(rawRadius);
  const minRating = rawMinRating === null ? undefined : Number(rawMinRating);
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90
    || !Number.isFinite(longitude) || longitude < -180 || longitude > 180
    || !Number.isInteger(radiusKm) || radiusKm < 1 || radiusKm > 10
    || (minRating !== undefined && (!Number.isFinite(minRating) || minRating < 0 || minRating > 5))
    || (rawJanAushadhi !== null && rawJanAushadhi !== 'true' && rawJanAushadhi !== 'false')
    || (rawIsOpen !== null && rawIsOpen !== 'true' && rawIsOpen !== 'false')) {
    res.status(400).json({ success: false, error: { code: 'INVALID_QUERY', message: 'Location, radius, or pharmacy filters are out of range.' } });
    return;
  }

  try {
    const pharmacies = await findNearbyPharmacies(latitude, longitude, radiusKm, {
      ...(minRating === undefined ? {} : { minRating }),
      ...(rawJanAushadhi === null ? {} : { isJanAushadhi: rawJanAushadhi === 'true' }),
      ...(rawIsOpen === null ? {} : { isOpen: rawIsOpen === 'true' }),
    });
    res.json({ success: true, data: pharmacies, meta: { count: pharmacies.length } });
  } catch (error) {
    next(error);
  }
});

app.use((req, res) => {
  void req;
  res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Endpoint not found.' } });
});

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  void req;
  void next;
  if (error?.type === 'entity.too.large') {
    res.status(413).json({ success: false, error: { code: 'PAYLOAD_TOO_LARGE', message: 'Request body exceeds the 1 MB limit.' } });
    return;
  }
  res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'The request could not be completed.' } });
};
app.use(errorHandler);

const currentFile = fileURLToPath(import.meta.url);
if (process.argv[1] && resolve(process.argv[1]) === currentFile) {
  if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required to start the production API.');
  }
  const port = Number(process.env.PORT ?? 5000);
  app.listen(port, () => {
    console.info(`DwaaDekho API listening on port ${port}`);
  });
}

export { app };
