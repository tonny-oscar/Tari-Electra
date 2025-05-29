
'use server';

import type { BlogPost, BlogFormState } from '@/lib/types';
import { addBlogPost } from '@/data/blogPosts';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const CreateBlogPostSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters.' }),
  slug: z.string().min(3, { message: 'Slug must be at least 3 characters.' })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'Slug must be lowercase alphanumeric with hyphens.' }),
  excerpt: z.string().min(10, { message: 'Excerpt must be at least 10 characters.' }),
  author: z.string().min(2, { message: 'Author name must be at least 2 characters.' }),
  category: z.string().min(2, { message: 'Category must be at least 2 characters.' }),
  content: z.string().min(50, { message: 'Content must be at least 50 characters.' }),
  imageUrl: z.string().optional().or(z.literal('')), // Allow any string (URL or Data URL) or empty
  imageHint: z.string().optional(),
});

export async function createBlogAction(
  prevState: BlogFormState,
  formData: FormData
): Promise<BlogFormState> {
  console.log('[createBlogAction] Action invoked.');

  const rawFormData = {
    title: formData.get('title'),
    slug: formData.get('slug'),
    excerpt: formData.get('excerpt'),
    author: formData.get('author'),
    category: formData.get('category'),
    content: formData.get('content'),
    imageUrl: formData.get('imageUrl'),
    imageHint: formData.get('imageHint'),
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

  try {
    const { imageUrl, imageHint, ...restOfData } = validatedFields.data;
    const newPostData: Omit<BlogPost, 'date'> = { 
        ...restOfData,
        imageUrl: imageUrl || undefined, 
        imageHint: imageHint || undefined,
    };

    const createdPost = addBlogPost(newPostData); 

    console.log('[createBlogAction] New Blog Post Data (JSON):', createdPost);
    
    revalidatePath('/admin/blog');
    revalidatePath('/blog');
    revalidatePath(`/blog/${createdPost.slug}`);

    return {
      message: `Blog post "${createdPost.title}" created successfully (saved to JSON).`,
      isError: false,
      isSuccess: true,
      createdPost: createdPost,
    };
  } catch (error) {
    console.error('[createBlogAction] Error creating post:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      message: `Error creating post: ${errorMessage}`,
      isError: true,
      isSuccess: false,
    };
  }
}
