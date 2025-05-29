
import { db } from '@/lib/firebase/client';
import type { Product } from '@/lib/types';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  setDoc,
  deleteDoc,
  Timestamp,
  query,
  orderBy,
  writeBatch,
} from 'firebase/firestore';
import { unstable_noStore as noStore } from 'next/cache'; // Import unstable_noStore

const PRODUCTS_COLLECTION = 'products';

// Helper to convert Firestore Timestamps to ISO strings for dates if needed
const productToClient = (docData: any): Product => {
  const data = { ...docData } as Product;
  // No explicit date fields in base Product type that need conversion here
  return data;
};

export async function getProducts(): Promise<Product[]> {
  noStore(); // Opt out of caching for this function
  console.log('[FirestoreProducts - getProducts] Attempting to fetch products (noStore active).');
  try {
    if (!db) {
      console.error('[FirestoreProducts - getProducts] Firestore db instance is not available.');
      return [];
    }
    const productsCollection = collection(db, PRODUCTS_COLLECTION);
    const q = query(productsCollection, orderBy('name', 'asc'));
    const productSnapshot = await getDocs(q);
    const productList = productSnapshot.docs.map(doc => ({
      id: doc.id,
      ...productToClient(doc.data()),
    }));
    console.log(`[FirestoreProducts - getProducts] Fetched ${productList.length} products.`);
    return productList;
  } catch (error) {
    console.error('[FirestoreProducts - getProducts] Error fetching products:', error);
    return [];
  }
}

export async function findProduct(id: string): Promise<Product | undefined> {
  noStore(); // Opt out of caching for this function as well for consistency on edit pages
  console.log(`[FirestoreProducts - findProduct] Attempting to find product with ID: ${id} (noStore active)`);
  try {
    if (!db) {
      console.error(`[FirestoreProducts - findProduct] Firestore db instance is not available for ID: ${id}`);
      return undefined;
    }
    const productDocRef = doc(db, PRODUCTS_COLLECTION, id);
    const productSnap = await getDoc(productDocRef);
    if (productSnap.exists()) {
      const productData = productToClient(productSnap.data());
      console.log(`[FirestoreProducts - findProduct] Found product:`, { id: productSnap.id, ...productData });
      return { id: productSnap.id, ...productData };
    }
    console.log(`[FirestoreProducts - findProduct] Product with ID ${id} not found.`);
    return undefined;
  } catch (error) {
    console.error(`[FirestoreProducts - findProduct] Error finding product ${id}:`, error);
    return undefined;
  }
}

export async function addProduct(
  productData: Omit<Product, 'id'>
): Promise<Product | null> {
  console.log('[FirestoreProducts - addProduct] Attempting to add product:', productData);
  try {
    if (!db) {
      console.error('[FirestoreProducts - addProduct] Firestore db instance is not available.');
      throw new Error('Firestore instance is not available');
    }
    const productForFirestore = {
      ...productData,
      price: Number(productData.price) || 0,
      features: Array.isArray(productData.features) ? productData.features : [],
      imageUrl: productData.imageUrl || 'https://placehold.co/600x400.png',
      imageHint: productData.imageHint || productData.name.split(' ').slice(0,2).join(' ').toLowerCase() || 'product image',
    };
    console.log('[FirestoreProducts - addProduct] Data prepared for Firestore:', productForFirestore);

    const docRef = await addDoc(
      collection(db, PRODUCTS_COLLECTION),
      productForFirestore
    );
    console.log('[FirestoreProducts - addProduct] Product added successfully with ID:', docRef.id);
    return { id: docRef.id, ...productForFirestore };
  } catch (error) {
    console.error('[FirestoreProducts - addProduct] Error adding product:', error);
    return null;
  }
}

export async function updateProduct(
  id: string,
  updatedProductData: Partial<Omit<Product, 'id'>>
): Promise<Product | null> {
  console.log(`[FirestoreProducts - updateProduct] Attempting to update product ${id} with data:`, updatedProductData);
  try {
    if (!db) {
      console.error(`[FirestoreProducts - updateProduct] Firestore db instance is not available for ID: ${id}`);
      return null;
    }
    const productDocRef = doc(db, PRODUCTS_COLLECTION, id);
    const dataToUpdate: Record<string, any> = { ...updatedProductData };
    if (typeof updatedProductData.price !== 'undefined') {
        dataToUpdate.price = Number(updatedProductData.price);
    }
    if (typeof updatedProductData.features !== 'undefined' && !Array.isArray(updatedProductData.features)) {
        dataToUpdate.features = []; 
    }
    
    await setDoc(productDocRef, dataToUpdate, { merge: true });
    console.log(`[FirestoreProducts - updateProduct] Product ${id} updated successfully in Firestore.`);
    
    // Fetch the updated document to return it
    const updatedSnap = await getDoc(productDocRef);
    if (updatedSnap.exists()) {
      const updatedProduct = { id: updatedSnap.id, ...productToClient(updatedSnap.data()) };
      console.log(`[FirestoreProducts - updateProduct] Returning updated product data:`, updatedProduct);
      return updatedProduct;
    } else {
      console.error(`[FirestoreProducts - updateProduct] Product ${id} not found after update attempt.`);
      return null;
    }
  } catch (error) {
    console.error(`[FirestoreProducts - updateProduct] Error updating product ${id}:`, error);
    return null;
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  console.log(`[FirestoreProducts - deleteProduct] Attempting to delete product with ID: ${id}`);
  try {
    if (!db) {
      console.error(`[FirestoreProducts - deleteProduct] Firestore db instance is not available for ID: ${id}`);
      return false;
    }
    const productDocRef = doc(db, PRODUCTS_COLLECTION, id);
    await deleteDoc(productDocRef);
    console.log(`[FirestoreProducts - deleteProduct] Product ${id} deleted successfully from Firestore.`);
    return true;
  } catch (error) {
    console.error(`[FirestoreProducts - deleteProduct] Error deleting product ${id}:`, error);
    return false;
  }
}
