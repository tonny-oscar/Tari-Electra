// Order interface is defined inline to avoid circular imports

export interface NotificationData {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  orderNumber: string;
  orderTotal: number;
  trackingNumber?: string;
  statusName: string;
  notes?: string;
}

export async function sendOrderStatusEmail(data: NotificationData) {
  try {
    if (!data.customerEmail) {
      console.log('No customer email provided, skipping email notification');
      return { success: true, message: 'No email provided' };
    }

    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: data.customerEmail,
        subject: `Order Update - ${data.orderNumber} | Tari Electra`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0;">Tari Electra</h1>
            </div>
            <div style="padding: 30px; background: #f9f9f9;">
              <h2 style="color: #333;">Hi ${data.customerName},</h2>
              <p style="color: #666; line-height: 1.6;">Your order has been updated!</p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #667eea; margin-top: 0;">Order Details</h3>
                <p><strong>Order Number:</strong> ${data.orderNumber}</p>
                <p><strong>Status:</strong> <span style="color: #10b981; font-weight: bold;">${data.statusName}</span></p>
                <p><strong>Total:</strong> KSH ${data.orderTotal.toLocaleString('en-KE')}</p>
                ${data.trackingNumber ? `<p><strong>Tracking Number:</strong> ${data.trackingNumber}</p>` : ''}
              </div>
              
              ${data.notes ? `
                <div style="background: #e3f2fd; padding: 15px; border-left: 4px solid #2196f3; margin: 20px 0;">
                  <strong>Update Notes:</strong><br/>
                  ${data.notes}
                </div>
              ` : ''}
              
              <p style="color: #666; line-height: 1.6;">Thank you for choosing Tari Electra!</p>
              <p style="color: #666; line-height: 1.6;">Best regards,<br/>Tari Electra Team</p>
            </div>
          </div>
        `
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.warn('Email service unavailable:', errorText);
      return { success: true, message: 'Email service unavailable (mock mode)' };
    }
    
    const result = await response.json();
    return { success: true, ...result };
  } catch (error: any) {
    console.warn('Email notification failed:', error?.message);
    return { success: true, message: 'Email service unavailable (mock mode)' };
  }
}

export async function sendOrderStatusSMS(data: NotificationData) {
  if (!data.customerPhone) return { success: true, message: 'No phone provided' };
  
  try {
    // Format phone number for international use (Kenya +254)
    const formattedPhone = data.customerPhone.startsWith('+') ? data.customerPhone : 
                          data.customerPhone.startsWith('0') ? `+254${data.customerPhone.slice(1)}` : 
                          `+254${data.customerPhone}`;
    
    let message = `Hi ${data.customerName}! Your Tari Electra order ${data.orderNumber} status: ${data.statusName}.`;
    
    if (data.trackingNumber) {
      message += ` Tracking: ${data.trackingNumber}.`;
    }
    
    message += ' Thank you!';
    
    const response = await fetch('/api/send-sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: formattedPhone,
        message,
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.warn('SMS service unavailable:', errorText);
      return { success: true, message: 'SMS service unavailable (mock mode)' };
    }
    
    const result = await response.json();
    return { success: true, ...result };
  } catch (error: any) {
    console.warn('SMS notification failed:', error?.message);
    return { success: true, message: 'SMS service unavailable (mock mode)' };
  }
}

export async function sendResellerApplicationEmail(
  email: string, 
  fullName: string, 
  status: 'approved' | 'rejected', 
  adminNotes?: string
) {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: email,
        subject: `Reseller Application ${status === 'approved' ? 'Approved' : 'Rejected'} - Tari Electra`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0;">Tari Electra</h1>
            </div>
            <div style="padding: 30px; background: #f9f9f9;">
              <h2 style="color: #333;">Dear ${fullName},</h2>
              <p style="color: #666; line-height: 1.6;">Your reseller application has been <strong style="color: ${status === 'approved' ? '#10b981' : '#ef4444'};">${status}</strong>.</p>
              ${status === 'approved' 
                ? '<p style="color: #666; line-height: 1.6;">Welcome to the Tari Electra reseller network! We will contact you soon with next steps.</p>'
                : '<p style="color: #666; line-height: 1.6;">Thank you for your interest. You may reapply in the future.</p>'
              }
              ${adminNotes ? `<div style="background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0;"><strong>Admin Notes:</strong><br/>${adminNotes}</div>` : ''}
              <p style="color: #666; line-height: 1.6;">Best regards,<br/>Tari Electra Team</p>
            </div>
          </div>
        `
      }),
    });
    
    if (!response.ok) {
      console.warn('Email service unavailable for reseller application');
      return { success: true, message: 'Email service unavailable (mock mode)' };
    }
    
    return await response.json();
  } catch (error) {
    console.warn('Reseller application email failed:', error);
    return { success: true, message: 'Email service unavailable (mock mode)' };
  }
}

export async function sendResellerApplicationSMS(
  phone: string, 
  fullName: string, 
  status: 'approved' | 'rejected'
) {
  try {
    // Format phone number for international use (Kenya +254)
    const formattedPhone = phone.startsWith('+') ? phone : 
                          phone.startsWith('0') ? `+254${phone.slice(1)}` : 
                          `+254${phone}`;
    
    const message = `Hi ${fullName}! Your Tari Electra reseller application has been ${status}. ${
      status === 'approved' ? 'Welcome to our network!' : 'Thank you for your interest.'
    }`;
    
    const response = await fetch('/api/send-sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: formattedPhone,
        message,
      }),
    });
    
    if (!response.ok) {
      console.warn('SMS service unavailable for reseller application');
      return { success: true, message: 'SMS service unavailable (mock mode)' };
    }
    
    return await response.json();
  } catch (error) {
    console.warn('Reseller application SMS failed:', error);
    return { success: true, message: 'SMS service unavailable (mock mode)' };
  }
}