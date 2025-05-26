// src/app/actions/sendContactEmailAction.ts
"use server";

import { z } from 'zod';
import nodemailer from 'nodemailer';

const ContactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  propertyType: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactFormState = {
  message: string;
  fields?: Record<string, string>;
  isError?: boolean;
  isSuccess?: boolean;
};

export async function sendContactEmailAction(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const rawFormData = {
    name: formData.get('name'),
    email: formData.get('email'),
    propertyType: formData.get('propertyType'),
    message: formData.get('message'),
  };

  const validatedFields = ContactFormSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: "Invalid form data. Please check your inputs.",
      fields: validatedFields.error.flatten().fieldErrors as Record<string, string>,
      isError: true,
      isSuccess: false,
    };
  }

  const { name, email, propertyType, message } = validatedFields.data;
  const recipientEmail = "betttonny26@gmail.com"; // Your email address

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const senderEmail = process.env.SMTP_SENDER_EMAIL || process.env.SMTP_USER;

  try {
    // Email to you
    await transporter.sendMail({
      from: `"${name} (Tari Contact Form)" <${senderEmail}>`,
      to: recipientEmail,
      replyTo: email,
      subject: `New Contact Inquiry from ${name}`,
      html: `
        <p>You have a new contact form submission:</p>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Property Type:</strong> ${propertyType || 'Not specified'}</li>
        </ul>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    // Confirmation email to the sender
    await transporter.sendMail({
        from: `"Tari Smart Power" <${senderEmail}>`,
        to: email,
        subject: "Thank you for your inquiry!",
        html: `
            <p>Dear ${name},</p>
            <p>Thank you for contacting Tari Smart Power. We have received your message and will get back to you as soon as possible.</p>
            <p>Here's a copy of your message:</p>
            <blockquote>
                <p><strong>Property Type:</strong> ${propertyType || 'Not specified'}</p>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
            </blockquote>
            <p>Best regards,<br>The Tari Smart Power Team</p>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL || '#'}">${process.env.NEXT_PUBLIC_APP_URL || 'Visit our website'}</a></p>
        `,
    });


    return {
      message: "Your inquiry has been sent successfully! We'll also send you a confirmation email.",
      isError: false,
      isSuccess: true,
    };
  } catch (error) {
    console.error("Failed to send email:", error);
    return {
      message: "Failed to send your message. Please try again later or contact us directly.",
      isError: true,
      isSuccess: false,
    };
  }
}
