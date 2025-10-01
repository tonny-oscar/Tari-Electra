'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { collection, query, onSnapshot, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Eye, CheckCircle, XCircle, Clock, User, Mail, Phone, MapPin, Building, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface ResellerApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  businessName?: string;
  businessType?: string;
  businessAddress?: string;
  experience?: string;
  whyReseller?: string;
  expectedSales?: string;
  status: 'pending' | 'approved' | 'rejected';
  submissionDate: any;
  approvalDate?: string;
  rejectionDate?: string;
  adminNotes?: string;
}

export default function ResellerApplications() {
  const [applications, setApplications] = useState<ResellerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<ResellerApplication | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [adminNotes, setAdminNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(
      collection(db, 'resellerApplications'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs.map(doc => ({
        id: doc.id,
        submissionDate: doc.data().createdAt || doc.data().submissionDate,
        ...doc.data()
      })) as ResellerApplication[];
      
      setApplications(apps);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching reseller applications:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleStatusUpdate = useCallback(async (applicationId: string, newStatus: 'approved' | 'rejected') => {
    if (!selectedApplication) return;
    
    setIsUpdating(true);
    try {
      const updateData: any = {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      };

      if (newStatus === 'approved') {
        updateData.approvalDate = new Date().toISOString();
      } else {
        updateData.rejectionDate = new Date().toISOString();
      }

      if (adminNotes.trim()) {
        updateData.adminNotes = adminNotes.trim();
      }

      await updateDoc(doc(db, 'resellerApplications', applicationId), updateData);

      // Send email notification
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: selectedApplication.email,
          subject: `Reseller Application ${newStatus === 'approved' ? 'Approved' : 'Rejected'} - Tari Electra`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0;">Tari Electra</h1>
              </div>
              <div style="padding: 30px; background: #f9f9f9;">
                <h2 style="color: #333;">Dear ${selectedApplication.fullName},</h2>
                <p style="color: #666; line-height: 1.6;">Your reseller application has been <strong style="color: ${newStatus === 'approved' ? '#10b981' : '#ef4444'};">${newStatus}</strong>.</p>
                ${newStatus === 'approved' 
                  ? '<p style="color: #666; line-height: 1.6;">Welcome to the Tari Electra reseller network! We will contact you soon with next steps.</p>'
                  : '<p style="color: #666; line-height: 1.6;">Thank you for your interest. You may reapply in the future.</p>'
                }
                ${adminNotes.trim() ? `<div style="background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0;"><strong>Admin Notes:</strong><br/>${adminNotes.trim()}</div>` : ''}
                <p style="color: #666; line-height: 1.6;">Best regards,<br/>Tari Electra Team</p>
              </div>
            </div>
          `
        })
      });

      toast({
        title: 'Success!',
        description: `Application ${newStatus} and email sent successfully.`,
      });

      setIsModalOpen(false);
      setAdminNotes('');
    } catch (error) {
      console.error('Error updating application:', error);
      toast({
        title: 'Error',
        description: 'Failed to update application status.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  }, [selectedApplication, adminNotes, toast]);



  const downloadPDF = useCallback((application: ResellerApplication) => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Reseller Application - ${application.fullName}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; margin: -40px -40px 30px -40px; }
          .section { margin: 25px 0; }
          .section h3 { color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 5px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 15px 0; }
          .info-item { background: #f8f9fa; padding: 15px; border-radius: 8px; }
          .info-item strong { color: #495057; }
          .status { padding: 8px 16px; border-radius: 20px; font-weight: bold; text-transform: uppercase; }
          .status.approved { background: #d4edda; color: #155724; }
          .status.rejected { background: #f8d7da; color: #721c24; }
          .status.pending { background: #fff3cd; color: #856404; }
          .notes { background: #e3f2fd; padding: 20px; border-left: 4px solid #2196f3; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>TARI ELECTRA</h1>
          <h2>Reseller Application</h2>
        </div>
        
        <div class="section">
          <div class="info-grid">
            <div class="info-item">
              <strong>Application Date:</strong><br/>
              ${formatDate(application.submissionDate)}
            </div>
            <div class="info-item">
              <strong>Status:</strong><br/>
              <span class="status ${application.status}">${application.status}</span>
            </div>
          </div>
        </div>

        <div class="section">
          <h3>Personal Information</h3>
          <div class="info-grid">
            <div class="info-item">
              <strong>Full Name:</strong><br/>
              ${application.fullName}
            </div>
            <div class="info-item">
              <strong>Email:</strong><br/>
              ${application.email}
            </div>
            <div class="info-item">
              <strong>Phone:</strong><br/>
              ${application.phone}
            </div>
          </div>
        </div>

        <div class="section">
          <h3>Business Information</h3>
          <div class="info-grid">
            <div class="info-item">
              <strong>Business Name:</strong><br/>
              ${application.businessName || 'Not provided'}
            </div>
            <div class="info-item">
              <strong>Business Type:</strong><br/>
              ${application.businessType || 'Not provided'}
            </div>
          </div>
          <div class="info-item">
            <strong>Business Address:</strong><br/>
            ${application.businessAddress || 'Not provided'}
          </div>
        </div>

        <div class="section">
          <h3>Application Details</h3>
          <div class="info-item">
            <strong>Experience:</strong><br/>
            ${application.experience || 'Not provided'}
          </div>
          <div class="info-item">
            <strong>Why Reseller:</strong><br/>
            ${application.whyReseller || 'Not provided'}
          </div>
          <div class="info-item">
            <strong>Expected Sales:</strong><br/>
            ${application.expectedSales || 'Not provided'}
          </div>
        </div>

        ${application.adminNotes ? `
          <div class="section">
            <h3>Admin Notes</h3>
            <div class="notes">
              ${application.adminNotes}
            </div>
          </div>
        ` : ''}
        
        <div style="text-align: center; margin-top: 40px; color: #666; font-size: 12px;">
          Generated on ${new Date().toLocaleDateString()} | Tari Electra Reseller Application
        </div>
      </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reseller-application-${application.fullName.replace(/\s+/g, '-')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      if (activeTab === 'all') return true;
      return app.status === activeTab;
    });
  }, [applications, activeTab]);

  const applicationStats = useMemo(() => ({
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    approved: applications.filter(app => app.status === 'approved').length,
    rejected: applications.filter(app => app.status === 'rejected').length
  }), [applications]);

  const formatDate = useCallback((dateValue: any) => {
    if (!dateValue) return 'N/A';
    if (typeof dateValue?.toDate === 'function') {
      return format(dateValue.toDate(), 'PPP');
    }
    return format(new Date(dateValue), 'PPP');
  }, []);

  const openModal = useCallback((application: ResellerApplication) => {
    setSelectedApplication(application);
    setAdminNotes(application.adminNotes || '');
    setIsModalOpen(true);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Reseller Applications</h1>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Reseller Applications</h1>
        <div className="flex gap-2">
          <Badge variant="secondary">
            Total: {applicationStats.total}
          </Badge>
          <Badge variant="outline">
            Pending: {applicationStats.pending}
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">
            All Applications ({applicationStats.total})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({applicationStats.pending})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({applicationStats.approved})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({applicationStats.rejected})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {filteredApplications.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No applications found</h3>
                <p className="text-muted-foreground">
                  {activeTab === 'all' 
                    ? 'No reseller applications have been submitted yet.'
                    : `No ${activeTab} applications found.`
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Business</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.map((app) => (
                      <ApplicationRow 
                        key={app.id} 
                        application={app} 
                        onView={openModal}
                        onDownload={downloadPDF}
                        formatDate={formatDate}
                        getBadgeVariant={getBadgeVariant}
                        getStatusIcon={getStatusIcon}
                      />
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Application Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Reseller Application Details</DialogTitle>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Application Info</h3>
                    <p><strong>Submitted:</strong> {formatDate(selectedApplication.submissionDate)}</p>
                    <div><strong>Status:</strong> 
                      <Badge variant={getBadgeVariant(selectedApplication.status)} className="ml-2">
                        {selectedApplication.status.charAt(0).toUpperCase() + selectedApplication.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Status Dates</h3>
                    {selectedApplication.approvalDate && (
                      <p><strong>Approved:</strong> {format(new Date(selectedApplication.approvalDate), 'PPP')}</p>
                    )}
                    {selectedApplication.rejectionDate && (
                      <p><strong>Rejected:</strong> {format(new Date(selectedApplication.rejectionDate), 'PPP')}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Full Name</Label>
                      <p className="text-sm">{selectedApplication.fullName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Email</Label>
                      <p className="text-sm flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {selectedApplication.email}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Phone</Label>
                      <p className="text-sm flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {selectedApplication.phone}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="w-5 h-5" />
                      Business Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Business Name</Label>
                      <p className="text-sm">{selectedApplication.businessName || 'Not provided'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Business Type</Label>
                      <p className="text-sm">{selectedApplication.businessType || 'Not provided'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Business Address</Label>
                      <p className="text-sm flex items-start gap-1">
                        <MapPin className="w-3 h-3 mt-0.5" />
                        {selectedApplication.businessAddress || 'Not provided'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Application Details */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Experience & Motivation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Previous Experience</Label>
                      <div className="bg-muted/50 p-3 rounded-lg mt-1">
                        <p className="text-sm whitespace-pre-wrap">{selectedApplication.experience || 'Not provided'}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Why do you want to become a reseller?</Label>
                      <div className="bg-muted/50 p-3 rounded-lg mt-1">
                        <p className="text-sm whitespace-pre-wrap">{selectedApplication.whyReseller || 'Not provided'}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Expected Sales Volume</Label>
                      <div className="bg-muted/50 p-3 rounded-lg mt-1">
                        <p className="text-sm whitespace-pre-wrap">{selectedApplication.expectedSales || 'Not provided'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Admin Notes */}
              <div>
                <Label htmlFor="adminNotes">Admin Notes</Label>
                <Textarea
                  id="adminNotes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about this application..."
                  rows={4}
                  className="mt-1"
                />
              </div>

              {/* Actions */}
              {selectedApplication.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    variant="destructive"
                    onClick={() => handleStatusUpdate(selectedApplication.id, 'rejected')}
                    disabled={isUpdating}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject Application
                  </Button>
                  <Button
                    onClick={() => handleStatusUpdate(selectedApplication.id, 'approved')}
                    disabled={isUpdating}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Application
                  </Button>
                </div>
              )}

              {selectedApplication.adminNotes && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <Label className="text-sm font-medium">Previous Admin Notes</Label>
                  <p className="text-sm mt-1 whitespace-pre-wrap">{selectedApplication.adminNotes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Memoized table row component for better performance
const ApplicationRow = React.memo(({ 
  application, 
  onView, 
  onDownload, 
  formatDate, 
  getBadgeVariant, 
  getStatusIcon 
}: {
  application: ResellerApplication;
  onView: (app: ResellerApplication) => void;
  onDownload: (app: ResellerApplication) => void;
  formatDate: (date: any) => string;
  getBadgeVariant: (status: string) => any;
  getStatusIcon: (status: string) => React.ReactNode;
}) => (
  <TableRow>
    <TableCell>
      {formatDate(application.submissionDate)}
    </TableCell>
    <TableCell>
      <div>
        <p className="font-medium">{application.fullName}</p>
        <p className="text-sm text-muted-foreground">{application.email}</p>
      </div>
    </TableCell>
    <TableCell>
      <div>
        <p className="font-medium">{application.businessName || 'N/A'}</p>
        <p className="text-sm text-muted-foreground">{application.businessType || 'N/A'}</p>
      </div>
    </TableCell>
    <TableCell>
      <div className="flex items-center gap-1">
        <Phone className="w-3 h-3" />
        <span className="text-sm">{application.phone}</span>
      </div>
    </TableCell>
    <TableCell>
      <Badge variant={getBadgeVariant(application.status)} className="flex items-center gap-1 w-fit">
        {getStatusIcon(application.status)}
        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
      </Badge>
    </TableCell>
    <TableCell>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onView(application)}
        >
          <Eye className="w-4 h-4 mr-2" />
          View
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDownload(application)}
        >
          <Download className="w-4 h-4 mr-2" />
          PDF
        </Button>
      </div>
    </TableCell>
  </TableRow>
));

ApplicationRow.displayName = 'ApplicationRow';