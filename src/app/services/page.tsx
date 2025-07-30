import { ProductsSection } from "@/components/sections/ProductsSection";
import type { Metadata } from 'next';
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase"; // make sure this points to your Firestore setup
import type { Product } from "@/lib/types";

export const metadata: Metadata = {
  title: 'Services Overview - Tari Electra',
  description: 'Explore the sub-metering services offered by Tari Electra. This page is an alternative to /products.',
};

// ✅ Firestore fetch (must be in async function)
async function fetchProducts(): Promise<Product[]> {
  const snapshot = await getDocs(collection(db, 'products'));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Product[];
}

export default async function ServicesPage() {
  const products = await fetchProducts();

  return <ProductsSection products={products} />;
}
