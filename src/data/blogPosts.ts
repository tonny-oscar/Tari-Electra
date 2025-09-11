import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  where,
} from 'firebase/firestore';

export interface BlogPost {
  id?: string;
  title: string;
  content: string;
  slug: string;
  published: boolean;
  imageUrl?: string;
  createdAt?: any;
  updatedAt?: any;
}

const BLOG_COLLECTION = 'blogPosts';

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const blogCollection = collection(db, BLOG_COLLECTION);
    const blogSnapshot = await getDocs(blogCollection);
    
    const posts = blogSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as BlogPost[];
    
    return posts.sort((a, b) => {
      const aTime = a.createdAt?.toDate?.() || new Date(0);
      const bTime = b.createdAt?.toDate?.() || new Date(0);
      return bTime.getTime() - aTime.getTime();
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  try {
    const blogCollection = collection(db, BLOG_COLLECTION);
    const blogSnapshot = await getDocs(blogCollection);
    
    const posts = blogSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as BlogPost[];
    
    return posts
      .filter(post => post.published === true)
      .sort((a, b) => {
        const aTime = a.createdAt?.toDate?.() || new Date(0);
        const bTime = b.createdAt?.toDate?.() || new Date(0);
        return bTime.getTime() - aTime.getTime();
      });
  } catch (error) {
    console.error('Error fetching published blog posts:', error);
    return [];
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const blogCollection = collection(db, BLOG_COLLECTION);
    const blogSnapshot = await getDocs(blogCollection);
    
    const posts = blogSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as BlogPost[];
    
    const post = posts.find(p => p.slug === slug);
    return post || null;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

export async function addBlogPost(blogData: Omit<BlogPost, 'id'>): Promise<string | null> {
  try {
    const newBlog = {
      ...blogData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(collection(db, BLOG_COLLECTION), newBlog);
    return docRef.id;
  } catch (error) {
    console.error('Error adding blog post:', error);
    return null;
  }
}

export async function updateBlogPost(id: string, blogData: Partial<BlogPost>): Promise<boolean> {
  try {
    const blogDoc = doc(db, BLOG_COLLECTION, id);
    const updateData = {
      ...blogData,
      updatedAt: serverTimestamp(),
    };
    
    await updateDoc(blogDoc, updateData);
    return true;
  } catch (error) {
    console.error('Error updating blog post:', error);
    return false;
  }
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  try {
    const blogDoc = doc(db, BLOG_COLLECTION, id);
    await deleteDoc(blogDoc);
    return true;
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return false;
  }
}