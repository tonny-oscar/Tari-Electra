
'use server';

import { deleteBlogPost } from '@/data/blogPosts';
import { revalidatePath } from 'next/cache';

export type DeleteBlogFormState = {
  message: string;
  isError?: boolean;
  isSuccess?: boolean;
};

export async function deleteBlogAction(
  slug: string
): Promise<DeleteBlogFormState> {
  console.log('[deleteBlogAction] Action invoked for slug:', slug);

  if (!slug) {
    return {
      message: 'Error: Slug is required for deletion.',
      isError: true,
      isSuccess: false,
    };
  }

  try {
    const success = deleteBlogPost(slug);

    if (success) {
      console.log('[deleteBlogAction] Blog Post Deleted (In-Memory):', slug);
      revalidatePath('/admin/blog');
      revalidatePath('/blog');
      // No specific slug to revalidate as it's deleted. Revalidating /blog should suffice.
      
      return {
        message: `Blog post "${slug}" deleted successfully (in-memory).`,
        isError: false,
        isSuccess: true,
      };
    } else {
      return {
        message: `Error: Blog post with slug "${slug}" not found or deletion failed.`,
        isError: true,
        isSuccess: false,
      };
    }
  } catch (error) {
    console.error('[deleteBlogAction] Error deleting post:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      message: `Error deleting post: ${errorMessage}`,
      isError: true,
      isSuccess: false,
    };
  }
}
