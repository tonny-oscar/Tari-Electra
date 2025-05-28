
'use server';

import type { BlogPost, BlogFormState } from '@/lib/types';
import { updateBlogPost, findBlogPost } from '@/data/blogPosts';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

// Schema for updating a blog post, slug is not part of formData here but passed separately
const UpdateBlogPostSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters.' }),
  // Slug is handled separately, not from form data for update usually, or read-only
  excerpt: z.string().min(10, { message: 'Excerpt must be at least 10 characters.' }),
  author: z.string().min(2, { message: 'Author name must be at least 2 characters.' }),
  category: z.string().min(2, { message: 'Category must be at least 2 characters.' }),
  content: z.string().min(50, { message: 'Content must be at least 50 characters.' }),
});

export async function updateBlogAction(
  currentSlug: string, // The original slug of the post being edited
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
    const postToUpdate = findBlogPost(currentSlug);
    if (!postToUpdate) {
      return {
        message: `Error: Blog post with slug "${currentSlug}" not found.`,
        isError: true,
        isSuccess: false,
      };
    }

    // Omit slug from validated data as it's not being changed here
    const { ...dataToUpdate } = validatedFields.data;
    
    const updatedPost = updateBlogPost(currentSlug, dataToUpdate);

    if (!updatedPost) {
        // This case should ideally be caught by findBlogPost, but as a safeguard
        return {
            message: `Failed to update blog post "${currentSlug}". Post not found or update failed.`,
            isError: true,
            isSuccess: false,
        };
    }
    
    console.log('[updateBlogAction] Blog Post Updated (In-Memory):', updatedPost);
    
    revalidatePath('/admin/blog');
    revalidatePath('/blog');
    revalidatePath(`/blog/${currentSlug}`); // Revalidate the specific post page

    return {
      message: `Blog post "${updatedPost.title}" updated successfully (in-memory).`,
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
