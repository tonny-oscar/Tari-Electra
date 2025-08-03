'use client';

import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface ServiceRequestFormProps {
  userId: string | null | undefined;
  customerName: string;
  customerEmail: string | null | undefined;
}

export function ServiceRequestForm({ userId, customerName, customerEmail }: ServiceRequestFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);

  const [formData, setFormData] = useState({
    serviceType: '',
    description: '',
    preferredDate: '',
    location: '',
    contactNumber: '',
    urgency: 'medium',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files);
    }
  };

  const uploadFiles = async () => {
    if (!files || !userId) return [];
    
    const uploadPromises = Array.from(files).map(async (file) => {
      // Storage disabled - return empty URL
      return '';

    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!userId || !customerEmail) {
      toast({
        title: 'Error',
        description: 'User information is missing. Please try logging in again.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const fileUrls = await uploadFiles();
      
      const serviceRequest = {
        customerId: userId,
        customerName,
        customerEmail,
        ...formData,
        attachments: fileUrls,
        status: 'pending',
        requestDate: new Date().toISOString(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'service-requests'), serviceRequest);

      toast({
        title: 'Request Submitted',
        description: 'Your service request has been submitted successfully.',
      });

      // Reset form
      setFormData({
        serviceType: '',
        description: '',
        preferredDate: '',
        location: '',
        contactNumber: '',
        urgency: 'medium',
      });
      setFiles(null);

    } catch (error) {
      console.error('Error submitting service request:', error);
      toast({
        title: 'Submission Failed',
        description: 'Failed to submit service request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Service Request</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="serviceType">Service Type</Label>
            <Select
              value={formData.serviceType}
              onValueChange={(value) => setFormData({ ...formData, serviceType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electrical">Electrical Installation</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="repair">Repair</SelectItem>
                <SelectItem value="installation">New Installation</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your service request"
              rows={4}
              required
            />
          </div>

          <div>
            <Label htmlFor="preferredDate">Preferred Service Date</Label>
            <Input
              type="date"
              id="preferredDate"
              value={formData.preferredDate}
              onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div>
            <Label htmlFor="location">Service Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Enter service location"
              required
            />
          </div>

          <div>
            <Label htmlFor="contactNumber">Contact Number</Label>
            <Input
              id="contactNumber"
              value={formData.contactNumber}
              onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
              placeholder="Enter contact number"
              required
            />
          </div>

          <div>
            <Label htmlFor="urgency">Urgency Level</Label>
            <Select
              value={formData.urgency}
              onValueChange={(value) => setFormData({ ...formData, urgency: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select urgency level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="attachments">Attachments (Optional)</Label>
            <Input
              type="file"
              id="attachments"
              onChange={handleFileChange}
              multiple
              accept="image/*,.pdf,.doc,.docx"
              className="mt-1"
            />
            <p className="text-sm text-gray-500 mt-1">
              Upload photos or documents related to the service request
            </p>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
