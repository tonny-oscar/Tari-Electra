
import { CreateProductForm } from '@/components/admin/CreateProductForm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { getCustomerProduct } from '@/data/customerProducts';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: EditProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getCustomerProduct(id);
  if (!product) {
    return {
      title: 'Product Not Found - Admin Edit',
    };
  }
  return {
    title: `Edit Customer Product: ${product.name} - Admin`,
    description: `Edit the customer product titled "${product.name}".`,
  };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const productToEdit = await getCustomerProduct(id);

  if (!productToEdit) {
    notFound();
  }

  // Convert Firestore timestamps to plain objects
  const serializedProduct = {
    ...productToEdit,
    createdAt: productToEdit.createdAt?.toDate?.() || productToEdit.createdAt,
    updatedAt: productToEdit.updatedAt?.toDate?.() || productToEdit.updatedAt,
  };

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
            <CardTitle className="text-2xl">Edit Customer Product</CardTitle>
          </div>
          <CardDescription>Modify the details for this product or service. Changes will be saved to customerProducts collection.</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateProductForm 
            mode="edit" 
            initialData={serializedProduct} 
            currentId={productToEdit.id} 
          />
        </CardContent>
      </Card>
    </div>
  );
}
