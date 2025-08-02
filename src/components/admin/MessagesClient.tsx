'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, MessageSquare, Phone, CalendarDays, Info } from "lucide-react";
import { MessageActionsCell } from "./MessageActionsCell";
import { Separator } from "@/components/ui/separator";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  receivedAt: any;
  isRead: boolean;
}

export function MessagesClient() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'contactMessages'),
      orderBy('receivedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ContactMessage[];
      
      setMessages(messagesList);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching messages:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading messages...</span>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-muted-foreground" /> No Messages Yet
          </CardTitle>
        </CardHeader>
        <CardContent className="py-10 text-center">
          <p className="text-muted-foreground">There are no contact messages to display at this time.</p>
          <p className="text-xs mt-2">Try submitting one from the main inquiry form!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      {messages.map((msg) => (
        <Card key={msg.id} className={`flex flex-col shadow-md hover:shadow-lg transition-shadow ${!msg.isRead ? 'border-primary border-2' : 'border'}`}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg font-semibold line-clamp-1 break-all">{msg.name}</CardTitle>
                <CardDescription className="text-xs text-muted-foreground pt-1">
                  <a href={`mailto:${msg.email}`} className="hover:underline flex items-center">
                    <Mail className="h-3 w-3 mr-1" /> {msg.email}
                  </a>
                  {msg.phone && (
                    <span className="flex items-center mt-1">
                      <Phone className="h-3 w-3 mr-1" /> {msg.phone}
                    </span>
                  )}
                </CardDescription>
              </div>
              {!msg.isRead && <Badge variant="default" className="ml-auto shrink-0">New</Badge>}
            </div>
          </CardHeader>
          <CardContent className="flex-grow pt-2">
            <p className="text-sm text-foreground bg-secondary p-3 rounded-md whitespace-pre-wrap break-words">{msg.message}</p>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 pt-3">
            <div className="text-xs text-muted-foreground flex items-center w-full justify-between">
              <span className="flex items-center">
                <CalendarDays className="h-3 w-3 mr-1" /> 
                Received: {msg.receivedAt?.toDate ? msg.receivedAt.toDate().toLocaleString() : new Date(msg.receivedAt).toLocaleString()}
              </span>
            </div>
            <Separator className="my-2" />
            <MessageActionsCell messageId={msg.id} isCurrentlyRead={msg.isRead} messageFromName={msg.name} />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}