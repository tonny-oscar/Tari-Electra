'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600">Thank you for your purchase</p>
        </div>

        {orderNumber && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">Order Number</p>
            <p className="text-lg font-semibold text-gray-900">{orderNumber}</p>
          </div>
        )}

        <div className="space-y-4 mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <Package className="w-4 h-4 mr-2" />
            <span>You will receive email and SMS notifications about your order status</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <ArrowRight className="w-4 h-4 mr-2" />
            <span>Estimated delivery: 5-7 business days</span>
          </div>
        </div>

        <div className="space-y-3">
          <Link href="/customer/dashboard">
            <Button className="w-full">
              View Order Details
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="outline" className="w-full">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}