'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface SubmeterApplication {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  propertyType: string;
  applicationType: string;
  physicalLocation: string;
  areaTown: string;
  mainMeterAccountNumber: string;
  currentReading: number;
  submetersRegistered?: string;
  suppliesOtherAreas: boolean;
  linkedMeterNumbers?: string;
  submissionDate: string;
  status: 'pending' | 'approved' | 'rejected';
  approvalDate?: string;
  rejectionDate?: string;
  approvalNotes?: string;
  rejectionNotes?: string;
}

interface SubmeterApplicationDetailsModalProps {
  application: SubmeterApplication | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SubmeterApplicationDetailsModal({
  application,
  isOpen,
  onClose,
}: SubmeterApplicationDetailsModalProps) {
  if (!application) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Sub-Meter Application Details</DialogTitle>
          <DialogDescription>
            Application submitted on {format(new Date(application.submissionDate), 'PPP')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status */}
          <div>
            <h3 className="font-semibold mb-2">Status</h3>
            <Badge
              variant={
                application.status === 'approved' ? 'secondary' :
                application.status === 'rejected' ? 'destructive' :
                'default'
              }
              className={
                application.status === 'approved' ? 'bg-green-100 text-green-800' :
                application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }
            >
              {application.status.toUpperCase()}
            </Badge>
            {application.approvalDate && (
              <p className="text-sm text-muted-foreground mt-1">
                Approved on {format(new Date(application.approvalDate), 'PPP')}
              </p>
            )}
            {application.rejectionDate && (
              <p className="text-sm text-muted-foreground mt-1">
                Rejected on {format(new Date(application.rejectionDate), 'PPP')}
              </p>
            )}
          </div>

          {/* Personal Information */}
          <div>
            <h3 className="font-semibold mb-2">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Full Name:</span>
                <p className="font-medium">{application.fullName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Email:</span>
                <p className="font-medium">{application.email}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Phone:</span>
                <p className="font-medium">{application.phoneNumber}</p>
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div>
            <h3 className="font-semibold mb-2">Property Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Property Type:</span>
                <p className="font-medium capitalize">{application.propertyType}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Application Type:</span>
                <p className="font-medium capitalize">{application.applicationType}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Physical Location:</span>
                <p className="font-medium">{application.physicalLocation}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Area & Town:</span>
                <p className="font-medium">{application.areaTown}</p>
              </div>
            </div>
          </div>

          {/* Meter Information */}
          <div>
            <h3 className="font-semibold mb-2">Meter Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Main Meter Account:</span>
                <p className="font-medium">{application.mainMeterAccountNumber}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Current Reading:</span>
                <p className="font-medium">{application.currentReading}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Supplies Other Areas:</span>
                <p className="font-medium">{application.suppliesOtherAreas ? 'Yes' : 'No'}</p>
              </div>
              {application.linkedMeterNumbers && (
                <div>
                  <span className="text-muted-foreground">Linked Meters:</span>
                  <p className="font-medium">{application.linkedMeterNumbers}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sub-meters Registered */}
          {application.submetersRegistered && (
            <div>
              <h3 className="font-semibold mb-2">Sub-meters Registered</h3>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm whitespace-pre-wrap">{application.submetersRegistered}</p>
              </div>
            </div>
          )}

          {/* Admin Notes */}
          {(application.approvalNotes || application.rejectionNotes) && (
            <div>
              <h3 className="font-semibold mb-2">Admin Notes</h3>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm">
                  {application.approvalNotes || application.rejectionNotes}
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}