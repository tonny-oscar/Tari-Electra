// This page is not directly linked in the new single-page landing structure.
// The "Contact" section on the homepage now serves this purpose.
// This file can be removed or kept if a dedicated contact page is desired later.
import { ContactSection } from "@/components/sections/ContactSection";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - Tari Electra',
  description: 'Get in touch with Tari Electra for your sub-metering needs.',
};

export default function ContactPage() {
  return <ContactSection />;
}
