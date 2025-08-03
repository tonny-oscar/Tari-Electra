'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getUserCart } from '@/lib/cartHelpers';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CartPage() {
  const { user } = useAuth();
  const [cart, setCart] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (user) {
      getUserCart(user.uid).then((items) => {
        setCart(items || []);
        const totalCost = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
        setTotal(totalCost);
      });
    }
  }, [user]);

  if (!user) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Login Required</h2>
        <p className="text-gray-600 mb-6">Please log in to view your cart</p>
        <Link href="/login">
          <Button className="w-full">Login Now</Button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6">
          <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Shopping Cart</h1>
          
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15.5M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">Your cart is empty</p>
              <Link href="/products">
                <Button className="mt-4">Continue Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="bg-gradient-to-r from-white to-blue-50/50 rounded-xl p-4 shadow-sm border border-blue-100/50 hover:shadow-md transition-all duration-200">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Qty: {item.quantity}</span>
                        <span className="text-sm text-gray-600">KES {item.price} each</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-600">KES {item.price * item.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}

              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mt-6 border-2 border-green-200/50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-semibold text-gray-700">Total Amount:</span>
                  <span className="text-3xl font-bold text-green-600">KES {total}</span>
                </div>
                <Link href="/checkout">
                  <Button className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-300">
                    Proceed to Checkout →
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
