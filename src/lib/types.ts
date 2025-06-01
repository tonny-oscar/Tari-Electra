
import type { Timestamp } from 'firebase/firestore';

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
  avatarFallback: string;
  quote: string;
  company?: string;
};

export type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

export type BlogPost = {
  slug: string; // Will be used as Firestore document ID
  title: string;
  date: string | Timestamp; // Store as Timestamp in Firestore, convert to string for display if needed
  excerpt: string;
  imageUrl?: string;
  imageHint?: string;
  author: string;
  category: string;
  content: string;
};

export type BlogFormState = {
  message: string;
  fields?: Record<string, string[] | undefined>;
  isError?: boolean;
  isSuccess?: boolean;
  updatedPost?: Partial<BlogPost>;
  createdPost?: Partial<BlogPost>;
};

export type Product = {
  id: string; // Firestore document ID
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  imageHint?: string;
  features: string[];
};

export type ProductFormState = {
  message: string;
  fields?: Record<string, string[] | undefined>;
  isError?: boolean;
  isSuccess?: boolean;
  updatedProduct?: Partial<Product>;
  createdProduct?: Partial<Product>;
};


export type ContactMessage = {
  id: string; // Firestore document ID
  name: string;
  email: string;
  phone?: string;
  message: string;
  receivedAt: string | Timestamp; // Store as Timestamp in Firestore
  isRead: boolean;
};

export type ContactMessageActionState = {
  message: string;
  isError?: boolean;
  isSuccess?: boolean;
  updatedMessageId?: string;
};

export type ContactFormState = {
  message: string;
  fields?: Record<string, string>;
  isError?: boolean;
  isSuccess?: boolean;
};

export type HomepageSettings = {
  heroImageUrl?: string;
  heroImageHint?: string;
  // Potentially other settings can be added here
};

export type HomepageSettingsFormState = {
  message: string;
  fields?: Record<string, string[] | undefined>;
  isError?: boolean;
  isSuccess?: boolean;
  updatedSettings?: HomepageSettings;
};

export type BlogSubscriber = {
  email: string; // Document ID in Firestore
  subscribedAt: Timestamp;
};

export type BlogSubscriptionFormState = {
  message: string;
  fields?: Record<string, string[] | undefined>;
  isError?: boolean;
  isSuccess?: boolean;
};

