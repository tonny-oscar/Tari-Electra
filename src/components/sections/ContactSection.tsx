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
      Send Message
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
        createdAt: serverTimestamp(),
        status: 'unread' // For admin to track message status
      };

      // Save to Firestore
      await addDoc(collection(db, 'contactMessages'), contactData);

      setFormState({
        message: "Thank you for your message! We'll get back to you soon.",
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
            We're here to help with your sub-metering needs.
          </motion.p>
        </div>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 items-start">
          <motion.div variants={itemVariants}>
            <Card className="shadow-lg h-full">
              <CardHeader>
                <CardTitle>Contact Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-primary mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground">Our Office</h3>
                    <p className="text-muted-foreground">1st Floor, Coloho Mall, Mavoko, Athi River</p>
                  </div>
                </div>
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
                    <a href="tel:+254758424283" className="text-muted-foreground hover:text-primary">+254 758 424 283</a>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-6 w-6 text-primary mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground">Business Hours</h3>
                    <p className="text-muted-foreground">9:00 AM – 5:00 PM (Mon–Fri)</p>
                  </div>
                </div>
                <div className="aspect-video w-full overflow-hidden rounded-lg border mt-6">
                  <Image
                      src="/8e8f8290-9ac0-4a92-a18c-cd3e69b35d03.jpeg"
                      alt="Athi River Location"
                      width={800}
                      height={500}
                      className="object-cover"
                      data-ai-hint="Athi River"
                    />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="shadow-lg h-full">
              <CardHeader>
                <CardTitle>Send Us a Message</CardTitle>
                <CardDescription>Fill out the form below and we'll get back to you.</CardDescription>
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
                    <Label htmlFor="message">Your Message</Label>
                    <Textarea id="message" name="message" placeholder="How can we help you today?" required rows={4} />
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