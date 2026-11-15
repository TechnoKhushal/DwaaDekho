import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isAuthenticated = status === 'authenticated';
  const user = session?.user;
  const role = user?.role as 'buyer' | 'pharmacy' | 'doctor' | 'admin' | undefined;

  const signOut = async () => {
    // next-auth sign out
    router.push('/');
  };

  const isRole = (roles: ('buyer' | 'pharmacy' | 'doctor' | 'admin')[]) => {
    return roles.includes(role as any);
  };

  return {
    isAuthenticated,
    user,
    role,
    signOut,
    isBuyer: isRole(['buyer']),
    isPharmacy: isRole(['pharmacy']),
    isDoctor: isRole(['doctor']),
    isAdmin: isRole(['admin']),
  };
}

export function requireAuth() {
  // This would be used in server components or middleware
  throw new Error('Authentication required');
}

export function requireRole(roles: ('buyer' | 'pharmacy' | 'doctor' | 'admin')[]) {
  // This would be used in server components or middleware
  throw new Error('Insufficient permissions');
}