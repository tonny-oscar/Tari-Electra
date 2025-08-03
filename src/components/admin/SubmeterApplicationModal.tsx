'use client';

import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { SubmeterApplication } from '@/lib/types/submeter';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Timestamp } from 'firebase/firestore';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf'; 


interface SubmeterApplicationModalProps {
  application: SubmeterApplication | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function SubmeterApplicationModal({
  application,
  isOpen,
  onClose,
}: SubmeterApplicationModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [approvalDocument, setApprovalDocument] = useState<File | null>(null);
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  const handleApprove = async () => {
    if (!application?.id) return;
    setIsLoading(true);

    try {
      let approvalDocumentUrl = '';

      if (approvalDocument) {
        const storageRef = ref(storage, `approvals/${application.id}/${approvalDocument.name}`);
        const uploadResult = await uploadBytes(storageRef, approvalDocument);
        approvalDocumentUrl = await getDownloadURL(uploadResult.ref);
      }

      await updateDoc(doc(db, 'submeterApplications', application.id), {
        status: 'approved',
        approvalDate: new Date().toISOString(),
        approvalNotes: notes,
        approvalDocumentUrl,
        updatedAt: new Date().toISOString(),
      });

      toast({
        title: 'Application Approved',
        description: 'The sub-meter application has been approved successfully.',
      });

      onClose();
    } catch (error) {
      console.error('Error approving application:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve the application. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (!application?.id) return;
    setIsLoading(true);

    try {
      await updateDoc(doc(db, 'submeterApplications', application.id), {
        status: 'rejected',
        rejectionDate: new Date().toISOString(),
        rejectionNotes: notes,
        updatedAt: new Date().toISOString(),
      });

      toast({
        title: 'Application Rejected',
        description: 'The sub-meter application has been rejected.',
      });

      onClose();
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject the application. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    let yPosition = 20;

    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Tari Electra - Sub-Meter Application', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;

    // Application details
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Application ID: ${application.id}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Submitted: ${formattedSubmissionDate}`, 20, yPosition);
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
    yPosition += 8;
    if (application.idNumber) {
      doc.text(`ID/Registration Number: ${application.idNumber}`, 20, yPosition);
      yPosition += 8;
    }
    if (application.utilityServices) {
      const services = Array.isArray(application.utilityServices) ? application.utilityServices.join(', ') : application.utilityServices;
      doc.text(`Utility Services: ${services}`, 20, yPosition);
      yPosition += 8;
    }
    yPosition += 10;

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
    if (application.mainMeterAccountNumber) {
      doc.setFont('helvetica', 'bold');
      doc.text('Meter Information', 20, yPosition);
      yPosition += 10;
      doc.setFont('helvetica', 'normal');
      doc.text(`Main Meter Account: ${application.mainMeterAccountNumber}`, 20, yPosition);
      yPosition += 8;
      if (application.currentReading !== undefined) {
        doc.text(`Current Reading: ${application.currentReading}`, 20, yPosition);
        yPosition += 8;
      }
      if (application.suppliesOtherAreas !== undefined) {
        doc.text(`Supplies Other Areas: ${application.suppliesOtherAreas ? 'Yes' : 'No'}`, 20, yPosition);
        yPosition += 8;
      }
      if (application.linkedMeterNumbers) {
        doc.text(`Linked Meters: ${application.linkedMeterNumbers}`, 20, yPosition);
        yPosition += 8;
      }
      yPosition += 10;
    }

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
      const adminNotes = application.approvalNotes || application.rejectionNotes || '';
      const noteLines = doc.splitTextToSize(adminNotes, pageWidth - 40);
      doc.text(noteLines, 20, yPosition);
      yPosition += noteLines.length * 6 + 10;
    }

    // Status dates
    if (application.approvalDate) {
      doc.text(`Approved on: ${format(new Date(application.approvalDate), 'PPP')}`, 20, yPosition);
      yPosition += 8;
    }
    if (application.rejectionDate) {
      doc.text(`Rejected on: ${format(new Date(application.rejectionDate), 'PPP')}`, 20, yPosition);
      yPosition += 8;
    }

    // Footer
    yPosition += 10;
    doc.setFontSize(10);
    doc.text(`Generated on: ${format(new Date(), 'PPP')}`, 20, yPosition);

    // Save PDF
    doc.save(`submeter-application-${application.id}.pdf`);
  };

  if (!application) return null;

const formattedSubmissionDate = (() => {
  const date = application?.submissionDate;

  if (!date) return 'N/A';

  let jsDate: Date;

  // ✅ Safe check for Firestore Timestamp (has .toDate function)
  if (typeof date === 'object' && date !== null && typeof (date as any).toDate === 'function') {
    jsDate = (date as any).toDate();
  } else if (typeof date === 'string' || typeof date === 'number') {
    jsDate = new Date(date);
  } else {
    return 'N/A';
  }

  return format(jsDate, 'PPP');
})();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Sub-Meter Application Form Details</DialogTitle>
            <Button onClick={generatePDF} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          <div>
            <h3 className="font-semibold mb-2">Applicant Info</h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-muted-foreground">Submission Date:</span>
                <p>{formattedSubmissionDate}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Full Name:</span>
                <p>{application.fullName}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Email:</span>
                <p>{application.email}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Phone:</span>
                <p>{application.phoneNumber}</p>
              </div>
              {application.idNumber && (
                <div>
                  <span className="text-sm text-muted-foreground">ID/Registration Number:</span>
                  <p>{application.idNumber}</p>
                </div>
              )}
              {application.utilityServices && (
                <div>
                  <span className="text-sm text-muted-foreground">Utility Services:</span>
                  <p>{Array.isArray(application.utilityServices) ? application.utilityServices.join(', ') : application.utilityServices}</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Property Details</h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-muted-foreground">Property Type:</span>
                <p className="capitalize">{application.propertyType}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Application Type:</span>
                <p className="capitalize">{application.applicationType}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Address:</span>
                <p>{application.physicalLocation}, {application.areaTown}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Current Status:</span>
                <p className={`capitalize font-medium ${
                  application.status === 'approved'
                    ? 'text-green-600'
                    : application.status === 'rejected'
                    ? 'text-red-600'
                    : 'text-yellow-600'
                }`}>
                  {application.status}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 py-4 border-t">
          <div>
            <h3 className="font-semibold mb-2">Meter Information</h3>
            <div className="space-y-2">
              {application.mainMeterAccountNumber && (
                <div>
                  <span className="text-sm text-muted-foreground">Main Meter Account:</span>
                  <p>{application.mainMeterAccountNumber}</p>
                </div>
              )}
              {application.currentReading !== undefined && (
                <div>
                  <span className="text-sm text-muted-foreground">Current Reading:</span>
                  <p>{application.currentReading}</p>
                </div>
              )}
              {application.suppliesOtherAreas !== undefined && (
                <div>
                  <span className="text-sm text-muted-foreground">Supplies Other Areas:</span>
                  <p>{application.suppliesOtherAreas ? 'Yes' : 'No'}</p>
                </div>
              )}
              {application.linkedMeterNumbers && (
                <div>
                  <span className="text-sm text-muted-foreground">Linked Meters:</span>
                  <p>{application.linkedMeterNumbers}</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Sub-meters Registered</h3>
            <div className="space-y-2">
              {application.submetersRegistered ? (
                <div>
                  <span className="text-sm text-muted-foreground">Registered Sub-meters:</span>
                  <div className="mt-1 p-2 bg-gray-50 rounded text-sm">
                    <pre className="whitespace-pre-wrap">{application.submetersRegistered}</pre>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No sub-meters registered information provided</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4 py-4">
          <div>
            <label className="block text-sm font-medium mb-2">Admin Notes</label>
            <Textarea
              placeholder="Add any notes or comments about this application..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>

          {application.status === 'pending' && (
            <div>
              <label className="block text-sm font-medium mb-2">Approval Document (PDF)</label>
              <Input
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file?.type === 'application/pdf') {
                    setApprovalDocument(file);
                  } else {
                    toast({
                      title: 'Invalid File',
                      description: 'Please upload a PDF document only.',
                      variant: 'destructive',
                    });
                  }
                }}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Upload an optional approval document (PDF only)
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <div className="flex space-x-2">
            {application.status === 'pending' && (
              <>
                <Button variant="destructive" onClick={handleReject} disabled={isLoading}>
                  Reject
                </Button>
                <Button onClick={handleApprove} disabled={isLoading}>
                  Approve
                </Button>
              </>
            )}
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
