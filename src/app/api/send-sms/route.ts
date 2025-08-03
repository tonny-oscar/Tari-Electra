import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { to, message } = await request.json();
    
    // Validate required fields
    if (!to || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Validate Twilio credentials
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
      console.error('Twilio credentials not configured');
      return NextResponse.json({ error: 'SMS service not configured' }, { status: 500 });
    }

    // Using Twilio
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: fromNumber || '',
        To: to,
        Body: message,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Twilio error:', errorData);
      throw new Error('Failed to send SMS');
    }

    const result = await response.json();
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('SMS API error:', error);
    return NextResponse.json({ error: 'Failed to send SMS' }, { status: 500 });
  }
}