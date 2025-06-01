
"use server";

import { z } from 'zod';
import nodemailer from 'nodemailer';
import { addContactMessage } from '@/data/contactMessages';
import type { ContactFormState, ContactMessage } from '@/lib/types';
import { Timestamp } from 'firebase/firestore';

const ContactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters").optional().or(z.literal('')),
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
    const phoneValue = phone || undefined;

    // Store the message in Firestore
    console.log("[sendContactEmailAction] Attempting to store message in Firestore...");
    const dataToStore: Omit<ContactMessage, 'id' | 'receivedAt' | 'isRead'> = { name, email, phone: phoneValue, message };
    const storedMessage = await addContactMessage(dataToStore);
    
    if (!storedMessage) {
      console.error("[sendContactEmailAction] FAILED to store message in Firestore.");
      return {
        message: "Server error: Could not save your message. Please try again later.",
        isError: true,
        isSuccess: false,
      };
    }
    console.log("[sendContactEmailAction] Message STORED successfully in Firestore. Stored data:", storedMessage);

    // Email sending logic
    const adminEmail = 'betttonny26@gmail.com'; // Replace with your admin email
    const appName = 'Tari Electra';
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'yourwebsite.com';

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: (process.env.SMTP_PORT || '587') === '465', 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const adminMailOptions = {
      from: `"${appName} Contact Form" <${process.env.SMTP_SENDER_EMAIL || email}>`,
      to: adminEmail,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <p>You have received a new contact form submission:</p>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          ${phoneValue ? `<li><strong>Phone:</strong> ${phoneValue}</li>` : ''}
          <li><strong>Message:</strong></li>
        </ul>
        <p style="white-space: pre-wrap;">${message}</p>
        <hr>
        <p>This message was sent from the contact form on ${appUrl}</p>
      `,
    };

    const userMailOptions = {
      from: `"${appName}" <${process.env.SMTP_SENDER_EMAIL || adminEmail}>`,
      to: email,
      subject: `Thank You for Your Inquiry, ${name}!`,
      html: `
        <p>Dear ${name},</p>
        <p>Thank you for contacting ${appName}. We have received your message and will get back to you as soon as possible.</p>
        <p><strong>Your Message:</strong></p>
        <blockquote style="border-left: 2px solid #ccc; padding-left: 1em; margin-left: 1em; white-space: pre-wrap;">${message}</blockquote>
        <hr>
        <p>If you have any urgent concerns, please feel free to call us.</p>
        <p>Sincerely,<br>The ${appName} Team</p>
      `,
    };

    try {
      await transporter.sendMail(adminMailOptions);
      console.log('[sendContactEmailAction] Admin notification email sent successfully.');
      await transporter.sendMail(userMailOptions);
      console.log('[sendContactEmailAction] User confirmation email sent successfully.');
      return {
        message: `Thank you for your inquiry, ${name}! We've received your message and will get back to you shortly.`,
        isError: false,
        isSuccess: true,
      };
    } catch (emailError: any) {
      console.error("[sendContactEmailAction] Error sending email(s):", emailError);
      // Still return success for form submission if message was stored, but with a note about email failure
      return {
        message: `Thank you, ${name}! Your message was received. However, there was an issue sending email notifications. We will still get back to you.`,
        isError: false, 
        isSuccess: true, 
      };
    }

  } catch (error: any) {
    console.error("[sendContactEmailAction] Critical error during action execution:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown server error occurred.";
    return {
      message: `Server error: ${errorMessage}. Please try again.`,
      isError: true,
      isSuccess: false,
    };
  }
}
