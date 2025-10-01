'use client';

import React, { useState, useEffect } from 'react';
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
import { Eye, CheckCircle, XCircle, Clock, User, Mail, Phone, MapPin, Building } from 'lucide-react';
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
      orderBy('submissionDate', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs.map(doc => ({
        id: doc.id,
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

  const handleStatusUpdate = async (applicationId: string, newStatus: 'approved' | 'rejected') => {
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

      toast({
        title: 'Success!',
        description: `Application ${newStatus} successfully.`,
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
  };

  const openModal = (application: ResellerApplication) => {
    setSelectedApplication(application);
    setAdminNotes(application.adminNotes || '');
    setIsModalOpen(true);
  };

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

  const filteredApplications = applications.filter(app => {
    if (activeTab === 'all') return true;
    return app.status === activeTab;
  });

  const formatDate = (dateValue: any) => {
    if (!dateValue) return 'N/A';
    if (typeof dateValue?.toDate === 'function') {
      return format(dateValue.toDate(), 'PPP');
    }
    return format(new Date(dateValue), 'PPP');
  };

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
            Total: {applications.length}
          </Badge>
          <Badge variant="outline">
            Pending: {applications.filter(app => app.status === 'pending').length}
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">
            All Applications ({applications.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({applications.filter(app => app.status === 'pending').length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({applications.filter(app => app.status === 'approved').length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({applications.filter(app => app.status === 'rejected').length})
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
                      <TableRow key={app.id}>
                        <TableCell>
                          {formatDate(app.submissionDate)}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{app.fullName}</p>
                            <p className="text-sm text-muted-foreground">{app.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{app.businessName || 'N/A'}</p>
                            <p className="text-sm text-muted-foreground">{app.businessType || 'N/A'}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            <span className="text-sm">{app.phone}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getBadgeVariant(app.status)} className="flex items-center gap-1 w-fit">
                            {getStatusIcon(app.status)}
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openModal(app)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
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
                    <p><strong>Status:</strong> 
                      <Badge variant={getBadgeVariant(selectedApplication.status)} className="ml-2">
                        {selectedApplication.status.charAt(0).toUpperCase() + selectedApplication.status.slice(1)}
                      </Badge>
                    </p>
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