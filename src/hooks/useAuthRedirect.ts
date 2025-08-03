import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function useAuthRedirect() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (pathname === '/login' || pathname === '/signup') return;

    if (!user) {
      router.push('/login');
    } else if (isAdmin && !pathname.startsWith('/admin')) {
      router.push('/admin');
    } else if (!isAdmin && !pathname.startsWith('/customer')) {
      router.push('/customer/dashboard');
    }
  }, [user, isAdmin, loading, router, pathname]);
}