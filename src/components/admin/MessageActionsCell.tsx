
'use client';

import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Trash2, Loader2, AlertCircle } from 'lucide-react';
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
import { markMessageReadAction, deleteMessageAction } from '@/app/actions/messageActions';
import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { ContactMessageActionState } from '@/lib/types';

type MessageActionsCellProps = {
  messageId: string;
  isCurrentlyRead: boolean;
  messageFromName: string;
};

export function MessageActionsCell({ messageId, isCurrentlyRead, messageFromName }: MessageActionsCellProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isReadPending, startReadTransition] = useTransition();
  const [isDeletePending, startDeleteTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleToggleReadStatus = async () => {
    setError(null);
    startReadTransition(async () => {
      const result: ContactMessageActionState = await markMessageReadAction(messageId, !isCurrentlyRead);
      if (result.isSuccess) {
        toast({
          title: 'Success!',
          description: result.message,
        });
        router.refresh(); // Re-fetches data for the current route
      } else {
        setError(result.message);
        toast({
          title: 'Error Updating Message',
          description: result.message,
          variant: 'destructive',
        });
      }
    });
  };

  const handleDelete = async () => {
    setError(null);
    startDeleteTransition(async () => {
      const result: ContactMessageActionState = await deleteMessageAction(messageId);
      if (result.isSuccess) {
        toast({
          title: 'Success!',
          description: result.message,
        });
        router.refresh();
      } else {
        setError(result.message);
        toast({
          title: 'Error Deleting Message',
          description: result.message,
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <div className="flex items-center gap-2 justify-end">
      <Button
        variant="outline"
        size="sm"
        onClick={handleToggleReadStatus}
        disabled={isReadPending || isDeletePending}
        className="flex-1"
      >
        {isReadPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : isCurrentlyRead ? (
          <EyeOff className="mr-2 h-4 w-4" />
        ) : (
          <Eye className="mr-2 h-4 w-4" />
        )}
        {isCurrentlyRead ? 'Mark Unread' : 'Mark Read'}
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={isReadPending || isDeletePending}
            className="text-destructive hover:text-destructive-foreground hover:bg-destructive/90 border-destructive/50 flex-1"
          >
            {isDeletePending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the message from &quot;{messageFromName}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {error && (
            <div className="text-sm text-destructive flex items-center gap-2">
              <AlertCircle className="h-4 w-4" /> {error}
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletePending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeletePending}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeletePending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Yes, delete message"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
