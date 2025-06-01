
'use server';

import { z } from 'zod';
import { addBlogSubscriber } from '@/data/blogSubscribers';
import type { BlogSubscriptionFormState } from '@/lib/types';
import { revalidatePath } from 'next/cache';

const SubscribeToBlogSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
});

export async function subscribeToBlogAction(
  prevState: BlogSubscriptionFormState,
  formData: FormData
): Promise<BlogSubscriptionFormState> {
  console.log('[subscribeToBlogAction] Action invoked.');

  const rawFormData = {
    email: formData.get('email'),
  };
  console.log('[subscribeToBlogAction] Raw form data:', rawFormData);

  const validatedFields = SubscribeToBlogSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    console.error('[subscribeToBlogAction] Validation failed:', fieldErrors);
    return {
      message: 'Invalid email. Please check the highlighted field.',
      fields: fieldErrors as Record<string, string[]>,
      isError: true,
      isSuccess: false,
    };
  }
  console.log('[subscribeToBlogAction] Validation successful.');

  try {
    const email = validatedFields.data.email;
    const result = await addBlogSubscriber(email);

    if (result.success) {
      console.log(`[subscribeToBlogAction] Email ${email} processed successfully: ${result.message}`);
      revalidatePath('/blog'); // Revalidate the blog page, though not strictly necessary for this action
      return {
        message: result.message,
        isError: false,
        isSuccess: true,
      };
    } else {
      console.error(`[subscribeToBlogAction] Failed to subscribe ${email}: ${result.message}`);
      return {
        message: result.message,
        isError: true,
        isSuccess: false,
      };
    }
  } catch (error) {
    console.error('[subscribeToBlogAction] Error subscribing email:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred.';
    return {
      message: `Error: ${errorMessage}`,
      isError: true,
      isSuccess: false,
    };
  }
}
