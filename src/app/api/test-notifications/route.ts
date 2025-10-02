import { NextRequest, NextResponse } from 'next/server';
import { getErrorMessage } from '@/lib/utils/error';

export async function POST(request: NextRequest) {
  try {
    const { phone, email } = await request.json();

    const results = {
      sms: null,
      email: null,
      errors: [] as string[],
      config: {
        brevoConfigured: !!process.env.BREVO_API_KEY,
        africasTalkingConfigured: !!(process.env.AFRICASTALKING_USERNAME && process.env.AFRICASTALKING_API_KEY)
      }
    };

    // Test SMS
    if (phone) {
      try {
        const formattedPhone = phone.startsWith('+') ? phone : 
                              phone.startsWith('0') ? `+254${phone.slice(1)}` : 
                              `+254${phone}`;
        
        const smsResponse = await fetch(`${request.nextUrl.origin}/api/send-sms`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: formattedPhone,
            message: 'Test SMS from Tari Electra - Your notification system is working! 🎉'
          }),
        });
        
        if (smsResponse.ok) {
          results.sms = await smsResponse.json();
        } else {
          const errorText = await smsResponse.text();
          results.errors.push(`SMS Error: ${errorText}`);
        }
      } catch (error) {
        results.errors.push(`SMS Error: ${getErrorMessage(error)}`);
      }
    }

    // Test Email
    if (email) {
      try {
        const testItems = [
          { name: 'Smart Meter', quantity: 1, price: 1000 },
          { name: 'Installation Kit', quantity: 1, price: 500 }
        ];
        const testTotal = 1500;
        const testOrderNumber = 'TEST-001';

        const itemsList = testItems.map(
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
                <h1>🧪 Test Email</h1>
              </div>
              <div class="content">
                <h2>Hello Test User,</h2>
                <p>This is a test email from Tari Electra notification system.</p>

                <div class="order-details">
                  <h3>Test Order #${testOrderNumber}</h3>
                  <p><strong>Date:</strong> ${new Date().toLocaleDateString("en-KE", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}</p>

                  <h4>Test Items:</h4>
                  ${itemsList
                    .map((item) => `<div class="item">${item}</div>`)
                    .join("")}

                  <div class="total">
                    <p>Total: KES ${testTotal.toLocaleString("en-KE")}</p>
                  </div>
                </div>

                <p>If you received this email, your notification system is working correctly!</p>

                <div class="footer">
                  <p>Tari Electra Test System</p>
                  <p>This is an automated test email.</p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `;

        const emailResponse = await fetch(`${request.nextUrl.origin}/api/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: email,
            subject: 'Test Email from Tari Electra',
            html
          }),
        });
        
        if (emailResponse.ok) {
          results.email = await emailResponse.json();
        } else {
          const errorText = await emailResponse.text();
          results.errors.push(`Email Error: ${errorText}`);
        }
      } catch (error) {
        results.errors.push(`Email Error: ${getErrorMessage(error)}`);
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}