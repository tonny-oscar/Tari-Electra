'use server';

export type ContactFormState = {
  message: string;
  isSuccess: boolean;
  isError: boolean;
  fields?: {
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
  };
};

export async function sendContactEmailAction(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = formData.get('name')?.toString() || '';
  const email = formData.get('email')?.toString() || '';
  const phone = formData.get('phone')?.toString() || '';
  const message = formData.get('message')?.toString() || '';

  // Very basic validation (adjust as needed)
  const fields: ContactFormState["fields"] = {};
  if (!name) fields.name = "Name is required.";
  if (!email) fields.email = "Email is required.";
  if (!message) fields.message = "Message is required.";

  if (Object.keys(fields).length > 0) {
    return {
      message: "Please correct the errors below.",
      isError: true,
      isSuccess: false,
      fields
    };
  }

  // Simulate sending email (replace with real API call or logic)
  try {
    console.log('Sending contact message...', { name, email, phone, message });

    return {
      message: "Your message has been sent successfully!",
      isError: false,
      isSuccess: true,
      fields: undefined
    };
  } catch (err) {
    return {
      message: "Something went wrong while sending your message.",
      isError: true,
      isSuccess: false,
      fields: undefined
    };
  }
}
