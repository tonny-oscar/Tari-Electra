
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
  where, // Added for potential future use if needed, not primary for slug-based find
} from 'firebase/firestore';
import { unstable_noStore as noStore } from 'next/cache';

const BLOGS_COLLECTION = 'blogs';

// Helper to convert Firestore Timestamps to ISO strings for dates
const blogPostToClient = (docData: any): Omit<BlogPost, 'slug'> => {
  const data = { ...docData };
  if (data.date && data.date instanceof Timestamp) {
    data.date = data.date.toDate().toISOString().split('T')[0];
  }
  return data as Omit<BlogPost, 'slug'>;
};

export async function getBlogPosts(): Promise<BlogPost[]> {
  noStore();
  console.log('[FirestoreBlogPosts - getBlogPosts] Attempting to fetch blog posts.');
  try {
    if (!db) {
      console.error('[FirestoreBlogPosts - getBlogPosts] Firestore db instance is not available.');
      return [];
    }
    const postsCollection = collection(db, BLOGS_COLLECTION);
    const q = query(postsCollection, orderBy('date', 'desc'));
    const postSnapshot = await getDocs(q);
    const postList = postSnapshot.docs.map(doc => ({
      slug: doc.id, // Slug is the document ID
      ...blogPostToClient(doc.data()),
    }));
    console.log(`[FirestoreBlogPosts - getBlogPosts] Fetched ${postList.length} posts.`);
    return postList;
  } catch (error) {
    console.error('[FirestoreBlogPosts - getBlogPosts] Error fetching blog posts:', error);
    return [];
  }
}

export async function findBlogPost(slug: string): Promise<BlogPost | undefined> {
  noStore();
  console.log(`[FirestoreBlogPosts - findBlogPost] Attempting to find post with slug: ${slug}`);
  try {
    if (!db) {
      console.error(`[FirestoreBlogPosts - findBlogPost] Firestore db instance is not available for slug: ${slug}`);
      return undefined;
    }
    const postDocRef = doc(db, BLOGS_COLLECTION, slug);
    const postSnap = await getDoc(postDocRef);
    if (postSnap.exists()) {
      const postData = blogPostToClient(postSnap.data());
      console.log(`[FirestoreBlogPosts - findBlogPost] Found post:`, { slug: postSnap.id, ...postData });
      return { slug: postSnap.id, ...postData };
    }
    console.log(`[FirestoreBlogPosts - findBlogPost] Post with slug ${slug} not found.`);
    return undefined;
  } catch (error) {
    console.error(`[FirestoreBlogPosts - findBlogPost] Error finding post ${slug}:`, error);
    return undefined;
  }
}

// postData now expects slug to be present, and date will be set internally
export async function addBlogPost(postData: Omit<BlogPost, 'date'>): Promise<BlogPost | null> {
  console.log('[FirestoreBlogPosts - addBlogPost] Attempting to add blog post to Firestore:', postData);
  try {
    if (!db) {
      console.error('[FirestoreBlogPosts - addBlogPost] Firestore db instance is not available.');
      return null;
    }
    if (!postData.slug || postData.slug.trim() === '') {
        console.error('[FirestoreBlogPosts - addBlogPost] Slug is required to add a blog post.');
        return null;
    }

    const docDataForFirestore = {
      title: postData.title,
      excerpt: postData.excerpt,
      author: postData.author,
      category: postData.category,
      content: postData.content,
      date: Timestamp.now(), // Set current date as Firestore Timestamp
      imageUrl: postData.imageUrl || 'https://placehold.co/600x400.png',
      imageHint: postData.imageHint || postData.title.split(' ').slice(0,2).join(' ').toLowerCase() || 'article placeholder',
    };

    const postDocRef = doc(db, BLOGS_COLLECTION, postData.slug);
    await setDoc(postDocRef, docDataForFirestore); // Use setDoc with slug as ID

    console.log(`[FirestoreBlogPosts - addBlogPost] Blog post "${postData.slug}" added successfully to Firestore.`);
    
    // Return the full BlogPost object, converting Timestamp date to string
    return {
      slug: postData.slug,
      ...docDataForFirestore,
      date: (docDataForFirestore.date as Timestamp).toDate().toISOString().split('T')[0],
    };
  } catch (error) {
    console.error(`[FirestoreBlogPosts - addBlogPost] Error adding blog post "${postData.slug}":`, error);
    return null;
  }
}

export async function updateBlogPost(slug: string, updatedPostData: Partial<Omit<BlogPost, 'slug' | 'date'>>): Promise<BlogPost | null> {
  console.log(`[FirestoreBlogPosts - updateBlogPost] Attempting to update post ${slug} with data:`, updatedPostData);
  try {
    if (!db) {
      console.error(`[FirestoreBlogPosts - updateBlogPost] Firestore db instance is not available for slug: ${slug}`);
      return null;
    }
    const postDocRef = doc(db, BLOGS_COLLECTION, slug);
    const postSnap = await getDoc(postDocRef);

    if (!postSnap.exists()) {
        console.error(`[FirestoreBlogPosts - updateBlogPost] Post with slug "${slug}" not found for update.`);
        return null;
    }
    
    // Ensure date is not accidentally overwritten if not provided, or convert if provided as string
    const dataToUpdate: Record<string, any> = { ...updatedPostData };
    if (updatedPostData.date && typeof updatedPostData.date === 'string') {
      dataToUpdate.date = Timestamp.fromDate(new Date(updatedPostData.date));
    } else if (!updatedPostData.date) {
      // If date is not in updatedPostData, keep the existing date from Firestore
      // This means we don't include 'date' in dataToUpdate unless it's explicitly being changed
      // or ensure it's merged correctly by Firestore if not included.
      // For setDoc with merge:true, not including 'date' field in dataToUpdate is fine if we don't want to change it.
      // However, if we want to update the date on every edit, we could add:
      // dataToUpdate.lastModified = Timestamp.now(); // Example for a lastModified field
      // For simplicity, we'll assume 'date' is only updated if explicitly provided.
      // Remove date from dataToUpdate if not provided to avoid type issues or accidental overwrites.
      delete dataToUpdate.date;
    }

    await setDoc(postDocRef, dataToUpdate, { merge: true }); // Use setDoc with merge:true to update
    console.log(`[FirestoreBlogPosts - updateBlogPost] Post ${slug} updated successfully.`);
    
    const updatedSnap = await getDoc(postDocRef);
    if (updatedSnap.exists()) {
      return { slug: updatedSnap.id, ...blogPostToClient(updatedSnap.data()) };
    }
    return null;
  } catch (error) {
    console.error(`[FirestoreBlogPosts - updateBlogPost] Error updating post ${slug}:`, error);
    return null;
  }
}

export async function deleteBlogPost(slug: string): Promise<boolean> {
  console.log(`[FirestoreBlogPosts - deleteBlogPost] Attempting to delete post with slug: ${slug}`);
  try {
    if (!db) {
      console.error(`[FirestoreBlogPosts - deleteBlogPost] Firestore db instance is not available for slug: ${slug}`);
      return false;
    }
    const postDocRef = doc(db, BLOGS_COLLECTION, slug);
    await deleteDoc(postDocRef);
    console.log(`[FirestoreBlogPosts - deleteBlogPost] Post ${slug} deleted successfully.`);
    return true;
  } catch (error) {
    console.error(`[FirestoreBlogPosts - deleteBlogPost] Error deleting post ${slug}:`, error);
    return false;
  }
}
