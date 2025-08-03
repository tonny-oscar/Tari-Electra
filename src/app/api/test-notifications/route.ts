import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { phone, email } = await request.json();

    const results = {
      sms: null,
      email: null,
      errors: [],
      config: {
        twilioConfigured: !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER),
        sendgridConfigured: !!process.env.SENDGRID_API_KEY
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
        results.errors.push(`SMS Error: ${error.message}`);
      }
    }

    // Test Email
    if (email) {
      try {
        const emailResponse = await fetch(`${request.nextUrl.origin}/api/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: email,
            subject: 'Test Email from Tari Electra',
            orderData: {
              orderNumber: 'TEST-001',
              total: 1500,
              items: [
                { name: 'Smart Meter', quantity: 1, price: 1000 },
                { name: 'Installation Kit', quantity: 1, price: 500 }
              ]
            },
            type: 'order_confirmation'
          }),
        });
        
        if (emailResponse.ok) {
          results.email = await emailResponse.json();
        } else {
          const errorText = await emailResponse.text();
          results.errors.push(`Email Error: ${errorText}`);
        }
      } catch (error) {
        results.errors.push(`Email Error: ${error.message}`);
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}