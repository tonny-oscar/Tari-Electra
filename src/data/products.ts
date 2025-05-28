
import type { Product } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

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
  // Return a deep copy to prevent direct mutation of the internal array from outside
  return JSON.parse(JSON.stringify(mutableProducts));
}

export function findProduct(id: string): Product | undefined {
  const product = mutableProducts.find(p => p.id === id);
  return product ? JSON.parse(JSON.stringify(product)) : undefined; // Return a deep copy
}

export function addProduct(productData: Omit<Product, 'id' | 'imageUrl' | 'imageHint'>): Product {
  const newProduct: Product = {
    ...productData,
    id: uuidv4(), // Use UUID for more robust unique IDs
    imageUrl: 'https://placehold.co/600x400.png', // Default placeholder
    imageHint: productData.name.split(' ').slice(0,2).join(' ').toLowerCase() || 'product placeholder',
  };
  mutableProducts.unshift(newProduct); // Add to the beginning
  console.log('[addProduct - In-Memory] New product added:', newProduct);
  return JSON.parse(JSON.stringify(newProduct)); // Return a deep copy
}

export function updateProduct(id: string, updatedProductData: Partial<Omit<Product, 'id'>>): Product | null {
  const productIndex = mutableProducts.findIndex(p => p.id === id);
  if (productIndex > -1) {
    // Ensure ID is not changed
    const { id: _, ...dataToUpdate } = updatedProductData;
    mutableProducts[productIndex] = {
      ...mutableProducts[productIndex],
      ...dataToUpdate,
      // Ensure price is a number if it's being updated
      price: dataToUpdate.price !== undefined ? Number(dataToUpdate.price) : mutableProducts[productIndex].price,
    };
    console.log('[updateProduct - In-Memory] Product updated:', mutableProducts[productIndex]);
    return JSON.parse(JSON.stringify(mutableProducts[productIndex])); // Return a deep copy
  }
  console.warn('[updateProduct - In-Memory] Product not found for ID:', id);
  return null;
}

export function deleteProduct(id: string): boolean {
  const initialLength = mutableProducts.length;
  mutableProducts = mutableProducts.filter(p => p.id !== id);
  const success = mutableProducts.length < initialLength;
  if (success) {
    console.log('[deleteProduct - In-Memory] Product deleted:', id);
  } else {
    console.warn('[deleteProduct - In-Memory] Product not found for deletion, ID:', id);
  }
  return success;
}
