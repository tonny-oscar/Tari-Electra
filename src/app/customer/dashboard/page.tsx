'use client';

import dynamic from 'next/dynamic';

const CustomerDashboard = dynamic(() => import('@/components/dashboard/CustomerDashboard'), {
  ssr: false,
});

export default function CustomerDashboardPage() {
  return <CustomerDashboard />;
}
