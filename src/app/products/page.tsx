
import { ProductsSection } from "@/components/sections/ProductsSection";
import { getProducts } from "@/data/products"; // Import getProducts
import type { Metadata } from 'next';
import type { Product } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Our Products & Services - Tari Electra',
  description: 'Explore Tari Electra\'s prepaid sub-meters and meter separation services designed for landlords and property owners.',
};

export default function ProductsPage() {
  const products: Product[] = getProducts(); // Fetch products here
  return <ProductsSection products={products} />; {/* Pass products as a prop */}
}
