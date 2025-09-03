import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getProducts } from '@/data/products';
import { PlusCircle, ShoppingBag, Package } from 'lucide-react';
import Image from 'next/image';
import { HomepageProductActionsCell } from '@/components/admin/HomepageProductActionsCell';
import type { Metadata } from 'next';
import type { Product } from '@/lib/types';
import { formatPrice } from '@/lib/formatCurrency';

export const metadata: Metadata = {
  title: 'Homepage Products - Admin',
  description: 'Manage products displayed on the public homepage.',
};

export default async function AdminHomepageProductsPage() {
  const products: Product[] = await getProducts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShoppingBag className="h-7 w-7 text-primary" />
          <div>
            <h1 className="text-2xl font-semibold">Homepage Products</h1>
            <p className="text-muted-foreground">Manage products displayed on the public homepage (products collection)</p>
          </div>
        </div>
        <Button asChild>
          <Link href="/admin/homepage-products/create">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Product
          </Link>
        </Button>
      </div>

      {products.length === 0 ? (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-muted-foreground" /> No Homepage Products Yet
            </CardTitle>
          </CardHeader>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">No homepage products yet. Start by creating one!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <Card key={product.id} className="flex flex-col shadow-md hover:shadow-lg transition-shadow bg-card">
              <div className="aspect-[3/2] w-full relative bg-muted rounded-t-lg overflow-hidden">
                <Image
                  src={product.imageUrl || 'https://placehold.co/600x400.png'}
                  alt={product.name}
                  fill
                  className="object-cover"
                  data-ai-hint={product.imageHint || product.name.split(' ').slice(0,2).join(' ').toLowerCase() || 'product image'}
                />
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold line-clamp-2 leading-tight">{product.name}</CardTitle>
                <CardDescription className="text-xs text-muted-foreground pt-1">
                  <span className="font-medium text-primary">{product.category}</span> • KES {(product.price || 0).toLocaleString('en-KE')}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow pt-0 text-sm">
                <p className="text-muted-foreground line-clamp-3">{product.description}</p>
                {product.features && product.features.length > 0 && (
                  <div className="mt-3">
                    <h4 className="text-xs font-semibold text-foreground mb-1">Features:</h4>
                    <ul className="list-disc list-inside pl-2 space-y-0.5">
                      {product.features.slice(0, 3).map((feature, index) => (
                        <li key={`${feature}-${index}`} className="text-xs text-muted-foreground truncate">
                          {feature}
                        </li>
                      ))}
                      {product.features.length > 3 && <li className="text-xs text-muted-foreground">...and more</li>}
                    </ul>
                  </div>
                )}
              </CardContent>
              <CardFooter className="gap-2 pt-4 items-center border-t mt-auto">
                <HomepageProductActionsCell productId={product.id} productName={product.name} />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}