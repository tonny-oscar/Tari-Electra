
'use server';

import { db } from '@/lib/firebase/client';
import type { BlogSubscriber } from '@/lib/types';
import {
  doc,
  setDoc,
  Timestamp,
  getDoc,
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
