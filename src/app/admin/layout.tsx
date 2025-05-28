
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Bell,
  CircleUser,
  Home,
  LayoutDashboard,
  Menu,
  Newspaper,
  MessageSquare, // Added for messages
  ShoppingBag, // Added for products
  Settings,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Loader2 } from 'lucide-react'; // For loading state
import { NotificationBell } from '@/components/admin/NotificationBell';
import { useToast } from '@/hooks/use-toast';

const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/blog', label: 'Blog Management', icon: Newspaper },
  { href: '/admin/products', label: 'Product Management', icon: ShoppingBag },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logOut } = useAuth();
  const router = useRouter();
  const [isAdminRouteAllowed, setIsAdminRouteAllowed] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    console.log(`[AdminLayout] Auth State Change: loading=${loading}, user=${user ? user.email : 'null'}`);

    if (loading) {
      console.log('[AdminLayout] Still loading authentication state.');
      return;
    }

    if (!user) {
      console.log('[AdminLayout] No user authenticated. Redirecting to login.');
      router.push('/login?redirect=/admin');
      return;
    }

    // User is authenticated, now check for admin privileges
    const configuredAdminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

    if (!configuredAdminEmail || configuredAdminEmail.trim() === "") {
      console.error(
        `[AdminLayout] CRITICAL: NEXT_PUBLIC_ADMIN_EMAIL environment variable is not set or is empty. 
        This is required for admin access. Please set it in your .env.local file and restart your server.`
      );
      setIsAdminRouteAllowed(false);
      router.push('/'); // Redirect to home page or a general error page
      toast({ 
        title: 'Admin Configuration Error', 
        description: 'The admin email is not configured. Please contact support.', 
        variant: 'destructive', 
        duration: 10000 
      });
      return;
    }

    const loggedInUserEmail = user.email?.trim().toLowerCase();
    const adminEmailLower = configuredAdminEmail.trim().toLowerCase();

    console.log(`[AdminLayout] Admin Check:`);
    console.log(`  - User Email (from auth): "${user.email}" (length: ${user.email?.length})`);
    console.log(`  - Processed User Email:   "${loggedInUserEmail}" (length: ${loggedInUserEmail?.length})`);
    console.log(`  - Admin Email (from env): "${configuredAdminEmail}" (length: ${configuredAdminEmail?.length})`);
    console.log(`  - Processed Admin Email:  "${adminEmailLower}" (length: ${adminEmailLower?.length})`);


    if (loggedInUserEmail && loggedInUserEmail === adminEmailLower) {
      console.log('[AdminLayout] Admin access GRANTED.');
      setIsAdminRouteAllowed(true);
    } else {
      console.log('[AdminLayout] Admin access DENIED. User is not the configured admin.');
      setIsAdminRouteAllowed(false);
      router.push('/');
      toast({ 
        title: 'Access Denied', 
        description: 'You do not have permission to access the admin area.', 
        variant: 'destructive', 
        duration: 7000 
      });
    }
  }, [user, loading, router, toast]);

  const handleLogout = async () => {
    await logOut();
    // router.push('/') is handled by logOut in AuthContext
  };

  if (loading) {
    console.log('[AdminLayout] Render: Auth is loading...');
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-muted/40">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading Admin Area...</p>
      </div>
    );
  }

  if (!user) {
    console.log('[AdminLayout] Render: No user object. Redirecting to login should be in progress.');
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-muted/40">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Authenticating...</p>
      </div>
    );
  }

  if (!isAdminRouteAllowed) {
     console.log('[AdminLayout] Render: Access not allowed or still verifying. Redirect should be in progress if denied.');
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-muted/40">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Verifying access or redirecting...</p>
      </div>
    );
  }

  console.log('[AdminLayout] Render: Admin access GRANTED, rendering admin content.');
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/admin" className="flex items-center gap-2 font-semibold text-primary">
              <LayoutDashboard className="h-6 w-6" />
              <span>Tari Electra Admin</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {navLinks.map(link => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="mt-auto p-4">
            <Button size="sm" className="w-full" asChild variant="outline">
               <Link href="/">View Public Site</Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="/admin"
                  className="flex items-center gap-2 text-lg font-semibold text-primary mb-4"
                >
                  <LayoutDashboard className="h-6 w-6" />
                  <span>Tari Electra Admin</span>
                </Link>
                {navLinks.map(link => (
                    <Link
                        key={link.label}
                        href={link.href}
                        className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                    >
                        <link.icon className="h-5 w-5" />
                        {link.label}
                    </Link>
                ))}
              </nav>
              <div className="mt-auto">
                <Button size="sm" className="w-full" asChild variant="outline">
                    <Link href="/">View Public Site</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            {/* Optional Search Form can go here */}
          </div>
          <NotificationBell />
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Admin User</p>
                    <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                    </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
    
