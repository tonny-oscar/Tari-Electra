
"use server";

import nodemailer from 'nodemailer';
import type { BlogPost, BlogSubscriber } from '@/lib/types';

export async function sendNewBlogPostEmailAction(
  blogPost: BlogPost,
  subscribers: BlogSubscriber[]
): Promise<{ success: boolean; message: string; errors?: string[] }> {
  console.log(`[sendNewBlogPostEmailAction] Action invoked for blog post: "${blogPost.title}". Subscribers: ${subscribers.length}`);

  if (subscribers.length === 0) {
    console.log("[sendNewBlogPostEmailAction] No subscribers to notify.");
    return { success: true, message: "No subscribers to notify." };
  }

  const appName = 'Tari Electra';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002'; // Fallback for local dev
  const blogPostUrl = `${appUrl}/blog/${blogPost.slug}`;
  const blogPageUrl = `${appUrl}/blog`; // Link to the main blog page

  // Validate environment variables
  if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error("[sendNewBlogPostEmailAction] Critical: SMTP environment variables are not fully configured.");
    return { success: false, message: "Server SMTP configuration error. Emails not sent." };
  }
  const senderEmail = process.env.SMTP_SENDER_EMAIL || 'noreply@example.com'; // Fallback sender

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: (process.env.SMTP_PORT || '587') === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000, // 10 seconds
    socketTimeout: 10000, // 10 seconds
  });

  const emailSubject = `New Post on ${appName} Blog: ${blogPost.title}`;
  const emailHtmlBody = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p>Hello,</p>
      <p>A new blog post has been published on the ${appName} blog:</p>
      <h2 style="margin-bottom: 0.5em;"><a href="${blogPostUrl}" style="color: #a6ed0b; text-decoration: none;">${blogPost.title}</a></h2>
      <p><strong>Category:</strong> ${blogPost.category}</p>
      <p><strong>Published on:</strong> ${new Date(blogPost.date as string).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} by ${blogPost.author}</p>
      <p><strong>Excerpt:</strong> ${blogPost.excerpt}</p>
      <p style="margin-top: 1em;">
        <a href="${blogPostUrl}" style="background-color: #a6ed0b; color: #1a202c; padding: 10px 15px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Read More &raquo;
        </a>
      </p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
      <p>Visit our <a href="${blogPageUrl}" style="color: #a6ed0b; text-decoration: none;">blog</a> for more articles or to subscribe/unsubscribe.</p>
      <p><small>To unsubscribe directly, click here (note: full unsubscribe functionality is planned for a future update).</small></p>
      <p>Sincerely,<br>The ${appName} Team</p>
    </div>
  `;

  const emailPromises = subscribers.map(subscriber => {
    const mailOptions = {
      from: `"${appName}" <${senderEmail}>`,
      to: subscriber.email,
      subject: emailSubject,
      html: emailHtmlBody,
    };
    return transporter.sendMail(mailOptions)
      .then(() => ({ email: subscriber.email, success: true as const }))
      .catch((error: any) => ({ email: subscriber.email, success: false as const, error }));
  });

  const results = await Promise.all(emailPromises);
  const errors: string[] = [];
  let successfulSends = 0;

  results.forEach(result => {
    if (result.success) {
      console.log(`[sendNewBlogPostEmailAction] Email sent successfully to: ${result.email}`);
      successfulSends++;
    } else {
      const errorMsg = 'error' in result ? result.error?.message || 'Unknown error' : 'Unknown error';
      console.error(`[sendNewBlogPostEmailAction] Failed to send email to: ${result.email}. Error: ${errorMsg}`);
      errors.push(`Failed to send to ${result.email}: ${errorMsg}`);
    }
  });

  if (errors.length > 0) {
    return {
      success: false,
      message: `Attempted to send ${subscribers.length} emails. ${successfulSends} sent successfully. ${errors.length} failed.`,
      errors,
    };
  }

  console.log(`[sendNewBlogPostEmailAction] All ${successfulSends} emails sent successfully.`);
  return { success: true, message: `Successfully sent notifications to ${successfulSends} subscribers.` };
}
