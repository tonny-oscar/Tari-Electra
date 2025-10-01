'use client';

import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, where, orderBy, QueryConstraint } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { FileText, Eye, Download, Filter } from 'lucide-react';
import { format } from 'date-fns';
import SubmeterApplicationModal from './SubmeterApplicationModal'; // Adjust path as needed
import DocumentPreviewModal from './DocumentPreviewModal'; // Adjust path as needed
import { SubmeterApplication } from '@/lib/types/submeter';

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

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

    // Add status filter only if not 'all'
    if (activeTab !== 'all') {
      queryConstraints.push(where('status', '==', activeTab));
    }

    // Add property type filter if selected
    if (propertyTypeFilter) {
      queryConstraints.push(where('propertyType', '==', propertyTypeFilter));
    }

    // Add ordering
    queryConstraints.push(orderBy('submissionDate', 'desc'));

    const q = query(baseCollection, ...queryConstraints);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const apps: SubmeterApplication[] = [];
        snapshot.forEach((doc) => {
          apps.push({ id: doc.id, ...doc.data() } as SubmeterApplication);
        });
        setApplications(apps);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching applications:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [activeTab, propertyTypeFilter]);

  const handleViewDocument = (url: string) => {
    if (!url) return;
    setSelectedDocumentUrl(url);
    setIsDocumentModalOpen(true);
  };

  const safeFormatDate = (dateValue: any): Date => {
    if (!dateValue) return new Date();
    // Handle Firestore Timestamp
    if (typeof dateValue?.toDate === 'function') {
      return dateValue.toDate();
    }
    // Handle regular Date object or date string
    const date = new Date(dateValue);
    return isNaN(date.getTime()) ? new Date() : date;
  };

  const generatePDF = (application: SubmeterApplication) => {
    if (!application) return;
    // Implement PDF generation logic here
    alert('PDF generation not implemented.');
  };

  const getBadgeVariant = (status: string): BadgeVariant => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getBadgeColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <span>Loading...</span>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <span>No applications found.</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                {applications
                  .filter(app => {
                    if (activeTab === 'all') return true;
                    return app.status === activeTab;
                  })
                  .filter(app => {
                    if (!propertyTypeFilter) return true;
                    return app.propertyType === propertyTypeFilter;
                  })
                  .map((app) => {
                  const dateValue = safeFormatDate(app.submissionDate);

                  return (
                    <TableRow key={app.id}>
                      <TableCell>
                        {format(dateValue, 'PPP')}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{app.fullName || ''}</p>
                          <p className="text-sm text-muted-foreground">{app.email || ''}</p>
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{app.propertyType || ''}</TableCell>
                      <TableCell className="capitalize">{app.applicationType || ''}</TableCell>
                      <TableCell>
                        {app.utilityServices
                          ? Array.isArray(app.utilityServices)
                            ? app.utilityServices.join(', ')
                            : app.utilityServices
                          : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getBadgeVariant(app.status || '')}
                          className={getBadgeColor(app.status || '')}
                        >
                          {app.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {Array.isArray(app.documents) && app.documents.map((doc, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              onClick={() => doc.url && handleViewDocument(doc.url)}
                              title={doc.name}
                            >
                              <FileText className="w-4 h-4" />
                            </Button>
                          ))}
                          {app.approvalDocumentUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDocument(app.approvalDocumentUrl!)}
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

      {isDetailsModalOpen && selectedApplication && (
        <SubmeterApplicationModal
          application={selectedApplication}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      )}  

      <DocumentPreviewModal
        isOpen={isDocumentModalOpen}
        onClose={() => setIsDocumentModalOpen(false)}
        documentUrl={selectedDocumentUrl}
      />
    </div>
  );
}

