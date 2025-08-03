'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireCustomer?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false, requireCustomer = false }: ProtectedRouteProps) {
  const { user, isAdmin, isCustomer, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    if (requireAdmin && !isAdmin) {
      router.push('/login');
      return;
    }

    if (requireCustomer && !isCustomer) {
      router.push('/login');
      return;
    }
  }, [user, isAdmin, isCustomer, loading, router, requireAdmin, requireCustomer]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  if (requireAdmin && !isAdmin) {
    return null;
  }

  if (requireCustomer && !isCustomer) {
    return null;
  }

  return <>{children}</>;
}