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
        description: 'The submeter application has been approved successfully.',
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
        description: 'The submeter application has been rejected.',
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
          <DialogTitle>Submeter Application Details</DialogTitle>
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
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Property Details</h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-muted-foreground">Property Type:</span>
                <p>{application.propertyType}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Application Type:</span>
                <p>{application.applicationType}</p>
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
