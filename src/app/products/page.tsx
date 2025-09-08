
import { ProductsSection } from "@/components/sections/ProductsSection";
import { getCustomerProducts } from "@/data/customerProducts"; 
import type { Metadata } from 'next';
import type { Product } from '@/lib/types';
import { headers } from 'next/headers'; 
import { unstable_noStore as noStore } from 'next/cache';

export const metadata: Metadata = {
  title: 'Our Products & Services - Tari Electra',
  description: 'Explore Tari Electra\'s prepaid sub-meters and meter separation services designed for landlords and property owners.',
};

export default async function ProductsPage() {
  headers();
  noStore();
  
  console.log('[ProductsPage] Fetching products from customerProducts collection...');
  const products: Product[] = await getCustomerProducts();
  console.log(`[ProductsPage] Fetched ${products.length} products:`, products.map(p => ({ id: p.id, name: p.name, price: p.price })));
  
  const serializedProducts = products.map(product => ({
    ...product,
    createdAt: product.createdAt?.toDate?.() || product.createdAt,
    updatedAt: product.updatedAt?.toDate?.() || product.updatedAt,
  }));
  
  return <ProductsSection products={serializedProducts} />;
}
