
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
  slug: string; 
  title: string;
  date: string | Timestamp; 
  excerpt: string;
  imageUrl?: string;
  imageHint?: string;
  author: string;
  category: string;
  content: string;
};

export type FormState<T> = {
  message: string;
  fields?: Record<string, string[] | undefined>;
  isError?: boolean;
  isSuccess?: boolean;
  updatedItem?: Partial<T>;
  createdItem?: Partial<T>;
};

export type BlogFormState = FormState<BlogPost>;

export type Product = {
  id: string; // Firestore document ID
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  imageHint?: string;
  features: string[];
  stock: number;
  rating: number;
  status: 'active' | 'inactive' | 'draft';
};

export type ProductFormState = FormState<Product>;


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

export type ContactFormState = Omit<FormState<ContactMessage>, 'fields'> & {
  fields?: Record<string, string>;
};

export type HomepageSettings = {
  heroImageUrl?: string;
  heroImageHint?: string;
  // Potentially other settings can be added here
};

export type HomepageSettingsFormState = FormState<HomepageSettings>;

export type BlogSubscriber = {
  email: string; // Document ID in Firestore
  subscribedAt: Timestamp;
};

export type BlogSubscriptionFormState = FormState<BlogSubscriber>;

