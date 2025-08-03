import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function useAuthRedirect() {
  const { user, isAdmin, isCustomer, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Wait for auth to load

    if (user) {
      if (isAdmin) {
        router.push('/admin');
      } else if (isCustomer) {
        router.push('/customer/dashboard');
      }
    }
  }, [user, isAdmin, isCustomer, loading, router]);
}