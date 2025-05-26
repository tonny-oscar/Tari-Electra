// src/components/sections/ContactSection.tsx
'use client';

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import React, { useEffect, useRef, useState } from "react";
import { useFormStatus } from 'react-dom';
import { sendContactEmailAction, type ContactFormState } from '@/app/actions/sendContactEmailAction';
import { AlertCircle, CheckCircle, Loader2, Send, MapPin, Mail, PhoneIcon, Clock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { motion } from "framer-motion";

const initialState: ContactFormState = {
  message: "",
  isSuccess: false,
  isError: false,
  fields: undefined,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
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

export function ContactSection() {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [formState, setFormState] = useState<ContactFormState>(initialState);

  const handleFormAction = async (formData: FormData) => {
    const result = await sendContactEmailAction(initialState, formData);
    setFormState(result);
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
        setFormState(initialState);
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
                    src="https://placehold.co/800x500.png"
                    alt="Service Area Map Placeholder"
                    width={800}
                    height={500}
                    className="object-cover"
                    data-ai-hint="map Athi River Kenya"
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
                <form action={handleFormAction} ref={formRef} className="space-y-6">
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
                  <SubmitButton />
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}