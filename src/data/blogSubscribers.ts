
'use server';

import { db } from '@/lib/firebase/client';
import type { BlogSubscriber } from '@/lib/types';
import {
  collection,
  doc,
  setDoc,
  Timestamp,
  getDoc,
  getDocs, // Added for getAllBlogSubscribers
} from 'firebase/firestore';
import { unstable_noStore as noStore } from 'next/cache';

const BLOG_SUBSCRIBERS_COLLECTION = 'blogSubscribers';

export async function addBlogSubscriber(email: string): Promise<{ success: boolean; message: string; alreadySubscribed?: boolean }> {
  noStore();
  console.log(`[FirestoreBlogSubscribers - addBlogSubscriber] Attempting to add/update subscriber: ${email}`);
  try {
    if (!db) {
      console.error('[FirestoreBlogSubscribers - addBlogSubscriber] Firestore db instance is not available.');
      return { success: false, message: 'Database connection error. Please try again later.' };
    }

    const subscriberDocRef = doc(db, BLOG_SUBSCRIBERS_COLLECTION, email.toLowerCase());
    const docSnap = await getDoc(subscriberDocRef);

    const dataToSet: Omit<BlogSubscriber, 'email'> = {
      subscribedAt: Timestamp.now(),
    };
    
    await setDoc(subscriberDocRef, { email: email.toLowerCase(), ...dataToSet }, { merge: true });

    if (docSnap.exists()) {
      console.log(`[FirestoreBlogSubscribers - addBlogSubscriber] Subscriber ${email} re-subscribed/updated successfully.`);
      return { success: true, message: 'You are already subscribed! We\'ll keep you updated.', alreadySubscribed: true };
    } else {
      console.log(`[FirestoreBlogSubscribers - addBlogSubscriber] Subscriber ${email} added successfully.`);
      return { success: true, message: 'Successfully subscribed! Thank you.' };
    }

  } catch (error: any) {
    console.error(`[FirestoreBlogSubscribers - addBlogSubscriber] Error adding subscriber ${email}:`, error.message, error.stack);
    return { success: false, message: 'An error occurred while subscribing. Please try again.' };
  }
}

export async function isEmailSubscribed(email: string): Promise<boolean> {
    noStore();
    try {
        if (!db) return false;
        const subscriberDocRef = doc(db, BLOG_SUBSCRIBERS_COLLECTION, email.toLowerCase());
        const docSnap = await getDoc(subscriberDocRef);
        return docSnap.exists();
    } catch (error) {
        console.error(`[FirestoreBlogSubscribers - isEmailSubscribed] Error checking subscription for ${email}:`, error);
        return false; // Assume not subscribed on error
    }
}

export async function getAllBlogSubscribers(): Promise<BlogSubscriber[]> {
  noStore();
  console.log('[FirestoreBlogSubscribers - getAllBlogSubscribers] Attempting to fetch all blog subscribers.');
  try {
    if (!db) {
      console.error('[FirestoreBlogSubscribers - getAllBlogSubscribers] Firestore db instance is not available.');
      return [];
    }
    const subscribersCollection = collection(db, BLOG_SUBSCRIBERS_COLLECTION);
    const subscriberSnapshot = await getDocs(subscribersCollection);
    const subscriberList = subscriberSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        email: doc.id, // Email is the document ID
        subscribedAt: data.subscribedAt instanceof Timestamp ? data.subscribedAt : Timestamp.now(), // Ensure Timestamp
      };
    });
    console.log(`[FirestoreBlogSubscribers - getAllBlogSubscribers] Fetched ${subscriberList.length} subscribers.`);
    return subscriberList;
  } catch (error) {
    console.error('[FirestoreBlogSubscribers - getAllBlogSubscribers] Error fetching subscribers:', error);
    return [];
  }
}
