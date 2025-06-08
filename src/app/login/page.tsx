'use client';

import { useSearchParams } from 'next/navigation';
import { LoginForm } from '@/components/auth/LoginForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="flex min-h-[calc(100vh-var(--header-height)-var(--footer-height))] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-secondary">
      <style jsx global>{`
        :root {
          --header-height: 4rem;
          --footer-height: 8rem;
        }
      `}</style>

      <div className="w-full max-w-md space-y-8">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Welcome Back!</CardTitle>
            <CardDescription>Sign in to access your account and the admin dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            {error && <p className="mb-4 text-sm text-red-500 text-center">{error}</p>}
            <LoginForm />
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="font-medium text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
