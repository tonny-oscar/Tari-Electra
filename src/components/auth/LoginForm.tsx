// 'use client';

// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// import { AlertCircle, Loader2 } from 'lucide-react';
// import { signInWithEmailAndPassword } from 'firebase/auth';
// import { auth } from '@/lib/firebase/client';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { useToast } from '@/hooks/use-toast';

// const loginSchema = z.object({
//   email: z
//     .string()
//     .min(1, 'Email is required')
//     .email({ message: 'Invalid email address' }),
//   password: z
//     .string()
//     .min(6, { message: 'Password must be at least 6 characters' }),
// });

// type LoginFormValues = z.infer<typeof loginSchema>;

// export function LoginForm() {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const { toast } = useToast();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<LoginFormValues>({
//     resolver: zodResolver(loginSchema),
//   });

//   const onSubmit = async (data: LoginFormValues) => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       // Optional: Debug logging
//       // console.log('Attempting login with:', data.email);

//       await signInWithEmailAndPassword(auth, data.email, data.password);

//       toast({
//         title: 'Login Successful!',
//         description: 'Redirecting...',
//       });

//       const redirectUrl = searchParams.get('redirect') || '/admin';
//       router.push(redirectUrl);
//     } catch (err: any) {
//       const message = err?.message || 'Failed to login. Please check your credentials.';
//       console.error('Login error:', err);
//       setError(message);
//       toast({
//         title: 'Login Failed',
//         description: message,
//         variant: 'destructive',
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//       {error && (
//         <Alert variant="destructive">
//           <AlertCircle className="h-4 w-4" />
//           <AlertTitle>Login Error</AlertTitle>
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       )}

//       <div className="space-y-2">
//         <Label htmlFor="email">Email</Label>
//         <Input
//           id="email"
//           type="email"
//           placeholder="you@example.com"
//           {...register('email')}
//         />
//         {errors.email && (
//           <p className="text-sm text-destructive">{errors.email.message}</p>
//         )}
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="password">Password</Label>
//         <Input
//           id="password"
//           type="password"
//           placeholder="••••••••"
//           {...register('password')}
//         />
//         {errors.password && (
//           <p className="text-sm text-destructive">{errors.password.message}</p>
//         )}
//       </div>

//       <Button type="submit" className="w-full" disabled={isLoading}>
//         {isLoading ? (
//           <>
//             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//             Logging in...
//           </>
//         ) : (
//           'Login'
//         )}
//       </Button>
//     </form>
//   );
// }



'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@yourstore.com';

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      // Sign in user
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      // Check if user is admin
      if (data.email === ADMIN_EMAIL) {
        toast({
          title: 'Admin Login Successful!',
          description: 'Redirecting to admin panel...',
        });
        router.push('/admin');
        return;
      }

      // Check if user exists in customers collection
      const customerDoc = await getDoc(doc(db, 'customers', user.uid));
      
      if (!customerDoc.exists()) {
        // If user doesn't exist in customers collection, sign them out
        await auth.signOut();
        setError('Account not found. Please sign up as a customer first.');
        toast({
          title: 'Access Denied',
          description: 'Please sign up as a customer to access the dashboard.',
          variant: 'destructive',
        });
        return;
      }

      const customerData = customerDoc.data();
      
      // Verify user role is customer
      if (customerData.role !== 'customer') {
        await auth.signOut();
        setError('Access denied. Customer account required.');
        toast({
          title: 'Access Denied',
          description: 'Customer account required for dashboard access.',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Login Successful!',
        description: 'Redirecting to your dashboard...',
      });

      // Redirect customer to dashboard
      router.push('/customer/dashboard');
      
    } catch (err: any) {
      const message = err?.message || 'Failed to login. Please check your credentials.';
      console.error('Login error:', err);
      setError(message);
      toast({
        title: 'Login Failed',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Login Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...register('password')}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <Button 
        onClick={handleSubmit(onSubmit)} 
        className="w-full" 
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Logging in...
          </>
        ) : (
          'Login'
        )}
      </Button>
    </div>
  );
}
