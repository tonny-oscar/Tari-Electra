
import fs from 'fs';
import path from 'path';
import type { Product } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

// Path to the JSON file for products
const productDataPath = path.resolve(process.cwd(), 'src/data/productData.json');

// Initial set of products (fallback/default)
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
    price: 0, 
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

function readProductData(): Product[] {
  try {
    if (fs.existsSync(productDataPath)) {
      const fileContent = fs.readFileSync(productDataPath, 'utf-8');
      if (fileContent.trim() === '') return initialProducts; // If file is empty, use initial
      const data = JSON.parse(fileContent);
      return Array.isArray(data) && data.length > 0 ? data : initialProducts;
    }
    fs.writeFileSync(productDataPath, JSON.stringify(initialProducts, null, 2), 'utf-8');
    return initialProducts;
  } catch (error) {
    console.error('Error reading or initializing productData.json:', error);
    try {
      fs.writeFileSync(productDataPath, JSON.stringify(initialProducts, null, 2), 'utf-8');
    } catch (writeError) {
        console.error('Error writing initial data to productData.json after read error:', writeError);
    }
    return initialProducts;
  }
}

function writeProductData(data: Product[]): void {
  try {
    fs.writeFileSync(productDataPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to productData.json:', error);
  }
}

export function getProducts(): Product[] {
  const products = readProductData();
  return JSON.parse(JSON.stringify(products));
}

export function findProduct(id: string): Product | undefined {
  const products = readProductData();
  const product = products.find(p => p.id === id);
  return product ? { ...product } : undefined;
}

export function addProduct(productData: Omit<Product, 'id' | 'imageUrl' | 'imageHint'>): Product {
  let products = readProductData();
  const newProduct: Product = {
    ...productData,
    id: uuidv4(),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: productData.name.split(' ').slice(0,2).join(' ').toLowerCase() || 'product placeholder',
    price: Number(productData.price), // Ensure price is a number
    features: Array.isArray(productData.features) ? productData.features : [],
  };
  products.unshift(newProduct);
  writeProductData(products);
  console.log('[addProduct - JSON] New product added and saved:', newProduct);
  return { ...newProduct };
}

export function updateProduct(id: string, updatedProductData: Partial<Omit<Product, 'id'>>): Product | null {
  let products = readProductData();
  const productIndex = products.findIndex(p => p.id === id);
  if (productIndex > -1) {
    const { id: _id, ...dataToUpdate } = updatedProductData;
    products[productIndex] = {
      ...products[productIndex],
      ...dataToUpdate,
      price: dataToUpdate.price !== undefined ? Number(dataToUpdate.price) : products[productIndex].price,
      features: Array.isArray(dataToUpdate.features) ? dataToUpdate.features : products[productIndex].features,
    };
    writeProductData(products);
    console.log('[updateProduct - JSON] Product updated and saved:', products[productIndex]);
    return { ...products[productIndex] };
  }
  console.warn('[updateProduct - JSON] Product not found for ID:', id);
  return null;
}

export function deleteProduct(id: string): boolean {
  let products = readProductData();
  const initialLength = products.length;
  products = products.filter(p => p.id !== id);
  const success = products.length < initialLength;
  if (success) {
    writeProductData(products);
    console.log('[deleteProduct - JSON] Product deleted and saved:', id);
  } else {
    console.warn('[deleteProduct - JSON] Product not found for deletion, ID:', id);
  }
  return success;
}
