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
  Settings as SettingsIcon,
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
import ResellerApplications from '@/components/admin/ResellerApplications';

const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/blog', label: 'Blog Management', icon: Newspaper },
  { href: '/admin/products', label: 'Customer Products', icon: ShoppingBag },
  { href: '/admin/stock', label: 'Stock Management', icon: Settings },
  { href: '/admin/homepage-products', label: 'Homepage Products', icon: ImageIcon },
  { href: '/admin/orders', label: 'Orders Management', icon: ShoppingBag },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { href: '/admin/homepage', label: 'Homepage Settings', icon: SettingsIcon },
  { href: '/admin/submeter-requests', label: 'Sub-Meter Applications', icon: CircleUser },
  { href: '/admin/reseller-applications', label: 'Reseller Applications', icon: CircleUser },
];

export default function AdminLayout() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [isAdminRouteAllowed, setIsAdminRouteAllowed] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (loading) {
      setIsAdminRouteAllowed(false);
      return;
    }

    if (!user) {
      router.push('/login?redirect=/admin');
      setIsAdminRouteAllowed(false);
      return;
    }

    const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'morgan.rotich@tarielectra.africa')
      .split(',')
      .map(email => email.trim());
    const isAdmin = ADMIN_EMAILS.includes(user.email?.trim() || '');
    
    if (!isAdmin) {
      router.push('/login');
      setIsAdminRouteAllowed(false);
      return;
    }
    
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
          {loading ? "Loading Admin Area..." : "Verifying access..."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Sidebar */}
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

      {/* Main content */}
      <div className="flex flex-col">
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

          <div className="w-full flex-1"></div>
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

        {/* Main Section: display Reseller Applications here */}
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
          <ResellerApplications />
        </main>
      </div>
    </div>
  );
}
