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

export async function createOrder(data: Omit<Order, 'id' | 'orderNumber'> & { orderNumber?: string; customerPhone?: string }): Promise<{ orderId: string; orderNumber: string }> {
  try {
    const orderNumber = await generateOrderNumber();
    const orderData = {
      ...data,
      orderNumber,
      createdAt: new Date().toISOString(),
      status: 1
    };
    
    // Update stock for each item in the order
    for (const item of data.items) {
      await updateProductStock(item.id, item.quantity);
    }
    
    const docRef = await addDoc(collection(db, 'orders'), orderData);
    const order = { id: docRef.id, ...orderData } as Order;
    
    // Send notifications
    try {
      // Send email notification
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: data.customerEmail,
          subject: `Order Confirmation - ${orderNumber}`,
          orderData: order,
          type: 'order_confirmation'
        })
      });
      
      // Send SMS notification if phone provided
      if (data.customerPhone) {
        const formattedPhone = data.customerPhone.startsWith('+') ? data.customerPhone : 
                              data.customerPhone.startsWith('0') ? `+254${data.customerPhone.slice(1)}` : 
                              `+254${data.customerPhone}`;
        
        await fetch('/api/send-sms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: formattedPhone,
            message: `Hi! Your Tari Electra order ${orderNumber} for KES ${data.total} has been confirmed. We'll notify you when it ships. Track: tari.africa`
          })
        });
      }
    } catch (notificationError) {
      console.error('Notification error:', notificationError);
    }
    
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
// Stock Management
// ====================

export async function updateProductStock(productId: string, quantityPurchased: number): Promise<void> {
  try {
    const collections = ['products', 'customerProducts', 'homepageProducts'];
    
    for (const collectionName of collections) {
      const productRef = doc(db, collectionName, productId);
      const productSnap = await getDoc(productRef);
      
      if (productSnap.exists()) {
        const currentStock = productSnap.data().stock || 0;
        const newStock = Math.max(0, currentStock - quantityPurchased);
        
        await updateDoc(productRef, {
          stock: newStock,
          updatedAt: new Date().toISOString(),
          status: newStock === 0 ? 'inactive' : 'active'
        });
        
        // Check for low stock and send alert
        await checkLowStock(productId, productSnap.data().name, newStock);
        break; // Exit after finding the product
      }
    }
  } catch (error) {
    console.error('Error updating product stock:', error);
    throw error;
  }
}

export async function addProductStock(productId: string, quantityAdded: number): Promise<void> {
  try {
    const collections = ['products', 'customerProducts', 'homepageProducts'];
    
    for (const collectionName of collections) {
      const productRef = doc(db, collectionName, productId);
      const productSnap = await getDoc(productRef);
      
      if (productSnap.exists()) {
        const currentStock = productSnap.data().stock || 0;
        const newStock = currentStock + quantityAdded;
        
        await updateDoc(productRef, {
          stock: newStock,
          updatedAt: new Date().toISOString(),
          status: 'active'
        });
        break;
      }
    }
  } catch (error) {
    console.error('Error adding product stock:', error);
    throw error;
  }
}

async function checkLowStock(productId: string, productName: string, currentStock: number): Promise<void> {
  const LOW_STOCK_THRESHOLD = 10;
  
  if (currentStock <= LOW_STOCK_THRESHOLD && currentStock > 0) {
    // Create low stock notification
    await addDoc(collection(db, 'notifications'), {
      type: 'low_stock',
      productId,
      productName,
      currentStock,
      threshold: LOW_STOCK_THRESHOLD,
      message: `Low stock alert: ${productName} has only ${currentStock} items remaining`,
      createdAt: new Date().toISOString(),
      read: false,
      priority: currentStock <= 5 ? 'high' : 'medium'
    });
  } else if (currentStock === 0) {
    // Create out of stock notification
    await addDoc(collection(db, 'notifications'), {
      type: 'out_of_stock',
      productId,
      productName,
      currentStock: 0,
      message: `Out of stock: ${productName} is now out of stock`,
      createdAt: new Date().toISOString(),
      read: false,
      priority: 'high'
    });
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
