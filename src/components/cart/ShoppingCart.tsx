'use client';

import { useCart } from '@/context/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Minus, Plus, X, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function ShoppingCart() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (cartItems.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
        <p className="text-gray-500 mb-4">Add some products to get started</p>
        <Link href="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="px-6 py-4 border-b">
        <h2 className="text-xl font-semibold text-gray-900">Shopping Cart</h2>
        <p className="text-sm text-gray-600">{cartItems.length} items</p>
      </div>

      {/* Cart Items */}
      <div className="divide-y">
        {cartItems.map((item) => (
          <div key={item.id} className="p-6 flex gap-4">
            {/* Product Image */}
            <div className="flex-shrink-0">
              <Image
                src={item.image || '/placeholder-product.jpg'}
                alt={item.name}
                width={120}
                height={120}
                className="rounded-lg object-cover border"
              />
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium text-gray-900 line-clamp-2">
                  {item.name}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFromCart(item.id)}
                  className="text-gray-400 hover:text-red-500 p-1"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Key Specs */}
              <div className="text-sm text-gray-600 mb-3 space-y-1">
                {item.category && (
                  <p><span className="font-medium">Category:</span> {item.category}</p>
                )}
                {item.rating && (
                  <p><span className="font-medium">Rating:</span> ⭐ {item.rating}/5</p>
                )}
                <p><span className="font-medium">Stock:</span> {item.stock > 0 ? `${item.stock} available` : 'Out of stock'}</p>
              </div>

              {/* Price and Quantity Row */}
              <div className="flex items-center justify-between">
                {/* Quantity Selector */}
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="px-3 py-1 text-sm font-medium min-w-[40px] text-center">
                    {item.quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>

                {/* Price */}
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">
                    KES {(item.price * item.quantity).toLocaleString()}
                  </p>
                  {item.quantity > 1 && (
                    <p className="text-sm text-gray-500">
                      KES {item.price.toLocaleString()} each
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <div className="px-6 py-4 bg-gray-50 border-t">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-medium text-gray-900">Subtotal:</span>
          <span className="text-2xl font-bold text-gray-900">
            KES {cartTotal.toLocaleString()}
          </span>
        </div>
        
        <div className="flex gap-3">
          <Link href="/products" className="flex-1">
            <Button variant="outline" className="w-full">
              Continue Shopping
            </Button>
          </Link>
          <Link href="/checkout" className="flex-1">
            <Button className="w-full bg-orange-500 hover:bg-orange-600">
              Proceed to Checkout
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}