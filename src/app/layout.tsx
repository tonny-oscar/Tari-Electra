// app/layout.tsx
import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import './globals.css';
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/context/CartContext';

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: 'Tari Electra - Empowering Your Property',
  description: 'Meter separation and prepaid sub-metering solutions for landlords and property owners.',
  keywords: 'electrical services, sub-metering, energy management, Kenya, Tari Electra, meter separation',
  authors: [{ name: 'Tari Electra' }],
  creator: 'Tari Electra',
  publisher: 'Tari Electra',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: 'https://tari-electra.vercel.app',
    title: 'Tari Electra - Empowering Your Property',
    description: 'Meter separation and prepaid sub-metering solutions for landlords and property owners.',
    siteName: 'Tari Electra',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tari Electra - Empowering Your Property',
    description: 'Meter separation and prepaid sub-metering solutions for landlords and property owners.',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src="https://js.paystack.co/v1/inline.js"></script>
      </head>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function() {});
                });
              }
            `,
          }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <CartProvider>
              <div className="relative flex min-h-dvh flex-col bg-background">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <Toaster />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
