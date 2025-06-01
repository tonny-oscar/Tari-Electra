
import { db } from '@/lib/firebase/client';
import type { ContactMessage } from '@/lib/types';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  query,
  orderBy,
  where,
  getCountFromServer,
} from 'firebase/firestore';
import { unstable_noStore as noStore } from 'next/cache';

const CONTACT_MESSAGES_COLLECTION = 'contactMessages';

// Helper to convert Firestore Timestamps for ContactMessage
const messageToClient = (docData: any): Omit<ContactMessage, 'id'> => {
  const data = { ...docData };
  if (data.receivedAt && data.receivedAt instanceof Timestamp) {
    data.receivedAt = data.receivedAt.toISOString();
  }
  return data as Omit<ContactMessage, 'id'>;
};

export async function getContactMessages(): Promise<ContactMessage[]> {
  noStore();
  console.log('[FirestoreContactMessages - getContactMessages] Attempting to fetch contact messages.');
  try {
    if (!db) {
      console.error('[FirestoreContactMessages - getContactMessages] Firestore db instance is not available.');
      return [];
    }
    const messagesCollection = collection(db, CONTACT_MESSAGES_COLLECTION);
    const q = query(messagesCollection, orderBy('receivedAt', 'desc'));
    const messageSnapshot = await getDocs(q);
    const messageList = messageSnapshot.docs.map(doc => ({
      id: doc.id,
      ...messageToClient(doc.data()),
    }));
    console.log(`[FirestoreContactMessages - getContactMessages] Fetched ${messageList.length} messages.`);
    return messageList;
  } catch (error) {
    console.error('[FirestoreContactMessages - getContactMessages] Error fetching contact messages:', error);
    return [];
  }
}

export async function addContactMessage(
  data: Omit<ContactMessage, 'id' | 'receivedAt' | 'isRead'>
): Promise<ContactMessage | null> {
  noStore(); 
  console.log('🔵 [FirestoreContactMessages - addContactMessage] Preparing to add message to Firestore with data:', data);
  
  if (!db) {
    console.error('🔴 [FirestoreContactMessages - addContactMessage] CRITICAL: Firestore db instance is NOT available at the start of addContactMessage. Cannot add message.');
    return null;
  }
  console.log('🟢 [FirestoreContactMessages - addContactMessage] Firestore db instance IS available at the start.');
    
  const newMessageForFirestore = {
    ...data,
    receivedAt: Timestamp.now(), // Store as Firestore Timestamp
    isRead: false,
  };
  console.log('🔵 [FirestoreContactMessages - addContactMessage] Data ready for Firestore:', newMessageForFirestore);
  
  try {
    // Re-check db instance immediately before the Firestore operation for extra safety
    if (!db) {
        console.error('🔴 [FirestoreContactMessages - addContactMessage] CRITICAL: Firestore db instance became unavailable just before addDoc. This is unexpected.');
        return null;
    }
    console.log(`Attempting to write to Firestore collection: ${CONTACT_MESSAGES_COLLECTION}`);
    const docRef = await addDoc(collection(db, CONTACT_MESSAGES_COLLECTION), newMessageForFirestore);
    console.log('✅ [FirestoreContactMessages - addContactMessage] Message ADDED successfully to Firestore. Document ID:', docRef.id);
    
    return { id: docRef.id, ...messageToClient(newMessageForFirestore) };
  } catch (error: any) {
    console.error('🔴 [FirestoreContactMessages - addContactMessage] Error ADDING message to Firestore:', error.message, error.stack);
    if (error.message && (error.message.toLowerCase().includes('permission') || error.message.toLowerCase().includes('denied'))) {
      console.error('👉 This looks like a Firestore security rule issue. Please check that your rules allow writes to the "contactMessages" collection for unauthenticated users (or the appropriate authentication state).');
    }
    return null;
  }
}

export async function findContactMessage(id: string): Promise<ContactMessage | undefined> {
  noStore();
  console.log(`[FirestoreContactMessages - findContactMessage] Attempting to find message with ID: ${id}`);
  try {
    if (!db) {
      console.error(`[FirestoreContactMessages - findContactMessage] Firestore db instance is not available for ID: ${id}`);
      return undefined;
    }
    const messageDocRef = doc(db, CONTACT_MESSAGES_COLLECTION, id);
    const messageSnap = await getDoc(messageDocRef);
    if (messageSnap.exists()) {
      const messageData = messageToClient(messageSnap.data());
      console.log(`[FirestoreContactMessages - findContactMessage] Found message:`, { id: messageSnap.id, ...messageData });
      return { id: messageSnap.id, ...messageData };
    }
    console.log(`[FirestoreContactMessages - findContactMessage] Message with ID ${id} not found.`);
    return undefined;
  } catch (error) {
    console.error(`[FirestoreContactMessages - findContactMessage] Error finding message ${id}:`, error);
    return undefined;
  }
}

export async function markMessageAsRead(id: string, isRead: boolean): Promise<ContactMessage | null> {
  noStore();
  console.log(`[FirestoreContactMessages - markMessageAsRead] Attempting to mark message ${id} as read: ${isRead}`);
  try {
    if (!db) {
      console.error(`[FirestoreContactMessages - markMessageAsRead] Firestore db instance is not available for ID: ${id}`);
      return null;
    }
    const messageDocRef = doc(db, CONTACT_MESSAGES_COLLECTION, id);
    await updateDoc(messageDocRef, { isRead });
    console.log(`[FirestoreContactMessages - markMessageAsRead] Message ${id} marked as read: ${isRead} successfully.`);
    const updatedSnap = await getDoc(messageDocRef);
    if (updatedSnap.exists()) {
      return { id: updatedSnap.id, ...messageToClient(updatedSnap.data()) };
    }
    return null;
  } catch (error) {
    console.error(`[FirestoreContactMessages - markMessageAsRead] Error updating message ${id} read status:`, error);
    return null;
  }
}

export async function deleteContactMessage(id: string): Promise<boolean> {
  noStore();
  console.log(`[FirestoreContactMessages - deleteContactMessage] Attempting to delete message with ID: ${id}`);
  try {
    if (!db) {
      console.error(`[FirestoreContactMessages - deleteContactMessage] Firestore db instance is not available for ID: ${id}`);
      return false;
    }
    const messageDocRef = doc(db, CONTACT_MESSAGES_COLLECTION, id);
    await deleteDoc(messageDocRef);
    console.log(`[FirestoreContactMessages - deleteContactMessage] Message ${id} deleted successfully from Firestore.`);
    return true;
  } catch (error) {
    console.error(`[FirestoreContactMessages - deleteContactMessage] Error deleting message ${id}:`, error);
    return false;
  }
}

export async function getUnreadMessagesCount(): Promise<number> {
  noStore();
  try {
    if (!db) {
      return 0;
    }
    const messagesCollection = collection(db, CONTACT_MESSAGES_COLLECTION);
    const q = query(messagesCollection, where('isRead', '==', false));
    const snapshot = await getCountFromServer(q);
    const count = snapshot.data().count;
    return count;
  } catch (error) {
    console.error('[FirestoreContactMessages - getUnreadMessagesCount] Error fetching unread messages count:', error);
    return 0;
  }
}
