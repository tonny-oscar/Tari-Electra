
import fs from 'fs';
import path from 'path';
import type { ContactMessage } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

const contactDataPath = path.resolve(process.cwd(), 'src/data/contactData.json');
console.log('[ContactMessages] Data path resolved to:', contactDataPath);

function readContactData(): ContactMessage[] {
  console.log('[ContactMessages] Attempting to read contactData.json from:', contactDataPath);
  try {
    if (fs.existsSync(contactDataPath)) {
      const fileContent = fs.readFileSync(contactDataPath, 'utf-8');
      console.log(`[ContactMessages] File content length: ${fileContent.length}`);
      if (fileContent.trim() === '') {
        console.log('[ContactMessages] contactData.json is empty. Initializing with empty array and returning.');
        // Write an empty array if it's just whitespace or truly empty
        fs.writeFileSync(contactDataPath, JSON.stringify([], null, 2), 'utf-8');
        return [];
      }
      const data = JSON.parse(fileContent);
      if (Array.isArray(data)) {
        console.log(`[ContactMessages] Successfully parsed ${data.length} messages from JSON.`);
        return data;
      } else {
        console.warn('[ContactMessages] contactData.json does not contain a valid array. Initializing with empty array.');
        fs.writeFileSync(contactDataPath, JSON.stringify([], null, 2), 'utf-8');
        return [];
      }
    }
    console.log('[ContactMessages] contactData.json does not exist. Creating and initializing with empty array.');
    fs.writeFileSync(contactDataPath, JSON.stringify([], null, 2), 'utf-8');
    return [];
  } catch (error: any) {
    console.error('[ContactMessages] Error reading or initializing contactData.json:', error.message, error.stack);
    // Fallback: attempt to write a fresh empty array and return it
    try {
      console.log('[ContactMessages] Attempting to write fresh empty array to contactData.json after error.');
      fs.writeFileSync(contactDataPath, JSON.stringify([], null, 2), 'utf-8');
      return [];
    } catch (writeError: any) {
      console.error('[ContactMessages] Critical error: Failed to write initial data to contactData.json after read error:', writeError.message, writeError.stack);
      return []; // Return empty array as a last resort
    }
  }
}

function writeContactData(data: ContactMessage[]): void {
  try {
    console.log(`[ContactMessages] Attempting to write ${data.length} messages to contactData.json.`);
    fs.writeFileSync(contactDataPath, JSON.stringify(data, null, 2), 'utf-8');
    console.log('[ContactMessages] Successfully wrote to contactData.json');
  } catch (error) {
    console.error('[ContactMessages] Error writing to contactData.json:', error);
  }
}

export function getContactMessages(): ContactMessage[] {
  const messages = readContactData();
  // Return a deep copy and sort by most recent
  return JSON.parse(JSON.stringify(messages)).sort(
    (a: ContactMessage, b: ContactMessage) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
  );
}

export function addContactMessage(
  data: Omit<ContactMessage, 'id' | 'receivedAt' | 'isRead'>
): ContactMessage {
  console.log('[ContactMessages] addContactMessage called with data:', data);
  let messages = readContactData();
  const newMessage: ContactMessage = {
    ...data,
    id: uuidv4(),
    receivedAt: new Date().toISOString(),
    isRead: false,
  };
  messages.unshift(newMessage); // Adds to the beginning
  writeContactData(messages);
  console.log('[ContactMessages] New message added and data written. Total messages:', messages.length);
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
    console.log(`[ContactMessages] Message ${id} marked as ${isRead ? 'read' : 'unread'} and data written.`);
    return { ...messages[messageIndex] };
  }
  console.warn(`[ContactMessages] Message ${id} not found for markAsRead.`);
  return null;
}

export function deleteContactMessage(id: string): boolean {
  let messages = readContactData();
  const initialLength = messages.length;
  messages = messages.filter(m => m.id !== id);
  const success = messages.length < initialLength;
  if (success) {
    writeContactData(messages);
    console.log(`[ContactMessages] Message ${id} deleted and data written.`);
  } else {
    console.warn(`[ContactMessages] Message ${id} not found for deletion.`);
  }
  return success;
}

export function getUnreadMessagesCount(): number {
  const messages = readContactData();
  const count = messages.filter(msg => !msg.isRead).length;
  console.log(`[ContactMessages] Unread messages count: ${count}`);
  return count;
}
