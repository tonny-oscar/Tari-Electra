
'use client';

import { MessageSquare, Plus } from "lucide-react";
import { MessagesClient } from "@/components/admin/MessagesClient";
import { Button } from "@/components/ui/button";
import { addTestMessage } from "@/utils/addTestMessage";
import { useState } from "react";
import type { Metadata } from 'next';

export default function AdminMessagesPage() {
  const [isAddingTest, setIsAddingTest] = useState(false);

  const handleAddTestMessage = async () => {
    setIsAddingTest(true);
    try {
      await addTestMessage();
      console.log('Test message added successfully');
    } catch (error) {
      console.error('Failed to add test message:', error);
    } finally {
      setIsAddingTest(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-7 w-7 text-primary" />
          <div>
            <h1 className="text-2xl font-semibold">Contact Messages</h1>
            <p className="text-muted-foreground">Manage inquiries from your website. (Real-time from Firestore)</p>
          </div>
        </div>
        <Button 
          onClick={handleAddTestMessage} 
          disabled={isAddingTest}
          variant="outline"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          {isAddingTest ? 'Adding...' : 'Add Test Message'}
        </Button>
      </div>
      <MessagesClient />
    </div>
  );
}
