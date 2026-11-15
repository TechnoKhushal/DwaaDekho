import type { AuthenticatedUser, UserRole } from '../middleware/authorize.js';

const roles: readonly UserRole[] = ['buyer', 'pharmacy_owner', 'pharmacy_staff', 'doctor', 'admin'];

export interface VerifiedAuthClaims {
  sub?: unknown;
  email?: unknown;
  app_metadata?: unknown;
}

export function userFromVerifiedClaims(claims: VerifiedAuthClaims): AuthenticatedUser | null {
  if (typeof claims.sub !== 'string' || claims.sub.trim() === '') return null;
  const metadata = typeof claims.app_metadata === 'object' && claims.app_metadata !== null
    ? claims.app_metadata as Record<string, unknown>
    : {};
  const claimRole = metadata.role;

  return {
    id: claims.sub,
    ...(typeof claims.email === 'string' ? { email: claims.email } : {}),
    role: typeof claimRole === 'string' && roles.includes(claimRole as UserRole) ? claimRole as UserRole : 'buyer',
  };
}
