import { HeroSection } from "@/components/sections/HeroSection";
import { ServiceMapSection } from "@/components/sections/ServiceMapSection";
import { TestimonialSection } from "@/components/sections/TestimonialSection";
import { SmartSolutionAdvisorSection } from "@/components/sections/SmartSolutionAdvisorSection";
import { SavingsEstimatorSection } from "@/components/sections/SavingsEstimatorSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { BlogSummarySection } from "@/components/sections/BlogSummarySection";
import { ServiceHighlightsSection } from "@/components/sections/ServiceHighlightsSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServiceHighlightsSection />
      <SmartSolutionAdvisorSection />
      <SavingsEstimatorSection />
      <TestimonialSection />
      <FaqSection />
      <BlogSummarySection />
      <ServiceMapSection /> {/* Contact form is here */}
    </>
  );
}
