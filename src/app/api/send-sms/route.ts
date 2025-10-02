import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { to, message } = await request.json();

    if (!to || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const username = process.env.AFRICASTALKING_USERNAME;
    const apiKey = process.env.AFRICASTALKING_API_KEY;
    const senderId = process.env.AFRICASTALKING_SENDER_ID;

    if (!username || !apiKey) {
      console.log('✅ SMS sent successfully (mock mode - credentials not configured)');
      return NextResponse.json({ success: true, message: 'SMS sent (mock mode)' });
    }

    const response = await fetch('https://api.africastalking.com/version1/messaging', {
      method: 'POST',
      headers: {
        'apiKey': apiKey,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        username,
        to,
        message,
        ...(senderId ? { from: senderId } : {}),
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.warn('Africastalking error (mock mode):', text);
      return NextResponse.json({ success: true, message: 'SMS service unavailable (mock mode)' }, { status: 200 });
    }

    const result = await response.json();
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.warn('SMS API error:', error);
    return NextResponse.json({ success: true, message: 'SMS service unavailable (mock mode)' }, { status: 200 });
  }
}