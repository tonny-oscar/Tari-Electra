
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Loader2, AlertCircle } from 'lucide-react';
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
import { deleteProductAction, type DeleteProductFormState } from '@/app/actions/deleteProductAction';
import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

type ProductActionsCellProps = {
  productId: string;
  productName: string;
};

export function ProductActionsCell({ productId, productName }: ProductActionsCellProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isDeletePending, startDeleteTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setError(null);
    startDeleteTransition(async () => {
      const result: DeleteProductFormState = await deleteProductAction(productId);
      if (result.isSuccess) {
        toast({
          title: 'Success!',
          description: result.message,
        });
        router.refresh(); // Re-fetches data for the current route
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

  return (
    <div className="flex items-center gap-2 justify-end w-full">
      <Button variant="outline" size="sm" asChild className="flex-1 min-w-[80px]">
        <Link href={`/admin/products/edit/${productId}`}>
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
              This action cannot be undone. This will permanently delete the product titled &quot;{productName}&quot;.
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
  );
}
