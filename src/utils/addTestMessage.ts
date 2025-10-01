import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';

export async function addTestMessage() {
  try {
    const testMessage = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+254712345678',
      message: 'Hello, I would like to get a quote for sub-metering services for my apartment building. Please contact me with more details.',
      receivedAt: serverTimestamp(),
      isRead: false
    };

    const docRef = await addDoc(collection(db, 'contactMessages'), testMessage);
    console.log('Test message added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding test message:', error);
    return null;
  }
}