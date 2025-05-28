
import type { ContactMessage } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

// Initial set of contact messages (can be empty)
const initialMessages: ContactMessage[] = [
  // Example message (can be removed)
  // {
  //   id: uuidv4(),
  //   name: 'John Doe',
  //   email: 'john.doe@example.com',
  //   phone: '123-456-7890',
  //   message: 'I am interested in your sub-metering solutions for my apartment complex. Can you provide more details?',
  //   receivedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
  //   isRead: false,
  // },
  // {
  //   id: uuidv4(),
  //   name: 'Jane Smith',
  //   email: 'jane.smith@example.com',
  //   message: 'What are the installation costs for meter separation?',
  //   receivedAt: new Date().toISOString(), // Today
  //   isRead: true,
  // },
];

let mutableMessages: ContactMessage[] = JSON.parse(JSON.stringify(initialMessages));

export function getContactMessages(): ContactMessage[] {
  // Return sorted by most recent first
  return JSON.parse(JSON.stringify(mutableMessages)).sort(
    (a: ContactMessage, b: ContactMessage) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
  );
}

export function addContactMessage(
  data: Omit<ContactMessage, 'id' | 'receivedAt' | 'isRead'>
): ContactMessage {
  const newMessage: ContactMessage = {
    ...data,
    id: uuidv4(),
    receivedAt: new Date().toISOString(),
    isRead: false,
  };
  mutableMessages.unshift(newMessage); // Add to the beginning for most recent first
  console.log('[addContactMessage] New message added to in-memory store:', newMessage);
  return { ...newMessage };
}

export function findContactMessage(id: string): ContactMessage | undefined {
  const message = mutableMessages.find(m => m.id === id);
  return message ? { ...message } : undefined;
}

export function markMessageAsRead(id: string, isRead: boolean): ContactMessage | null {
  const messageIndex = mutableMessages.findIndex(m => m.id === id);
  if (messageIndex > -1) {
    mutableMessages[messageIndex].isRead = isRead;
    console.log(`[markMessageAsRead] Message ${id} marked as ${isRead ? 'read' : 'unread'}.`);
    return { ...mutableMessages[messageIndex] };
  }
  console.warn(`[markMessageAsRead] Message ${id} not found.`);
  return null;
}

export function deleteContactMessage(id: string): boolean {
  const initialLength = mutableMessages.length;
  mutableMessages = mutableMessages.filter(m => m.id !== id);
  const success = mutableMessages.length < initialLength;
  if (success) {
    console.log(`[deleteContactMessage] Message ${id} deleted.`);
  } else {
    console.warn(`[deleteContactMessage] Message ${id} not found for deletion.`);
  }
  return success;
}

export function getUnreadMessagesCount(): number {
  const count = mutableMessages.filter(msg => !msg.isRead).length;
  // console.log('[getUnreadMessagesCount] Unread count from data source:', count); // Optional: for debugging
  return count;
}
