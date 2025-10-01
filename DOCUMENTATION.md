# Tari-Electra Website Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Features](#features)
5. [Authentication System](#authentication-system)
6. [Database Schema](#database-schema)
7. [Admin Panel](#admin-panel)
8. [Customer Dashboard](#customer-dashboard)
9. [API Routes](#api-routes)
10. [Deployment](#deployment)
11. [Configuration](#configuration)
12. [Troubleshooting](#troubleshooting)

---

## Project Overview

**Tari-Electra** is a comprehensive e-commerce platform specializing in electrical meters and energy solutions. The platform provides a complete business solution with customer-facing features, admin management tools, and automated business processes.

### Key Capabilities
- **E-commerce Platform**: Product catalog, shopping cart, order management
- **User Management**: Customer and reseller registration with role-based access
- **Admin Dashboard**: Complete business management interface
- **Blog System**: Content management with subscription features
- **Submeter Applications**: Specialized application processing system
- **Stock Management**: Automated inventory tracking with alerts
- **Communication**: Email and SMS notifications
- **Responsive Design**: Mobile-first approach with dark/light themes

---

## Technology Stack

### Frontend
- **Framework**: Next.js 15.2.3 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Icons**: Lucide React
- **State Management**: React Context API
- **Forms**: React Hook Form with Zod validation

### Backend
- **Runtime**: Node.js
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **File Storage**: Firebase Storage
- **Email Service**: Resend API
- **SMS Service**: Twilio API
- **PDF Generation**: jsPDF

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint
- **Code Formatting**: Prettier
- **Version Control**: Git
- **Deployment**: Vercel

---

## Project Structure

```
Tari-Electra/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/             # Admin panel pages
│   │   ├── blog/              # Blog pages
│   │   ├── customer/          # Customer dashboard
│   │   ├── api/               # API routes
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable components
│   │   ├── admin/             # Admin-specific components
│   │   ├── auth/              # Authentication components
│   │   ├── cart/              # Shopping cart components
│   │   ├── dashboard/         # Dashboard components
│   │   ├── layout/            # Layout components
│   │   ├── sections/          # Page sections
│   │   └── ui/                # UI components (Shadcn)
│   ├── context/               # React contexts
│   ├── data/                  # Data access layer
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility libraries
│   │   ├── firebase/          # Firebase configuration
│   │   └── types.ts           # TypeScript type definitions
│   └── utils/                 # Utility functions
├── public/                    # Static assets
├── firestore.rules           # Firestore security rules
├── firestore.indexes.json    # Firestore indexes
└── package.json              # Dependencies and scripts
```

---

## Features

### 1. Homepage
- **Hero Section**: Company introduction with call-to-action
- **Problem & Solution**: Business value proposition
- **Product Categories**: Water Meter and Energy Meter sections
- **Why Choose Tari**: Company advantages
- **Contact Information**: Business details and location

### 2. Product Catalog
- **Category Filtering**: Water Meter, Energy Meter
- **Search Functionality**: Real-time product search
- **Product Details**: Specifications, pricing, stock status
- **Shopping Cart**: Add to cart with quantity management
- **Responsive Grid**: Mobile-optimized product display

### 3. Blog System
- **Content Management**: Admin can create, edit, delete posts
- **Public Blog**: Customer-facing blog with categories
- **Subscription**: Email subscription for blog updates
- **SEO Optimized**: Meta tags and sitemap generation

### 4. User Authentication
- **Customer Registration**: Email/password with profile setup
- **Reseller Registration**: Extended form with business details
- **Admin Access**: Role-based authentication
- **Password Reset**: Firebase Auth integration
- **Profile Management**: User profile updates

### 5. Shopping & Orders
- **Shopping Cart**: Persistent cart with quantity controls
- **Order Placement**: Automated order processing
- **Order Tracking**: Multi-stage order status tracking
- **Stock Management**: Real-time inventory updates
- **Email/SMS Notifications**: Order confirmations and updates

### 6. Submeter Applications
- **Application Form**: Comprehensive submeter application
- **Document Upload**: File attachment support
- **Status Tracking**: Application progress monitoring
- **Admin Review**: Application approval/rejection workflow

---

## Authentication System

### User Roles
1. **Customer**: Standard users who can browse, shop, and place orders
2. **Reseller**: Business users with extended registration requirements
3. **Admin**: Full system access for management

### Authentication Flow
```typescript
// Customer Registration
interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'customer';
  createdAt: string;
}

// Reseller Registration
interface ResellerData extends CustomerData {
  role: 'reseller';
  businessName: string;
  businessType: string;
  businessAddress: string;
  taxId?: string;
  yearsInBusiness: string;
}
```

### Protected Routes
- `/admin/*` - Admin only
- `/customer/dashboard` - Authenticated customers
- `/checkout` - Authenticated users

---

## Database Schema

### Collections

#### 1. customers
```typescript
{
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'customer' | 'reseller';
  profile?: {
    address?: string;
    city?: string;
    country?: string;
  };
  createdAt: string;
}
```

#### 2. products / customerProducts / homepageProducts
```typescript
{
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory?: string;
  imageUrl?: string;
  features: string[];
  specifications: Record<string, string>;
  stock: number;
  rating: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt?: string;
}
```

#### 3. orders
```typescript
{
  id: string;
  orderNumber: string;
  customerId: string;
  customerEmail: string;
  customerName?: string;
  customerPhone?: string;
  items: CartItem[];
  total: number;
  status: number; // 1: Placed, 3: Shipped, 4: Delivered
  createdAt: string;
  trackingNumber?: string;
  estimatedDelivery: string;
}
```

#### 4. blogPosts
```typescript
{
  slug: string;
  title: string;
  date: string | Timestamp;
  excerpt: string;
  imageUrl?: string;
  author: string;
  category: string;
  content: string;
}
```

#### 5. submeterApplications
```typescript
{
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  propertyType: 'residential' | 'commercial' | 'industrial';
  applicationType: 'new' | 'transfer' | 'upgrade';
  status: 'pending' | 'approved' | 'rejected';
  submissionDate: string | Timestamp;
  documents: SubmeterDocument[];
}
```

#### 6. contactMessages
```typescript
{
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  receivedAt: string | Timestamp;
  isRead: boolean;
}
```

#### 7. notifications
```typescript
{
  type: 'low_stock' | 'out_of_stock' | 'new_order' | 'new_application';
  message: string;
  createdAt: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}
```

---

## Admin Panel

### Dashboard Overview
- **Statistics Cards**: Orders, revenue, customers, products
- **Recent Activity**: Latest orders and applications
- **Quick Actions**: Common admin tasks
- **Notifications**: System alerts and updates

### Product Management
- **Create Products**: Add new products with specifications
- **Edit Products**: Update existing product information
- **Stock Management**: Track and update inventory levels
- **Category Management**: Organize products by categories

### Order Management
- **Order List**: View all customer orders
- **Order Details**: Complete order information
- **Status Updates**: Change order status and tracking
- **Customer Information**: Access customer details

### Blog Management
- **Create Posts**: Rich text editor for blog content
- **Edit Posts**: Update existing blog posts
- **Delete Posts**: Remove blog posts
- **Category Management**: Organize blog content

### User Management
- **Customer List**: View all registered customers
- **Reseller Applications**: Review and approve resellers
- **User Details**: Access user profiles and activity

### Communication
- **Contact Messages**: View and respond to inquiries
- **Email Notifications**: Automated email system
- **SMS Notifications**: Order and status updates

### Reports & Analytics
- **Sales Reports**: Revenue and order analytics
- **Stock Reports**: Inventory levels and alerts
- **User Analytics**: Customer behavior insights

---

## Customer Dashboard

### Dashboard Overview
- **Order Summary**: Recent orders and status
- **Quick Stats**: Total orders, cart items, spending
- **Featured Products**: Recommended items
- **Account Information**: Profile summary

### Product Browsing
- **Category Filters**: Water Meter, Energy Meter
- **Search & Sort**: Find products quickly
- **Product Details**: Specifications and pricing
- **Add to Cart**: Shopping cart management

### Shopping Cart
- **Item Management**: Add, remove, update quantities
- **Price Calculation**: Subtotal, tax, total
- **Checkout Process**: Order placement
- **Stock Validation**: Real-time availability check

### Order Tracking
- **Order History**: All past orders
- **Order Status**: Real-time tracking updates
- **Order Details**: Item breakdown and pricing
- **Tracking Numbers**: Shipment tracking

### Submeter Applications
- **Application Form**: Complete submeter requests
- **Document Upload**: Attach required files
- **Application Status**: Track approval progress
- **History**: Previous applications

### Profile Management
- **Personal Information**: Update contact details
- **Address Management**: Shipping addresses
- **Password Change**: Security settings
- **Account Statistics**: Usage metrics

---

## API Routes

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (admin)
- `PUT /api/products/[id]` - Update product (admin)
- `DELETE /api/products/[id]` - Delete product (admin)

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `PUT /api/orders/[id]` - Update order status (admin)

### Blog
- `GET /api/blog` - Get all blog posts
- `POST /api/blog` - Create blog post (admin)
- `PUT /api/blog/[slug]` - Update blog post (admin)
- `DELETE /api/blog/[slug]` - Delete blog post (admin)

### Communication
- `POST /api/send-email` - Send email notifications
- `POST /api/send-sms` - Send SMS notifications
- `POST /api/contact` - Submit contact form

### Utilities
- `GET /api/sitemap.xml` - Generate sitemap
- `GET /api/health` - Health check endpoint

---

## Deployment

### Vercel Deployment
1. **Repository Setup**: Connect GitHub repository to Vercel
2. **Environment Variables**: Configure production environment
3. **Build Settings**: Next.js build configuration
4. **Domain Setup**: Custom domain configuration

### Environment Variables
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Email Service (Resend)
RESEND_API_KEY=your_resend_api_key

# SMS Service (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_phone

# Payment (Paystack)
NEXT_PUBLIC_PAYSTACK_KEY=your_paystack_key
```

### Build Process
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start production server
npm start
```

### Firebase Setup
1. **Project Creation**: Create Firebase project
2. **Authentication**: Enable email/password auth
3. **Firestore**: Set up database with security rules
4. **Storage**: Configure file storage
5. **Indexes**: Deploy Firestore indexes

---

## Configuration

### Firebase Configuration
```typescript
// lib/firebase/client.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /customers/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Products are readable by all, writable by admin
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/customers/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Orders are readable by owner and admin
    match /orders/{orderId} {
      allow read: if request.auth != null && 
        (resource.data.customerId == request.auth.uid || 
         get(/databases/$(database)/documents/customers/$(request.auth.uid)).data.role == 'admin');
      allow write: if request.auth != null;
    }
  }
}
```

### Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
    },
  },
  plugins: [],
}
```

---

## Troubleshooting

### Common Issues

#### 1. Build Errors
**Problem**: TypeScript compilation errors
**Solution**: 
- Check type definitions in `lib/types.ts`
- Ensure proper imports and exports
- Verify Firebase configuration

#### 2. Authentication Issues
**Problem**: Users cannot log in
**Solution**:
- Verify Firebase Auth configuration
- Check environment variables
- Ensure proper security rules

#### 3. Database Connection
**Problem**: Firestore connection fails
**Solution**:
- Verify Firebase project configuration
- Check network connectivity
- Validate security rules

#### 4. Email/SMS Not Working
**Problem**: Notifications not sending
**Solution**:
- Verify API keys (Resend, Twilio)
- Check API rate limits
- Validate phone number formats

#### 5. Performance Issues
**Problem**: Slow page loading
**Solution**:
- Optimize images and assets
- Implement proper caching
- Use React.memo for components
- Optimize Firestore queries

### Debug Commands
```bash
# Check build locally
npm run build

# Run development server
npm run dev

# Check linting issues
npm run lint

# Type checking
npx tsc --noEmit
```

### Monitoring
- **Vercel Analytics**: Performance monitoring
- **Firebase Console**: Database and auth monitoring
- **Error Tracking**: Console logs and error boundaries
- **User Feedback**: Contact form and support system

---

## Maintenance

### Regular Tasks
1. **Security Updates**: Keep dependencies updated
2. **Database Cleanup**: Remove old data and optimize queries
3. **Performance Monitoring**: Track page load times and user experience
4. **Backup Strategy**: Regular database backups
5. **Content Updates**: Keep blog and product information current

### Scaling Considerations
- **Database Optimization**: Index optimization and query performance
- **CDN Implementation**: Static asset delivery
- **Caching Strategy**: Redis or similar for session management
- **Load Balancing**: Multiple server instances
- **Monitoring**: Application performance monitoring (APM)

---

## Support & Contact

For technical support or questions about this documentation:

- **Email**: support@tari-electra.com
- **Phone**: +254 123 456 789
- **Address**: Nairobi, Kenya

---

*This documentation was last updated on: December 2024*
*Version: 1.0.0*