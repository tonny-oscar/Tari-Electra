import { HeroSection } from "@/components/sections/HeroSection";
import { ServiceHighlightsSection } from "@/components/sections/ServiceHighlightsSection";
import { TestimonialSection } from "@/components/sections/TestimonialSection";
import { CallToActionStripSection } from "@/components/sections/CallToActionStripSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServiceHighlightsSection /> {/* "Why Choose Us" / "About" summary */}
      <TestimonialSection />
      <CallToActionStripSection />
    </>
  );
}
