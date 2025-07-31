import { Metadata } from 'next';
import SubmeterApplicationForm from '@/components/customer/SubmeterApplicationForm';

export const metadata: Metadata = {
  title: 'Sub-Meter Application Form | Tari Electra',
  description: 'Apply for prepaid sub-meters and services',
};

export default function SubmeterFormPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Application for Prepaid Sub-Meters & Services</h1>
      <SubmeterApplicationForm />
    </div>
  );
}
