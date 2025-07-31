'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { auth } from '@/lib/firebase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

interface SubmeterApplication {
  id?: string;
  propertyType: 'residential' | 'commercial';
  utilityServices: ('electricity' | 'water')[];
  applicationType: 'new' | 'existing';
  fullName: string;
  phoneNumber: string;
  idNumber: string;
  email: string;
  physicalLocation: string;
  areaTown: string;
  mainMeterAccountNumber: string;
  currentReading: number;
  suppliesOtherAreas: boolean;
  linkedMeterNumbers?: string;
  termsAccepted: boolean;
  submissionDate?: string;
  status?: 'pending' | 'approved' | 'rejected';
  userId?: string;
}

export default function SubmeterApplicationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<SubmeterApplication>();

  const onSubmit = async (data: SubmeterApplication) => {
    if (!auth.currentUser) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to submit an application.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const submissionData: SubmeterApplication = {
        ...data,
        submissionDate: new Date().toISOString(),
        status: 'pending',
        userId: auth.currentUser.uid
      };

      await addDoc(collection(db, 'submeterApplications'), submissionData);
      
      toast({
        title: 'Application Submitted',
        description: 'Your sub-meter application has been successfully submitted.',
      });
      
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Error',
        description: 'There was an error submitting your application. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="space-y-4">
        <div>
          <Label>Property Type</Label>
          <RadioGroup defaultValue="residential" className="grid grid-cols-2 gap-4 mt-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="residential"
                {...register('propertyType', { required: true })}
              />
              <Label>Residential - House(s)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="commercial"
                {...register('propertyType', { required: true })}
              />
              <Label>Commercial - Shops & Offices</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label>Utility Service</Label>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="flex items-center space-x-2">
              <Checkbox {...register('utilityServices')} value="electricity" />
              <Label>Electricity</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox {...register('utilityServices')} value="water" />
              <Label>Water</Label>
            </div>
          </div>
        </div>

        <div>
          <Label>Application Type</Label>
          <RadioGroup defaultValue="new" className="grid grid-cols-2 gap-4 mt-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="new"
                {...register('applicationType', { required: true })}
              />
              <Label>New</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="existing"
                {...register('applicationType', { required: true })}
              />
              <Label>Existing / Addition</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label>Full Name / Organization Name</Label>
          <Input
            {...register('fullName', { required: "Full name is required" })}
            className={`mt-2 ${errors.fullName ? 'border-red-500' : ''}`}
            placeholder="Enter full name or organization name"
          />
        </div>

        <div>
          <Label>Phone Number</Label>
          <Input
            {...register('phoneNumber', { required: true })}
            type="tel"
            className="mt-2"
            placeholder="Enter phone number"
          />
        </div>

        <div>
          <Label>ID or Registration Number</Label>
          <Input
            {...register('idNumber', { required: true })}
            className="mt-2"
            placeholder="Enter ID or registration number"
          />
        </div>

        <div>
          <Label>Email Address</Label>
          <Input
            {...register('email', {
              required: true,
              pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            })}
            type="email"
            className="mt-2"
            placeholder="Enter email address"
          />
        </div>

        <div>
          <Label>Physical Location</Label>
          <Input
            {...register('physicalLocation', { required: true })}
            className="mt-2"
            placeholder="Enter physical location"
          />
        </div>

        <div>
          <Label>Area & Town</Label>
          <Input
            {...register('areaTown', { required: true })}
            className="mt-2"
            placeholder="Enter area and town"
          />
        </div>

        <div>
          <Label>Main Meter Account Number</Label>
          <Input
            {...register('mainMeterAccountNumber', { required: true })}
            className="mt-2"
            placeholder="Enter main meter account number"
          />
        </div>

        <div>
          <Label>Current Reading</Label>
          <Input
            {...register('currentReading', {
              required: true,
              valueAsNumber: true,
            })}
            type="number"
            className="mt-2"
            placeholder="Enter current reading"
          />
        </div>

        <div>
          <Label>Is main meter supplying other areas?</Label>
          <div className="flex items-center space-x-2 mt-2">
            <Checkbox {...register('suppliesOtherAreas')} />
            <Label>Yes</Label>
          </div>
        </div>

        <div>
          <Label>Meter Numbers linked to main meter (optional)</Label>
          <Input
            {...register('linkedMeterNumbers')}
            className="mt-2"
            placeholder="Enter linked meter numbers"
          />
        </div>

        <div>
          <div className="flex items-center space-x-2">
            <Checkbox
              {...register('termsAccepted', { required: true })}
            />
            <Label>
              I confirm that I have read and accept the terms and conditions
            </Label>
          </div>
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Application'}
      </Button>
    </form>
  );
}
