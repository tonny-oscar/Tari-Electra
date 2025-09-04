import { SavingsEstimatorSection } from "@/components/sections/SavingsEstimatorSection";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Savings Estimator - Tari Electra',
  description: 'Estimate your potential savings with our smart sub-metering solutions.',
};

export default function EstimatorPage() {
  return <SavingsEstimatorSection />;
}
