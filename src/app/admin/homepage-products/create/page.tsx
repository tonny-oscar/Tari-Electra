import { CreateProductForm } from '@/components/admin/CreateProductForm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Homepage Product - Admin',
  description: 'Create a new product for the homepage.',
};

export default function CreateHomepageProductPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-start mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/homepage-products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Homepage Products
          </Link>
        </Button>
      </div>
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Plus className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Create Homepage Product</CardTitle>
          </div>
          <CardDescription>Add a new product to display on the public homepage (products collection).</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateProductForm 
            mode="create" 
            isHomepageProduct={true}
          />
        </CardContent>
      </Card>
    </div>
  );
}
