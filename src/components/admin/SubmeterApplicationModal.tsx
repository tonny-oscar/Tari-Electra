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
    if (!application) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    let yPosition = 20;

    // Header background
    doc.setFillColor(59, 130, 246); // Blue color
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    // Company name in header
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('TARI ELECTRA', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Sub-Meter Application Form', pageWidth / 2, 30, { align: 'center' });
    
    yPosition = 55;
    doc.setTextColor(0, 0, 0);

    // Application details box
    doc.setFillColor(240, 248, 255);
    doc.rect(15, yPosition - 5, pageWidth - 30, 25, 'F');
    doc.setDrawColor(59, 130, 246);
    doc.rect(15, yPosition - 5, pageWidth - 30, 25, 'S');
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('APPLICATION DETAILS', 20, yPosition + 5);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Application ID: ${application?.id}`, 20, yPosition + 12);
    doc.text(`Submitted: ${formattedSubmissionDate}`, 20, yPosition + 18);
    doc.text(`Status: ${application?.status.toUpperCase()}`, pageWidth - 80, yPosition + 12);
    
    yPosition += 35;

    // Personal Information Section
    doc.setFillColor(34, 197, 94); // Green color
    doc.rect(15, yPosition - 3, pageWidth - 30, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('👤 APPLICANT INFORMATION', 20, yPosition + 2);
    
    yPosition += 15;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    // Create a bordered section
    doc.setDrawColor(34, 197, 94);
    doc.rect(15, yPosition - 5, pageWidth - 30, 45, 'S');
    
    doc.text(`Full Name: ${application?.fullName}`, 20, yPosition);
    yPosition += 7;
    doc.text(`Email: ${application?.email}`, 20, yPosition);
    yPosition += 7;
    doc.text(`Phone: ${application?.phoneNumber}`, 20, yPosition);
    yPosition += 7;
    if (application?.idNumber) {
      doc.text(`ID/Registration Number: ${application.idNumber}`, 20, yPosition);
      yPosition += 7;
    }
    if (application?.utilityServices) {
      const services = Array.isArray(application.utilityServices) ? application.utilityServices.join(', ') : application.utilityServices;
      doc.text(`Utility Services: ${services}`, 20, yPosition);
      yPosition += 7;
    }
    yPosition += 15;

    // Property Details Section
    doc.setFillColor(168, 85, 247); // Purple color
    doc.rect(15, yPosition - 3, pageWidth - 30, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('🏢 PROPERTY DETAILS', 20, yPosition + 2);
    
    yPosition += 15;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    doc.setDrawColor(168, 85, 247);
    doc.rect(15, yPosition - 5, pageWidth - 30, 35, 'S');
    
    doc.text(`Property Type: ${application?.propertyType}`, 20, yPosition);
    yPosition += 7;
    doc.text(`Application Type: ${application?.applicationType}`, 20, yPosition);
    yPosition += 7;
    doc.text(`Physical Location: ${application?.physicalLocation}`, 20, yPosition);
    yPosition += 7;
    doc.text(`Area & Town: ${application?.areaTown}`, 20, yPosition);
    yPosition += 15;

    // Meter Information Section - FIXED VERSION
    if (application?.mainMeterAccountNumber) {
      doc.setFillColor(245, 158, 11); // Orange color
      doc.rect(15, yPosition - 3, pageWidth - 30, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('⚡ METER INFORMATION', 20, yPosition + 2);
      
      yPosition += 15;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      // Calculate dynamic section height based on available fields
      let sectionHeight = 14; // Base height for main meter account
      if (application.submeterAccountNumber) sectionHeight += 7;
      if (application.currentReading !== undefined) sectionHeight += 7;
      if (application.suppliesOtherAreas !== undefined) sectionHeight += 7;
      if (application.linkedMeterNumbers) sectionHeight += 7;
      
      doc.setDrawColor(245, 158, 11);
      doc.rect(15, yPosition - 5, pageWidth - 30, sectionHeight, 'S');
      
      // Main meter account (always present due to the if condition)
      doc.text(`Main Meter Account: ${application.mainMeterAccountNumber}`, 20, yPosition);
      yPosition += 7;
      
      // Optional fields - only add if they exist
      if (application.submeterAccountNumber) {
        doc.text(`Sub-meter Account: ${application.submeterAccountNumber}`, 20, yPosition);
        yPosition += 7;
      }
      if (application.currentReading !== undefined) {
        doc.text(`Current Reading: ${application.currentReading} kWh`, 20, yPosition);
        yPosition += 7;
      }
      if (application.suppliesOtherAreas !== undefined) {
        doc.text(`Supplies Other Areas: ${application.suppliesOtherAreas ? 'Yes' : 'No'}`, 20, yPosition);
        yPosition += 7;
      }
      if (application.linkedMeterNumbers) {
        doc.text(`Linked Meters: ${application.linkedMeterNumbers}`, 20, yPosition);
        yPosition += 7;
      }
      
      yPosition += 15; // Add spacing after section
    }

    // Sub-meters Registered Section
    if (application.submetersRegistered) {
      doc.setFillColor(239, 68, 68); // Red color
      doc.rect(15, yPosition - 3, pageWidth - 30, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('📋 SUB-METERS REGISTERED', 20, yPosition + 2);
      
      yPosition += 15;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      
      const lines = doc.splitTextToSize(application.submetersRegistered, pageWidth - 50);
      const sectionHeight = lines.length * 5 + 10;
      
      doc.setDrawColor(239, 68, 68);
      doc.rect(15, yPosition - 5, pageWidth - 30, sectionHeight, 'S');
      doc.setFillColor(254, 242, 242);
      doc.rect(15, yPosition - 5, pageWidth - 30, sectionHeight, 'F');
      
      doc.setTextColor(0, 0, 0);
      doc.text(lines, 20, yPosition);
      yPosition += lines.length * 5 + 15;
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
    yPosition += 20;
    doc.setFillColor(59, 130, 246);
    doc.rect(0, yPosition - 5, pageWidth, 20, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Tari Electra - Electrical Solutions', 20, yPosition + 5);
    doc.text(`Generated on: ${format(new Date(), 'PPP')}`, pageWidth - 80, yPosition + 5);
    doc.text('Ramcocot, South C | 0717777668 | hello@tari.africa', pageWidth / 2, yPosition + 12, { align: 'center' });

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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Sub-Meter Application Form Details</DialogTitle>
            <Button onClick={generatePDF} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[75vh] pr-2">
          <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm">
                <h3 className="font-bold text-lg mb-4 text-blue-700 border-b border-blue-200 pb-2">👤 Applicant Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Submission Date:</span>
                    <span className="text-sm font-semibold">{formattedSubmissionDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Full Name:</span>
                    <span className="text-sm font-semibold">{application.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Email:</span>
                    <span className="text-sm font-semibold text-blue-600">{application.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Phone:</span>
                    <span className="text-sm font-semibold">{application.phoneNumber}</span>
                  </div>
                  {application.idNumber && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">ID/Registration:</span>
                      <span className="text-sm font-semibold">{application.idNumber}</span>
                    </div>
                  )}
                  {application.utilityServices && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Services:</span>
                      <span className="text-sm font-semibold capitalize">{Array.isArray(application.utilityServices) ? application.utilityServices.join(', ') : application.utilityServices}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm">
                <h3 className="font-bold text-lg mb-4 text-green-700 border-b border-green-200 pb-2">🏢 Property Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Property Type:</span>
                    <span className="text-sm font-semibold capitalize">{application.propertyType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Application Type:</span>
                    <span className="text-sm font-semibold capitalize">{application.applicationType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Location:</span>
                    <span className="text-sm font-semibold">{application.physicalLocation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Area & Town:</span>
                    <span className="text-sm font-semibold">{application.areaTown}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Status:</span>
                    <span className={`text-sm font-bold px-2 py-1 rounded-full ${
                      application.status === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : application.status === 'rejected'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {application.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4">
              <h3 className="font-bold text-lg mb-4 text-purple-700 border-b border-purple-200 pb-2">⚡ Meter Information</h3>
              <div className="space-y-3">
                {application.mainMeterAccountNumber && (
                  <div className="bg-white/70 rounded p-2">
                    <span className="text-sm font-medium text-gray-600">Main Meter Account:</span>
                    <p className="font-semibold text-purple-700">{application.mainMeterAccountNumber}</p>
                  </div>
                )}
                {application.currentReading !== undefined && (
                  <div className="bg-white/70 rounded p-2">
                    <span className="text-sm font-medium text-gray-600">Current Reading:</span>
                    <p className="font-semibold">{application.currentReading} kWh</p>
                  </div>
                )}
                {application.suppliesOtherAreas !== undefined && (
                  <div className="bg-white/70 rounded p-2">
                    <span className="text-sm font-medium text-gray-600">Supplies Other Areas:</span>
                    <p className={`font-semibold ${application.suppliesOtherAreas ? 'text-green-600' : 'text-red-600'}`}>
                      {application.suppliesOtherAreas ? '✓ Yes' : '✗ No'}
                    </p>
                  </div>
                )}
                {application.submeterAccountNumber && (
                  <div className="bg-white/70 rounded p-2">
                    <span className="text-sm font-medium text-gray-600">Sub-meter Account:</span>
                    <p className="font-semibold text-purple-700">{application.submeterAccountNumber}</p>
                  </div>
                )}
                {application.linkedMeterNumbers && (
                  <div className="bg-white/70 rounded p-2">
                    <span className="text-sm font-medium text-gray-600">Linked Meters:</span>
                    <p className="font-semibold">{application.linkedMeterNumbers}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-4">
              <h3 className="font-bold text-lg mb-4 text-orange-700 border-b border-orange-200 pb-2">📋 Sub-meters Registered</h3>
              {application.submetersRegistered ? (
                <div className="bg-white/80 rounded-lg p-3 shadow-sm">
                  <div className="text-sm font-medium text-gray-600 mb-2">Registered Sub-meters:</div>
                  <div className="bg-gray-50 rounded p-3 border-l-4 border-orange-400">
                    <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">{application.submetersRegistered}</pre>
                  </div>
                </div>
              ) : (
                <div className="bg-white/80 rounded-lg p-3 text-center">
                  <p className="text-gray-500 italic">No sub-meters information provided</p>
                </div>
              )}
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
        </div>
        
        <DialogFooter className="sticky bottom-0 bg-white border-t pt-4">
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