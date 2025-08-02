'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Loader2, AlertCircle, ShoppingCart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { deleteHomepageProductAction } from '@/app/actions/homepageProductActions';
import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

type HomepageProductActionsCellProps = {
  productId: string;
  productName: string;
};

export function HomepageProductActionsCell({ productId, productName }: HomepageProductActionsCellProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();
  const [isDeletePending, startDeleteTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setError(null);
    startDeleteTransition(async () => {
      const result = await deleteHomepageProductAction(productId);
      if (result.isSuccess) {
        toast({
          title: 'Success!',
          description: result.message,
        });
        router.refresh();
      } else {
        setError(result.message);
        toast({
          title: 'Error Deleting Product',
          description: result.message,
          variant: 'destructive',
        });
      }
    });
  };

  const handleBuyNow = () => {
    if (!user) {
      window.location.href = '/login';
    } else {
      window.location.href = '/contact';
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <Button 
        size="sm" 
        onClick={handleBuyNow}
        className="w-full"
      >
        <ShoppingCart className="mr-2 h-4 w-4" /> Buy Now
      </Button>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" asChild className="flex-1 min-w-[80px]">
          <Link href={`/admin/homepage-products/edit/${productId}`}>
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Link>
        </Button>
        <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive-foreground hover:bg-destructive/90 border-destructive/50 flex-1 min-w-[80px]">
            {isDeletePending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the homepage product titled "{productName}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          {error && (
            <div className="text-sm text-destructive flex items-center gap-2 p-2 bg-destructive/10 rounded-md">
                <AlertCircle className="h-4 w-4" /> {error}
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletePending}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeletePending} className="bg-destructive hover:bg-destructive/90">
              {isDeletePending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Yes, delete product"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
    </div>
  );
}