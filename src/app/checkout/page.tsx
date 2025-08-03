'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getUserCart, clearUserCart } from '@/lib/cartHelpers';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const PaystackButton = dynamic(
  () => import('react-paystack').then((mod) => mod.PaystackButton),
  { ssr: false }
);

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export default function CheckoutPage() {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const PAYSTACK_KEY = process.env.NEXT_PUBLIC_PAYSTACK_KEY || '';

  useEffect(() => {
    async function fetchCart() {
      if (user) {
        const cartData = await getUserCart(user.uid);
        setCart(cartData);
      }
      setLoading(false);
    }
    fetchCart();
  }, [user]);

  if (!user) {
    return <div className="text-center py-20">Please log in to continue.</div>;
  }

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const paystackConfig = {
    email: user.email || 'user@example.com',
    amount: totalAmount * 100, // kobo
    publicKey: PAYSTACK_KEY,
    metadata: {
      custom_fields: [
        {
          display_name: user.email || 'Customer',
          variable_name: 'user_id',
          value: user.uid,
        },
      ],
    },
    onSuccess: async () => {
      alert('Payment Successful!');
      await clearUserCart(user.uid);
      router.push('/thank-you');
    },
    onClose: () => alert('Transaction was not completed'),
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold mb-6">Checkout</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>KES {item.price * item.quantity}</span>
            </div>
          ))}

          <div className="mt-4 border-t pt-4 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>KES {totalAmount}</span>
          </div>

          <PaystackButton
            {...paystackConfig}
            className="bg-primary text-white px-4 py-2 mt-6 rounded-md hover:opacity-90"
          >
            Pay Now
          </PaystackButton>
        </div>
      )}
    </div>
  );
}
