import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  type DocumentData,
} from 'firebase/firestore';
import { db } from './client'; // Make sure this points to your Firebase instance

// ====================
// Product Types
// ====================
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  description?: string;
  rating?: number;
  category?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt?: string;
}

// ====================
// Cart Types
// ====================
export interface CartItem extends Product {
  quantity: number;
}

// ====================
// Order Types
// ====================
export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerEmail: string;
  items: CartItem[];
  total: number;
  status: number;
  createdAt: string;
  updatedAt?: string;
  estimatedDelivery: string;
  trackingNumber?: string;
}

// ====================
// Product Operations
// ====================

export async function getProducts(options?: {
  active?: boolean;
  category?: string;
  limit?: number;
}): Promise<Product[]> {
  try {
    const ref = collection(db, 'products');
    const conditions = [];

    if (options?.active) {
      conditions.push(where('status', '==', 'active'));
    }
    if (options?.category && options.category !== 'All') {
      conditions.push(where('category', '==', options.category));
    }

    conditions.push(orderBy('createdAt', 'desc'));
    if (options?.limit) {
      conditions.push(limit(options.limit));
    }

    const q = query(ref, ...conditions);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

export async function getProduct(productId: string): Promise<Product | null> {
  try {
    const docRef = doc(db, 'products', productId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Product;
    }
    return null;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

// ====================
// Order Operations
// ====================

// Generate custom order number
async function generateOrderNumber(): Promise<string> {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'), limit(1));
    const snapshot = await getDocs(q);
    
    let nextNumber = 1;
    if (!snapshot.empty) {
      const lastOrder = snapshot.docs[0].data();
      if (lastOrder.orderNumber) {
        const lastNumber = parseInt(lastOrder.orderNumber.split('/')[2]);
        nextNumber = lastNumber + 1;
      }
    }
    
    return `TEE/CG1/${nextNumber.toString().padStart(3, '0')}`;
  } catch (error) {
    console.error('Error generating order number:', error);
    return `TEE/CG1/${Date.now().toString().slice(-3)}`;
  }
}

export async function createOrder(data: Omit<Order, 'id' | 'orderNumber'> & { orderNumber?: string }): Promise<{ orderId: string; orderNumber: string }> {
  try {
    const orderNumber = await generateOrderNumber();
    const docRef = await addDoc(collection(db, 'orders'), {
      ...data,
      orderNumber,
      createdAt: new Date().toISOString(),
      status: 1
    });
    return { orderId: docRef.id, orderNumber };
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

export async function getCustomerOrders(customerId: string): Promise<Order[]> {
  try {
    const q = query(
      collection(db, 'orders'),
      where('customerId', '==', customerId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Order[];
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    throw error;
  }
}

export async function updateOrderStatus(orderId: string, status: number): Promise<void> {
  try {
    const docRef = doc(db, 'orders', orderId);
    await updateDoc(docRef, {
      status,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}

// ====================
// Cart Operations
// ====================

export async function saveCart(customerId: string, items: CartItem[]): Promise<void> {
  try {
    const docRef = doc(db, 'carts', customerId);
    await updateDoc(docRef, {
      items,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error saving cart:', error);
    throw error;
  }
}

export async function getCustomerCart(customerId: string): Promise<CartItem[]> {
  try {
    const docRef = doc(db, 'carts', customerId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data().items as CartItem[];
    }
    return [];
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
}

// ====================
// Dashboard Stats
// ====================

export async function getCustomerDashboardStats(customerId: string) {
  try {
    const orders = await getCustomerOrders(customerId);
    const cart = await getCustomerCart(customerId);

    return {
      totalOrders: orders.length,
      activeOrders: orders.filter(order => order.status < 4).length,
      cartItems: cart.length,
      totalSpent: orders.reduce((sum, order) => sum + order.total, 0),
      recentOrders: orders.slice(0, 3)
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
}
