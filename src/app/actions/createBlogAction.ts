
'use server';

import type { BlogPost, BlogFormState } from '@/lib/types';
import { addBlogPost } from '@/data/blogPosts'; // Firestore version
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { getAllBlogSubscribers } from '@/data/blogSubscribers';
import { sendNewBlogPostEmailAction } from './sendNewBlogPostEmailAction';

const CreateBlogPostSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters.' }),
  slug: z.string().min(3, { message: 'Slug must be at least 3 characters.' })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'Slug must be lowercase alphanumeric with hyphens.' }),
  excerpt: z.string().min(10, { message: 'Excerpt must be at least 10 characters.' }),
  author: z.string().min(2, { message: 'Author name must be at least 2 characters.' }),
  category: z.string().min(2, { message: 'Category must be at least 2 characters.' }),
  content: z.string().min(50, { message: 'Content must be at least 50 characters.' }),
  imageUrl: z.string().optional().or(z.literal('')), 
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
        slug: validatedFields.data.slug, 
        imageUrl: imageUrl || undefined, 
        imageHint: imageHint || undefined,
    };

    const createdPost = await addBlogPost(newPostData); 

    if (!createdPost) {
      console.error('[createBlogAction] Failed to create blog post in Firestore.');
      return {
        message: 'Failed to create blog post. Slug might already exist or server error.',
        isError: true,
        isSuccess: false,
      };
    }
    
    console.log('[createBlogAction] New Blog Post Created (Firestore):', createdPost);
    
    revalidatePath('/admin/blog');
    revalidatePath('/blog');
    revalidatePath(`/blog/${createdPost.slug}`);

    // Send email notifications to subscribers
    console.log('[createBlogAction] Attempting to fetch subscribers for email notification...');
    try {
      const subscribers = await getAllBlogSubscribers();
      if (subscribers.length > 0) {
        console.log(`[createBlogAction] Found ${subscribers.length} subscribers. Initiating email notifications for post: "${createdPost.title}".`);
        // Pass the full createdPost object which includes date as a string
        const emailResult = await sendNewBlogPostEmailAction(createdPost as BlogPost, subscribers); 
        if (emailResult.success) {
          console.log(`[createBlogAction] Successfully initiated sending ${subscribers.length} notification emails.`);
        } else {
          console.warn(`[createBlogAction] Email notification sending had issues: ${emailResult.message}`, emailResult.errors);
        }
      } else {
        console.log('[createBlogAction] No subscribers found. Skipping email notification.');
      }
    } catch (emailError) {
      console.error('[createBlogAction] Error during subscriber fetching or email notification process:', emailError);
      // Note: We don't fail the whole action if email sending fails, but we log it.
    }

    return {
      message: `Blog post "${createdPost.title}" created successfully and saved to Firestore. Email notifications initiated.`,
      isError: false,
      isSuccess: true,
      createdPost: createdPost,
    };
  } catch (error)
 {
    console.error('[createBlogAction] Error creating post:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      message: `Error creating post: ${errorMessage}`,
      isError: true,
      isSuccess: false,
    };
  }
}
