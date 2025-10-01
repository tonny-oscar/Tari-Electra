
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, MessageSquare, FileText, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getUnreadMessagesCountAction } from '@/app/actions/getUnreadMessagesCountAction';
import { getPendingSubmeterApplicationsCount } from '@/data/submeterApplications';
import { usePathname } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

export function NotificationBell() {
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [pendingApplications, setPendingApplications] = useState(0);
  const [stockAlerts, setStockAlerts] = useState(0);
  const [resellerApplications, setResellerApplications] = useState(0);
  const pathname = usePathname();

  const totalNotifications = unreadMessages + pendingApplications + stockAlerts + resellerApplications;

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [messagesCount, applicationsCount] = await Promise.all([
          getUnreadMessagesCountAction(),
          getPendingSubmeterApplicationsCount()
        ]);
        
        // Fetch reseller applications count
        try {
          const { collection, getDocs, query, where } = await import('firebase/firestore');
          const { db } = await import('@/lib/firebase/client');
          const resellerQuery = query(
            collection(db, 'resellerApplications'),
            where('status', '==', 'pending')
          );
          const resellerSnapshot = await getDocs(resellerQuery);
          setResellerApplications(resellerSnapshot.size);
        } catch (error) {
          setResellerApplications(0);
        }
        setUnreadMessages(messagesCount);
        setPendingApplications(applicationsCount);
        
        // Fetch stock alerts with simplified query
        try {
          const { collection, getDocs } = await import('firebase/firestore');
          const { db } = await import('@/lib/firebase/client');
          const alertsSnapshot = await getDocs(collection(db, 'notifications'));
          const unreadStockAlerts = alertsSnapshot.docs.filter(doc => {
            const data = doc.data();
            return (data.type === 'low_stock' || data.type === 'out_of_stock') && !data.read;
          });
          setStockAlerts(unreadStockAlerts.length);
        } catch (error) {
          console.log('Stock alerts query failed, using fallback');
          setStockAlerts(0);
        }
      } catch {
        setUnreadMessages(0);
        setPendingApplications(0);
        setStockAlerts(0);
      }
    };

    fetchCounts();
    const interval = setInterval(fetchCounts, 10000); // every 10s

    return () => clearInterval(interval);
  }, [pathname]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {totalNotifications > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center rounded-full text-xs"
            >
              {totalNotifications > 9 ? '9+' : totalNotifications}
            </Badge>
          )}
          <span className="sr-only">View Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/admin/messages" className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              New Messages
            </div>
            {unreadMessages > 0 && (
              <Badge variant="secondary" className="ml-2">
                {unreadMessages}
              </Badge>
            )}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/admin/submeter-requests" className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Pending Applications
            </div>
            {pendingApplications > 0 && (
              <Badge variant="secondary" className="ml-2">
                {pendingApplications}
              </Badge>
            )}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/admin/stock" className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <Package className="h-4 w-4 mr-2" />
              Stock Alerts
            </div>
            {stockAlerts > 0 && (
              <Badge variant="destructive" className="ml-2">
                {stockAlerts}
              </Badge>
            )}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/admin/reseller-applications" className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Reseller Applications
            </div>
            {resellerApplications > 0 && (
              <Badge variant="secondary" className="ml-2">
                {resellerApplications}
              </Badge>
            )}
          </Link>
        </DropdownMenuItem>
        {totalNotifications === 0 && (
          <DropdownMenuItem disabled>
            <span className="text-muted-foreground">No new notifications</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
