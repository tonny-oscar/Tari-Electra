
import { CreateProductForm } from '@/components/admin/CreateProductForm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PackagePlus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create New Product - Admin',
  description: 'Add a new product or service to the Tari Electra catalog.',
};

export default function CreateProductPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-start mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Product List
          </Link>
        </Button>
      </div>
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center gap-3">
            <PackagePlus className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Create New Product</CardTitle>
          </div>
          <CardDescription>Fill in the details for the new product or service. This data is in-memory for the prototype.</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateProductForm mode="create" />
        </CardContent>
      </Card>
    </div>
  );
}
