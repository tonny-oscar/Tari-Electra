
import { db } from '@/lib/firebase/client'; // Ensure db is correctly imported
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
  where,
  writeBatch,
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid'; // Still useful for ensuring client-side ID if needed, but Firestore auto-generates

const PRODUCTS_COLLECTION = 'products';

// Helper to convert Firestore Timestamps to ISO strings for dates
const productToClient = (docData: any): Product => {
  const data = { ...docData } as Product;
  // Convert any Timestamp fields to ISO strings if necessary
  // For Product, 'price' is number, 'features' is string[]. No explicit date fields in base Product.
  return data;
};

export async function getProducts(): Promise<Product[]> {
  console.log('[FirestoreProducts] Attempting to fetch products.');
  try {
    const productsCollection = collection(db, PRODUCTS_COLLECTION);
    const q = query(productsCollection, orderBy('name', 'asc')); // Example: order by name
    const productSnapshot = await getDocs(q);
    const productList = productSnapshot.docs.map(doc => ({
      id: doc.id,
      ...productToClient(doc.data()),
    }));
    console.log(`[FirestoreProducts] Fetched ${productList.length} products.`);
    return productList;
  } catch (error) {
    console.error('[FirestoreProducts] Error fetching products:', error);
    return [];
  }
}

export async function findProduct(id: string): Promise<Product | undefined> {
  console.log(`[FirestoreProducts] Attempting to find product with ID: ${id}`);
  try {
    const productDocRef = doc(db, PRODUCTS_COLLECTION, id);
    const productSnap = await getDoc(productDocRef);
    if (productSnap.exists()) {
      const productData = productToClient(productSnap.data());
      console.log(`[FirestoreProducts] Found product:`, productData);
      return { id: productSnap.id, ...productData };
    }
    console.log(`[FirestoreProducts] Product with ID ${id} not found.`);
    return undefined;
  } catch (error) {
    console.error(`[FirestoreProducts] Error finding product ${id}:`, error);
    return undefined;
  }
}

export async function addProduct(
  productData: Omit<Product, 'id'>
): Promise<Product | null> {
  console.log('[FirestoreProducts] Attempting to add product:', productData);
  try {
    if (!db) {
      console.error('[FirestoreProducts] Firestore db instance is not available in addProduct.');
      throw new Error('Firestore instance is not available');
    }
    const productForFirestore = {
      ...productData,
      // Firestore will auto-generate an ID for the document
      // Ensure price is a number
      price: Number(productData.price) || 0,
      features: Array.isArray(productData.features) ? productData.features : [],
      imageUrl: productData.imageUrl || 'https://placehold.co/600x400.png',
      imageHint: productData.imageHint || productData.name.split(' ').slice(0,2).join(' ').toLowerCase() || 'product image',
    };
    console.log('[FirestoreProducts] Data prepared for Firestore:', productForFirestore);

    const docRef = await addDoc(
      collection(db, PRODUCTS_COLLECTION),
      productForFirestore
    );
    console.log('[FirestoreProducts] Product added successfully with ID:', docRef.id);
    return { id: docRef.id, ...productForFirestore };
  } catch (error) {
    console.error('[FirestoreProducts] Error adding product:', error);
    return null;
  }
}

export async function updateProduct(
  id: string,
  updatedProductData: Partial<Omit<Product, 'id'>>
): Promise<Product | null> {
  console.log(`[FirestoreProducts] Attempting to update product ${id} with data:`, updatedProductData);
  try {
    const productDocRef = doc(db, PRODUCTS_COLLECTION, id);
    // Ensure price is a number if provided
    const dataToUpdate: Record<string, any> = { ...updatedProductData };
    if (typeof updatedProductData.price !== 'undefined') {
        dataToUpdate.price = Number(updatedProductData.price);
    }
    if (typeof updatedProductData.features !== 'undefined' && !Array.isArray(updatedProductData.features)) {
        // This case should ideally be handled by Zod schema to ensure features is an array
        dataToUpdate.features = []; 
    }
    
    await setDoc(productDocRef, dataToUpdate, { merge: true }); // Use setDoc with merge for partial updates
    console.log(`[FirestoreProducts] Product ${id} updated successfully.`);
    const updatedDoc = await getDoc(productDocRef);
    if (updatedDoc.exists()) {
      return { id: updatedDoc.id, ...productToClient(updatedDoc.data()) };
    }
    return null; // Should not happen if update was successful
  } catch (error) {
    console.error(`[FirestoreProducts] Error updating product ${id}:`, error);
    return null;
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  console.log(`[FirestoreProducts] Attempting to delete product with ID: ${id}`);
  try {
    const productDocRef = doc(db, PRODUCTS_COLLECTION, id);
    await deleteDoc(productDocRef);
    console.log(`[FirestoreProducts] Product ${id} deleted successfully.`);
    return true;
  } catch (error) {
    console.error(`[FirestoreProducts] Error deleting product ${id}:`, error);
    return false;
  }
}
