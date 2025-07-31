'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const CustomerDashboard = dynamic(
  () => import('@/components/dashboard/CustomerDashboard').then(mod => ({ 
    default: function CustomerDashboardWrapper(props: any) {
      return <mod.CustomerDashboard {...props} />;
    }
  })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    ),
  }
);

export default function CustomerDashboardPage() {
  return (
    <Suspense fallback={null}>
      <CustomerDashboard />
    </Suspense>
  );
}
