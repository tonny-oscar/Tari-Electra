"use client";

import React, { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, CheckCircle, Loader2, Lightbulb } from "lucide-react";
import { getSmartSolutionAction, FormState } from '@/app/actions/getSmartSolutionAction';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const initialState: FormState = {
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
      Get My Smart Solution
    </Button>
  );
}

export function SmartSolutionAdvisorSection() {
  const [state, formAction] = useFormState(getSmartSolutionAction, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message && !state.fields) { // Show toast only for general messages, not field validation errors
      toast({
        title: state.isError ? "Error" : "Success",
        description: state.message,
        variant: state.isError ? "destructive" : "default",
      });
    }
  }, [state, toast]);

  return (
    <section id="advisor" className="py-16 lg:py-24 bg-secondary">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            AI-Powered Smart Solution Advisor
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Let our AI help you find the optimal sub-metering solution for your property.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Describe Your Property</CardTitle>
              <CardDescription>Provide details about your property for a tailored recommendation.</CardDescription>
            </CardHeader>
            <form action={formAction}>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="propertyType">Property Type</Label>
                  <Select name="propertyType" defaultValue="">
                    <SelectTrigger id="propertyType">
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Apartment Complex">Apartment Complex</SelectItem>
                      <SelectItem value="Condominium">Condominium</SelectItem>
                      <SelectItem value="Office Building">Office Building</SelectItem>
                      <SelectItem value="Retail Space">Retail Space</SelectItem>
                      <SelectItem value="Mixed-Use Development">Mixed-Use Development</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {state.fields?.propertyType && <p className="text-sm text-destructive mt-1">{state.fields.propertyType}</p>}
                </div>
                <div>
                  <Label htmlFor="usagePatterns">Usage Patterns</Label>
                  <Textarea
                    id="usagePatterns"
                    name="usagePatterns"
                    placeholder="e.g., High daytime electricity use in common areas, variable tenant consumption, specific peak hours..."
                    rows={5}
                  />
                  {state.fields?.usagePatterns && <p className="text-sm text-destructive mt-1">{state.fields.usagePatterns}</p>}
                </div>
              </CardContent>
              <CardFooter>
                <SubmitButton />
              </CardFooter>
            </form>
          </Card>

          <Card className="shadow-lg min-h-[300px] flex flex-col">
            <CardHeader>
              <CardTitle>Your Custom Recommendation</CardTitle>
              <CardDescription>Our AI will generate a solution and reasoning here.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              {state.recommendation ? (
                <Alert variant={state.isError ? "destructive" : "default"}>
                   {state.isError ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                  <AlertTitle>{state.isError ? "Error" : "Recommendation Ready!"}</AlertTitle>
                  <AlertDescription className="space-y-3">
                    {state.recommendation.recommendation && (
                        <div>
                            <h4 className="font-semibold">Suggested Solution:</h4>
                            <p>{state.recommendation.recommendation}</p>
                        </div>
                    )}
                    {state.recommendation.reasoning && (
                         <div>
                            <h4 className="font-semibold mt-2">Reasoning:</h4>
                            <p>{state.recommendation.reasoning}</p>
                        </div>
                    )}
                    {state.message && !state.recommendation.recommendation && <p>{state.message}</p>}
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="text-center text-muted-foreground py-10">
                  <Lightbulb className="mx-auto h-12 w-12 mb-4" />
                  <p>Your personalized advice will appear here once you submit your property details.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
