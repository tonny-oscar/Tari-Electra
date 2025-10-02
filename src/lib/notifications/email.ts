import { Order } from '@/lib/firebase/store';

export async function sendOrderConfirmationEmail(order: Order, customerEmail: string) {
  try {
    const itemsList = order.items.map(
      (item) =>
        `${item.name} x${item.quantity} - KES ${(item.price * item.quantity).toLocaleString('en-KE')}`
    );

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2563eb 0%, #9333ea 100%);
                    color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .item { padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
          .item:last-child { border-bottom: none; }
          .total { font-size: 1.2em; font-weight: bold; color: #2563eb; margin-top: 20px; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 0.9em; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚡ Order Confirmed!</h1>
          </div>
          <div class="content">
            <h2>Hello ${order.customerName},</h2>
            <p>Thank you for your order! We've received it and will process it soon.</p>

            <div class="order-details">
              <h3>Order #${order.orderNumber}</h3>
              <p><strong>Date:</strong> ${new Date().toLocaleDateString("en-KE", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}</p>

              <h4>Order Items:</h4>
              ${itemsList
                .map((item) => `<div class="item">${item}</div>`)
                .join("")}

              <div class="total">
                <p>Total: KES ${order.total.toLocaleString("en-KE")}</p>
              </div>
            </div>

            <p>We'll keep you updated on your order status. If you have any questions,
               feel free to reach out to us.</p>

            <div class="footer">
              <p>Thank you for choosing Tari Electra!</p>
              <p>This is an automated email. Please do not reply directly to this message.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: customerEmail,
        subject: `Order Confirmation - ${order.orderNumber}`,
        html
      }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}