import { HeroSection } from "@/components/sections/HeroSection";
import { ServiceHighlightsSection } from "@/components/sections/ServiceHighlightsSection";
import { TestimonialSection } from "@/components/sections/TestimonialSection";
import { CallToActionStripSection } from "@/components/sections/CallToActionStripSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { getHomepageSettings } from "@/data/homepageSettings"; // Firestore version
import { unstable_noStore as noStore } from 'next/cache';

export default async function HomePage() { // Make async
  noStore(); 
  const homepageSettings = await getHomepageSettings(); // Await the Firestore call

  return (
    <>
      <HeroSection
        imageUrl={homepageSettings.heroImageUrl}
        imageHint={homepageSettings.heroImageHint}
      />
      <ServiceHighlightsSection id="about" />
      {/* ProductsSection removed */}
      <TestimonialSection />
      <CallToActionStripSection />
      <ContactSection id="contact" />
    </>
  );
}

