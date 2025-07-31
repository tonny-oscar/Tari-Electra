import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customer Dashboard | Tari Electra',
  description: 'Manage your electrical services and applications',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
}
