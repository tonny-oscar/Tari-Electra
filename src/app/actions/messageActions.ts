
'use server';

import {
  markMessageAsRead as markAsReadInData,
  deleteContactMessage as deleteMessageInData,
} from '@/data/contactMessages';
import { revalidatePath } from 'next/cache';
import type { ContactMessageActionState } from '@/lib/types';

export async function markMessageReadAction(
  id: string,
  isRead: boolean
): Promise<ContactMessageActionState> {
  console.log(`[markMessageReadAction] Action invoked for ID: ${id}, Mark as Read: ${isRead}`);
  try {
    const updatedMessage = await markAsReadInData(id, isRead);
    if (updatedMessage) {
      revalidatePath('/admin/messages');
      return {
        message: `Message marked as ${isRead ? 'read' : 'unread'} successfully.`,
        isSuccess: true,
        updatedMessageId: id,
      };
    }
    return {
      message: 'Failed to update message read status. Message not found.',
      isError: true,
    };
  } catch (error) {
    console.error('[markMessageReadAction] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      message: `Error updating message: ${errorMessage}`,
      isError: true,
    };
  }
}

export async function deleteMessageAction(id: string): Promise<ContactMessageActionState> {
  console.log('[deleteMessageAction] Action invoked for ID:', id);
  try {
    const success = await deleteMessageInData(id);
    if (success) {
      revalidatePath('/admin/messages');
      return {
        message: 'Message deleted successfully.',
        isSuccess: true,
      };
    }
    return {
      message: 'Failed to delete message. Message not found.',
      isError: true,
    };
  } catch (error) {
    console.error('[deleteMessageAction] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      message: `Error deleting message: ${errorMessage}`,
      isError: true,
    };
  }
}
