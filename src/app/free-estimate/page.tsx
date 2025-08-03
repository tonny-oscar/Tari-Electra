import { FreeEstimateSection } from "@/components/sections/FreeEstimateSection";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Get Your Free Estimate - Tari Electra',
  description: 'Contact us today for a personalized quote on sub-metering services.',
};

export default function FreeEstimatePage() {
  return <FreeEstimateSection />;
}