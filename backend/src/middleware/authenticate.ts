import type { NextFunction, Request, Response } from 'express';
import { verifySupabaseToken } from '../config/supabase.js';
import { userFromVerifiedClaims } from '../domain/auth.js';
import type { AuthenticatedRequest } from './authorize.js';

function attachAuthenticatedUser(req: Request, payload: { sub?: unknown; email?: unknown; app_metadata?: unknown }): boolean {
  const user = userFromVerifiedClaims(payload);
  if (!user) return false;
  (req as AuthenticatedRequest).user = user;
  return true;
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ') || !authHeader.slice(7).trim()) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Missing or invalid authorization header',
        },
      });
      return;
    }

    const token = authHeader.slice(7).trim();

    // Verify Supabase JWT
    const payload = await verifySupabaseToken(token);
    if (!payload || !attachAuthenticatedUser(req, payload)) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid or expired token',
        },
      });
      return;
    }

    next();
  } catch {
    res.status(500).json({
      success: false,
      error: {
        code: 'AUTH_ERROR',
        message: 'Authentication failed',
      },
    });
  }
};

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      next();
      return;
    }

    if (!authHeader.startsWith('Bearer ') || !authHeader.slice(7).trim()) {
      res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid authorization header.' } });
      return;
    }

    const token = authHeader.slice(7).trim();
    const payload = await verifySupabaseToken(token);

    if (!payload || !attachAuthenticatedUser(req, payload)) {
      res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token.' } });
      return;
    }

    next();
  } catch {
    res.status(500).json({ success: false, error: { code: 'AUTH_ERROR', message: 'Authentication failed.' } });
  }
};
