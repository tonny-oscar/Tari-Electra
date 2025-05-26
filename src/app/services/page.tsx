// This page is not directly linked in the new single-page landing structure.
// The "Products" section on the homepage now serves this purpose.
// This file can be removed or kept if a dedicated services page is desired later.
import { ProductsSection } from "@/components/sections/ProductsSection";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Services - Tari Electra',
  description: 'Explore the sub-metering services offered by Tari Electra.',
};

export default function ServicesPage() {
  return <ProductsSection />;
}
