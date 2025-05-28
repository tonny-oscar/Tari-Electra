
'use server';

import type { BlogPost } from '@/lib/types';
import { z } from 'zod';

const CreateBlogPostSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters.' }),
  slug: z.string().min(3, { message: 'Slug must be at least 3 characters.' })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'Slug must be lowercase alphanumeric with hyphens.' }),
  excerpt: z.string().min(10, { message: 'Excerpt must be at least 10 characters.' }),
  author: z.string().min(2, { message: 'Author name must be at least 2 characters.' }),
  category: z.string().min(2, { message: 'Category must be at least 2 characters.' }),
  content: z.string().min(50, { message: 'Content must be at least 50 characters.' }),
});

export type CreateBlogFormState = {
  message: string;
  fields?: Record<string, string[] | undefined>; // Adjusted to match Zod error structure
  isError?: boolean;
  isSuccess?: boolean;
  createdPost?: Partial<BlogPost>; // For potential future use
};

export async function createBlogAction(
  prevState: CreateBlogFormState,
  formData: FormData
): Promise<CreateBlogFormState> {
  console.log('[createBlogAction] Action invoked.');

  const rawFormData = {
    title: formData.get('title'),
    slug: formData.get('slug'),
    excerpt: formData.get('excerpt'),
    author: formData.get('author'),
    category: formData.get('category'),
    content: formData.get('content'),
  };
  console.log('[createBlogAction] Raw form data:', rawFormData);

  const validatedFields = CreateBlogPostSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    console.error('[createBlogAction] Validation failed:', fieldErrors);
    return {
      message: 'Invalid form data. Please check the highlighted fields.',
      fields: fieldErrors,
      isError: true,
      isSuccess: false,
    };
  }
  console.log('[createBlogAction] Validation successful.');

  const newPostData: Omit<BlogPost, 'date' | 'imageUrl' | 'imageHint'> = validatedFields.data;

  // For this prototype, we'll just log the data.
  // In a real application, you would save this to a database or file.
  const blogPostToLog: BlogPost = {
    ...newPostData,
    date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD
    imageUrl: 'https://placehold.co/600x400.png', // Placeholder
    imageHint: 'new article', // Placeholder
  };

  console.log('[createBlogAction] New Blog Post Data (Prototype - Logged Only):', blogPostToLog);
  
  // Simulate successful creation
  return {
    message: `Blog post "${blogPostToLog.title}" submitted successfully (logged to console).`,
    isError: false,
    isSuccess: true,
    createdPost: blogPostToLog,
  };
}
