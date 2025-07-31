import React from 'react';
import { Metadata } from 'next';
import { auth } from '@/lib/firebase/client';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Customer Dashboard | Tari Electra',
  description: 'Manage your electrical services and applications',
};

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
