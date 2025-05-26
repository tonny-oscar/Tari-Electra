import { HeroSection } from "@/components/sections/HeroSection";
import { ServiceHighlightsSection } from "@/components/sections/ServiceHighlightsSection"; // Renamed from "Why Choose Us", using same component for "About"
import { ProductsSection } from "@/components/sections/ProductsSection";
import { TestimonialSection } from "@/components/sections/TestimonialSection";
import { CallToActionStripSection } from "@/components/sections/CallToActionStripSection";
import { ContactSection } from "@/components/sections/ContactSection"; // Added ContactSection

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServiceHighlightsSection /> {/* This is "Why Choose Us / About" id="about" */}
      <ProductsSection /> {/* This is "Our Services / Products" id="products" */}
      <TestimonialSection />
      <CallToActionStripSection />
      <ContactSection /> {/* Added ContactSection, id="contact" */}
    </>
  );
}
