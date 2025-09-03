'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { BarChart3, Users } from 'lucide-react';
import Link from 'next/link';

export function AuthButtons() {
  const { user, isAdmin, isCustomer } = useAuth();

  return (
    <>
      {!user && (
        <Button
          asChild
          size="lg"
          className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-4 text-lg shadow-xl hover:scale-105 transition-transform"
        >
          <Link href="/signup">Get Started Free</Link>
        </Button>
      )}
      
      {user && (
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          {isAdmin && (
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link href="/admin">
                <BarChart3 className="mr-2 h-5 w-5" />
                Admin Dashboard
              </Link>
            </Button>
          )}
          {isCustomer && (
            <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90">
              <Link href="/customer/dashboard">
                <Users className="mr-2 h-5 w-5" />
                My Dashboard
              </Link>
            </Button>
          )}
        </div>
      )}
    </>
  );
}