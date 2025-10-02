// /**
//  * Firebase Cloud Functions for Order Notifications
//  * Combines default boilerplate with Brevo (email) + Africa's Talking (SMS)
//  */

// const functions = require("firebase-functions");
// const {setGlobalOptions} = require("firebase-functions");
// const logger = require("firebase-functions/logger");

// // --- Limit concurrent containers for cost control ---
// setGlobalOptions({maxInstances: 10});

// // --- Brevo (Sendinblue) setup ---
// const Sib = require("sib-api-v3-sdk");

// // --- Africa's Talking setup ---
// const africastalking = require("africastalking")({
//   apiKey: functions.config().at.key,
//   username: functions.config().at.username,
// });

// // Initialize Brevo API
// const client = Sib.ApiClient.instance;
// client.authentications["api-key"].apiKey = functions.config().brevo.key;
// const emailApi = new Sib.TransactionalEmailsApi();

// // Initialize SMS
// const sms = africastalking.SMS;

// /**
//  * Firestore Trigger:
//  * Runs when a new document is created in the `orders` collection.
//  */
// exports.onNewOrder = functions.firestore
//     .document("orders/{orderId}")
//     .onCreate(async (snap, context) => {
//       const order = snap.data();
//       const {
//         customerName,
//         customerEmail,
//         customerPhone,
//         items,
//         total,
//         orderNumber,
//       } = order;

//       logger.info("📦 New order received:", {
//         orderId: context.params.orderId,
//         orderNumber,
//         customerEmail,
//       });

//       // Validate required fields
//       if (!customerEmail || !customerName) {
//         logger.error("❌ Missing required customer information");
//         return;
//       }

//       // Format items for email display
//       const itemsList = items.map((item) =>
//         `${item.name} x${item.quantity} - KES ${(item.price * item.quantity).toLocaleString()}`,
//       );

//       try {
//         // --- 1. Confirmation email to customer ---
//         await emailApi.sendTransacEmail({
//           sender: {
//             email: functions.config().sender.email,
//             name: "Tari Electra",
//           },
//           to: [{email: customerEmail}],
//           subject: `Order Confirmation - ${orderNumber}`,
//           htmlContent: `
//             <!DOCTYPE html>
//             <html>
//             <head>
//               <style>
//                 body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
//                 .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//                 .header { background: linear-gradient(135deg, #2563eb 0%, #9333ea 100%); 
//                           color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
//                 .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
//                 .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
//                 .item { padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
//                 .item:last-child { border-bottom: none; }
//                 .total { font-size: 1.2em; font-weight: bold; color: #2563eb; margin-top: 20px; }
//                 .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 0.9em; }
//               </style>
//             </head>
//             <body>
//               <div class="container">
//                 <div class="header">
//                   <h1>⚡ Order Confirmed!</h1>
//                 </div>
//                 <div class="content">
//                   <h2>Hello ${customerName},</h2>
//                   <p>Thank you for your order! We've received it and will process it soon.</p>
                  
//                   <div class="order-details">
//                     <h3>Order #${orderNumber}</h3>
//                     <p><strong>Date:</strong> ${new Date().toLocaleDateString("en-KE", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   })}</p>
                    
//                     <h4>Order Items:</h4>
//                     ${itemsList.map((item) => `<div class="item">${item}</div>`).join("")}
                    
//                     <div class="total">
//                       <p>Total: KES ${total.toLocaleString("en-KE")}</p>
//                     </div>
//                   </div>
                  
//                   <p>We'll keep you updated on your order status. If you have any questions, 
//                      feel free to reach out to us.</p>
                  
//                   <div class="footer">
//                     <p>Thank you for choosing Tari Electra!</p>
//                     <p>This is an automated email. Please do not reply directly to this message.</p>
//                   </div>
//                 </div>
//               </div>
//             </body>
//             </html>
//           `,
//         });

//         logger.info("✅ Customer email sent successfully");

