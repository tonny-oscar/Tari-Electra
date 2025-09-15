'use client';

import Link from 'next/link';
import Logo from '@/components/Logo';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  LogOut,
  Menu,
  UserCircle,
  ShoppingBag,
  ShoppingCart,
  Newspaper,
  Settings,
  Home,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const mainNavItems: NavItem[] = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/products', label: 'Products', icon: ShoppingBag },
  { href: '/about', label: 'About', icon: Newspaper },
  { href: '/faq', label: 'FAQ', icon: Newspaper },
  { href: '/contact', label: 'Contact', icon: UserCircle },
  { href: '/blog', label: 'Blog', icon: Newspaper },
];

export function Header() {
  const { user, loading, logout, isAdmin, isCustomer } = useAuth();
  const { cartItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const items = Array.isArray(cartItems) ? cartItems : [];
  const cartCount = items.reduce((total, item) => total + (item?.quantity ?? 0), 0);
  const cartTotal = items.reduce(
    (total, item) => total + (item?.quantity ?? 0) * (item?.price ?? 0),
    0
  );

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.label}
                variant="ghost"
                asChild
                className="text-muted-foreground hover:text-primary hover:bg-primary/10 px-2 lg:px-3"
              >
                <Link href={item.href}>
                  <Icon className="h-4 w-4 mr-1 lg:mr-2" />
                  {item.label}
                </Link>
              </Button>
            );
          })}

          {/* Show Admin link only for admins */}
          {isAdmin && (
            <Button
              variant="ghost"
              asChild
              className="text-muted-foreground hover:text-primary hover:bg-primary/10 px-2 lg:px-3"
            >
              <Link href="/admin">
                <Settings className="h-4 w-4 mr-1 lg:mr-2" />
                Admin
              </Link>
            </Button>
          )}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <ThemeToggle />



          {/* Authentication */}
          {loading ? (
            <Button variant="outline" size="sm" disabled>
              Loading...
            </Button>
          ) : user ? (
            <>
              {isCustomer && (
                <Button size="sm" className="hidden sm:flex" asChild>
                  <Link href="/free-estimate">Get a Free Estimate</Link>
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    aria-label="Open user menu"
                  >
                    <UserCircle className="h-6 w-6" />
                    <span className="sr-only">User menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Logged in as:
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={isAdmin ? '/admin' : '/customer/dashboard'}>
                      <Settings className="mr-2 h-4 w-4" />
                      {isAdmin ? 'Admin Dashboard' : 'My Dashboard'}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/login">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Link>
              </Button>
              <Button asChild>
                <Link href="/signup">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Sign Up
                </Link>
              </Button>
            </div>
          )}

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open navigation menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Navigation Menu</SheetTitle>
                </SheetHeader>

                <nav className="flex flex-col space-y-2 mt-6">
                  {mainNavItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.label}
                        variant="ghost"
                        asChild
                        className="text-lg justify-start px-3 py-2"
                        onClick={closeMobileMenu}
                      >
                        <Link href={item.href}>
                          <Icon className="h-5 w-5 mr-3" />
                          {item.label}
                        </Link>
                      </Button>
                    );
                  })}



                  <hr className="my-3" />

                  {loading ? (
                    <Button
                      variant="outline"
                      disabled
                      className="w-full justify-start px-3 py-2 text-lg"
                    >
                      Loading...
                    </Button>
                  ) : user ? (
                    <>
                      <Button variant="ghost" asChild className="text-lg justify-start px-3 py-2" onClick={closeMobileMenu}>
                        <Link href={isAdmin ? '/admin' : '/customer/dashboard'}>
                          <Settings className="h-5 w-5 mr-3" />
                          {isAdmin ? 'Admin Dashboard' : 'My Dashboard'}
                        </Link>
                      </Button>
                      <Button
                        onClick={handleLogout}
                        variant="ghost"
                        className="text-lg text-destructive justify-start px-3 py-2"
                      >
                        <LogOut className="h-5 w-5 mr-3" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" asChild className="text-lg justify-start px-3 py-2" onClick={closeMobileMenu}>
                        <Link href="/login">
                          <LogIn className="h-5 w-5 mr-3" />
                          Login
                        </Link>
                      </Button>
                      <Button asChild className="text-lg justify-start px-3 py-2" onClick={closeMobileMenu}>
                        <Link href="/signup">
                          <UserPlus className="h-5 w-5 mr-3" />
                          Sign Up
                        </Link>
                      </Button>
                    </>
                  )}

                  {isCustomer && (
                    <Button asChild className="mt-4 text-lg justify-start px-3 py-2" onClick={closeMobileMenu}>
                      <Link href="/free-estimate">Get a Free Estimate</Link>
                    </Button>
                  )}

                  {isCustomer && cartCount > 0 && (
                    <Link href="/checkout" onClick={closeMobileMenu}>
                      <Button className="mt-2 w-full">Proceed to Payment</Button>
                    </Link>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
