import { ProductsSection } from "@/components/sections/ProductsSection";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Products & Services - Tari Electra',
  description: 'Explore Tari Electra\'s prepaid sub-meters and meter separation services designed for landlords and property owners.',
};

export default function ProductsPage() {
  return <ProductsSection />;
}
