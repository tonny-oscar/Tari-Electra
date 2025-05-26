import { HeroSection } from "@/components/sections/HeroSection";
import { ServiceHighlightsSection } from "@/components/sections/ServiceHighlightsSection"; // Repurposed for "Why Choose Us"
import { ProductsSection } from "@/components/sections/ProductsSection";
import { TestimonialSection } from "@/components/sections/TestimonialSection";
import { CallToActionStripSection } from "@/components/sections/CallToActionStripSection";
// import { ContactSection } from "@/components/sections/ContactSection"; // Renamed from ServiceMapSection - Removed

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServiceHighlightsSection /> {/* This is now "Why Choose Us / About" */}
      <ProductsSection /> {/* This is "Our Services / Products" */}
      <TestimonialSection />
      <CallToActionStripSection />
      {/* <ContactSection /> */} {/* ContactSection removed */}
    </>
  );
}
