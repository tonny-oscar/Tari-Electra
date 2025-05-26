import { ContactSection } from "@/components/sections/ContactSection";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - Tari Electra',
  description: 'Get in touch with Tari Electra for your sub-metering needs. Reach out for a free estimate or any inquiries.',
};

export default function ContactPage() {
  return <ContactSection />;
}
