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

  if (!user) return <p className="p-4">Please log in to view your cart.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold">Ksh {item.price * item.quantity}</p>
            </div>
          ))}

          <div className="mt-6 flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>Ksh {total}</span>
          </div>

          <Link href="/checkout">
            <Button className="mt-4 w-full">Proceed to Checkout</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
