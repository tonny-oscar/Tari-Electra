// 'use client';

// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { db } from '@/lib/firebase/client';
// import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
// import { Loader2 } from 'lucide-react';
// import { useToast } from '@/hooks/use-toast';

// export function ResellerSignupForm() {
//   const { register, handleSubmit, reset, watch } = useForm();
//   const [loading, setLoading] = useState(false);
//   const { toast } = useToast();
//   const watchOccupation = watch('occupation');

//   const onSubmit = async (data: any) => {
//     setLoading(true);
//     try {
//       await addDoc(collection(db, 'resellerApplications'), {
//         ...data,
//         status: 'pending',
//         createdAt: serverTimestamp(),
//       });

//       toast({ title: 'Application Sent', description: 'We’ll review your application soon.' });
//       reset();
//       // Create notification for admin
//       await addDoc(collection(db, 'notifications'), {
//         type: 'reseller_application',
//         title: 'New Reseller Application',
//         message: `New reseller application from ${data.fullName}`,
//         createdAt: serverTimestamp(),
//         read: false,
//         priority: 'medium',
//         data: {
//           applicantName: data.fullName,
//           applicantEmail: data.email,
//           occupation: data.occupation
//         }
//       });

//       toast({ title: 'Application Sent', description: 'We\'ll review your application soon.' });
//       reset();
//     } catch (err) {
//       console.error(err);
//       toast({ title: 'Error', description: 'Failed to submit application', variant: 'destructive' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//       <Label>Full Name</Label>
//       <Input {...register('fullName', { required: true })} />

//       <Label>ID / Passport Number</Label>
//       <Input {...register('idNumber', { required: true })} />

//       <Label>Phone Number</Label>
//       <Input {...register('phone', { required: true })} />

//       <Label>Email Address</Label>
//       <Input {...register('email', { required: true })} />

//       <Label>Occupation</Label>
//       <select {...register('occupation', { required: true })} className="w-full border rounded">
//         <option value="">Select...</option>
//         <option>Electrician</option>
//         <option>Student</option>
//         <option>Sales Agent</option>
//         <option>Electrical Shop Owner</option>
//         <option>Other</option>
//       </select>

//       {watchOccupation === 'Other' && (
//         <div>
//           <Label>Please specify your occupation</Label>
//           <Input {...register('otherOccupation', { required: watchOccupation === 'Other' })} placeholder="Enter your occupation" />
//         </div>
//       )}

//       <Label>Business / Shop Name</Label>
//       <Input {...register('businessName', { required: true })} />

//       <Label>Location</Label>
//       <Input {...register('location', { required: true })} />

//       <Label>Current Region</Label>
//       <select {...register('currentRegion', { required: true })} className="w-full border rounded">
//         <option>Nairobi</option>
//         <option>Central</option>
//         <option>Coast</option>
//         <option>Eastern</option>
//         <option>North Eastern</option>
//         <option>Nyanza</option>
//         <option>Rift Valley</option>
//         <option>Western</option>
//         <option>Other</option>
//       </select>

//       {watch('currentRegion') === 'Other' && (
//         <div>
//           <Label>Please specify your current region</Label>
//           <Input {...register('otherCurrentRegion', { required: watch('currentRegion') === 'Other' })} placeholder="Enter your current region" />
//         </div>
//       )}

//       <Label>Interested Region(s) to Resell</Label>
//       <div className="grid grid-cols-2 gap-2">
//         {['Nairobi','Central','Coast','Eastern','North Eastern','Nyanza','Rift Valley','Western','Other'].map(r => (
//           <label key={r} className="flex gap-2">
//             <input type="checkbox" value={r} {...register('interestedRegions')} />
//             {r}
//           </label>
//         ))}
//       </div>

//       <Label>Years of Experience</Label>
//       <Input {...register('experience', { required: true })} />

//       <Label>Do you already sell related products/services?</Label>
//       <select {...register('alreadySelling', { required: true })} className="w-full border rounded">
//         <option>Yes</option>
//         <option>No</option>
//       </select>

