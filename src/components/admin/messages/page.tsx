'use client';

import React, { useEffect, useState } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MessageActionsCell } from '@/components/admin/MessageActionsCell';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Array<QueryDocumentSnapshot<DocumentData>>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'contactMessages'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setMessages(snapshot.docs);
        setIsLoading(false);
      },
      (err) => {
        console.error("Firestore error:", err.message);
        setError("Failed to load messages.");
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <p className="p-6 text-center">Loading messages…</p>;
  }

  if (error) {
    return <p className="p-6 text-center text-destructive">{error}</p>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Admin Messages</h1>

      {messages.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        messages.map((doc) => {
          const data = doc.data();
          const createdAt = data.createdAt?.toDate?.();

          return (
            <div
              key={doc.id}
              className="border p-4 rounded shadow flex justify-between items-start"
            >
              <div>
                <p><strong>Name:</strong> {data.name}</p>
                <p><strong>Email:</strong> {data.email}</p>
                {data.phone && <p><strong>Phone:</strong> {data.phone}</p>}
                <p><strong>Message:</strong> {data.message}</p>
                <p><strong>Status:</strong> {data.status ?? 'unread'}</p>
                <p>
                  <strong>Sent:</strong>{' '}
                  {createdAt ? createdAt.toLocaleString() : 'N/A'}
                </p>
              </div>

              <MessageActionsCell
                messageId={doc.id}
                isCurrentlyRead={data.status === 'read'}
                messageFromName={data.name}
              />
            </div>
          );
        })
      )}
    </div>
  );
}
