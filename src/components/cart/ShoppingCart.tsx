'use client';

import { useCart } from '@/context/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Minus, Plus, X, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createOrder } from '@/lib/firebase/store';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { useToast } from '@/hooks/use-toast';

export function ShoppingCart() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handlePlaceOrder = async () => {
    if (!user || cartItems.length === 0) return;
    
    setIsPlacingOrder(true);
    try {
      // Get customer profile for phone number
      const customerDoc = await getDoc(doc(db, 'customers', user.uid));
      const customerData = customerDoc.data();
      
      const orderData = {
        customerId: user.uid,
        customerEmail: user.email || '',
        customerName: user.displayName || customerData?.profile?.fullName || 'Customer',
        customerPhone: customerData?.profile?.phone || '',
        items: cartItems.map(item => ({
          ...item,
          image: item.image || item.imageUrl || '',
          status: 'active' as const,
          createdAt: new Date().toISOString()
        })),
        total: cartTotal,
        status: 1,
        createdAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      };
      
      const { orderId, orderNumber } = await createOrder(orderData);
      
      // Clear cart after successful order
      clearCart();
      
      toast({
        title: 'Order Placed Successfully! 🎉',
        description: `Order ${orderNumber} has been created.`,
      });
      
      // Redirect to success page
      router.push(`/order-success?orderNumber=${orderNumber}`);
      
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: 'Order Failed',
        description: 'Failed to place order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

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
      <div className="bg-white rounded-lg shadow-sm border p-6 sm:p-8 text-center">
        <ShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
        <p className="text-sm sm:text-base text-gray-500 mb-4">Add some products to get started</p>
        <Link href="/products">
          <Button className="w-full sm:w-auto">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 border-b">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Shopping Cart</h2>
        <p className="text-sm text-gray-600">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</p>
      </div>

      {/* Cart Items */}
      <div className="divide-y">
        {cartItems.map((item) => (
          <div key={item.id} className="p-4 sm:p-6">
            <div className="flex gap-3 sm:gap-4">
              {/* Product Image */}
              <div className="flex-shrink-0">
                <Image
                  src={item.image || item.imageUrl || '/placeholder-product.jpg'}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="w-20 h-20 sm:w-28 sm:h-28 rounded-lg object-cover border"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm sm:text-base font-medium text-gray-900 line-clamp-2 pr-2">
                    {item.name}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-400 hover:text-red-500 p-1 flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Key Specs - Hidden on very small screens */}
                <div className="hidden xs:block text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 space-y-0.5 sm:space-y-1">
                  {item.category && (
                    <p><span className="font-medium">Category:</span> {item.category}</p>
                  )}
                  {item.rating && (
                    <p><span className="font-medium">Rating:</span> ⭐ {item.rating}/5</p>
                  )}
                  <p><span className="font-medium">Stock:</span> {item.stock > 0 ? `${item.stock} available` : 'Out of stock'}</p>
                </div>

                {/* Mobile: Stack Price and Quantity */}
                <div className="sm:hidden space-y-2">
                  {/* Price */}
                  <div>
                    <p className="text-base font-semibold text-gray-900">
                      KES {(item.price * item.quantity).toLocaleString()}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-xs text-gray-500">
                        KES {item.price.toLocaleString()} each
                      </p>
                    )}
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center border rounded-md w-fit">
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
                </div>

                {/* Desktop: Price and Quantity Row */}
                <div className="hidden sm:flex items-center justify-between">
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
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t">
        <div className="flex justify-between items-center mb-4">
          <span className="text-base sm:text-lg font-medium text-gray-900">Subtotal:</span>
          <span className="text-xl sm:text-2xl font-bold text-gray-900">
            KES {cartTotal.toLocaleString()}
          </span>
        </div>
        
        <div className="space-y-2 sm:space-y-3">
          {/* Desktop: Side by side buttons */}
          <div className="hidden sm:flex gap-3">
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

          {/* Mobile: Stacked buttons */}
          <div className="flex sm:hidden flex-col gap-2">
            <Link href="/checkout" className="w-full">
              <Button className="w-full bg-orange-500 hover:bg-orange-600">
                Proceed to Checkout
              </Button>
            </Link>
            <Link href="/products" className="w-full">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>

          {/* Place Order Button - Full width on all screens */}
          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3"
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder}
          >
            {isPlacingOrder ? '⏳ Placing Order...' : '🛒 Place Order Now'}
          </Button>
        </div>
      </div>
    </div>
  );
}