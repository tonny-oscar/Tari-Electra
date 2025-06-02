
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
import { deleteBlogAction, type DeleteBlogFormState } from '@/app/actions/deleteBlogAction';
import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

type BlogActionsCellProps = {
  slug: string;
  title: string;
};

export function BlogActionsCell({ slug, title }: BlogActionsCellProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setError(null);
    startTransition(async () => {
      const result: DeleteBlogFormState = await deleteBlogAction(slug);
      if (result.isSuccess) {
        toast({
          title: 'Success!',
          description: result.message,
        });
        router.refresh(); // Re-fetches data for the current route
      } else {
        setError(result.message);
        toast({
          title: 'Error Deleting Post',
          description: result.message,
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <div className="flex items-center gap-2 justify-end">
      <Button variant="outline" size="sm" asChild className="flex-1">
        <Link href={`/admin/blog/edit/${slug}`}>
          <Edit className="mr-2 h-4 w-4" /> Edit
        </Link>
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive-foreground hover:bg-destructive/90 border-destructive/50 flex-1">
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the blog post titled &quot;{title}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {error && (
            <div className="text-sm text-destructive flex items-center gap-2">
                <AlertCircle className="h-4 w-4" /> {error}
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isPending} className="bg-destructive hover:bg-destructive/90">
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Yes, delete post"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}






