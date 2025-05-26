// This page is not directly linked in the new single-page landing structure.
// It can be removed or kept if a dedicated page for FAQs is desired later.
import { FaqSection } from "@/components/sections/FaqSection";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ - Tari Electra',
  description: 'Frequently asked questions about Tari Electra services.',
};

export default function FAQPage() {
  return <FaqSection />;
}
