"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { TrendingUp, DollarSign, Loader2 } from "lucide-react";

const AVERAGE_SAVINGS_PERCENTAGE = 0.15;

export function SavingsEstimatorSection() {
  const [currentBill, setCurrentBill] = useState<number>(500);
  const [numberOfUnits, setNumberOfUnits] = useState<number>(10);
  const [estimatedSavings, setEstimatedSavings] = useState<number>(0);
  
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);


  useMemo(() => {
    if (currentBill > 0 && numberOfUnits > 0) {
      const savings = currentBill * AVERAGE_SAVINGS_PERCENTAGE;
      setEstimatedSavings(savings);
    } else {
      setEstimatedSavings(0);
    }
  }, [currentBill, numberOfUnits]);

  const handleReset = () => {
    setCurrentBill(500);
    setNumberOfUnits(10);
  };
  
  if (!isClient) {
    return (
      <section id="estimator" className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <Card className="shadow-xl text-left">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <TrendingUp className="mr-2 h-6 w-6 text-primary" />
                Estimate Your Potential Savings
              </CardTitle>
              <CardDescription>Loading estimator...</CardDescription>
            </CardHeader>
            <CardContent className="h-40 flex items-center justify-center">
                 <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }


  return (
    <section id="estimator" className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <Card className="shadow-xl text-left overflow-hidden">
          <CardHeader className="bg-primary/10">
            <CardTitle className="text-2xl flex items-center text-foreground">
              <TrendingUp className="mr-2 h-6 w-6 text-primary" />
              Estimate Your Potential Savings
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Use our calculator to see how much you could save with Tari Smart Power.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div>
              <Label htmlFor="currentBill" className="text-base">
                Current Average Monthly Energy Bill ($)
              </Label>
              <div className="flex items-center space-x-2 mt-2">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <Input
                  id="currentBill"
                  type="number"
                  value={currentBill}
                  onChange={(e) => setCurrentBill(parseFloat(e.target.value) || 0)}
                  min="0"
                  className="text-lg"
                />
              </div>
              <Slider
                value={[currentBill]}
                onValueChange={(value) => setCurrentBill(value[0])}
                max={5000}
                step={50}
                className="mt-3"
              />
            </div>
            <div>
              <Label htmlFor="numberOfUnits" className="text-base">
                Number of Units in Property
              </Label>
              <Input
                id="numberOfUnits"
                type="number"
                value={numberOfUnits}
                onChange={(e) => setNumberOfUnits(parseInt(e.target.value) || 0)}
                min="1"
                className="mt-2 text-lg"
              />
              <Slider
                value={[numberOfUnits]}
                onValueChange={(value) => setNumberOfUnits(value[0])}
                max={200}
                step={1}
                className="mt-3"
              />
            </div>
            <div className="bg-primary/10 p-6 rounded-lg text-center mt-6">
              <p className="text-lg font-medium text-muted-foreground">Estimated Monthly Savings</p>
              <p className="text-4xl font-bold text-primary mt-2">
                ${estimatedSavings.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Based on an average {AVERAGE_SAVINGS_PERCENTAGE * 100}% reduction. Actual savings may vary.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={handleReset} className="w-full">
              Reset Calculator
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
