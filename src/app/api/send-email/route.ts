// // src/app/api/send-email/route.ts
// import { NextRequest, NextResponse } from 'next/server';

// export async function POST(request: NextRequest) {
//   try {
//     const { to, subject, orderData, type } = await request.json();

//     if (!to || !subject || !orderData) {
//       return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
//     }

//     const apiKey = process.env.BREVO_API_KEY;
//     if (!apiKey) {
//       console.error('Brevo API key not configured');
//       return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
//     }

//     const response = await fetch('https://api.brevo.com/v3/smtp/email', {
//       method: 'POST',
//       headers: {
//         'accept': 'application/json',
//         'api-key': apiKey,
//         'content-type': 'application/json',
//       },
//       body: JSON.stringify({
//         sender: { name: 'Tari Electra', email: 'hello@tari.africa' },
//         to: [{ email: to }],
//         subject: subject,
//         htmlContent: generateEmailHTML(orderData, type),
//       }),
//     });

//     if (!response.ok) {
//       const text = await response.text();
//       console.error('Brevo error response:', text);
//       throw new Error('Failed to send email');
//     }

//     return NextResponse.json({ success: true });
//   } catch (error: any) {
//     console.error('Email API error:', error);
//     return NextResponse.json({ error: 'Failed to send email', details: error.message }, { status: 500 });
//   }
// }

// function generateEmailHTML(orderData: any, type: string) {
//   if (type === 'order_confirmation') {
//     return `
//       <h2>Order Confirmation</h2>
//       <p>Thank you for your order!</p>
//       <p><strong>Order Number:</strong> ${orderData.orderNumber}</p>
//       <p><strong>Total:</strong> KES ${orderData.total}</p>
//       <h3>Items:</h3>
//       <ul>
//         ${orderData.items
//           .map(
//             (item: any) =>
//               `<li>${item.name} x ${item.quantity} – KES ${item.price * item.quantity}</li>`
//           )
//           .join('')}
//       </ul>
//       <p>We’ll notify you when your order ships.</p>
//     `;
//   }
//   return `<p>${type}</p>`;
// }


import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { to, subject, html } = await req.json();

    if (!to || !subject || !html) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ✅ Make sure BREVO_API_KEY is set in your deployment environment
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
      console.error("BREVO_API_KEY not configured");
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
    }

    // ✅ Add your shop’s email here to get CC notifications
    const shopEmail = "betttonny26@gmail.com";

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        sender: { email: shopEmail, name: "Your Shop" },
        to: [{ email: to }],
        // 👇 CC the shop owner so you get notified
        cc: [{ email: shopEmail }],
        subject,
        htmlContent: html,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Brevo send error:", errorText);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("Send email error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
