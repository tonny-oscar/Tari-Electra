import { db } from './firebase/client';
import { collection, doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import type { Product } from './types';

export async function createProduct(product: Omit<Product, 'id'>) {
  try {
    const productsRef = collection(db, 'products');
    const newProductRef = doc(productsRef);
    
    await setDoc(newProductRef, {
      ...product,
      id: newProductRef.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: product.status || 'active'
    });

    return newProductRef.id;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

export async function updateProduct(id: string, updates: Partial<Product>) {
  try {
    const productRef = doc(db, 'products', id);
    await updateDoc(productRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

export async function toggleProductStatus(id: string, status: 'active' | 'inactive' | 'draft') {
  try {
    const productRef = doc(db, 'products', id);
    await updateDoc(productRef, {
      status,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error toggling product status:', error);
    throw error;
  }
}
