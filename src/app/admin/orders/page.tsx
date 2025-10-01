'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Edit, Calendar, User, DollarSign } from 'lucide-react';
import { OrderUpdateModal } from '@/components/admin/OrderUpdateModal';

interface Order {
  id: string;
  userId: string;
  customerEmail: string;
  customerName?: string;
  customerPhone?: string;
  items: any[];
  total: number;
  status: number;
  createdAt: any;
  trackingNumber?: string;
  statusHistory?: Array<{
    status: number;
    timestamp: any;
    notes?: string;
  }>;
}

const trackingStages = [
  { id: 1, name: 'Order Placed', color: 'bg-blue-100 text-blue-800' },

  { id: 3, name: 'Shipped', color: 'bg-purple-100 text-purple-800' },
  { id: 4, name: 'Delivered', color: 'bg-green-100 text-green-800' },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      
      setOrders(ordersList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getStatusInfo = (status: number) => {
    return trackingStages.find(stage => stage.id === status) || trackingStages[0];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading orders...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Package className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-2xl font-semibold">Orders Management</h1>
          <p className="text-muted-foreground">Update order status and track customer purchases</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No orders found</h3>
            <p className="text-gray-600">Customer orders will appear here</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            
            return (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        Order {order.orderNumber || `#${order.id.slice(-8)}`}
                      </CardTitle>
                      <div className="space-y-1 mt-2">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(order.createdAt?.toDate?.() || order.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            KSH {order.total.toFixed(2)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-700">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            <span className="font-medium">{order.customerName || 'N/A'}</span>
                          </div>
                          <div className="ml-5 text-gray-600">
                            📧 {order.customerEmail}
                          </div>
                          {order.customerPhone && (
                            <div className="ml-5 text-gray-600">
                              📞 {order.customerPhone}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={statusInfo.color}>
                        {statusInfo.name}
                      </Badge>
                      {order.trackingNumber && (
                        <p className="text-xs text-gray-500 mt-1">
                          Tracking: {order.trackingNumber}
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Order Items ({order.items.length})</h4>
                      <div className="space-y-2">
                        {order.items.slice(0, 3).map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{item.name} × {item.quantity}</span>
                            <span>KSH {(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <p className="text-sm text-gray-500">
                            +{order.items.length - 3} more items
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsModalOpen(true);
                        }}
                        size="sm"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Update Order
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <OrderUpdateModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedOrder(null);
        }}
        trackingStages={trackingStages}
      />
    </div>
  );
}