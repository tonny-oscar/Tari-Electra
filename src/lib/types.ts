
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
  date: string; // YYYY-MM-DD
  excerpt: string;
  imageUrl?: string;
  imageHint?: string;
  author: string;
  category: string;
  content: string; // Potentially HTML string
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
  id: string;
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
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  receivedAt: string; // ISO string date
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
};

export type HomepageSettingsFormState = {
  message: string;
  fields?: Record<string, string[] | undefined>;
  isError?: boolean;
  isSuccess?: boolean;
  updatedSettings?: HomepageSettings;
};
