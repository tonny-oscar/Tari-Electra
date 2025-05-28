
'use client';

import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { LogOut, Menu, UserCircle, ShoppingBag, NewspaperIcon, Settings, HomeIcon, LogIn, UserPlus } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ContactSection } from '@/components/sections/ContactSection';
import { useAuth } from '@/hooks/useAuth'; // Import useAuth
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mainNavItems = [
  { href: '/', label: 'Home', icon: HomeIcon },
  { href: '/products', label: 'Products', icon: ShoppingBag },
  { href: '/about', label: 'About', icon: NewspaperIcon }, // Using Newspaper for About
  { href: '/contact', label: 'Contact', icon: UserCircle }, // Using UserCircle for Contact
  { href: '/blog', label: 'Blog', icon: NewspaperIcon },
];

export function Header() {
  const { user, loading, logOut } = useAuth(); // Use the auth hook

  const handleLogout = async () => {
    await logOut();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {mainNavItems.map((item) => (
            <Button key={item.label} variant="ghost" asChild className="text-muted-foreground hover:text-primary hover:bg-primary/10 px-2 lg:px-3">
              <Link href={item.href}>
                <item.icon className="h-4 w-4 mr-1 lg:mr-2" />
                {item.label}
              </Link>
            </Button>
          ))}

          {!loading && user && (
            <Button variant="ghost" asChild className="text-muted-foreground hover:text-primary hover:bg-primary/10 px-2 lg:px-3">
              <Link href="/admin">
                <Settings className="h-4 w-4 mr-1 lg:mr-2" />
                Admin
              </Link>
            </Button>
          )}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <ThemeToggle />
          {loading ? (
             <Button variant="outline" size="sm" disabled>Loading...</Button>
          ) : user ? (
            <>
              <Sheet>
                <SheetTrigger asChild>
                  <Button size="sm" className="hidden sm:flex">Get a Free Estimate</Button>
                </SheetTrigger>
                <SheetContent className="sm:max-w-lg w-[90vw] overflow-y-auto">
                  <SheetHeader className="mb-4">
                    <SheetTitle>Request a Free Estimate</SheetTitle>
                    <SheetDescription>
                      Fill out the form below and we&apos;ll get back to you as soon as possible.
                    </SheetDescription>
                  </SheetHeader>
                  <ContactSection />
                </SheetContent>
              </Sheet>
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <UserCircle className="h-6 w-6" />
                    <span className="sr-only">User menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Logged in as:</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                     <Link href="/admin"><Settings className="mr-2 h-4 w-4" />Admin Dashboard</Link>
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
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Trigger */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-2 mt-8">
                  {mainNavItems.map((item) => (
                     <Button key={item.label} variant="ghost" asChild className="text-lg justify-start px-3 py-2">
                        <Link href={item.href}>
                            <item.icon className="h-5 w-5 mr-3" />
                            {item.label}
                        </Link>
                    </Button>
                  ))}
                  <hr className="my-3"/>
                  {loading ? (
                     <Button variant="outline" disabled className="w-full justify-start px-3 py-2 text-lg">Loading...</Button>
                  ) : user ? (
                    <>
                        <Button variant="ghost" asChild className="text-lg justify-start px-3 py-2">
                            <Link href="/admin">
                                <Settings className="h-5 w-5 mr-3" />
                                Admin
                            </Link>
                        </Button>
                        <Button onClick={handleLogout} variant="ghost" className="text-lg text-destructive hover:text-destructive justify-start px-3 py-2">
                            <LogOut className="h-5 w-5 mr-3" />
                            Logout
                        </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" asChild className="text-lg justify-start px-3 py-2">
                        <Link href="/login">
                            <LogIn className="h-5 w-5 mr-3" />
                            Login
                        </Link>
                      </Button>
                      <Button asChild className="text-lg justify-start px-3 py-2">
                         <Link href="/signup">
                            <UserPlus className="h-5 w-5 mr-3" />
                            Sign Up
                        </Link>
                      </Button>
                    </>
                  )}
                   <Button asChild className="mt-4 text-lg justify-start px-3 py-2">
                     <Link href="/contact">
                        Get a Free Estimate
                     </Link>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
