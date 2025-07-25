
// 'use client';

// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// import { AlertCircle, Loader2, KeyRound } from 'lucide-react'; // Added KeyRound for invite code
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { auth } from '@/lib/firebase/client';
// import { useRouter } from 'next/navigation';
// import { useToast } from '@/hooks/use-toast';

// const signupSchema = z
//   .object({
//     email: z.string().email({ message: 'Invalid email address' }),
//     password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
//     confirmPassword: z.string(),
//     inviteCode: z.string().min(1, { message: 'Signup invite code is required' }),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Passwords don't match",
//     path: ['confirmPassword'],
//   });

// type SignupFormValues = z.infer<typeof signupSchema>;

// export function SignupForm() {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();
//   const { toast } = useToast();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<SignupFormValues>({
//     resolver: zodResolver(signupSchema),
//   });

//   const onSubmit = async (data: SignupFormValues) => {
//     setIsLoading(true);
//     setError(null);

//     // Client-side check for the invite code
//     if (data.inviteCode !== process.env.NEXT_PUBLIC_SIGNUP_INVITE_CODE) {
//       setError('Invalid signup invite code.');
//       toast({
//         title: 'Signup Failed',
//         description: 'Invalid signup invite code. Please try again.',
//         variant: 'destructive',
//       });
//       setIsLoading(false);
//       return;
//     }

//     try {
//       await createUserWithEmailAndPassword(auth, data.email, data.password);
//       toast({ title: 'Account Created!', description: 'Redirecting to login...' });
//       router.push('/login');
//     } catch (err: any) {
//       console.error('Signup error:', err);
//       let errorMessage = 'Failed to create account. Please try again.';
//       if (err.code === 'auth/email-already-in-use') {
//         errorMessage = 'This email address is already in use. Please try a different one or log in.';
//       } else if (err.message) {
//         errorMessage = err.message;
//       }
//       setError(errorMessage);
//       toast({ title: 'Signup Failed', description: errorMessage, variant: 'destructive' });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//       {error && (
//         <Alert variant="destructive">
//           <AlertCircle className="h-4 w-4" />
//           <AlertTitle>Signup Error</AlertTitle>
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       )}
//       <div className="space-y-2">
//         <Label htmlFor="email">Email</Label>
//         <Input id="email" type="email" placeholder="you@example.com" {...register('email')} />
//         {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
//       </div>
//       <div className="space-y-2">
//         <Label htmlFor="password">Password</Label>
//         <Input id="password" type="password" placeholder="••••••••" {...register('password')} />
//         {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
//       </div>
//       <div className="space-y-2">
//         <Label htmlFor="confirmPassword">Confirm Password</Label>
//         <Input id="confirmPassword" type="password" placeholder="••••••••" {...register('confirmPassword')} />
//         {errors.confirmPassword && (
//           <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
//         )}
//       </div>
//       <div className="space-y-2">
//         <Label htmlFor="inviteCode">Signup Invite Code</Label>
//         <div className="relative">
//             <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             <Input id="inviteCode" type="text" placeholder="Enter invite code" {...register('inviteCode')} className="pl-10" />
//         </div>
//         {errors.inviteCode && <p className="text-sm text-destructive">{errors.inviteCode.message}</p>}
//       </div>
//       <Button type="submit" className="w-full" disabled={isLoading}>
//         {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create Account'}
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
import { AlertCircle, Loader2, KeyRound } from 'lucide-react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/client';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const signupSchema = z
  .object({
    firstName: z.string().min(1, { message: 'First name is required' }),
    lastName: z.string().min(1, { message: 'Last name is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z.string(),
    inviteCode: z.string().min(1, { message: 'Signup invite code is required' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    setError(null);

    // Client-side check for the invite code
    if (data.inviteCode !== process.env.NEXT_PUBLIC_SIGNUP_INVITE_CODE) {
      setError('Invalid signup invite code.');
      toast({
        title: 'Signup Failed',
        description: 'Invalid signup invite code. Please try again.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      // Create customer profile in Firestore
      await setDoc(doc(db, 'customers', user.uid), {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: 'customer',
        createdAt: new Date().toISOString(),
        orders: [],
        profile: {
          phone: '',
          address: '',
          city: '',
          country: '',
        }
      });

      toast({ 
        title: 'Account Created!', 
        description: 'Redirecting to your dashboard...' 
      });
      
      // Redirect directly to customer dashboard after signup
      router.push('/customer/dashboard');
    } catch (err: any) {
      console.error('Signup error:', err);
      let errorMessage = 'Failed to create account. Please try again.';
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'This email address is already in use. Please try a different one or log in.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      toast({ title: 'Signup Failed', description: errorMessage, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Signup Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input 
            id="firstName" 
            type="text" 
            placeholder="John" 
            {...register('firstName')} 
          />
          {errors.firstName && (
            <p className="text-sm text-destructive">{errors.firstName.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input 
            id="lastName" 
            type="text" 
            placeholder="Doe" 
            {...register('lastName')} 
          />
          {errors.lastName && (
            <p className="text-sm text-destructive">{errors.lastName.message}</p>
          )}
        </div>
      </div>

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

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input 
          id="confirmPassword" 
          type="password" 
          placeholder="••••••••" 
          {...register('confirmPassword')} 
        />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="inviteCode">Signup Invite Code</Label>
        <div className="relative">
          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            id="inviteCode" 
            type="text" 
            placeholder="Enter invite code" 
            {...register('inviteCode')} 
            className="pl-10" 
          />
        </div>
        {errors.inviteCode && (
          <p className="text-sm text-destructive">{errors.inviteCode.message}</p>
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
            Creating Account...
          </>
        ) : (
          'Create Customer Account'
        )}
      </Button>
    </div>
  );
}
