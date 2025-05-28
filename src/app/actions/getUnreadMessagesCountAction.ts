
'use server';

import { getUnreadMessagesCount } from '@/data/contactMessages';

export async function getUnreadMessagesCountAction(): Promise<number> {
  try {
    // console.log('[getUnreadMessagesCountAction] Fetching unread messages count.');
    const count = getUnreadMessagesCount();
    // console.log('[getUnreadMessagesCountAction] Unread count:', count);
    return count;
  } catch (error) {
    console.error("[getUnreadMessagesCountAction] Error fetching unread messages count:", error);
    return 0; // Return 0 on error to prevent breaking the UI
  }
}
