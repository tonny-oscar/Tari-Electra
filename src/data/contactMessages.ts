
import fs from 'fs';
import path from 'path';
import type { ContactMessage } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

const contactDataPath = path.resolve(process.cwd(), 'src/data/contactData.json');

const initialMessages: ContactMessage[] = []; // Start with no initial messages in the code

function readContactData(): ContactMessage[] {
  try {
    if (fs.existsSync(contactDataPath)) {
      const fileContent = fs.readFileSync(contactDataPath, 'utf-8');
      if (fileContent.trim() === '') {
        // File is empty, write initial (empty array) and return it
        fs.writeFileSync(contactDataPath, JSON.stringify([], null, 2), 'utf-8');
        console.log('[readContactData] Initialized empty contactData.json');
        return [];
      }
      const data = JSON.parse(fileContent);
      if (Array.isArray(data)) {
        return data;
      } else {
        console.warn('[readContactData] contactData.json does not contain a valid array. Initializing with empty array.');
        fs.writeFileSync(contactDataPath, JSON.stringify([], null, 2), 'utf-8');
        return [];
      }
    }
    // File doesn't exist, write initial (empty array) and return it
    fs.writeFileSync(contactDataPath, JSON.stringify([], null, 2), 'utf-8');
    console.log('[readContactData] Created and initialized empty contactData.json');
    return [];
  } catch (error: any) {
    console.error('[readContactData] Error reading or initializing contactData.json:', error.message);
    // Fallback to an empty array in memory and attempt to write it if possible
    try {
      fs.writeFileSync(contactDataPath, JSON.stringify([], null, 2), 'utf-8');
      console.log('[readContactData] Initialized contactData.json with empty array after read error.');
    } catch (writeError: any) {
      console.error('[readContactData] Error writing initial data to contactData.json after read error:', writeError.message);
    }
    return []; // Return empty array in case of any unrecoverable error
  }
}

function writeContactData(data: ContactMessage[]): void {
  try {
    fs.writeFileSync(contactDataPath, JSON.stringify(data, null, 2), 'utf-8');
    console.log('[writeContactData] Successfully wrote to contactData.json');
  } catch (error) {
    console.error('[writeContactData] Error writing to contactData.json:', error);
  }
}

export function getContactMessages(): ContactMessage[] {
  const messages = readContactData();
  return JSON.parse(JSON.stringify(messages)).sort(
    (a: ContactMessage, b: ContactMessage) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
  );
}

export function addContactMessage(
  data: Omit<ContactMessage, 'id' | 'receivedAt' | 'isRead'>
): ContactMessage {
  let messages = readContactData();
  const newMessage: ContactMessage = {
    ...data,
    id: uuidv4(),
    receivedAt: new Date().toISOString(),
    isRead: false,
  };
  messages.unshift(newMessage);
  writeContactData(messages);
  console.log('[addContactMessage] New message added and saved to JSON:', newMessage);
  return { ...newMessage };
}

export function findContactMessage(id: string): ContactMessage | undefined {
  const messages = readContactData();
  const message = messages.find(m => m.id === id);
  return message ? { ...message } : undefined;
}

export function markMessageAsRead(id: string, isRead: boolean): ContactMessage | null {
  let messages = readContactData();
  const messageIndex = messages.findIndex(m => m.id === id);
  if (messageIndex > -1) {
    messages[messageIndex].isRead = isRead;
    writeContactData(messages);
    console.log(`[markMessageAsRead] Message ${id} marked as ${isRead ? 'read' : 'unread'} and saved to JSON.`);
    return { ...messages[messageIndex] };
  }
  console.warn(`[markMessageAsRead] Message ${id} not found.`);
  return null;
}

export function deleteContactMessage(id: string): boolean {
  let messages = readContactData();
  const initialLength = messages.length;
  messages = messages.filter(m => m.id !== id);
  const success = messages.length < initialLength;
  if (success) {
    writeContactData(messages);
    console.log(`[deleteContactMessage] Message ${id} deleted and saved to JSON.`);
  } else {
    console.warn(`[deleteContactMessage] Message ${id} not found for deletion.`);
  }
  return success;
}

export function getUnreadMessagesCount(): number {
  const messages = readContactData();
  const count = messages.filter(msg => !msg.isRead).length;
  return count;
}
