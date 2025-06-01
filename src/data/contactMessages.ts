
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
  console.log('[FirestoreContactMessages] Attempting to fetch contact messages.');
  try {
    if (!db) {
      console.error('[FirestoreContactMessages] Firestore db instance is not available.');
      return [];
    }
    const messagesCollection = collection(db, CONTACT_MESSAGES_COLLECTION);
    const q = query(messagesCollection, orderBy('receivedAt', 'desc'));
    const messageSnapshot = await getDocs(q);
    const messageList = messageSnapshot.docs.map(doc => ({
      id: doc.id,
      ...messageToClient(doc.data()),
    }));
    console.log(`[FirestoreContactMessages] Fetched ${messageList.length} messages.`);
    return messageList;
  } catch (error) {
    console.error('[FirestoreContactMessages] Error fetching contact messages:', error);
    return [];
  }
}

export async function addContactMessage(
  data: Omit<ContactMessage, 'id' | 'receivedAt' | 'isRead'>
): Promise<ContactMessage | null> {
  noStore(); 
  console.log('[FirestoreContactMessages] addContactMessage: Preparing to add message to Firestore with data:', data);
  try {
    if (!db) {
      console.error('[FirestoreContactMessages] addContactMessage: Firestore db instance is NOT available. Cannot add message.');
      return null;
    }
    const newMessageForFirestore = {
      ...data,
      receivedAt: Timestamp.now(), // Store as Firestore Timestamp
      isRead: false,
    };
    console.log('[FirestoreContactMessages] addContactMessage: Data ready for Firestore:', newMessageForFirestore);
    
    const docRef = await addDoc(collection(db, CONTACT_MESSAGES_COLLECTION), newMessageForFirestore);
    console.log('[FirestoreContactMessages] addContactMessage: Message ADDED successfully to Firestore. Document ID:', docRef.id);
    
    return { id: docRef.id, ...messageToClient(newMessageForFirestore) };
  } catch (error) {
    console.error('[FirestoreContactMessages] addContactMessage: Error ADDING message to Firestore:', error);
    return null;
  }
}

export async function findContactMessage(id: string): Promise<ContactMessage | undefined> {
  noStore();
  console.log(`[FirestoreContactMessages] Attempting to find message with ID: ${id}`);
  try {
    if (!db) {
      console.error(`[FirestoreContactMessages] Firestore db instance is not available for ID: ${id}`);
      return undefined;
    }
    const messageDocRef = doc(db, CONTACT_MESSAGES_COLLECTION, id);
    const messageSnap = await getDoc(messageDocRef);
    if (messageSnap.exists()) {
      const messageData = messageToClient(messageSnap.data());
      console.log(`[FirestoreContactMessages] Found message:`, { id: messageSnap.id, ...messageData });
      return { id: messageSnap.id, ...messageData };
    }
    console.log(`[FirestoreContactMessages] Message with ID ${id} not found.`);
    return undefined;
  } catch (error) {
    console.error(`[FirestoreContactMessages] Error finding message ${id}:`, error);
    return undefined;
  }
}

export async function markMessageAsRead(id: string, isRead: boolean): Promise<ContactMessage | null> {
  noStore();
  console.log(`[FirestoreContactMessages] Attempting to mark message ${id} as read: ${isRead}`);
  try {
    if (!db) {
      console.error(`[FirestoreContactMessages] Firestore db instance is not available for ID: ${id}`);
      return null;
    }
    const messageDocRef = doc(db, CONTACT_MESSAGES_COLLECTION, id);
    await updateDoc(messageDocRef, { isRead });
    console.log(`[FirestoreContactMessages] Message ${id} marked as read: ${isRead} successfully.`);
    const updatedSnap = await getDoc(messageDocRef);
    if (updatedSnap.exists()) {
      return { id: updatedSnap.id, ...messageToClient(updatedSnap.data()) };
    }
    return null;
  } catch (error) {
    console.error(`[FirestoreContactMessages] Error updating message ${id} read status:`, error);
    return null;
  }
}

export async function deleteContactMessage(id: string): Promise<boolean> {
  noStore();
  console.log(`[FirestoreContactMessages] Attempting to delete message with ID: ${id}`);
  try {
    if (!db) {
      console.error(`[FirestoreContactMessages] Firestore db instance is not available for ID: ${id}`);
      return false;
    }
    const messageDocRef = doc(db, CONTACT_MESSAGES_COLLECTION, id);
    await deleteDoc(messageDocRef);
    console.log(`[FirestoreContactMessages] Message ${id} deleted successfully from Firestore.`);
    return true;
  } catch (error) {
    console.error(`[FirestoreContactMessages] Error deleting message ${id}:`, error);
    return false;
  }
}

export async function getUnreadMessagesCount(): Promise<number> {
  noStore();
  // console.log('[FirestoreContactMessages] Attempting to fetch unread messages count.'); // Too frequent, commenting out
  try {
    if (!db) {
      // console.error('[FirestoreContactMessages] Firestore db instance is not available for count.'); // Too frequent
      return 0;
    }
    const messagesCollection = collection(db, CONTACT_MESSAGES_COLLECTION);
    const q = query(messagesCollection, where('isRead', '==', false));
    const snapshot = await getCountFromServer(q);
    const count = snapshot.data().count;
    // console.log(`[FirestoreContactMessages] Unread messages count: ${count}`); // Too frequent
    return count;
  } catch (error) {
    console.error('[FirestoreContactMessages] Error fetching unread messages count:', error);
    return 0;
  }
}
