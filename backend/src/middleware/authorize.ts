import type { NextFunction, Request, Response } from 'express';

export type UserRole = 'buyer' | 'pharmacy_owner' | 'pharmacy_staff' | 'doctor' | 'admin';

export interface AuthenticatedUser {
  id: string;
  email?: string;
  role: UserRole;
}

export type AuthenticatedRequest = Request & { user?: AuthenticatedUser };

export function authorize(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as AuthenticatedRequest).user;
    if (!user) {
      res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication is required.' },
      });
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Insufficient permissions.' },
      });
      return;
    }

    next();
  };
}

export const isBuyer = authorize('buyer');
export const isPharmacyOwner = authorize('pharmacy_owner');
export const isPharmacyStaff = authorize('pharmacy_staff');
export const isDoctor = authorize('doctor');
export const isAdmin = authorize('admin');
export const canAccessPharmacyResources = authorize('pharmacy_owner', 'pharmacy_staff');
export const canAccessDoctorResources = authorize('doctor');
export const canAccessAdminResources = authorize('admin');

export const isBuyerRole = (role: string): role is 'buyer' => role === 'buyer';
export const isPharmacyRole = (role: string): role is 'pharmacy_owner' | 'pharmacy_staff' =>
  role === 'pharmacy_owner' || role === 'pharmacy_staff';
export const isDoctorRole = (role: string): role is 'doctor' => role === 'doctor';
export const isAdminRole = (role: string): role is 'admin' => role === 'admin';
