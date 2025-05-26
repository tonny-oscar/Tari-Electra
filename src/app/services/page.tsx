// This file can be deleted or kept if a different "/services" page is intended in the future.
// For now, products/services are handled by /products page.
import { ProductsSection } from "@/components/sections/ProductsSection";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services Overview - Tari Electra',
  description: 'Explore the sub-metering services offered by Tari Electra. This page is an alternative to /products.',
};

export default function ServicesPage() {
  return <ProductsSection />;
}
