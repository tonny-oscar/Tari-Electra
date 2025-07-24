// src/lib/cartHelpers.ts
import { db } from './firebase/client';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import type { Product } from './types';

export async function getUserCart(uid: string) {
  const userDocRef = doc(db, 'carts', uid);
  const userDoc = await getDoc(userDocRef);
  if (userDoc.exists()) {
    return userDoc.data().items || [];
  }
  return [];
}

export async function saveUserCart(uid: string, items: Product[]) {
  const cartDocRef = doc(db, 'carts', uid);
  await setDoc(cartDocRef, { items });
}

export async function addToUserCart(uid: string, product: Product) {
  const currentCart = await getUserCart(uid);
  const existing = currentCart.find((item) => item.id === product.id);
  let updatedCart;

  if (existing) {
    updatedCart = currentCart.map((item) =>
      item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
    );
  } else {
    updatedCart = [...currentCart, { ...product, quantity: 1 }];
  }

  await saveUserCart(uid, updatedCart);
  return updatedCart;
}

export async function clearUserCart(uid: string) {
  const cartDocRef = doc(db, 'carts', uid);
  await updateDoc(cartDocRef, { items: [] });
}
