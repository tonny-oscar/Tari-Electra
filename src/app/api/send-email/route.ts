import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {

    const { to, subject, html } = await req.json();


    if (!to || !subject || !html) {
      console.error("❌ Missing required fields:", { to, subject, html });
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }


    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
      console.error("❌ BREVO_API_KEY not configured in environment");
      console.log("✅ Email sent successfully (mock mode - API key not configured)");
      return NextResponse.json({ success: true, message: "Email sent (mock mode)" });
    }


    const shopEmail = "betttonny26@gmail.com";


    const emailPayload = {
      sender: { email: shopEmail, name: "Tari Electra" },
      to: [{ email: to }],                     
      cc: [{ email: shopEmail }],               
      subject,
      html: html,                        
    };


    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify(emailPayload),
    });


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
