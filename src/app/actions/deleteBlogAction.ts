
'use server';

import { deleteBlogPost } from '@/data/blogPosts'; // Firestore version
import { revalidatePath } from 'next/cache';

export type DeleteBlogFormState = {
  message: string;
  isError?: boolean;
  isSuccess?: boolean;
};

export async function deleteBlogAction(
  slug: string // Slug is the identifier
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
    // deleteBlogPost now interacts with Firestore
    const success = await deleteBlogPost(slug);

    if (success) {
      console.log('[deleteBlogAction] Blog Post Deleted (Firestore):', slug);
      revalidatePath('/admin/blog');
      revalidatePath('/blog');
      // No specific slug page to revalidate for /blog/[slug] as it's deleted.
      
      return {
        message: `Blog post "${slug}" deleted successfully from Firestore.`,
        isError: false,
        isSuccess: true,
      };
    } else {
      return {
        message: `Error: Blog post with slug "${slug}" not found in Firestore or deletion failed.`,
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
