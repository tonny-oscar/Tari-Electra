'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { SubmeterApplication } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { FileText, Eye, Filter, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import DocumentPreviewModal from '@/components/admin/DocumentPreviewModal';
import SubmeterApplicationModal from '@/components/admin/SubmeterApplicationModal';


export default function SubmeterApplicationsTable() {
  const [applications, setApplications] = useState<SubmeterApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<SubmeterApplication | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [selectedDocumentUrl, setSelectedDocumentUrl] = useState<string>('');
  const [activeTab, setActiveTab] = useState('all');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState<string | null>(null);

  useEffect(() => {
    const baseCollection = collection(db, 'submeterApplications');
    const queryConstraints: QueryConstraint[] = [];

    if (activeTab !== 'all') {
      queryConstraints.push(where('status', '==', activeTab));
    }

    if (propertyTypeFilter) {
      queryConstraints.push(where('propertyType', '==', propertyTypeFilter));
    }

    queryConstraints.push(orderBy('submissionDate', 'desc'));

    const q = query(baseCollection, ...queryConstraints);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as SubmeterApplication[];
      setApplications(apps);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [activeTab, propertyTypeFilter]);

  const handleViewDocument = (url: string) => {
    setSelectedDocumentUrl(url);
    setIsDocumentModalOpen(true);
  };

  const generatePDF = (application: SubmeterApplication) => {
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
    const submissionDate = typeof application.submissionDate?.toDate === 'function' 
      ? application.submissionDate.toDate() 
      : new Date(application.submissionDate);
    
    doc.text(`Application ID: ${application.id}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Submitted: ${format(submissionDate, 'PPP')}`, 20, yPosition);
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
      if (application.currentReading) {
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
      const notes = application.approvalNotes || application.rejectionNotes || '';
      const noteLines = doc.splitTextToSize(notes, pageWidth - 40);
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

  const getBadgeColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading applications...</span>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No sub-meter applications found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Tabs defaultValue={activeTab} className="w-full" onValueChange={value => setActiveTab(value)}>
          <div className="flex items-center justify-between mb-4 w-full">
            <TabsList>
              <TabsTrigger value="all">
                All Applications
                <Badge variant="secondary" className="ml-2">
                  {applications.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending
                <Badge variant="secondary" className="ml-2">
                  {applications.filter(app => app.status === 'pending').length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved
                <Badge variant="secondary" className="ml-2">
                  {applications.filter(app => app.status === 'approved').length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected
                <Badge variant="secondary" className="ml-2">
                  {applications.filter(app => app.status === 'rejected').length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter by Property Type
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Property Types</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setPropertyTypeFilter(null)}>
                  All Types
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPropertyTypeFilter('residential')}>
                  Residential
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPropertyTypeFilter('commercial')}>
                  Commercial
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPropertyTypeFilter('industrial')}>
                  Industrial
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <TabsContent value={activeTab} className="mt-0">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Submission Date</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Property Type</TableHead>
                    <TableHead>Application Type</TableHead>
                    <TableHead>Utility Services</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Documents</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => {
                    const dateValue =
                      typeof app.submissionDate?.toDate === 'function'
                        ? app.submissionDate.toDate()
                        : new Date(app.submissionDate);

                    return (
                      <TableRow key={app.id}>
                        <TableCell>
                          {format(dateValue, 'PPP')}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{app.fullName}</p>
                            <p className="text-sm text-muted-foreground">{app.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="capitalize">{app.propertyType}</TableCell>
                        <TableCell className="capitalize">{app.applicationType}</TableCell>
                        <TableCell>
                          {app.utilityServices ? (
                            Array.isArray(app.utilityServices) ? app.utilityServices.join(', ') : app.utilityServices
                          ) : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Badge className={getBadgeColor(app.status)}>
                            {app.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {app.documents?.map((doc, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewDocument(doc.url)}
                                title={doc.name}
                              >
                                <FileText className="w-4 h-4" />
                              </Button>
                            ))}
                            {app.approvalDocumentUrl && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewDocument(app.approvalDocumentUrl)}
                                className="text-green-600"
                                title="Approval Document"
                              >
                                <FileText className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedApplication(app);
                                setIsDetailsModalOpen(true);
                              }}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => generatePDF(app)}
                              title="Download Application"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <SubmeterApplicationModal
        application={selectedApplication}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedApplication(null);
        }}
      />

      <DocumentPreviewModal
        documentUrl={selectedDocumentUrl}
        isOpen={isDocumentModalOpen}
        onClose={() => setIsDocumentModalOpen(false)}
      />
    </div>
  );
}
