// This page is not directly linked in the new single-page landing structure.
// It can be removed or kept if a dedicated page for the advisor is desired later.
import { SmartSolutionAdvisorSection } from "@/components/sections/SmartSolutionAdvisorSection";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Smart Solution Advisor - Tari Electra',
  description: 'Get AI-powered recommendations for your sub-metering needs.',
};

export default function AdvisorPage() {
  return <SmartSolutionAdvisorSection />;
}
