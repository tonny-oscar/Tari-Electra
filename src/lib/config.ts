export const config = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  app: {
    name: 'Tari Electra',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://tari-electra.vercel.app',
    description: 'Professional electrical solutions and sub-metering services',
  },
  
  admin: {
    email: process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'morgan.rotich@tarielectra.africa',
  },
  
  paystack: {
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
    secretKey: process.env.PAYSTACK_SECRET_KEY!,
  },
  
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  },
  
  email: {
    sendgridApiKey: process.env.SENDGRID_API_KEY!,
    fromEmail: 'hello@tari.africa',
    fromName: 'Tari Electra',
  },
  
  sms: {
    twilioAccountSid: process.env.TWILIO_ACCOUNT_SID!,
    twilioAuthToken: process.env.TWILIO_AUTH_TOKEN!,
    twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER!,
  },
};