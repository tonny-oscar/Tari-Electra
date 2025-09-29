import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Parse incoming JSON
    const { to, subject, html } = await req.json();

    // Validate required fields
    if (!to || !subject || !html) {
      console.error("❌ Missing required fields:", { to, subject, html });
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Load Brevo API key from environment
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
      console.error("❌ BREVO_API_KEY not configured in environment");
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
    }

    // Shop owner's email (will receive a CC)
    const shopEmail = "betttonny26@gmail.com";

    // Prepare email payload
    const emailPayload = {
      sender: { email: shopEmail, name: "Tari Electra" },
      to: [{ email: to }],                     
      cc: [{ email: shopEmail }],               
      subject,
      html: html,                        
    };

    // Call Brevo API
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify(emailPayload),
    });

    // Handle Brevo response
    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Brevo send error:", errorText);
      return NextResponse.json({ error: "Failed to send email", details: errorText }, { status: 500 });
    }

    const data = await response.json();
    console.log("✅ Email sent successfully:", data);
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("❌ Send email error:", err.message || err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
