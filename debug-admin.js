// Debug script to check admin configuration
console.log('Environment variable:', process.env.NEXT_PUBLIC_ADMIN_EMAIL);
console.log('Split emails:', (process.env.NEXT_PUBLIC_ADMIN_EMAIL || '').split(',').map(email => email.trim()));

// Test email matching
const testEmail = 'morgan.rotich@tarielectra.africa';
const adminEmails = 'betttonny26@gmail.com,morgan.rotich@tarielectra.africa'.split(',').map(email => email.trim());
console.log('Test email:', testEmail);
console.log('Admin emails:', adminEmails);
console.log('Is admin?', adminEmails.includes(testEmail));