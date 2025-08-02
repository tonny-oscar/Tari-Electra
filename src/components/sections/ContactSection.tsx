'use client';

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import React, { useEffect, useRef, useState } from "react";
import { AlertCircle, Loader2, Send, MapPin, Mail, PhoneIcon, Clock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { motion } from "framer-motion";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase'; 

interface ContactFormState {
  message: string;
  isSuccess: boolean;
  isError: boolean;
  fields?: {
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
  };
}

const initialState: ContactFormState = {
  message: "",
  isSuccess: false,
  isError: false,
  fields: undefined,
};

function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <Button type="submit" className="w-full" disabled={isSubmitting}>
      {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
      Request Free Estimate
    </Button>
  );
}

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.2 }
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// Validation function
const validateForm = (formData: FormData): { isValid: boolean; fields?: any } => {
  const errors: any = {};
  
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const message = formData.get('message') as string;

  if (!name || name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters long';
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (phone && phone.trim() && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(phone.replace(/\s/g, ''))) {
    errors.phone = 'Please enter a valid phone number';
  }

  if (!message || message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters long';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    fields: Object.keys(errors).length > 0 ? errors : undefined
  };
};

export function ContactSection() {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [formState, setFormState] = useState<ContactFormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form submission to Firestore
  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      
      // Validate form
      const validation = validateForm(formData);
      if (!validation.isValid) {
        setFormState({
          message: "Please check the form for errors.",
          isSuccess: false,
          isError: true,
          fields: validation.fields
        });
        setIsSubmitting(false);
        return;
      }

      // Prepare data for Firestore
      const contactData = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string || '',
        message: formData.get('message') as string,
        receivedAt: serverTimestamp(),
        isRead: false
      };

      // Save to Firestore
      await addDoc(collection(db, 'contactMessages'), contactData);

      setFormState({
        message: "Thank you for your estimate request! We'll get back to you with a quote soon.",
        isSuccess: true,
        isError: false,
        fields: undefined
      });

    } catch (error) {
      console.error('Error saving contact message:', error);
      setFormState({
        message: "There was an error sending your message. Please try again.",
        isSuccess: false,
        isError: true,
        fields: undefined
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (formState.message) {
      if (formState.isSuccess) {
        toast({
          title: "Success!",
          description: formState.message,
          variant: "default",
        });
        formRef.current?.reset();
        // Reset form state after showing success message
        setTimeout(() => setFormState(initialState), 2000);
      } else if (formState.isError && !formState.fields) { 
        toast({
          title: "Error",
          description: formState.message,
          variant: "destructive",
        });
      }
    }
  }, [formState, toast]);

  return (
    <motion.section
      id="contact"
      className="py-16 lg:py-24 bg-secondary"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={sectionVariants}
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            variants={itemVariants}
          >
            Reach Out to Us
          </motion.h2>
          <motion.p
            className="mt-4 text-lg text-muted-foreground"
            variants={itemVariants}
          >
            Get in touch for a free estimate or any inquiries.
          </motion.p>
        </div>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 items-start">
          <motion.div variants={itemVariants}>
            <Card className="shadow-lg h-full">
              <CardHeader>
                <CardTitle>Get Your Free Estimate</CardTitle>
                <CardDescription>Contact us today for a personalized quote</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">

                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-primary mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground">Email Us</h3>
                    <a href="mailto:hello@tari.africa" className="text-muted-foreground hover:text-primary">hello@tari.africa</a>
                  </div>
                </div>
                <div className="flex items-start">
                  <PhoneIcon className="h-6 w-6 text-primary mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground">Call Us</h3>
                    <a href="tel:0717777668" className="text-muted-foreground hover:text-primary">0717777668</a>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-4 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
                  </svg>
                  <div>
                    <h3 className="font-semibold text-foreground">WhatsApp</h3>
                    <a href="https://wa.me/254717777668?text=Hello%2C%20I%27m%20interested%20in%20your%20sub-metering%20services.%20Could%20you%20please%20provide%20me%20with%20more%20information%3F" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-green-500">0717777668</a>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-6 w-6 text-primary mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground">Business Hours</h3>
                    <p className="text-muted-foreground">9:00 AM – 5:00 PM (Mon–Fri)</p>
                  </div>
                </div>
                <div className="aspect-video w-full overflow-hidden rounded-lg border mt-6 bg-gradient-to-br from-blue-50 to-indigo-100 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="relative">
                        <div className="w-24 h-24 mx-auto bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-blue-200">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.9 1 3 1.9 3 3V21C3 22.1 3.9 23 5 23H19C20.1 23 21 22.1 21 21V9M19 9H14V4H19V9Z"/>
                            </svg>
                          </div>
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-800">Customer Support Agent</h4>
                        <p className="text-sm text-gray-600">Ready to assist you 24/7</p>
                        <div className="flex justify-center space-x-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <PhoneIcon className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <Mail className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12,3C17.5,3 22,6.58 22,11C22,15.42 17.5,19 12,19C10.76,19 9.57,18.82 8.47,18.5C5.55,21 2,21 2,21C4.33,18.67 4.7,17.1 4.75,16.5C3.05,15.07 2,13.13 2,11C2,6.58 6.5,3 12,3Z"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-4 left-4 opacity-20">
                    <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z"/>
                    </svg>
                  </div>
                  <div className="absolute bottom-4 right-4 opacity-20">
                    <svg className="w-8 h-8 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6Z"/>
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="shadow-lg h-full">
              <CardHeader>
                <CardTitle>Request Your Estimate</CardTitle>
                <CardDescription>Fill out the form below and we'll provide you with a free quote.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFormSubmit} ref={formRef} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" type="text" placeholder="John Doe" required />
                    {formState.fields?.name && <p className="text-sm text-destructive mt-1">{formState.fields.name}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" name="email" type="email" placeholder="you@example.com" required />
                    {formState.fields?.email && <p className="text-sm text-destructive mt-1">{formState.fields.email}</p>}
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" type="tel" placeholder="e.g. +254 7XX XXX XXX" />
                    {formState.fields?.phone && <p className="text-sm text-destructive mt-1">{formState.fields.phone}</p>}
                  </div>
                  <div>
                    <Label htmlFor="message">Project Details</Label>
                    <Textarea id="message" name="message" placeholder="Tell us about your sub-metering project and requirements..." required rows={4} />
                    {formState.fields?.message && <p className="text-sm text-destructive mt-1">{formState.fields.message}</p>}
                  </div>

                  {formState.isError && formState.fields && formState.message && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Form Error</AlertTitle>
                      <AlertDescription>
                        {formState.message} Please correct the highlighted fields.
                      </AlertDescription>
                    </Alert>
                  )}
                  <SubmitButton isSubmitting={isSubmitting} />
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}