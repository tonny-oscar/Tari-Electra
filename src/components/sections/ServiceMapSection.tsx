"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import React from "react";

export function ServiceMapSection() {
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Basic form handling, in a real app this would submit to a backend
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name");
    console.log("Form submitted with data:", Object.fromEntries(formData));
    toast({
      title: "Inquiry Sent!",
      description: `Thanks, ${name}! We'll be in touch shortly.`,
    });
    event.currentTarget.reset();
  };

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
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" type="text" placeholder="John Doe" required />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" name="email" type="email" placeholder="you@example.com" required />
                </div>
                <div>
                  <Label htmlFor="propertyType">Property Type (optional)</Label>
                  <Input id="propertyType" name="propertyType" type="text" placeholder="e.g., Apartment Complex, Office Building" />
                </div>
                <div>
                  <Label htmlFor="message">Your Message</Label>
                  <Textarea id="message" name="message" placeholder="How can we help you today?" required rows={4} />
                </div>
                <Button type="submit" className="w-full">Send Inquiry</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