//       <div className="flex items-center gap-2">
//         <input type="checkbox" {...register('agree', { required: true })} />
//         <span>
//           I hereby confirm that the information provided is accurate and I agree to comply with the reseller policies and guidelines set by Tari Electra.
//         </span>
//       </div>

//       <Button type="submit" disabled={loading} className="w-full">
//         {loading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Submit Application'}
//       </Button>
//     </form>
//   );
// }


'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { db } from '@/lib/firebase/client';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ResellerSignupForm() {
  const { register, handleSubmit, reset, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // watch the select fields
  const watchOccupation = watch('occupation');
  const watchRegion = watch('currentRegion');

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      await addDoc(collection(db, 'resellerApplications'), {
        ...data,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      // Notify admin
      await addDoc(collection(db, 'notifications'), {
        type: 'reseller_application',
        title: 'New Reseller Application',
        message: `New reseller application from ${data.fullName}`,
        createdAt: serverTimestamp(),
        read: false,
        priority: 'medium',
        data: {
          applicantName: data.fullName,
          applicantEmail: data.email,
          occupation: data.occupation === 'Other' ? data.otherOccupation : data.occupation,
        },
      });

      toast({ title: 'Application Sent', description: 'We’ll review your application soon.' });
      reset();
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to submit application', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Label>Full Name</Label>
      <Input {...register('fullName', { required: true })} />

      <Label>ID / Passport Number</Label>
      <Input {...register('idNumber', { required: true })} />

      <Label>Phone Number</Label>
      <Input {...register('phone', { required: true })} />

      <Label>Email Address</Label>
      <Input {...register('email', { required: true })} />

      <Label>Occupation</Label>
      <select {...register('occupation', { required: true })} className="w-full border rounded">
        <option value="">Select...</option>
        <option>Electrician</option>
        <option>Student</option>
        <option>Sales Agent</option>
        <option>Electrical Shop Owner</option>
        <option>Other</option>
      </select>

      {watchOccupation === 'Other' && (
        <div>
          <Label>Please specify your occupation</Label>
          <Input
            {...register('otherOccupation', { required: watchOccupation === 'Other' })}
            placeholder="Enter your occupation"
          />
        </div>
      )}

      <Label>Business / Shop Name</Label>
      <Input {...register('businessName', { required: true })} />

      <Label>Location</Label>
      <Input {...register('location', { required: true })} />

      <Label>Current Region</Label>
      <select {...register('currentRegion', { required: true })} className="w-full border rounded">
        <option value="">Select...</option>
        <option>Nairobi</option>
        <option>Central</option>
        <option>Coast</option>
        <option>Eastern</option>
        <option>North Eastern</option>
        <option>Nyanza</option>
        <option>Rift Valley</option>
        <option>Western</option>
        <option>Other</option>
      </select>

      {watchRegion === 'Other' && (
        <div>
          <Label>Please specify your current region</Label>
          <Input
            {...register('otherCurrentRegion', { required: watchRegion === 'Other' })}
            placeholder="Enter your current region"
          />
        </div>
      )}

      <Label>Interested Region(s) to Resell</Label>
      <div className="grid grid-cols-2 gap-2">
        {['Nairobi','Central','Coast','Eastern','North Eastern','Nyanza','Rift Valley','Western','Other'].map(r => (
          <label key={r} className="flex gap-2">
            <input type="checkbox" value={r} {...register('interestedRegions')} />
            {r}
          </label>
        ))}
      </div>

      <Label>Years of Experience</Label>
      <Input {...register('experience', { required: true })} />

      <Label>Do you already sell related products/services?</Label>
      <select {...register('alreadySelling', { required: true })} className="w-full border rounded">
        <option>Yes</option>
        <option>No</option>
      </select>

      <div className="flex items-center gap-2">
        <input type="checkbox" {...register('agree', { required: true })} />
        <span>
          I hereby confirm that the information provided is accurate and I agree to comply with the reseller policies and guidelines set by Tari Electra.
        </span>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Submit Application'}
      </Button>
    </form>
  );
}
