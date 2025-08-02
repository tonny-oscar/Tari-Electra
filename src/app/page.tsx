import { HeroSection } from "@/components/sections/HeroSection";
import { ServiceHighlightsSection } from "@/components/sections/ServiceHighlightsSection";
import { ProductsSection } from "@/components/sections/ProductsSection";
import { TestimonialSection } from "@/components/sections/TestimonialSection";
import { CallToActionStripSection } from "@/components/sections/CallToActionStripSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { getHomepageSettings } from "@/data/homepageSettings";
import { getProducts } from "@/data/products";
import { unstable_noStore as noStore } from 'next/cache';

export default async function HomePage() {
  noStore();
  
  const [homepageSettings, products] = await Promise.all([
    getHomepageSettings(),
    getProducts()
  ]);

  if (!homepageSettings) {
    throw new Error('Failed to load homepage settings');
  }

  return (
    <>
      <HeroSection
        imageUrl={homepageSettings.heroImageUrl}
        imageHint={homepageSettings.heroImageHint}
      />
      <ServiceHighlightsSection />
      <ProductsSection products={products} />
      <TestimonialSection />
      <CallToActionStripSection />
      <ContactSection />
    </>
  );
}

