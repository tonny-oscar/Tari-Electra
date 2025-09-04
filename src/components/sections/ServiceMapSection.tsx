"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import React, { useEffect, useRef } from "react";
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { sendContactEmailAction, type ContactFormState } from '@/app/actions/sendContactEmailAction';
import { AlertCircle, CheckCircle, Loader2, Send } from "lucide-react";
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
      Send Inquiry
    </Button>
  );
}

export function ServiceMapSection() {
  const { toast } = useToast();
  const [state, formAction, isPending] = useActionState(sendContactEmailAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message) {
      if (state.isSuccess) {
        toast({
          title: "Success!",
          description: state.message,
          variant: "default",
        });
        formRef.current?.reset(); // Reset form on success
      } else if (state.isError && !state.fields) { // Only show general errors as toast
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
            Our Service Area & Inquiries
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We proudly serve a wide range of locations. Contact us to see if we cover your area.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 items-start">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Service Coverage</CardTitle>
              <CardDescription>Placeholder map of our service area. For specific coverage, please contact us.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video w-full overflow-hidden rounded-lg border">
                <Image
                  src="https://placehold.co/800x500.png"
                  alt="Service Area Map Placeholder"
                  width={800}
                  height={500}
                  className="object-cover"
                  data-ai-hint="map region"
                />
              </div>
               <p className="mt-4 text-sm text-muted-foreground">
                Note: This is a placeholder image. Actual service map integration would require map APIs and location data.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Get in Touch</CardTitle>
              <CardDescription>Have questions or need a quote? Fill out the form below.</CardDescription>
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
                  <Label htmlFor="propertyType">Property Type (optional)</Label>
                  <Input id="propertyType" name="propertyType" type="text" placeholder="e.g., Apartment Complex, Office Building" />
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
