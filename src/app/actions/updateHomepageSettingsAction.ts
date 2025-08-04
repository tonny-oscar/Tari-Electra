'use server';

import type { HomepageSettings, HomepageSettingsFormState } from '@/lib/types';
import { updateHomepageSettings } from '@/data/homepageSettings'; // Make sure this function RETURNS something
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/firebase';


const UpdateHomepageSettingsSchema = z.object({
  heroImageUrl: z.string().optional().or(z.literal('')),
  heroImageHint: z.string().optional(),
});

export async function updateHomepageSettingsAction(
  prevState: HomepageSettingsFormState,
  formData: FormData
): Promise<HomepageSettingsFormState> {
  console.log('[updateHomepageSettingsAction] Action invoked.');

  const rawFormData = {
    heroImageUrl: formData.get('heroImageUrl'),
    heroImageHint: formData.get('heroImageHint'),
  };

  console.log('[updateHomepageSettingsAction] Raw form data:', rawFormData);

  const validatedFields = UpdateHomepageSettingsSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    console.error('[updateHomepageSettingsAction] Validation failed:', fieldErrors);
    return {
      message: 'Invalid form data. Please check the highlighted fields.',
      fields: fieldErrors,
      isError: true,
      isSuccess: false,
    };
  }

  
  console.log('[updateHomepageSettingsAction] Validation successful. Validated data:', validatedFields.data);

  try {
    const dataToUpdate: Partial<HomepageSettings> = {
      heroImageUrl: validatedFields.data.heroImageUrl,
      heroImageHint: validatedFields.data.heroImageHint,
    };

    // 👇 Make sure this function returns the updated object from Firestore
    const updatedSettings = await updateHomepageSettings(dataToUpdate);

    console.log('[updateHomepageSettingsAction] Homepage Settings Updated (Firestore):', updatedSettings);

    revalidatePath('/');
    revalidatePath('/admin/homepage');

    return {
      message: 'Homepage settings updated successfully (saved to Firestore).',
      isError: false,
      isSuccess: true,
      updatedItem: updatedSettings, // ✅ Now this is typed correctly
    };
  } catch (error) {
    console.error('[updateHomepageSettingsAction] Error updating settings:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      message: `Error updating settings: ${errorMessage}`,
      isError: true,
      isSuccess: false,
    };
  }
}
