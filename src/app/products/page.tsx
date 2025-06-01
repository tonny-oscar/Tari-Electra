
import { ProductsSection } from "@/components/sections/ProductsSection";
import { getProducts } from "@/data/products"; 
import type { Metadata } from 'next';
import type { Product } from '@/lib/types';
import { headers } from 'next/headers'; // To make the page dynamic
import { unstable_noStore as noStore } from 'next/cache'; // For explicit no-store

export const metadata: Metadata = {
  title: 'Our Products & Services - Tari Electra',
  description: 'Explore Tari Electra\'s prepaid sub-meters and meter separation services designed for landlords and property owners.',
};

export default async function ProductsPage() {
  headers(); // Accessing headers makes this page dynamically rendered on each request.
  noStore(); // Explicitly opt out of caching for this Server Component's data fetching operation.
  
  console.log('[ProductsPage] Fetching products from Firestore for public page...');
  const products: Product[] = await getProducts();
  console.log(`[ProductsPage] Public page fetched ${products.length} products:`, products.map(p => ({ id: p.id, name: p.name, price: p.price })));
  
  return <ProductsSection products={products} />;
}
