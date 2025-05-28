
"use client";

import { SignupForm } from '@/components/auth/SignupForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import type { Metadata } from 'next';

// Note: Metadata export can still exist in a client component, Next.js handles it.
// However, if you needed dynamic metadata based on server-side data, you'd use generateMetadata.
// For a static title/description, this is fine.
// export const metadata: Metadata = {
// title: 'Sign Up - Tari Electra',
// description: 'Create a new account with Tari Electra.',
// };

export default function SignupPage() {
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
            <CardTitle className="text-3xl font-bold">Create an Account</CardTitle>
            <CardDescription>Join Tari Electra today. It&apos;s quick and easy!</CardDescription>
          </CardHeader>
          <CardContent>
            <SignupForm />
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Log in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
