import { FaqSection } from "@/components/sections/FaqSection";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ - Tari Electra',
  description: 'Frequently asked questions about Tari Electra services.',
};

export default function FAQPage() {
  return <FaqSection />;
}
