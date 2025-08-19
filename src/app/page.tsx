'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function HomePage() {
  const { user, loading, isAdmin, isCustomer } = useAuth();

  // Loading spinner while auth state is being determined
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  // Landing page for everyone
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Tari Electra</h1>
      <p className="mb-6 text-lg text-gray-600">
        Your trusted sub-metering solution.
      </p>

      {/* CTA buttons */}
      <div className="flex gap-4 mt-4">
        <Link
          href="/products"
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          Explore Products
        </Link>

        {!user && (
          <Link
            href="/signup"
            className="px-4 py-2 bg-secondary text-white rounded hover:bg-secondary/90"
          >
            Get Started
          </Link>
        )}
      </div>

      {/* If logged in, show dashboard shortcut */}
      {user && (
        <div className="mt-6">
          {isAdmin && (
            <Link
              href="/admin"
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
            >
              Go to Admin Dashboard
            </Link>
          )}
          {isCustomer && (
            <Link
              href="/customer/dashboard"
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
            >
              Go to My Dashboard
            </Link>
          )}
        </div>
      )}
    </main>
  );
}
