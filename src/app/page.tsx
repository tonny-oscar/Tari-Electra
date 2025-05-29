
import { HeroSection } from "@/components/sections/HeroSection";
import { ServiceHighlightsSection } from "@/components/sections/ServiceHighlightsSection";
import { ProductsSection } from "@/components/sections/ProductsSection";
import { TestimonialSection } from "@/components/sections/TestimonialSection";
import { CallToActionStripSection } from "@/components/sections/CallToActionStripSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { getHomepageSettings } from "@/data/homepageSettings"; // Import the settings function

export default function HomePage() {
  const homepageSettings = getHomepageSettings();

  return (
    <>
      <HeroSection 
        imageUrl={homepageSettings.heroImageUrl}
        imageHint={homepageSettings.heroImageHint}
      />
      <ServiceHighlightsSection id="about" />
      <ProductsSection id="products" />
      <TestimonialSection />
      <CallToActionStripSection />
      <ContactSection id="contact" />
    </>
  );
}
