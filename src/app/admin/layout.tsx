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
  Settings as SettingsIcon, // Renamed to avoid conflict
  Settings,
  ImageIcon,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
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
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Loader2 } from 'lucide-react';
import { NotificationBell } from '@/components/admin/NotificationBell';
import { useToast } from '@/hooks/use-toast';


const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/blog', label: 'Blog Management', icon: Newspaper },
  { href: '/admin/products', label: 'Customer Products', icon: ShoppingBag },
  { href: '/admin/stock', label: 'Stock Management', icon: Settings },
  { href: '/admin/homepage-products', label: 'Homepage Products', icon: ImageIcon },
  { href: '/admin/orders', label: 'Orders Management', icon: ShoppingBag },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare },

  { href: '/admin/submeter-requests', label: 'Sub-Meter Applications', icon: CircleUser },
  { href: '/admin/reseller-applications', label: 'Reseller Applications', icon: CircleUser },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
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

    // Check if user is admin
    const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'morgan.rotich@tarielectra.africa')
      .split(',')
      .map(email => email.trim());
    const isAdmin = ADMIN_EMAILS.includes(user.email?.trim() || '');

    if (!isAdmin) {
      console.log(`[AdminLayout] User ${user.email} is not an admin. Redirecting to login.`);
      router.push('/login');
      setIsAdminRouteAllowed(false);
      return;
    }

    console.log(`[AdminLayout] User ${user.email} is authenticated as admin. Granting access.`);
    setIsAdminRouteAllowed(true);
  }, [user, loading, router, toast]);

  const handleLogout = async () => {
    await logout();
  };

  if (loading || !user || !isAdminRouteAllowed) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-muted/40">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">
          {loading ? 'Loading Admin Area...' : 'Verifying access...'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Sidebar */}
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 bg-gradient-to-r from-primary/5 to-secondary/5">
            <Link href="/admin" className="flex items-center gap-3 font-bold text-foreground hover:text-primary transition-colors group">
              <div className="relative p-2 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <LayoutDashboard className="h-5 w-5 text-white" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Tari Electra</span>
                <span className="text-xs text-muted-foreground font-medium">Admin Panel</span>
              </div>
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

      {/* Main Content */}
      <div className="flex flex-col">
        {/* Header */}
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="/admin"
                  className="flex items-center gap-3 text-lg font-bold text-foreground hover:text-primary transition-colors group mb-4"
                >
                  <div className="relative p-2 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <LayoutDashboard className="h-5 w-5 text-white" />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl"></div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Tari Electra</span>
                    <span className="text-xs text-muted-foreground font-medium">Admin Panel</span>
                  </div>
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

          <div className="w-full flex-1">{/* Optional Search Form */}</div>
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
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Main Section */}
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
