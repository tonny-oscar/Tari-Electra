
"use server";

import { z } from 'zod';
import { addContactMessage } from '@/data/contactMessages'; // Import the new function
import type { ContactFormState } from '@/lib/types'; // Using the more general form state

const ContactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters").optional().or(z.literal('')), // Allow empty string or valid phone
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function sendContactEmailAction(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  console.log("[sendContactEmailAction] Action invoked.");

  try {
    const rawFormData = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      message: formData.get('message'),
    };
    console.log("[sendContactEmailAction] Raw form data:", rawFormData);

    const validatedFields = ContactFormSchema.safeParse(rawFormData);

    if (!validatedFields.success) {
      console.error("[sendContactEmailAction] Validation failed:", validatedFields.error.flatten().fieldErrors);
      return {
        message: "Invalid form data. Please check your inputs.",
        fields: validatedFields.error.flatten().fieldErrors as Record<string, string>,
        isError: true,
        isSuccess: false,
      };
    }
    console.log("[sendContactEmailAction] Validation successful.");

    const { name, email, phone, message } = validatedFields.data;

    // Store the message in-memory
    const storedMessage = addContactMessage({ name, email, phone: phone || undefined, message });
    console.log("[sendContactEmailAction] New Inquiry Stored (In-Memory):", storedMessage);
    
    return {
      message: `Thank you for your inquiry, ${name}! We've received your message and will get back to you shortly. (Message stored in memory).`,
      isError: false,
      isSuccess: true,
    };
  } catch (error) {
    console.error("[sendContactEmailAction] Error during action execution:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown server error occurred.";
    return {
      message: `Server error: ${errorMessage}. Please try again.`,
      isError: true,
      isSuccess: false,
    };
  }
}