//         // --- 2. Notification email to admin ---
//         await emailApi.sendTransacEmail({
//           sender: {
//             email: functions.config().sender.email,
//             name: "Order System",
//           },
//           to: [{email: functions.config().admin.email}],
//           subject: `🔔 New Order: ${orderNumber}`,
//           htmlContent: `
//             <!DOCTYPE html>
//             <html>
//             <head>
//               <style>
//                 body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
//                 .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//                 .header { background: #1f2937; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
//                 .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
//                 .info-box { background: white; padding: 15px; border-left: 4px solid #2563eb; margin: 10px 0; }
//                 .item { padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
//                 .total { font-size: 1.3em; font-weight: bold; color: #dc2626; margin-top: 15px; }
//               </style>
//             </head>
//             <body>
//               <div class="container">
//                 <div class="header">
//                   <h1>📦 New Order Received</h1>
//                 </div>
//                 <div class="content">
//                   <h2>Order #${orderNumber}</h2>
                  
//                   <div class="info-box">
//                     <h3>Customer Information</h3>
//                     <p><strong>Name:</strong> ${customerName}</p>
//                     <p><strong>Email:</strong> ${customerEmail}</p>
//                     <p><strong>Phone:</strong> ${customerPhone || "Not provided"}</p>
//                   </div>
                  
//                   <div class="info-box">
//                     <h3>Order Details</h3>
//                     <p><strong>Order Date:</strong> ${new Date().toLocaleString("en-KE")}</p>
//                     <p><strong>Items:</strong></p>
//                     ${itemsList.map((item) => `<div class="item">${item}</div>`).join("")}
//                     <div class="total">Total: KES ${total.toLocaleString("en-KE")}</div>
//                   </div>
                  
//                   <p><strong>Action Required:</strong> Please process this order in the admin dashboard.</p>
//                 </div>
//               </div>
//             </body>
//             </html>
//           `,
//         });

//         logger.info("✅ Admin email sent successfully");

//         // --- 3. SMS confirmation to customer (only if phone is provided) ---
//         if (customerPhone && customerPhone.trim() !== "") {
//           // Format phone number for Kenya (ensure it starts with +254)
//           let formattedPhone = customerPhone.trim();
//           if (formattedPhone.startsWith("0")) {
//             formattedPhone = "+254" + formattedPhone.substring(1);
//           } else if (!formattedPhone.startsWith("+")) {
//             formattedPhone = "+254" + formattedPhone;
//           }

//           const smsMessage =
//             `Hi ${customerName}, your order #${orderNumber} of KES ${total.toLocaleString("en-KE")} ` +
//             `has been received at Tari Electra. We'll contact you soon. Thank you!`;

//           await sms.send({
//             to: [formattedPhone],
//             message: smsMessage,
//             from: "TARI", // Optional: Your sender ID if registered
//           });

//           logger.info("✅ SMS sent successfully to", formattedPhone);
//         } else {
//           logger.warn("⚠️ No phone number provided, skipping SMS");
//         }

//         logger.info("✅ All notifications sent successfully for order:", orderNumber);
//       } catch (err) {
//         logger.error("❌ Error sending notifications:", err);
//         // Don't throw - we don't want to retry failed notifications indefinitely
//       }
//     });




const functions = require("firebase-functions");
const { setGlobalOptions } = require("firebase-functions");
const logger = require("firebase-functions/logger");

setGlobalOptions({ maxInstances: 10 });

const Sib = require("sib-api-v3-sdk");

const africastalking = require("africastalking")({
  apiKey: functions.config().at.key,
  username: functions.config().at.username,
});

// Initialize Brevo API
const client = Sib.ApiClient.instance;
client.authentications["api-key"].apiKey = functions.config().brevo.key;
const emailApi = new Sib.TransactionalEmailsApi();

// Initialize SMS
const sms = africastalking.SMS;


//  Firestore Trigger:

