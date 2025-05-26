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
  imageUrl: string;
  imageHint: string;
  author: string;
  category: string;
  content: string; // Potentially Markdown string
};
