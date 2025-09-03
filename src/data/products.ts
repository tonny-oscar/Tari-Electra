
import { db } from '@/lib/firebase'; // Ensure db is correctly imported
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
  console.log('[FirestoreProducts - getProducts] Attempting to fetch products from Firestore (noStore active).');
  try {
    if (!db) {
      console.error('[FirestoreProducts - getProducts] Firestore db instance is not available.');
      return [];
    }
    const productsCollection = collection(db, PRODUCTS_COLLECTION);
    const q = query(productsCollection, orderBy('name', 'asc'));
    const productSnapshot = await getDocs(q);
    const productList = productSnapshot.docs.map(doc => {
      const data = productToClient(doc.data());
      return { ...data, id: doc.id };
    });
    console.log(`[FirestoreProducts - getProducts] Fetched ${productList.length} products from Firestore.`);
    return productList;
  } catch (error) {
    console.error('[FirestoreProducts - getProducts] Error fetching products from Firestore:', error);
    return [];
  }
}

export async function findProduct(id: string): Promise<Product | undefined> {
  noStore(); // Opt out of caching for this function
  console.log(`[FirestoreProducts - findProduct] Attempting to find product with ID: ${id} from Firestore (noStore active)`);
  try {
    if (!db) {
      console.error(`[FirestoreProducts - findProduct] Firestore db instance is not available for ID: ${id}`);
      return undefined;
    }
    const productDocRef = doc(db, PRODUCTS_COLLECTION, id);
    const productSnap = await getDoc(productDocRef);
    if (productSnap.exists()) {
      const productData = productToClient(productSnap.data());
      console.log(`[FirestoreProducts - findProduct] Found product from Firestore:`, { ...productData, id: productSnap.id });
      return { ...productData, id: productSnap.id };
    }
    console.log(`[FirestoreProducts - findProduct] Product with ID ${id} not found in Firestore.`);
    return undefined;
  } catch (error) {
    console.error(`[FirestoreProducts - findProduct] Error finding product ${id} from Firestore:`, error);
    return undefined;
  }
}

export async function addProduct(
  productData: Omit<Product, 'id'>
): Promise<Product | null> {
  console.log('[FirestoreProducts - addProduct] Attempting to add product to Firestore:', productData);
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
      category: productData.category || 'General',
      stock: productData.stock || 100,
      rating: productData.rating || 4.0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    console.log('[FirestoreProducts - addProduct] Data prepared for Firestore:', productForFirestore);

    const docRef = await addDoc(
      collection(db, PRODUCTS_COLLECTION),
      productForFirestore
    );
    console.log('[FirestoreProducts - addProduct] Product added successfully to Firestore with ID:', docRef.id);
    return { id: docRef.id, ...productForFirestore };
  } catch (error) {
    console.error('[FirestoreProducts - addProduct] Error adding product to Firestore:', error);
    return null;
  }
}

export async function updateProduct(
  id: string,
  updatedProductData: Partial<Omit<Product, 'id'>>
): Promise<Product | null> {
  console.log(`[FirestoreProducts - updateProduct] Attempting to update product ${id} in Firestore with data:`, updatedProductData);
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
    if (typeof updatedProductData.category !== 'undefined') {
        dataToUpdate.category = updatedProductData.category || 'General';
    }
    dataToUpdate.updatedAt = new Date();
    
    await setDoc(productDocRef, dataToUpdate, { merge: true });
    console.log(`[FirestoreProducts - updateProduct] Product ${id} updated successfully in Firestore.`);
    
    const updatedSnap = await getDoc(productDocRef);
    if (updatedSnap.exists()) {
      const updatedData = productToClient(updatedSnap.data());
      const updatedProduct = { ...updatedData, id: updatedSnap.id };
      console.log(`[FirestoreProducts - updateProduct] Returning updated product data from Firestore:`, updatedProduct);
      return updatedProduct;
    } else {
      console.error(`[FirestoreProducts - updateProduct] Product ${id} not found in Firestore after update attempt.`);
      return null;
    }
  } catch (error) {
    console.error(`[FirestoreProducts - updateProduct] Error updating product ${id} in Firestore:`, error);
    return null;
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  console.log(`[FirestoreProducts - deleteProduct] Attempting to delete product with ID: ${id} from Firestore`);
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
    console.error(`[FirestoreProducts - deleteProduct] Error deleting product ${id} from Firestore:`, error);
    return false;
  }
}

export async function reduceStock(productId: string, quantity: number): Promise<boolean> {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    const productSnap = await getDoc(productRef);
    
    if (productSnap.exists()) {
      const currentStock = productSnap.data().stock || 0;
      const newStock = Math.max(0, currentStock - quantity);
      
      await setDoc(productRef, { stock: newStock }, { merge: true });
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error reducing stock:', error);
    return false;
  }
}

// Alias for findProduct to match expected function name
export const getProduct = findProduct;
