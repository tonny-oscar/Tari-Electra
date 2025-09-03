import { db } from '@/lib/firebase';
import type { Product } from '@/lib/types';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

const CUSTOMER_PRODUCTS_COLLECTION = 'customerProducts';

export async function getCustomerProducts(): Promise<Product[]> {
  try {
    if (!db) {
      console.error('Firestore db instance not available');
      return [];
    }
    
    const productsCollection = collection(db, CUSTOMER_PRODUCTS_COLLECTION);
    const q = query(productsCollection, orderBy('createdAt', 'desc'));
    const productSnapshot = await getDocs(q);
    
    const productList = productSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];
    
    return productList;
  } catch (error) {
    console.error('Error fetching customer products:', error);
    return [];
  }
}

export async function getCustomerProduct(id: string): Promise<Product | null> {
  try {
    if (!db) {
      console.error('Firestore db instance not available');
      return null;
    }
    
    const productDoc = doc(db, CUSTOMER_PRODUCTS_COLLECTION, id);
    const productSnap = await getDoc(productDoc);
    
    if (productSnap.exists()) {
      return { id: productSnap.id, ...productSnap.data() } as Product;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching customer product:', error);
    return null;
  }
}

export async function addCustomerProduct(productData: Omit<Product, 'id'>): Promise<string | null> {
  try {
    if (!db) {
      console.error('Firestore db instance not available');
      return null;
    }
    
    const newProduct = {
      name: productData.name || 'Unnamed Product',
      description: productData.description || 'No description',
      price: Number(productData.price) || 0,
      category: productData.category || 'General',
      subcategory: productData.subcategory || '',
      features: Array.isArray(productData.features) ? productData.features : [],
      specifications: Array.isArray(productData.specifications) ? productData.specifications : [],
      imageUrl: productData.imageUrl || '',
      image: productData.imageUrl || '📦',
      stock: 100,
      rating: 4.0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(collection(db, CUSTOMER_PRODUCTS_COLLECTION), newProduct);
    return docRef.id;
  } catch (error) {
    console.error('Error adding customer product:', error);
    return null;
  }
}

export async function updateCustomerProduct(id: string, productData: Partial<Product>): Promise<boolean> {
  try {
    if (!db) {
      console.error('Firestore db instance not available');
      return false;
    }
    
    const productDoc = doc(db, CUSTOMER_PRODUCTS_COLLECTION, id);
    const updateData = {
      ...productData,
      updatedAt: serverTimestamp(),
    };
    
    await updateDoc(productDoc, updateData);
    return true;
  } catch (error) {
    console.error('Error updating customer product:', error);
    return false;
  }
}

export async function deleteCustomerProduct(id: string): Promise<boolean> {
  try {
    if (!db) {
      console.error('Firestore db instance not available');
      return false;
    }
    
    const productDoc = doc(db, CUSTOMER_PRODUCTS_COLLECTION, id);
    await deleteDoc(productDoc);
    return true;
  } catch (error) {
    console.error('Error deleting customer product:', error);
    return false;
  }
}

export async function reduceCustomerProductStock(productId: string, quantity: number): Promise<boolean> {
  try {
    const productRef = doc(db, CUSTOMER_PRODUCTS_COLLECTION, productId);
    const productSnap = await getDoc(productRef);
    
    if (productSnap.exists()) {
      const currentStock = productSnap.data().stock || 0;
      const newStock = Math.max(0, currentStock - quantity);
      
      await updateDoc(productRef, { stock: newStock });
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error reducing customer product stock:', error);
    return false;
  }
}