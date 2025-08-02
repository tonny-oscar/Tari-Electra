import { Metadata } from 'next';
import SubmeterApplicationsTable from '@/components/admin/SubmeterApplicationsTable';

export const metadata: Metadata = {
  title: 'Sub-Meter Application Forms | Admin Dashboard',
  description: 'Manage sub-meter application forms',
};

export default function SubmeterRequestsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Sub-Meter Application Forms</h1>
      <SubmeterApplicationsTable />
    </div>
  );
}
