
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  CircleUser,
  Home,
  LayoutDashboard,
  Menu,
  Newspaper,
  MessageSquare,
  ShoppingBag,
  Settings,
  ImageIcon, // Added ImageIcon
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Loader2 } from 'lucide-react'; 
import { NotificationBell } from '@/components/admin/NotificationBell';
import { useToast } from '@/hooks/use-toast';

const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/blog', label: 'Blog Management', icon: Newspaper },
  { href: '/admin/products', label: 'Product Management', icon: ShoppingBag },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { href: '/admin/homepage', label: 'Homepage Settings', icon: ImageIcon }, // Added Homepage Settings
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
    console.log(`[AdminLayout] Auth State: loading=${loading}, user=${user ? user.email : 'null'}`);

    if (loading) {
      console.log('[AdminLayout] Auth is loading. Waiting...');
      setIsAdminRouteAllowed(false);
      return;
    }

    if (!user) {
      console.log('[AdminLayout] No user authenticated. Redirecting to login.');
      router.push('/login?redirect=/admin');
      setIsAdminRouteAllowed(false);
      return;
    }

    const adminEmailEnv = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    console.log(`[AdminLayout] Checking access: User Email (from auth): '${user.email}', Configured Admin Email (from env): '${adminEmailEnv}'`);

    if (!adminEmailEnv || adminEmailEnv.trim() === "") {
      console.error('[AdminLayout] CRITICAL: NEXT_PUBLIC_ADMIN_EMAIL environment variable is not set or is empty. Admin access denied.');
      setIsAdminRouteAllowed(false);
      router.push('/');
      toast({ title: 'Configuration Error', description: 'Admin email not configured. Please contact support.', variant: 'destructive', duration: 10000 });
      return;
    }

    const isActualAdmin = user.email?.toLowerCase() === adminEmailEnv.toLowerCase();
    console.log(`[AdminLayout] Email comparison: User: '${user.email?.toLowerCase()}', Admin: '${adminEmailEnv.toLowerCase()}', Match: ${isActualAdmin}`);

    if (isActualAdmin) {
      console.log(`[AdminLayout] User ${user.email} is ADMIN. Granting access to admin area.`);
      setIsAdminRouteAllowed(true);
    } else {
      console.log(`[AdminLayout] User ${user.email} is NOT ADMIN. Denying access to admin area.`);
      setIsAdminRouteAllowed(false);
      router.push('/');
      toast({ title: 'Access Denied', description: 'You do not have permission to view this page.', variant: 'destructive', duration: 7000 });
    }

  }, [user, loading, router, toast]);

  const handleLogout = async () => {
    await logOut();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-muted/40">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading Admin Area...</p>
      </div>
    );
  }

  if (!user || !isAdminRouteAllowed) {
    // This state is typically brief as the useEffect should redirect if not allowed.
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-muted/40">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Verifying access...</p>
      </div>
    );
  }

  console.log('[AdminLayout] Render: Access VERIFIED, rendering admin content for', user.email);
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
