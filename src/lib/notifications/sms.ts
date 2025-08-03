import { Order } from '@/lib/firebase/store';

export async function sendOrderConfirmationSMS(order: Order, phoneNumber: string) {
  try {
    // Format phone number for international use (Kenya +254)
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : 
                          phoneNumber.startsWith('0') ? `+254${phoneNumber.slice(1)}` : 
                          `+254${phoneNumber}`;
    
    const response = await fetch('/api/send-sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: formattedPhone,
        message: `Hi! Your Tari Electra order ${order.orderNumber} for KES ${order.total} has been confirmed. We'll notify you when it ships. Track: tari.africa`,
      }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
}