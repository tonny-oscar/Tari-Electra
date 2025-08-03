'use client';

import { ShoppingCart } from '@/components/cart/ShoppingCart';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function CartPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <ShoppingCart />
        </div>
      </div>
    </ProtectedRoute>
  );
}