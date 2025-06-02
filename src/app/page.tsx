
import { HeroSection } from "@/components/sections/HeroSection";
import { ServiceHighlightsSection } from "@/components/sections/ServiceHighlightsSection";
import { ProductsSection } from "@/components/sections/ProductsSection"; // Removed
import { TestimonialSection } from "@/components/sections/TestimonialSection";
import { CallToActionStripSection } from "@/components/sections/CallToActionStripSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { getHomepageSettings } from "@/data/homepageSettings";
import { unstable_noStore as noStore } from 'next/cache';

export default function HomePage() {
  noStore(); // Ensures fresh data for homepage settings
  const homepageSettings = getHomepageSettings(); 

  return (
    <>
      <HeroSection
        imageUrl={homepageSettings.heroImageUrl}
        imageHint={homepageSettings.heroImageHint}
      />
      <ServiceHighlightsSection id="about" />
      {/* <ProductsSection id="products" /> */} {/* This section has been removed */}
      <TestimonialSection />
      <CallToActionStripSection />
      <ContactSection id="contact" />
    </>
  );
}
