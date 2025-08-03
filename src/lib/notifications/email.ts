import { Order } from '@/lib/firebase/store';

export async function sendOrderConfirmationEmail(order: Order, customerEmail: string) {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: customerEmail,
        subject: `Order Confirmation - ${order.orderNumber}`,
        orderData: order,
        type: 'order_confirmation'
      }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}