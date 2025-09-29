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
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { doc, setDoc } from 'firebase/firestore';
// import { auth, db } from '@/lib/firebase/client';
// import { useRouter } from 'next/navigation';
// import { useToast } from '@/hooks/use-toast';
// import { ResellerSignupForm } from './ResellerSignupForm';
// const signupSchema = z
//   .object({
//     firstName: z.string().min(1, { message: 'First name is required' }),
//     lastName: z.string().min(1, { message: 'Last name is required' }),
//     email: z.string().email({ message: 'Invalid email address' }),
//     password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
//     confirmPassword: z.string(),
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

//     try {
//       // ✅ Create Firebase Auth account
//       const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
//       const user = userCredential.user;

//       // ✅ Save customer record in Firestore
//       await setDoc(doc(db, 'customers', user.uid), {
//         firstName: data.firstName,
//         lastName: data.lastName,
//         email: data.email,
//         role: 'customer',
//         createdAt: new Date().toISOString(),
//         orders: [],
//         profile: {
//           phone: '',
//           address: '',
//           city: '',
//           country: '',
//         },
//       });

//       // ✅ Send welcome / verification email via Brevo
//       const welcomeHtml = `
//         <h2>Welcome to Tari Electra!</h2>
//         <p>Hello ${data.firstName},</p>
//         <p>Thank you for creating an account with us.</p>
//         <p>We're excited to have you on board 🚀</p>
//       `;

//       await fetch('/api/send-email', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           to: data.email,                  // send to the customer
//           subject: 'Welcome to Tari Electra!',
//           html: welcomeHtml,
//         }),
//       });

//       toast({ 
//         title: 'Account Created!', 
//         description: 'Redirecting to your dashboard...' 
//       });

//       router.push('/customer/dashboard');
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
//     <div className="space-y-6">
//       {error && (
//         <Alert variant="destructive">
//           <AlertCircle className="h-4 w-4" />
//           <AlertTitle>Signup Error</AlertTitle>
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       )}

//       <div className="grid grid-cols-2 gap-4">
//         <div className="space-y-2">
//           <Label htmlFor="firstName">First Name</Label>
//           <Input id="firstName" type="text" placeholder="John" {...register('firstName')} />
//           {errors.firstName && (
//             <p className="text-sm text-destructive">{errors.firstName.message}</p>
//           )}
//         </div>

//         <div className="space-y-2">
//           <Label htmlFor="lastName">Last Name</Label>
//           <Input id="lastName" type="text" placeholder="Doe" {...register('lastName')} />
//           {errors.lastName && (
//             <p className="text-sm text-destructive">{errors.lastName.message}</p>
//           )}
//         </div>
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="email">Email</Label>
//         <Input id="email" type="email" placeholder="you@example.com" {...register('email')} />
//         {errors.email && (
//           <p className="text-sm text-destructive">{errors.email.message}</p>
//         )}
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="password">Password</Label>
//         <Input id="password" type="password" placeholder="••••••••" {...register('password')} />
//         {errors.password && (
//           <p className="text-sm text-destructive">{errors.password.message}</p>
//         )}
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="confirmPassword">Confirm Password</Label>
//         <Input id="confirmPassword" type="password" placeholder="••••••••" {...register('confirmPassword')} />
//         {errors.confirmPassword && (
//           <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
//         )}
//       </div>

//       <Button onClick={handleSubmit(onSubmit)} className="w-full" disabled={isLoading}>
//         {isLoading ? (
//           <>
//             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//             Creating Account...
//           </>
//         ) : (
//           'Create Customer Account'
//         )}
//       </Button>
//     </div>
//   );
// }



'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SignupFormCustomer } from './SignupFormCustomer';
import { ResellerSignupForm } from './ResellerSignupForm';

export function SignupForm() {
  const [mode, setMode] = useState<'customer' | 'reseller'>('customer');

  return (
    <div className="space-y-6">
      {/* Toggle */}
      <div className="flex justify-center gap-4">
        <Button
          variant={mode === 'customer' ? 'default' : 'outline'}
          onClick={() => setMode('customer')}
        >
          Customer
        </Button>
        <Button
          variant={mode === 'reseller' ? 'default' : 'outline'}
          onClick={() => setMode('reseller')}
        >
          Reseller
        </Button>
      </div>

      {mode === 'customer' ? (
        <SignupFormCustomer />
      ) : (
        <ResellerSignupForm />
      )}
    </div>
  );
}
