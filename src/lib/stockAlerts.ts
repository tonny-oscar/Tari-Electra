import { collection, query, where, onSnapshot, updateDoc, doc, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface StockAlert {
  productId: string;
  productName: string;
  currentStock: number;
  alertType: 'out_of_stock' | 'low_stock';
  timestamp: string;
}




// Monitor stock levels and create alerts
export function initializeStockMonitoring() {
  const productsRef = collection(db, 'customerProducts');
  
  return onSnapshot(productsRef, async (snapshot) => {
    const alerts: StockAlert[] = [];
    
    snapshot.docs.forEach(async (docSnapshot) => {
      const product = { id: docSnapshot.id, ...docSnapshot.data() };
      const stock = (product as any).stock || 0;
      
      // Check for out of stock
      if (stock === 0) {
        alerts.push({
          productId: product.id,
          productName: (product as any).name,
          currentStock: stock,
          alertType: 'out_of_stock',
          timestamp: new Date().toISOString()
        });
        
        // Update product status to inactive if out of stock
        await updateDoc(doc(db, 'customerProducts', product.id), {
          status: 'inactive',
          updatedAt: new Date().toISOString()
        });
      }
      // Check for low stock (5 or less)
      else if (stock <= 5 && stock > 0) {
        alerts.push({
          productId: product.id,
          productName: (product as any).name,
          currentStock: stock,
          alertType: 'low_stock',
          timestamp: new Date().toISOString()
        });
      }
      // Reactivate product if stock is restored
      else if (stock > 0 && (product as any).status === 'inactive') {
        await updateDoc(doc(db, 'customerProducts', product.id), {
          status: 'active',
          updatedAt: new Date().toISOString()
        });
      }
    });
    
    // Save alerts to database for admin dashboard
    if (alerts.length > 0) {
      for (const alert of alerts) {
        try {
          await addDoc(collection(db, 'stockAlerts'), {
            ...alert,
            isRead: false,
            createdAt: new Date().toISOString()
          });
        } catch (error) {
          console.error('Error saving stock alert:', error);
        }
      }
    }
  });
}

// Get unread stock alerts for admin
export async function getUnreadStockAlerts(): Promise<StockAlert[]> {
  try {
    const alertsRef = collection(db, 'stockAlerts');
    const q = query(alertsRef, where('isRead', '==', false));
    
    return new Promise((resolve) => {
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const alerts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as any[];
        resolve(alerts);
        unsubscribe();
      });
    });
  } catch (error) {
    console.error('Error fetching stock alerts:', error);
    return [];
  }
}