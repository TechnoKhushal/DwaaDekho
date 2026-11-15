import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

export interface AppError extends Error {
  code: string;
  statusCode: number;
  details?: unknown[];
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;

  // Log error with correlation ID
  logger.error(
    {
      error: {
        name: err.name,
        message: err.message,
        code: err.code,
        stack: err.stack,
      },
      request: {
        method: req.method,
        path: req.path,
        ip: req.ip,
        userId: req.user?.id,
        userAgent: req.get('User-Agent'),
        requestId: req.headers['x-request-id'],
      },
    },
    { requestId: req.headers['x-request-id'] as string }
  );

  // Don't leak stack traces in production
  const response = {
    success: false,
    error: {
      code: err.code,
      message: err.message,
    },
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    ...(err.details && { details: err.details }),
  };

  res.status(statusCode).json(response);
};

// Centralized error creation
export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 500,
    public details?: unknown[]
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Common error helpers
export const errors = {
  validation: (message: string, details?: unknown[]) =>
    new AppError('VALIDATION_ERROR', message, 422, details),

  unauthorized: (message: string = 'Unauthorized') =>
    new AppError('UNAUTHORIZED', message, 401),

  forbidden: (message: string = 'Forbidden') =>
    new AppError('FORBIDDEN', message, 403),

  notFound: (message: string = 'Not Found') =>
    new AppError('NOT_FOUND', message, 404),

  conflict: (message: string = 'Conflict') =>
    new AppError('CONFLICT', message, 409),

  rateLimited: (message: string = 'Rate limit exceeded') =>
    new AppError('RATE_LIMIT_EXCEEDED', message, 429),

  serverError: (message: string = 'Internal Server Error') =>
    new AppError('INTERNAL_SERVER_ERROR', message, 500),
};

// Global error handler setup
export const setupErrorHandler = (app: import('express').Express): void => {
  app.use((err: any, req: Request, res: Response, next: NextFunction): void => {
    let appError: AppError;

    if (err instanceof AppError) {
      appError = err;
    } else {
      appError = new AppError('INTERNAL_SERVER_ERROR', err.message || 'Unknown error');
    }

    errorHandler(appError, req, res, next);
  });
};