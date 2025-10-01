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
      console.error('Africa’sTalking credentials not configured');
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
      console.error('Africa’sTalking error:', text);
      return NextResponse.json({ error: 'Failed to send SMS', details: text }, { status: 500 });
    }

    const result = await response.json();
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error('SMS API error:', error);
    return NextResponse.json({ error: 'Failed to send SMS', details: error.message }, { status: 500 });
  }
}
