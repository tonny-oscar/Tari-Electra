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
    const content = `
SUB-METER APPLICATION FORM

Submission Date: ${format(typeof application.submissionDate?.toDate === 'function' ? application.submissionDate.toDate() : new Date(application.submissionDate), 'PPP')}
Application ID: ${application.id}

APPLICANT INFORMATION:
Full Name: ${application.fullName}
Email: ${application.email}
Phone Number: ${application.phoneNumber}

PROPERTY DETAILS:
Property Type: ${application.propertyType}
Application Type: ${application.applicationType}
Physical Location: ${application.physicalLocation}
Area/Town: ${application.areaTown}

STATUS:
Current Status: ${application.status}
${application.approvalDate ? `Approval Date: ${format(new Date(application.approvalDate), 'PPP')}` : ''}
${application.approvalNotes ? `Admin Notes: ${application.approvalNotes}` : ''}
${application.rejectionDate ? `Rejection Date: ${format(new Date(application.rejectionDate), 'PPP')}` : ''}
${application.rejectionNotes ? `Rejection Notes: ${application.rejectionNotes}` : ''}

Generated on: ${format(new Date(), 'PPP')}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sub-meter-application-${application.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
