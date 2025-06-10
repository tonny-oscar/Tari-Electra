
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getUnreadMessagesCountAction } from '@/app/actions/getUnreadMessagesCountAction';
import { usePathname } from 'next/navigation';

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const pathname = usePathname(); // Hook to re-fetch on navigation

useEffect(() => {
  const fetchCount = async () => {
    try {
      const count = await getUnreadMessagesCountAction();
      setUnreadCount(count);
    } catch {
      setUnreadCount(0);
    }
  };

  fetchCount();
  const interval = setInterval(fetchCount, 10000); // every 10s

  return () => clearInterval(interval);
}, [pathname]);


  return (
    <Button variant="ghost" size="icon" asChild className="relative">
      <Link href="/admin/messages" aria-label="View Messages">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center rounded-full text-xs"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
        <span className="sr-only">View Messages</span>
      </Link>
    </Button>
  );
}
