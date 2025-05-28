
import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Newspaper, Settings } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle'; // Added ThemeToggle import

export const metadata: Metadata = {
  title: 'Admin Dashboard - Tari Electra',
  description: 'Manage Tari Electra website content.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        </nav>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle /> 
            <Button asChild variant="outline" size="sm">
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
