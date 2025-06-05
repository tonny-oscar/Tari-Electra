'use server';

import { db } from '@/lib/firebase/client';
import type { BlogPost } from '@/lib/types';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { unstable_noStore as noStore } from 'next/cache';

const BLOGS_COLLECTION = 'blogs';

const blogPostToClient = (docData: any): Omit<BlogPost, 'slug'> => {
  const data = { ...docData };
  if (data.date && data.date instanceof Timestamp) {
    data.date = data.date.toDate().toISOString().split('T')[0];
  }
  return data as Omit<BlogPost, 'slug'>;
};

export async function getBlogPosts(): Promise<BlogPost[]> {
  noStore();
  if (!db) return [];
  const postsCollection = collection(db, BLOGS_COLLECTION);
  const q = query(postsCollection, orderBy('date', 'desc'));
  const postSnapshot = await getDocs(q);
  return postSnapshot.docs.map(doc => ({
    slug: doc.id,
    ...blogPostToClient(doc.data()),
  }));
}

export async function findBlogPost(slug: string): Promise<BlogPost | undefined> {
  noStore();
  if (!db) return undefined;
  const postDocRef = doc(db, BLOGS_COLLECTION, slug);
  const postSnap = await getDoc(postDocRef);
  if (postSnap.exists()) {
    return { slug: postSnap.id, ...blogPostToClient(postSnap.data()) };
  }
  return undefined;
}

export async function addBlogPost(postData: Omit<BlogPost, 'date'>): Promise<BlogPost | null> {
  if (!db) return null;
  if (!postData.slug || postData.slug.trim() === '') return null;

  const docDataForFirestore = {
    title: postData.title,
    excerpt: postData.excerpt,
    author: postData.author,
    category: postData.category,
    content: postData.content,
    date: Timestamp.now(),
    imageUrl: postData.imageUrl || 'https://placehold.co/600x400.png',
    imageHint: postData.imageHint || postData.title.split(' ').slice(0, 2).join(' ').toLowerCase() || 'article placeholder',
  };

  const postDocRef = doc(db, BLOGS_COLLECTION, postData.slug);
  await setDoc(postDocRef, docDataForFirestore);

  return {
    slug: postData.slug,
    ...docDataForFirestore,
    date: (docDataForFirestore.date as Timestamp).toDate().toISOString().split('T')[0],
  };
}

export async function updateBlogPost(slug: string, updatedPostData: Partial<Omit<BlogPost, 'slug' | 'date'>>): Promise<BlogPost | null> {
  if (!db) return null;
  const postDocRef = doc(db, BLOGS_COLLECTION, slug);
  const postSnap = await getDoc(postDocRef);
  if (!postSnap.exists()) return null;

  const dataToUpdate: Record<string, any> = { ...updatedPostData };
  if (updatedPostData.date && typeof updatedPostData.date === 'string') {
    dataToUpdate.date = Timestamp.fromDate(new Date(updatedPostData.date));
  } else {
    delete dataToUpdate.date;
  }

  await setDoc(postDocRef, dataToUpdate, { merge: true });

  const updatedSnap = await getDoc(postDocRef);
  if (updatedSnap.exists()) {
    return { slug: updatedSnap.id, ...blogPostToClient(updatedSnap.data()) };
  }
  return null;
}

export async function deleteBlogPost(slug: string): Promise<boolean> {
  if (!db) return false;
  const postDocRef = doc(db, BLOGS_COLLECTION, slug);
  await deleteDoc(postDocRef);
  return true;
}
