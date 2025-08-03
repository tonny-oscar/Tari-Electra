
'use server';

import type { HomepageSettings, HomepageSettingsFormState } from '@/lib/types';
import { updateHomepageSettings } from '@/data/homepageSettings'; // Firestore version
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

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
    // The updatedSettingsData now just passes what was validated from the form.
    // The updateHomepageSettings Firestore function will handle merging with defaults if fields are empty/undefined.
    const dataToUpdate: Partial<HomepageSettings> = {
        heroImageUrl: validatedFields.data.heroImageUrl, // Pass directly, let Firestore function handle empty string logic
        heroImageHint: validatedFields.data.heroImageHint,
    };
    
    const updatedSettings = await updateHomepageSettings(dataToUpdate); // Call Firestore version
    
    console.log('[updateHomepageSettingsAction] Homepage Settings Updated (Firestore):', updatedSettings);
    
    revalidatePath('/'); 
    revalidatePath('/admin/homepage'); 

    return {
      message: `Homepage settings updated successfully (saved to Firestore).`,
      isError: false,
      isSuccess: true,
      updatedItem: updatedSettings,
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
