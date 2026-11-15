import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { createRedisClient } from '../config/redis';

// Rate limiter configurations
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests from this IP, please try again later.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth limiter - stricter
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // Limit auth attempts to 20 per 15 minutes
  message: {
    success: false,
    error: {
      code: 'AUTH_RATE_LIMIT',
      message: 'Too many authentication attempts, please try again later.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// API limiter
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // Limit each IP to 60 requests per minute
  message: {
    success: false,
    error: {
      code: 'API_RATE_LIMIT',
      message: 'Too many API requests, please slow down.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Pharmacy-specific limiter
export const pharmacyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // Limit pharmacy operations
  message: {
    success: false,
    error: {
      code: 'PHARMACY_RATE_LIMIT',
      message: 'Pharmacy rate limit exceeded.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Doctor-specific limiter
export const doctorLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30, // Limit doctor operations
  message: {
    success: false,
    error: {
      code: 'DOCTOR_RATE_LIMIT',
      message: 'Doctor rate limit exceeded.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// JWT request ID middleware
export const requestId = (req: Request, res: Response, next: NextFunction): void => {
  req.headers['x-request-id'] ||= crypto.randomUUID();
  next();
};