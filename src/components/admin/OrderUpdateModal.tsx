'use client';

import { useState } from 'react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface Order {
  id: string;
  status: number;
  trackingNumber?: string;
}

interface TrackingStage {
  id: number;
  name: string;
  color: string;
}

interface OrderUpdateModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  trackingStages: TrackingStage[];
}

export function OrderUpdateModal({ order, isOpen, onClose, trackingStages }: OrderUpdateModalProps) {
  const [status, setStatus] = useState<string>('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  // Reset form when order changes
  useState(() => {
    if (order) {
      setStatus(order.status.toString());
      setTrackingNumber(order.trackingNumber || '');
      setNotes('');
    }
  });

  const handleUpdate = async () => {
    if (!order) return;

    setIsUpdating(true);
    try {
      const orderRef = doc(db, 'orders', order.id);
      const updateData: any = {
        status: parseInt(status),
        updatedAt: serverTimestamp(),
      };

      if (trackingNumber.trim()) {
        updateData.trackingNumber = trackingNumber.trim();
      }

      // Add to status history
      const statusHistoryEntry = {
        status: parseInt(status),
        timestamp: new Date(),
        ...(notes.trim() && { notes: notes.trim() }),
      };

      updateData.statusHistory = order.statusHistory ? 
        [...order.statusHistory, statusHistoryEntry] : 
        [statusHistoryEntry];



      await updateDoc(orderRef, updateData);

      toast({
        title: 'Success!',
        description: 'Order updated successfully',
      });

      onClose();
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: 'Error',
        description: 'Failed to update order',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-gradient-to-br from-white to-blue-50/30 border-0 shadow-2xl">
        <DialogHeader className="text-center pb-2">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Update Order #{order.id.slice(-8)}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Update status and tracking information
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-white/70 rounded-xl p-4 border border-blue-100">
            <Label htmlFor="status" className="text-sm font-semibold text-gray-700">Order Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="mt-2 border-blue-200 focus:border-blue-400">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {trackingStages.map((stage) => (
                  <SelectItem key={stage.id} value={stage.id.toString()}>
                    {stage.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="bg-white/70 rounded-xl p-4 border border-green-100">
            <Label htmlFor="tracking" className="text-sm font-semibold text-gray-700">Tracking Number</Label>
            <Input
              id="tracking"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number"
              className="mt-2 border-green-200 focus:border-green-400"
            />
          </div>

          <div className="bg-white/70 rounded-xl p-4 border border-purple-100">
            <Label htmlFor="notes" className="text-sm font-semibold text-gray-700">Update Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this status update..."
              rows={3}
              className="mt-2 border-purple-200 focus:border-purple-400 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={onClose} 
              disabled={isUpdating}
              className="flex-1 border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdate} 
              disabled={isUpdating}
              className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-lg"
            >
              {isUpdating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Update Order
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}