exports.onNewOrder = functions.firestore
  .document("orders/{orderId}")
  .onCreate(async (snap, context) => {
    const order = snap.data();
    const {
      customerName,
      customerEmail,
      customerPhone,
      items,
      total,
      orderNumber,
    } = order;

    logger.info("📦 New order received:", {
      orderId: context.params.orderId,
      orderNumber,
      customerEmail,
    });

    if (!customerEmail || !customerName) {
      logger.error("❌ Missing required customer information");
      return;
    }

    const itemsList = items.map(
      (item) =>
        `${item.name} x${item.quantity} - KES ${(item.price * item.quantity).toLocaleString()}`
    );

    try {
      await emailApi.sendTransacEmail({
        sender: {
          email: functions.config().sender.email,
          name: "Tari Electra",
        },
        to: [{ email: customerEmail }],
        subject: `Order Confirmation - ${orderNumber}`,
        htmlContent: `
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
                <h1>⚡ Order Confirmed!</h1>
              </div>
              <div class="content">
                <h2>Hello ${customerName},</h2>
                <p>Thank you for your order! We've received it and will process it soon.</p>
                
                <div class="order-details">
                  <h3>Order #${orderNumber}</h3>
                  <p><strong>Date:</strong> ${new Date().toLocaleDateString("en-KE", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}</p>
                  
                  <h4>Order Items:</h4>
                  ${itemsList
                    .map((item) => `<div class="item">${item}</div>`)
                    .join("")}
                  
                  <div class="total">
                    <p>Total: KES ${total.toLocaleString("en-KE")}</p>
                  </div>
                </div>
                
                <p>We'll keep you updated on your order status. If you have any questions, 
                   feel free to reach out to us.</p>
                
                <div class="footer">
                  <p>Thank you for choosing Tari Electra!</p>
                  <p>This is an automated email. Please do not reply directly to this message.</p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `,
      });

      logger.info("✅ Customer email sent successfully");

      await emailApi.sendTransacEmail({
        sender: {
          email: functions.config().sender.email,
          name: "Order System",
        },
        to: [{ email: functions.config().admin.email }],
        subject: `🔔 New Order: ${orderNumber}`,
        htmlContent: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #1f2937; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
              .info-box { background: white; padding: 15px; border-left: 4px solid #2563eb; margin: 10px 0; }
              .item { padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
              .total { font-size: 1.3em; font-weight: bold; color: #dc2626; margin-top: 15px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>📦 New Order Received</h1>
              </div>
              <div class="content">
                <h2>Order #${orderNumber}</h2>
                
                <div class="info-box">
                  <h3>Customer Information</h3>
                  <p><strong>Name:</strong> ${customerName}</p>
                  <p><strong>Email:</strong> ${customerEmail}</p>
                  <p><strong>Phone:</strong> ${customerPhone || "Not provided"}</p>
                </div>
                
                <div class="info-box">
                  <h3>Order Details</h3>
                  <p><strong>Order Date:</strong> ${new Date().toLocaleString("en-KE")}</p>
                  <p><strong>Items:</strong></p>
                  ${itemsList
                    .map((item) => `<div class="item">${item}</div>`)
                    .join("")}
                  <div class="total">Total: KES ${total.toLocaleString("en-KE")}</div>
                </div>
                
                <p><strong>Action Required:</strong> Please process this order in the admin dashboard.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      });

      logger.info("✅ Admin email sent successfully");

      if (customerPhone && customerPhone.trim() !== "") {
        let formattedPhone = customerPhone.trim();
        if (formattedPhone.startsWith("0")) {
          formattedPhone = "+254" + formattedPhone.substring(1);
        } else if (!formattedPhone.startsWith("+")) {
          formattedPhone = "+254" + formattedPhone;
        }

        const smsMessage = `Hi ${customerName}, your order #${orderNumber} of KES ${total.toLocaleString(
          "en-KE"
        )} has been received at Tari Electra. We'll contact you soon. Thank you!`;

        await sms.send({
          to: [formattedPhone],
          message: smsMessage,
          from: "TARI", 
        });

        logger.info("✅ SMS sent successfully to", formattedPhone);
      } else {
        logger.warn("⚠️ No phone number provided, skipping SMS");
      }

      logger.info(
        "✅ All notifications sent successfully for order:",
        orderNumber
      );
    } catch (err) {
      logger.error("❌ Error sending notifications:", err);
      // Don't throw - we don't want to retry failed notifications indefinitely
    }
  });
