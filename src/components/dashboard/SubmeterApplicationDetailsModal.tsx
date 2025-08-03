'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download } from 'lucide-react';
import { format } from 'date-fns';
import jsPDF from 'jspdf';

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

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    let yPosition = 20;

    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Tari Electra - Sub-Meter Application', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;

    // Application ID and Date
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Application ID: ${application.id}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Submitted: ${format(new Date(application.submissionDate), 'PPP')}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Status: ${application.status.toUpperCase()}`, 20, yPosition);
    yPosition += 20;

    // Personal Information
    doc.setFont('helvetica', 'bold');
    doc.text('Personal Information', 20, yPosition);
    yPosition += 10;
    doc.setFont('helvetica', 'normal');
    doc.text(`Full Name: ${application.fullName}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Email: ${application.email}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Phone: ${application.phoneNumber}`, 20, yPosition);
    yPosition += 15;

    // Property Details
    doc.setFont('helvetica', 'bold');
    doc.text('Property Details', 20, yPosition);
    yPosition += 10;
    doc.setFont('helvetica', 'normal');
    doc.text(`Property Type: ${application.propertyType}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Application Type: ${application.applicationType}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Physical Location: ${application.physicalLocation}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Area & Town: ${application.areaTown}`, 20, yPosition);
    yPosition += 15;

    // Meter Information
    doc.setFont('helvetica', 'bold');
    doc.text('Meter Information', 20, yPosition);
    yPosition += 10;
    doc.setFont('helvetica', 'normal');
    doc.text(`Main Meter Account: ${application.mainMeterAccountNumber}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Current Reading: ${application.currentReading}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Supplies Other Areas: ${application.suppliesOtherAreas ? 'Yes' : 'No'}`, 20, yPosition);
    yPosition += 8;
    if (application.linkedMeterNumbers) {
      doc.text(`Linked Meters: ${application.linkedMeterNumbers}`, 20, yPosition);
      yPosition += 8;
    }
    yPosition += 10;

    // Sub-meters Registered
    if (application.submetersRegistered) {
      doc.setFont('helvetica', 'bold');
      doc.text('Sub-meters Registered', 20, yPosition);
      yPosition += 10;
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(application.submetersRegistered, pageWidth - 40);
      doc.text(lines, 20, yPosition);
      yPosition += lines.length * 6 + 10;
    }

    // Admin Notes
    if (application.approvalNotes || application.rejectionNotes) {
      doc.setFont('helvetica', 'bold');
      doc.text('Admin Notes', 20, yPosition);
      yPosition += 10;
      doc.setFont('helvetica', 'normal');
      const notes = application.approvalNotes || application.rejectionNotes || '';
      const noteLines = doc.splitTextToSize(notes, pageWidth - 40);
      doc.text(noteLines, 20, yPosition);
    }

    // Save PDF
    doc.save(`submeter-application-${application.id}.pdf`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Sub-Meter Application Details</DialogTitle>
              <DialogDescription>
                Application submitted on {format(new Date(application.submissionDate), 'PPP')}
              </DialogDescription>
            </div>
            <Button onClick={generatePDF} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
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