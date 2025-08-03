import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { to, subject, orderData, type } = await request.json();

    // Using SendGrid (replace with your API key)
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: to }],
          subject: subject,
        }],
        from: { email: 'hello@tari.africa', name: 'Tari Electra' },
        content: [{
          type: 'text/html',
          value: generateEmailHTML(orderData, type)
        }]
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}

function generateEmailHTML(orderData: any, type: string) {
  if (type === 'order_confirmation') {
    return `
      <h2>Order Confirmation</h2>
      <p>Thank you for your order!</p>
      <p><strong>Order Number:</strong> ${orderData.orderNumber}</p>
      <p><strong>Total:</strong> KES ${orderData.total}</p>
      <h3>Items:</h3>
      <ul>
        ${orderData.items.map((item: any) => `<li>${item.name} x ${item.quantity} - KES ${item.price * item.quantity}</li>`).join('')}
      </ul>
      <p>We'll notify you when your order ships.</p>
    `;
  }
  return '';
}