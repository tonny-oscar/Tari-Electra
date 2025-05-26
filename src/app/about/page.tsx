import { ServiceHighlightsSection } from "@/components/sections/ServiceHighlightsSection";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - Tari Electra',
  description: 'Learn more about Tari Electra and why we are the preferred choice for smart sub-metering solutions.',
};

export default function AboutPage() {
  // The ServiceHighlightsSection serves as the "Why Choose Us" / About content
  return <ServiceHighlightsSection />;
}
