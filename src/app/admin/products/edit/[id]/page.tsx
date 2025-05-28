
import { CreateProductForm } from '@/components/admin/CreateProductForm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { findProduct } from '@/data/products';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

type EditProductPageProps = {
  params: { id: string };
};

export async function generateMetadata({ params }: EditProductPageProps): Promise<Metadata> {
  const product = findProduct(params.id);
  if (!product) {
    return {
      title: 'Product Not Found - Admin Edit',
    };
  }
  return {
    title: `Edit: ${product.name} - Admin`,
    description: `Edit the product titled "${product.name}".`,
  };
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const productToEdit = findProduct(params.id);

  if (!productToEdit) {
    notFound();
  }

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
            <Edit className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Edit Product</CardTitle>
          </div>
          <CardDescription>Modify the details for this product or service. Changes are in-memory for this prototype.</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateProductForm 
            mode="edit" 
            initialData={productToEdit} 
            currentId={productToEdit.id} 
          />
        </CardContent>
      </Card>
    </div>
  );
}
