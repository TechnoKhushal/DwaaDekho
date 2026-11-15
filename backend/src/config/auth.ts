// Authentication configuration for DwaaDekho backend
import { supabaseAdmin } from './supabase';

// Types for authenticated user
export interface AuthUser {
  id: string;
  email: string;
  role: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  metadata: Record<string, unknown>;
}

// Scoped role types for middleware
export type UserRole = 'buyer' | 'pharmacy_owner' | 'pharmacy_staff' | 'doctor' | 'admin';

// Create user in Supabase Auth
export async function createAuthUser(
  email: string,
  password: string,
  role: UserRole,
  metadata: Record<string, unknown> = {}
): Promise<{ user: AuthUser | null; error: string | null }> {
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      role,
      ...metadata,
    },
  });

  if (error) return { user: null, error: error.message };

  return {
    user: {
      id: data.user.id,
      email: data.user.email!,
      role: data.user.app_metadata?.role || 'buyer',
      emailVerified: data.user.email_confirmed_at ? true : false,
      phoneVerified: data.user.phone_confirmed_at ? true : false,
      metadata: data.user.user_metadata,
    },
    error: null,
  };
}

// Get user by ID
export async function getAuthUser(userId: string): Promise<{ user: AuthUser | null; error: string | null }> {
  const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);

  if (error || !data.user) return { user: null, error: error?.message || 'User not found' };

  return {
    user: {
      id: data.user.id,
      email: data.user.email!,
      role: data.user.app_metadata?.role || 'buyer',
      emailVerified: data.user.email_confirmed_at ? true : false,
      phoneVerified: data.user.phone_confirmed_at ? true : false,
      metadata: data.user.user_metadata,
    },
    error: null,
  };
}

// Update user role (admin only)
export async function updateUserRole(
  userId: string,
  role: UserRole,
  grantedBy: string
): Promise<{ success: boolean; error: string | null }> {
  void grantedBy;
  const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    app_metadata: { role, roleGrantedBy: grantedBy },
  });

  if (error) return { success: false, error: error.message };
  return { success: true, error: null };
}

// Delete user (admin only)
export async function deleteAuthUser(userId: string): Promise<{ success: boolean; error: string | null }> {
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (error) return { success: false, error: error.message };
  return { success: true, error: null };
}

// Initiate password reset
export async function initiatePasswordReset(email: string): Promise<{ success: boolean; error: string | null }> {
  const { error } = await supabaseAdmin.auth.admin.generateLink({
    type: 'recovery',
    email,
  });

  if (error) return { success: false, error: error.message };
  return { success: true, error: null };
}

// Update password after reset
export async function updatePassword(
  userId: string,
  newPassword: string
): Promise<{ success: boolean; error: string | null }> {
  const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    password: newPassword,
  });

  if (error) return { success: false, error: error.message };
  return { success: true, error: null };
}

// Sign out user (invalidate tokens)
export async function signOutUser(userId: string): Promise<{ success: boolean; error: string | null }> {
  const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    data: { revoked_at: new Date().toISOString() },
  });

  if (error) return { success: false, error: error.message };
  return { success: true, error: null };
}

// Check if user is pharmacy owner
export function isPharmacyOwner(role: string): boolean {
  return role === 'pharmacy_owner';
}

// Check if user is pharmacy staff
export function isPharmacyStaffRole(role: string): boolean {
  return role === 'pharmacy_staff';
}

// Check if user is doctor
export function isDoctorRole(role: string): boolean {
  return role === 'doctor';
}

// Check if user is buyer
export function isBuyerRole(role: string): boolean {
  return role === 'buyer';
}

// Check if user is admin
export function isAdminRole(role: string): boolean {
  return role === 'admin';
}
