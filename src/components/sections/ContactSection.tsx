'use client';

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import React, { useEffect, useRef } from "react";
import { useActionState, useFormStatus } from 'react';
import { sendContactEmailAction, type ContactFormState } from '@/app/actions/sendContactEmailAction';
import { AlertCircle, CheckCircle, Loader2, Send, MapPin, Mail, PhoneIcon, Clock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const initialState: ContactFormState = {
  message: "",
  isSuccess: false,
  isError: false,
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

export function ContactSection() {
  const { toast } = useToast();
  const [state, formAction] = useActionState(sendContactEmailAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message) {
      if (state.isSuccess) {
        toast({
          title: "Success!",
          description: state.message,
          variant: "default",
        });
        formRef.current?.reset();
      } else if (state.isError && !state.fields) {
        toast({
          title: "Error",
          description: state.message,
          variant: "destructive",
        });
      }
    }
  }, [state, toast]);

  return (
    <section id="contact" className="py-16 lg:py-24 bg-secondary">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Reach Out to Us
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We're here to help with your sub-metering needs.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 items-start">
          <Card className="shadow-lg">
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

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Send Us a Message</CardTitle>
              <CardDescription>Fill out the form below and we'll get back to you.</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={formAction} ref={formRef} className="space-y-6">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" type="text" placeholder="John Doe" required />
                  {state.fields?.name && <p className="text-sm text-destructive mt-1">{state.fields.name}</p>}
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" name="email" type="email" placeholder="you@example.com" required />
                  {state.fields?.email && <p className="text-sm text-destructive mt-1">{state.fields.email}</p>}
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" type="tel" placeholder="e.g. +254 7XX XXX XXX" />
                  {state.fields?.phone && <p className="text-sm text-destructive mt-1">{state.fields.phone}</p>}
                </div>
                <div>
                  <Label htmlFor="message">Your Message</Label>
                  <Textarea id="message" name="message" placeholder="How can we help you today?" required rows={4} />
                  {state.fields?.message && <p className="text-sm text-destructive mt-1">{state.fields.message}</p>}
                </div>
                
                {state.message && !state.isSuccess && state.isError && state.fields && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Form Error</AlertTitle>
                    <AlertDescription>
                      {state.message} Please correct the highlighted fields.
                    </AlertDescription>
                  </Alert>
                )}
                <SubmitButton />
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
