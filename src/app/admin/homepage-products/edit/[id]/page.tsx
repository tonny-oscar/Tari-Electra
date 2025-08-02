import { CreateProductForm } from '@/components/admin/CreateProductForm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { getProduct } from '@/data/products';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

type EditHomepageProductPageProps = {
  params: { id: string };
};

export async function generateMetadata({ params }: EditHomepageProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.id);
  if (!product) {
    return {
      title: 'Product Not Found - Admin Edit',
    };
  }
  return {
    title: `Edit Homepage Product: ${product.name} - Admin`,
    description: `Edit the homepage product titled "${product.name}".`,
  };
}

export default async function EditHomepageProductPage({ params }: EditHomepageProductPageProps) {
  const productToEdit = await getProduct(params.id);

  if (!productToEdit) {
    notFound();
  }

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
            <Edit className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Edit Homepage Product</CardTitle>
          </div>
          <CardDescription>Modify the homepage product details.</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateProductForm 
            mode="edit" 
            initialData={productToEdit} 
            currentId={productToEdit.id}
            isHomepageProduct={true}
          />
        </CardContent>
      </Card>
    </div>
  );
}