
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

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: (process.env.SMTP_PORT || '587') === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    // Add timeout options
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000, // 10 seconds
    socketTimeout: 10000, // 10 seconds
  });

  const emailSubject = `New Post on ${appName} Blog: ${blogPost.title}`;
  const emailHtmlBody = `
    <p>Hello,</p>
    <p>A new blog post has been published on the ${appName} blog:</p>
    <h2><a href="${blogPostUrl}">${blogPost.title}</a></h2>
    <p><strong>Excerpt:</strong> ${blogPost.excerpt}</p>
    <p><a href="${blogPostUrl}">Read More &raquo;</a></p>
    <hr>
    <p>Visit our <a href="${blogPageUrl}">blog</a> for more articles or to subscribe.</p>
    <p><small>To unsubscribe, click here (feature coming soon).</small></p>
    <p>Sincerely,<br>The ${appName} Team</p>
  `;

  const emailPromises = subscribers.map(subscriber => {
    const mailOptions = {
      from: `"${appName}" <${process.env.SMTP_SENDER_EMAIL || 'noreply@example.com'}>`,
      to: subscriber.email,
      subject: emailSubject,
      html: emailHtmlBody,
    };
    return transporter.sendMail(mailOptions)
      .then(info => ({ email: subscriber.email, success: true, info }))
      .catch(error => ({ email: subscriber.email, success: false, error }));
  });

  const results = await Promise.all(emailPromises);
  const errors: string[] = [];
  let successfulSends = 0;

  results.forEach(result => {
    if (result.success) {
      console.log(`[sendNewBlogPostEmailAction] Email sent successfully to: ${result.email}. Message ID: ${result.info.messageId}`);
      successfulSends++;
    } else {
      console.error(`[sendNewBlogPostEmailAction] Failed to send email to: ${result.email}. Error: ${result.error.message}`);
      errors.push(`Failed to send to ${result.email}: ${result.error.message}`);
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
