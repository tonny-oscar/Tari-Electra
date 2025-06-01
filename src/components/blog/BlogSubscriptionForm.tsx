
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Loader2, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { BlogSubscriptionFormState } from '@/lib/types';
import { subscribeToBlogAction } from '@/app/actions/subscribeToBlogAction';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';

const initialFormState: BlogSubscriptionFormState = {
  message: '',
  isError: false,
  isSuccess: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
      Subscribe
    </Button>
  );
}

export function BlogSubscriptionForm() {
  const { toast } = useToast();
  const [state, setState] = useState<BlogSubscriptionFormState>(initialFormState);
  const formRef = useRef<HTMLFormElement>(null);

  const handleFormAction = async (formData: FormData) => {
    setState(prev => ({ ...prev, message: '', fields: undefined, isError: false, isSuccess: false }));
    const result = await subscribeToBlogAction(initialFormState, formData);
    setState(result);
  };

  useEffect(() => {
    if (state.message) {
      if (state.isSuccess) {
        toast({
          title: 'Subscribed!',
          description: state.message,
          variant: 'default',
          duration: 5000,
        });
        formRef.current?.reset();
        setState(initialFormState); // Reset state after successful submission
      } else if (state.isError && !state.fields) { 
        toast({
          title: 'Subscription Failed',
          description: state.message,
          variant: 'destructive',
          duration: 5000,
        });
      }
    }
  }, [state, toast]);

  return (
    <Card className="shadow-lg bg-background mt-12">
        <CardHeader>
            <CardTitle className="text-xl font-semibold text-center">Stay Updated!</CardTitle>
            <CardDescription className="text-center text-muted-foreground">
                Subscribe to our newsletter to get the latest blog posts directly in your inbox.
            </CardDescription>
        </CardHeader>
        <form action={handleFormAction} ref={formRef}>
            <CardContent className="space-y-4">
                <div className="space-y-1">
                    <Label htmlFor="email-subscribe" className="sr-only">Email Address</Label>
                    <Input
                        id="email-subscribe"
                        name="email"
                        type="email"
                        placeholder="Enter your email address"
                        required
                        className="text-base"
                    />
                    {state.fields?.email && (
                    <p className="text-sm text-destructive mt-1 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {state.fields.email.join(', ')}
                    </p>
                    )}
                </div>
                {state.isError && state.fields && state.message && ( 
                    <Alert variant="destructive" className="mt-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{state.message}</AlertDescription>
                    </Alert>
                )}
            </CardContent>
            <CardFooter className="pt-0">
                <SubmitButton />
            </CardFooter>
        </form>
    </Card>
  );
}

