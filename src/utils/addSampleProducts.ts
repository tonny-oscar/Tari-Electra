import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';

const sampleProducts = [
  {
    name: "Smart Sub-Meter SM100",
    price: 15000,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    stock: 25,
    description: "Advanced digital sub-meter with WiFi connectivity and real-time monitoring",
    rating: 4.5,
    category: "Sub-Meters",
    status: "active",
    createdAt: new Date().toISOString()
  },
  {
    name: "Electrical Panel Box",
    price: 8500,
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400",
    stock: 15,
    description: "Heavy-duty electrical panel box for residential and commercial use",
    rating: 4.2,
    category: "Electrical",
    status: "active",
    createdAt: new Date().toISOString()
  },
  {
    name: "Circuit Breaker 20A",
    price: 1200,
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400",
    stock: 50,
    description: "High-quality 20A circuit breaker for electrical protection",
    rating: 4.8,
    category: "Electrical",
    status: "active",
    createdAt: new Date().toISOString()
  },
  {
    name: "Digital Energy Monitor",
    price: 12000,
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400",
    stock: 20,
    description: "Monitor your energy consumption with this digital display unit",
    rating: 4.3,
    category: "Monitoring",
    status: "active",
    createdAt: new Date().toISOString()
  },
  {
    name: "Electrical Wire 2.5mm",
    price: 450,
    image: "https://images.unsplash.com/photo-1621905252472-e8ace8bc424e?w=400",
    stock: 100,
    description: "High-grade electrical wire suitable for residential wiring",
    rating: 4.0,
    category: "Wiring",
    status: "active",
    createdAt: new Date().toISOString()
  },
  {
    name: "Smart Switch Module",
    price: 3500,
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400",
    stock: 30,
    description: "WiFi-enabled smart switch for remote control and automation",
    rating: 4.6,
    category: "Smart Devices",
    status: "active",
    createdAt: new Date().toISOString()
  }
];

export async function addSampleProducts() {
  try {
    console.log('Adding sample products to Firestore...');
    
    for (const product of sampleProducts) {
      const docRef = await addDoc(collection(db, 'products'), product);
      console.log(`Added product: ${product.name} with ID: ${docRef.id}`);
    }
    
    console.log('All products added successfully!');
    return true;
  } catch (error) {
    console.error('Error adding products:', error);
    return false;
  }
}