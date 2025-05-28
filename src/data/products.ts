
import type { Product } from '@/lib/types';

// Initial set of products
const initialProducts: Product[] = [
  {
    id: 'tari-std-001',
    name: 'Tari Standard Prepaid Meter',
    description: 'Reliable and affordable prepaid electricity meter for residential and small commercial use. Easy to install and manage.',
    price: 2500.00,
    category: 'Prepaid Meters',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'electricity meter standard',
    features: [
      'STS Compliant',
      'Tamper Detection',
      'Low Credit Warning',
      'Compact Design',
    ],
  },
  {
    id: 'tari-adv-002',
    name: 'Tari Advanced Smart Meter',
    description: 'Smart prepaid meter with remote monitoring capabilities, detailed consumption reports, and mobile app integration.',
    price: 4500.00,
    category: 'Smart Meters',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'smart meter advanced',
    features: [
      'Remote Reading & Vending',
      'Real-time Usage Data',
      'Mobile App Control',
      'Load Management',
    ],
  },
  {
    id: 'meter-sep-svc-003',
    name: 'Meter Separation Service',
    description: 'Professional service for separating existing single meter connections into multiple individual sub-metered units.',
    price: 0, // Price typically quoted based on project scope
    category: 'Services',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'electrical wiring service',
    features: [
      'Site Assessment Included',
      'Compliant Installations',
      'Suitable for Multi-Tenant Properties',
      'Reduces Billing Disputes',
    ],
  },
];

// Mutable array for in-memory operations
let mutableProducts: Product[] = JSON.parse(JSON.stringify(initialProducts));

export function getProducts(): Product[] {
  return JSON.parse(JSON.stringify(mutableProducts));
}

export function findProduct(id: string): Product | undefined {
  const product = mutableProducts.find(p => p.id === id);
  return product ? { ...product } : undefined;
}

// Function to generate a simple unique ID (for prototype purposes)
function generateProductId(name: string): string {
  const slugPart = name.toLowerCase().replace(/\s+/g, '-').slice(0, 20);
  const timestamp = Date.now().toString().slice(-5);
  return `${slugPart}-${timestamp}`;
}


export function addProduct(productData: Omit<Product, 'id' | 'imageUrl' | 'imageHint' | 'features'> & { price: number | string }): Product {
  // Check if a product with a very similar name already exists to prevent accidental duplicates if IDs are name-based
  // For robust ID generation, a UUID library or database sequence would be better.
  const newId = generateProductId(productData.name);
  if (mutableProducts.some(p => p.id === newId)) {
    throw new Error(`Product with generated ID "${newId}" might conflict. Try a slightly different name.`);
  }

  const newProduct: Product = {
    ...productData,
    id: newId,
    price: Number(productData.price), // Ensure price is a number
    imageUrl: productData.imageUrl || 'https://placehold.co/600x400.png',
    imageHint: productData.imageHint || 'product placeholder',
    features: productData.features || [],
  };
  mutableProducts.unshift(newProduct);
  return { ...newProduct };
}

export function updateProduct(id: string, updatedProductData: Partial<Omit<Product, 'id'>> & { price?: number | string }): Product | null {
  const productIndex = mutableProducts.findIndex(p => p.id === id);
  if (productIndex > -1) {
    const existingProduct = mutableProducts[productIndex];
    const newProductData = { ...existingProduct, ...updatedProductData };

    if (updatedProductData.price !== undefined) {
      newProductData.price = Number(updatedProductData.price);
    }
    
    mutableProducts[productIndex] = newProductData;
    return { ...mutableProducts[productIndex] };
  }
  return null;
}

export function deleteProduct(id: string): boolean {
  const initialLength = mutableProducts.length;
  mutableProducts = mutableProducts.filter(p => p.id !== id);
  return mutableProducts.length < initialLength;
}
