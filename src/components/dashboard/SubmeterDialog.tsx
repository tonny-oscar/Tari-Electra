'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { addDoc, collection } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface SubmeterFormData {
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
}

export function SubmeterApplicationDialog() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<SubmeterFormData>();

  const onSubmit = async (data: SubmeterFormData) => {
    if (!auth.currentUser) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to submit an application.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const submissionData = {
        ...data,
        userId: auth.currentUser.uid,
        submissionDate: new Date().toISOString(),
        status: 'pending'
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
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">Apply for Sub-Meter</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Application for Prepaid Sub-Meters & Services</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6">
            <div className="space-y-2">
              <Label>Property Type</Label>
              <RadioGroup defaultValue="residential" className="grid grid-cols-2 gap-4">
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

            <div className="space-y-2">
              <Label>Utility Service</Label>
              <div className="grid grid-cols-2 gap-4">
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

            <div className="space-y-2">
              <Label>Application Type</Label>
              <RadioGroup defaultValue="new" className="grid grid-cols-2 gap-4">
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

            <div className="space-y-2">
              <Label>Full Name / Organization Name</Label>
              <Input {...register('fullName', { required: true })} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input {...register('phoneNumber', { required: true })} type="tel" />
              </div>
              <div className="space-y-2">
                <Label>ID or Registration Number</Label>
                <Input {...register('idNumber', { required: true })} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input
                {...register('email', {
                  required: true,
                  pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                })}
                type="email"
              />
            </div>

            <div className="space-y-2">
              <Label>Physical Location</Label>
              <Input {...register('physicalLocation', { required: true })} />
            </div>

            <div className="space-y-2">
              <Label>Area & Town</Label>
              <Input {...register('areaTown', { required: true })} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Main Meter Account Number</Label>
                <Input {...register('mainMeterAccountNumber', { required: true })} />
              </div>
              <div className="space-y-2">
                <Label>Current Reading</Label>
                <Input
                  {...register('currentReading', {
                    required: true,
                    valueAsNumber: true,
                  })}
                  type="number"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox {...register('suppliesOtherAreas')} />
                <Label>Main meter supplies other areas</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Meter Numbers linked to main meter (optional)</Label>
              <Input {...register('linkedMeterNumbers')} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox {...register('termsAccepted', { required: true })} />
                <Label>
                  I confirm that I have read and accept the terms and conditions
                </Label>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
