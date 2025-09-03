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
      Get Free Estimate
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
        property: formData.get('property') as string || '',
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
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Let's Optimize Your Utility Management.
          </motion.h2>
          <motion.p
            className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto"
            variants={itemVariants}
          >
            Get in touch with us today to discuss your requirements and discover how Tari's smart metering solutions can help you save costs and improve efficiency.
          </motion.p>
        </div>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 items-start">
          <motion.div variants={itemVariants}>
            <Card className="shadow-lg h-full">
              <CardHeader>
                <CardTitle>Get Your Free Estimate</CardTitle>
                <CardDescription>Contact us today for a personalized quote</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid gap-6">
                  <div className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200 hover:shadow-md transition-all duration-300">
                    <div className="p-3 bg-purple-500 rounded-full mr-4">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-purple-900 text-lg">📍 Address</h3>
                      <p className="text-purple-700 font-semibold text-lg">Ramco Court, Mombasa Road, Nairobi, Kenya</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-300">
                    <div className="p-3 bg-blue-500 rounded-full mr-4">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-blue-900 text-lg">📧 Email</h3>
                      <a href="mailto:hello@tari.africa" className="text-blue-700 hover:text-blue-900 font-semibold text-lg">hello@tari.africa</a>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200 hover:shadow-md transition-all duration-300">
                    <div className="p-3 bg-green-500 rounded-full mr-4">
                      <PhoneIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-green-900 text-lg">📞 Phone</h3>
                      <a href="tel:+254757672936" className="text-green-700 hover:text-green-900 font-semibold text-lg">+254 757672936</a>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200 hover:shadow-md transition-all duration-300">
                    <div className="p-3 bg-emerald-500 rounded-full mr-4">
                      <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-emerald-900 text-lg">💬 WhatsApp</h3>
                      <a href="https://wa.me/254717777668?text=Hello%2C%20I%27m%20interested%20in%20your%20sub-metering%20services.%20Could%20you%20please%20provide%20me%20with%20more%20information%3F" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-900 font-semibold text-lg">0717777668</a>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200 hover:shadow-md transition-all duration-300">
                    <div className="p-3 bg-purple-500 rounded-full mr-4">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-purple-900 text-lg">🕘 Business Hours</h3>
                      <p className="text-purple-700 font-semibold text-lg">9:00 AM – 5:00 PM (Mon–Fri)</p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl border-2 border-gradient-to-r from-indigo-200 to-purple-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/30 to-purple-100/30"></div>
                  <div className="relative z-10 text-center space-y-4">
                    <div className="relative inline-block">
                      <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-xl flex items-center justify-center border-4 border-white animate-pulse">
                        <div className="text-3xl">👥</div>
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-3 border-white flex items-center justify-center animate-bounce">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-bold text-xl text-gray-800 flex items-center justify-center gap-2">
                        🎆 Customer Support Agent
                      </h4>
                      <p className="text-lg text-gray-700 font-semibold bg-white/60 px-4 py-2 rounded-full inline-block">
                        Ready to assist you 24/7
                      </p>
                      <div className="flex justify-center space-x-3 pt-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer">
                          <PhoneIcon className="w-6 h-6 text-white" />
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer">
                          <Mail className="w-6 h-6 text-white" />
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12,3C17.5,3 22,6.58 22,11C22,15.42 17.5,19 12,19C10.76,19 9.57,18.82 8.47,18.5C5.55,21 2,21 2,21C4.33,18.67 4.7,17.1 4.75,16.5C3.05,15.07 2,13.13 2,11C2,6.58 6.5,3 12,3Z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-3 left-3 opacity-30">
                    <div className="text-2xl animate-spin-slow">✨</div>
                  </div>
                  <div className="absolute bottom-3 right-3 opacity-30">
                    <div className="text-2xl animate-bounce">🚀</div>
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
                    <Label htmlFor="property">Property Name/Location</Label>
                    <Input id="property" name="property" type="text" placeholder="e.g. Westlands Apartments, Nairobi" />
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" name="message" placeholder="Tell us about your requirements..." required rows={4} />
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
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}