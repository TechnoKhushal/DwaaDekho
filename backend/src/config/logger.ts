// Logger configuration for DwaaDekho backend
import pino, { LoggerOptions } from 'pino';

const isDev = process.env.NODE_ENV !== 'production';

const loggerOptions: LoggerOptions = {
  level: isDev ? 'debug' : 'info',
  base: {
    service: 'dwaadekho-backend',
  },
  redact: {
    paths: [
      'req.headers.authorization',
      'req.body.password',
      'req.body.token',
      'req.body.passwordHash',
    ],
    censor: '[REDACTED]',
  },
};

if (isDev) {
  loggerOptions.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  };
}

export const logger = pino(loggerOptions);

// Request logging middleware
export const requestLogger = (req: any, res: any, next: any) => {
  const start = Date.now();
  req.id = req.headers['x-request-id'] || crypto.randomUUID();

  logger.info({
    requestId: req.id,
    method: req.method,
    path: req.path,
    query: req.query,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id,
  });

  res.on('finish', () => {
    logger.info({
      requestId: req.id,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      responseTime: Date.now() - start,
    });
  });

  next();
};

export default logger;