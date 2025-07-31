// // src/lib/cartHelpers.ts
import { db } from './firebase/client';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import type { Product } from './types';

export async function getUserCart(uid: string): Promise<(Product & { quantity: number })[]> {
  const userDocRef = doc(db, 'carts', uid);
  const userDoc = await getDoc(userDocRef);
  if (userDoc.exists()) {
    return userDoc.data().items || [];
  }
  return [];
}

export async function saveUserCart(uid: string, items: (Product & { quantity: number })[]) {
  const cartDocRef = doc(db, 'carts', uid);
  try {
    await setDoc(cartDocRef, { items });
  } catch (error) {
    console.error('Error saving user cart:', error);
    throw error;
  }
}

export async function addToUserCart(uid: string, product: Product) {
  const currentCart = await getUserCart(uid);
  const existing = currentCart.find((item) => item.id === product.id);
  let updatedCart;

  if (existing) {
    updatedCart = currentCart.map((item) =>
      item.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  } else {
    updatedCart = [...currentCart, { ...product, quantity: 1 }];
  }

  await saveUserCart(uid, updatedCart);
  return updatedCart;
}

export async function clearUserCart(uid: string) {
  const cartDocRef = doc(db, 'carts', uid);
  try {
    const cartSnap = await getDoc(cartDocRef);
    if (cartSnap.exists()) {
      await updateDoc(cartDocRef, { items: [] });
    } else {
      await setDoc(cartDocRef, { items: [] });
    }
  } catch (error) {
    console.error('Error clearing user cart:', error);
    throw error;
  }
}
interface PaystackTransaction {
  reference: string;
  amount: number;
  email: string;
  metadata?: any;
}

export async function initializePaystackTransaction(transaction: PaystackTransaction) {
  try {
    const response = await fetch('/api/paystack/initialize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transaction),
    });

    if (!response.ok) {
      throw new Error('Payment initialization failed');
    }

    const data = await response.json();
    return data.authorization_url;
  } catch (error) {
    console.error('Error initializing Paystack payment:', error);
    throw error;
  }
}

export async function verifyPaystackTransaction(reference: string) {
  try {
    const response = await fetch(`/api/paystack/verify/${reference}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Payment verification failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error verifying Paystack payment:', error);
    throw error;
  }
}

export function setupPaystackPayment({
  amount,
  email,
  metadata = {},
  onSuccess,
  onClose,
}: {
  amount: number;
  email: string;
  metadata?: any;
  onSuccess: (reference: string) => void;
  onClose: () => void;
}) {
  if (typeof window !== 'undefined' && (window as any).PaystackPop) {
    const handler = (window as any).PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email,
      amount: Math.round(amount * 100), // Convert to kobo and ensure it's a whole number
      currency: 'KES', // Kenya Shillings
      metadata: {
        ...metadata,
        custom_fields: [
          {
            display_name: "Cart Total",
            variable_name: "cart_total",
            value: amount
          }
        ]
      },
      callback: (response: any) => {
        onSuccess(response.reference);
      },
      onClose: () => {
        onClose();
      }
    });
    handler.openIframe();
  } else {
    console.error('Paystack not properly loaded');
  }
}
