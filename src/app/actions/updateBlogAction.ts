
'use server';

import type { BlogPost, BlogFormState } from '@/lib/types';
import { updateBlogPost, findBlogPost } from '@/data/blogPosts'; // Firestore version
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

// Slug is not part of updateable fields, it's the identifier
const UpdateBlogPostSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters.' }),
  excerpt: z.string().min(10, { message: 'Excerpt must be at least 10 characters.' }),
  author: z.string().min(2, { message: 'Author name must be at least 2 characters.' }),
  category: z.string().min(2, { message: 'Category must be at least 2 characters.' }),
  content: z.string().min(50, { message: 'Content must be at least 50 characters.' }),
  imageUrl: z.string().optional().or(z.literal('')), 
  imageHint: z.string().optional(),
});

export async function updateBlogAction(
  currentSlug: string, 
  prevState: BlogFormState,
  formData: FormData
): Promise<BlogFormState> {
  console.log('[updateBlogAction] Action invoked for slug:', currentSlug);

  const rawFormData = {
    title: formData.get('title'),
    excerpt: formData.get('excerpt'),
    author: formData.get('author'),
    category: formData.get('category'),
    content: formData.get('content'),
    imageUrl: formData.get('imageUrl'),
    imageHint: formData.get('imageHint'),
  };
  console.log('[updateBlogAction] Raw form data:', rawFormData);

  const validatedFields = UpdateBlogPostSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    console.error('[updateBlogAction] Validation failed:', fieldErrors);
    return {
      message: 'Invalid form data. Please check the highlighted fields.',
      fields: fieldErrors,
      isError: true,
      isSuccess: false,
    };
  }
  console.log('[updateBlogAction] Validation successful.');

  try {
    // findBlogPost uses Firestore and returns BlogPost | undefined
    const postToUpdate = await findBlogPost(currentSlug); 
    if (!postToUpdate) {
      return {
        message: `Error: Blog post with slug "${currentSlug}" not found in Firestore.`,
        isError: true,
        isSuccess: false,
      };
    }

    const { imageUrl, imageHint, ...restOfData } = validatedFields.data;
    // Data for Firestore update, slug and date are not directly updated here
    // Date could be a 'lastModified' timestamp updated by Firestore function if needed
    const dataToUpdate: Partial<Omit<BlogPost, 'slug' | 'date'>> = {
        ...restOfData,
        imageUrl: imageUrl || undefined,
        imageHint: imageHint || undefined,
    };
    
    // updateBlogPost now interacts with Firestore
    const updatedPost = await updateBlogPost(currentSlug, dataToUpdate);

    if (!updatedPost) {
        return {
            message: `Failed to update blog post "${currentSlug}" in Firestore.`,
            isError: true,
            isSuccess: false,
        };
    }
    
    console.log('[updateBlogAction] Blog Post Updated (Firestore):', updatedPost);
    
    revalidatePath('/admin/blog');
    revalidatePath('/blog');
    revalidatePath(`/blog/${currentSlug}`); // currentSlug is the identifier

    return {
      message: `Blog post "${updatedPost.title}" updated successfully (saved to Firestore).`,
      isError: false,
      isSuccess: true,
      updatedPost: updatedPost,
    };
  } catch (error) {
    console.error('[updateBlogAction] Error updating post:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      message: `Error updating post: ${errorMessage}`,
      isError: true,
      isSuccess: false,
    };
  }
}
