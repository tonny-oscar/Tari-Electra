
'use client'; // AdminLayout must be a client component for auth checks

import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Newspaper, Settings, ShoppingBag, Loader2 } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

// Metadata can still be defined for client components, Next.js handles it
// export const metadata: Metadata = { // This will be static for the layout
//   title: 'Admin Dashboard - Tari Electra',
//   description: 'Manage Tari Electra website content.',
// };


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/admin');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-muted/40">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading Admin Area...</p>
      </div>
    );
  }

  if (!user) {
    // This case should ideally be handled by the redirect in useEffect,
    // but as a fallback or if JS is disabled momentarily.
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-muted/40">
        <p className="text-muted-foreground">Redirecting to login...</p>
      </div>
    );
  }

  const handleLogout = async () => {
    await logOut();
    // AuthProvider's logOut already handles redirecting to '/'
  };


  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-lg font-semibold md:text-base text-primary"
          >
            <Settings className="h-6 w-6" />
            <span>Tari Electra Admin</span>
          </Link>
          <Link
            href="/admin"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Home className="h-4 w-4 mr-1 inline-block" />
            Dashboard
          </Link>
          <Link
            href="/admin/blog"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Newspaper className="h-4 w-4 mr-1 inline-block" />
            Blog Management
          </Link>
          <Link
            href="/admin/products"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <ShoppingBag className="h-4 w-4 mr-1 inline-block" />
            Product Management
          </Link>
        </nav>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <div className="ml-auto flex items-center gap-x-3">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user.email}
            </span>
            <ThemeToggle />
            <Button onClick={handleLogout} variant="outline" size="sm">
              Logout
            </Button>
            <Button asChild variant="outline" size="sm" className="hidden sm:flex">
              <Link href="/">View Public Site</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {children}
      </main>
    </div>
  );
}
