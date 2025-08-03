import { StockManagement } from '@/components/admin/StockManagement';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Stock Management - Admin',
  description: 'Manage product inventory and stock levels.',
};

export default function StockManagementPage() {
  return <StockManagement />;
}