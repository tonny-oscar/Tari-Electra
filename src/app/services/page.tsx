import { ProductsSection } from "@/components/sections/ProductsSection";
import type { Metadata } from 'next';
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Product } from "@/lib/types";

export const metadata: Metadata = {
  title: 'Services Overview - Tari Electra',
  description: 'Explore the sub-metering services offered by Tari Electra. This page is an alternative to /products.',
};

async function fetchProducts(): Promise<Product[]> {
  try {
    const snapshot = await getDocs(collection(db, 'products'));
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data?.name || 'Unnamed Product',
        description: data?.description || 'No description available',
        price: Number(data?.price) || 0,
        category: data?.category || 'General',
        features: Array.isArray(data?.features) ? data.features : [],
        imageUrl: data?.imageUrl || 'https://placehold.co/600x400.png',
        ...data,
      };
    }) as Product[];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function ServicesPage() {
  const products = await fetchProducts();

  return <ProductsSection products={products} />;
}
