// This file is no longer used on the main landing page as per the new structure.
// It can be kept for potential future use or if a dedicated FAQ page is desired.
"use client";

import React, { useState, useMemo } from 'react';
import { faqs as allFaqs } from "@/data/faqs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Search, HelpCircle } from "lucide-react";

export function FaqSection() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFaqs = useMemo(() => {
    if (!searchTerm) return allFaqs;
    return allFaqs.filter(faq =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  
  return (
    <section id="faq" className="py-16 lg:py-24 bg-secondary">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Find answers to common questions about our services and sub-metering.
          </p>
        </div>
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-3 text-base w-full"
          />
        </div>
        {filteredFaqs.length > 0 ? (
          <Accordion type="single" collapsible className="w-full space-y-4">
            {filteredFaqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="bg-background border border-border rounded-lg shadow-sm">
                <AccordionTrigger className="px-6 py-4 text-left text-base hover:no-underline">
                  <span className="font-medium">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-0 text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="text-center py-10 text-muted-foreground bg-background rounded-lg shadow-sm">
            <HelpCircle className="mx-auto h-12 w-12 mb-4" />
            <p className="text-lg">No FAQs found matching your search criteria.</p>
            <p>Try a different search term or browse all FAQs by clearing the search.</p>
          </div>
        )}
      </div>
    </section>
  );
}
