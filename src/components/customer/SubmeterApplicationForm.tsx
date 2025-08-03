'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { auth } from '@/lib/firebase/client';
import { createSubmeterApplication, type SubmeterApplication } from '@/lib/firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

interface SubmeterApplicationFormData {
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
  submeterAccountNumber: string;
  submetersRegistered?: string;
  suppliesOtherAreas: boolean;
  linkedMeterNumbers?: string;
  termsAccepted: boolean;
}

export default function SubmeterApplicationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubmeterApplicationFormData>();

  const onSubmit = async (data: SubmeterApplicationFormData) => {
    if (!auth.currentUser) {
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to submit an application.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const submissionData: Omit<SubmeterApplication, 'id'> = {
        ...data,
        userId: auth.currentUser.uid,
        submissionDate: new Date().toISOString(),
        status: 'pending',
      };

      await createSubmeterApplication(submissionData);

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
        {/* Property Type */}
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

        {/* Utility Services */}
        <div>
          <Label>Utility Services</Label>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                value="electricity"
                {...register('utilityServices')}
                className="form-checkbox"
                id="electricity"
              />
              <Label htmlFor="electricity">Electricity</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                value="water"
                {...register('utilityServices')}
                className="form-checkbox"
                id="water"
              />
              <Label htmlFor="water">Water</Label>
            </div>
          </div>
        </div>

        {/* Application Type */}
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

        {/* Name */}
        <div>
          <Label>Full Name / Organization Name</Label>
          <Input
            {...register('fullName', { required: 'Full name is required' })}
            className={`mt-2 ${errors.fullName ? 'border-red-500' : ''}`}
            placeholder="Enter full name or organization name"
          />
        </div>

        {/* Phone Number */}
        <div>
          <Label>Phone Number</Label>
          <Input
            {...register('phoneNumber', { required: true })}
            type="tel"
            className="mt-2"
            placeholder="Enter phone number"
          />
        </div>

        {/* ID Number */}
        <div>
          <Label>ID or Registration Number</Label>
          <Input
            {...register('idNumber', { required: true })}
            className="mt-2"
            placeholder="Enter ID or registration number"
          />
        </div>

        {/* Email */}
        <div>
          <Label>Email Address</Label>
          <Input
            {...register('email', {
              required: true,
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            type="email"
            className="mt-2"
            placeholder="Enter email address"
          />
        </div>

        {/* Physical Location */}
        <div>
          <Label>Physical Location</Label>
          <Input
            {...register('physicalLocation', { required: true })}
            className="mt-2"
            placeholder="Enter physical location"
          />
        </div>

        {/* Area & Town */}
        <div>
          <Label>Area & Town</Label>
          <Input
            {...register('areaTown', { required: true })}
            className="mt-2"
            placeholder="Enter area and town"
          />
        </div>

        {/* Main Meter Account */}
        <div>
          <Label>Main Meter Account Number</Label>
          <Input
            {...register('mainMeterAccountNumber', { required: true })}
            className="mt-2"
            placeholder="Enter main meter account number"
          />
        </div>

        {/* Current Reading */}
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

        {/* Sub-meter Account Number */}
        <div>
          <Label>Sub-meter Account Number</Label>
          <Input
            {...register('submeterAccountNumber', { required: true })}
            className="mt-2"
            placeholder="Enter sub-meter account number"
          />
        </div>

        {/* Sub-meters Registered */}
        <div>
          <Label>List of Sub-meters registered</Label>
          <textarea
            {...register('submetersRegistered')}
            className="mt-2 w-full p-2 border border-gray-300 rounded-md"
            rows={4}
            placeholder="List all sub-meters registered (one per line or separated by commas)"
          />
          <p className="text-sm text-gray-500 mt-1">
            Please list all sub-meters that are currently registered or will be registered
          </p>
        </div>

        {/* Supplies Other Areas */}
        <div>
          <Label>Is main meter supplying other areas?</Label>
          <div className="flex items-center space-x-2 mt-2">
            <input
              type="checkbox"
              {...register('suppliesOtherAreas')}
              className="form-checkbox"
              id="suppliesOtherAreas"
            />
            <Label htmlFor="suppliesOtherAreas">Yes</Label>
          </div>
        </div>

        {/* Linked Meter Numbers */}
        <div>
          <Label>Meter Numbers linked to main meter (optional)</Label>
          <Input
            {...register('linkedMeterNumbers')}
            className="mt-2"
            placeholder="Enter linked meter numbers"
          />
        </div>

        {/* Terms & Conditions */}
        <div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              {...register('termsAccepted', { required: true })}
              className="form-checkbox"
              id="termsAccepted"
            />
            <Label htmlFor="termsAccepted">
              I confirm that I have read and accept the terms and conditions
            </Label>
          </div>
          {errors.termsAccepted && (
            <p className="text-sm text-red-500 mt-1">You must accept the terms to proceed.</p>
          )}
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Application'}
      </Button>
    </form>
  );
}
