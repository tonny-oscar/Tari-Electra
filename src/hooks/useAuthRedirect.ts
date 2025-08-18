import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function useAuthRedirect() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return; // wait until Firebase finishes loading

    // If user is not logged in and not on login/signup → send to login
    if (!user && pathname !== '/login' && pathname !== '/signup') {
      router.push('/login');
      return;
    }

    // If admin logs in, redirect to admin
    if (user && isAdmin && !pathname.startsWith('/admin')) {
      router.push('/admin');
      return;
    }

    // If customer logs in, redirect to customer dashboard
    if (user && !isAdmin && !pathname.startsWith('/customer')) {
      router.push('/customer/dashboard');
      return;
    }
  }, [user, isAdmin, loading, router, pathname]);
}
