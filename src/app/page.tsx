'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function HomePage() {
  const { user, isAdmin, isCustomer } = useAuth();

  return (
    <main
      className="
        relative min-h-screen flex items-center justify-center text-center
        bg-black
        bg-[url('/e028f8be-87a9-4864-995b-7138e613c62c.jpeg')]
        bg-no-repeat bg-center bg-contain bg-fixed
      "
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative px-6 max-w-3xl text-white">
        <h1 className="text-4xl sm:text-6xl font-extrabold mb-6 drop-shadow-lg">
          Welcome to <span className="text-primary">Tari Electra</span>
        </h1>
        <p className="mb-8 text-lg sm:text-xl text-gray-200">
          Your trusted <span className="font-semibold">sub-metering</span> solution.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/products"
            className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition shadow-lg"
          >
            Explore Products
          </Link>

          {!user && (
            <Link
              href="/signup"
              className="px-6 py-3 bg-secondary text-white rounded-xl font-medium hover:bg-secondary/90 transition shadow-lg"
            >
              Get Started
            </Link>
          )}
        </div>

        {/* Dashboard shortcuts */}
        {user && (
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            {isAdmin && (
              <Link
                href="/admin"
                className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition shadow-lg"
              >
                Go to Admin Dashboard
              </Link>
            )}
            {isCustomer && (
              <Link
                href="/customer/dashboard"
                className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition shadow-lg"
              >
                Go to My Dashboard
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
