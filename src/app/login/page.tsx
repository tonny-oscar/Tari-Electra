// 'use client';

// import { Suspense } from 'react';
// import { useSearchParams } from 'next/navigation';
// import Link from 'next/link';
// import { LoginForm } from '@/components/auth/LoginForm';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';

// function LoginInner() {
//   const searchParams = useSearchParams();
//   const error = searchParams.get('error');

//   return (
//     <div className="w-full max-w-md space-y-8">
//       <Card className="shadow-xl">
//         <CardHeader className="text-center">
//           <CardTitle className="text-3xl font-bold">Welcome Back!</CardTitle>
//           <CardDescription>
//             Sign in to access your account and the admin dashboard.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
//           <LoginForm />
//           <p className="mt-6 text-center text-sm text-muted-foreground">
//             Don&apos;t have an account?{' '}
//             <Link
//               href="/signup"
//               className="font-medium text-primary hover:underline"
//             >
//               Sign up
//             </Link>
//           </p>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// export default function LoginPage() {
//   return (
//     <div className="flex min-h-[calc(100vh-var(--header-height)-var(--footer-height))] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-secondary">
//       <style jsx global>{`
//         :root {
//           --header-height: 4rem;
//           --footer-height: 8rem;
//         }
//       `}</style>
//       <Suspense fallback={<div>Loading login...</div>}>
//         <LoginInner />
//       </Suspense>
//     </div>
//   );
// }

'use client';


import React from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your customer account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                Sign up here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

