'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { Zap, FileText, Plus } from 'lucide-react';

interface SubmeterApplication {
  id: string;
  fullName: string;
  propertyType: string;
  applicationType: string;
  submissionDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface SubmeterTabProps {
  applications: SubmeterApplication[];
}

export function SubmeterTab({ applications }: SubmeterTabProps) {
  const [selectedApplication, setSelectedApplication] = useState<SubmeterApplication | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isApplicationFormOpen, setIsApplicationFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    idNumber: '',
    utilityServices: '',
    propertyType: '',
    applicationType: '',
    physicalLocation: '',
    areaAndTown: '',
    mainMeterAccount: '',
    currentReading: '',
    suppliesOtherAreas: '',
    additionalNotes: ''
  });

  const handleViewDetails = (application: SubmeterApplication) => {
    setSelectedApplication(application);
    setIsDetailsModalOpen(true);
  };

  const handleSubmitApplication = async () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to submit an application.',
        variant: 'destructive'
      });
      return;
    }

    if (!formData.fullName || !formData.email || !formData.phone || !formData.propertyType || !formData.applicationType) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'submeterApplications'), {
        ...formData,
        userId: user.uid,
        submissionDate: new Date().toISOString(),
        status: 'pending',
        createdAt: new Date().toISOString()
      });

      toast({
        title: 'Application Submitted',
        description: 'Your submeter application has been submitted successfully. We will review it and get back to you soon.',
      });

      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        idNumber: '',
        utilityServices: '',
        propertyType: '',
        applicationType: '',
        physicalLocation: '',
        areaAndTown: '',
        mainMeterAccount: '',
        currentReading: '',
        suppliesOtherAreas: '',
        additionalNotes: ''
      });
      setIsApplicationFormOpen(false);
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: 'Submission Failed',
        description: 'Failed to submit application. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Submeter Application Forms</h2>
        <Dialog open={isApplicationFormOpen} onOpenChange={setIsApplicationFormOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Apply for Submeter
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Submeter Application Form
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="idNumber">ID/Registration Number</Label>
                  <Input
                    id="idNumber"
                    value={formData.idNumber}
                    onChange={(e) => setFormData({...formData, idNumber: e.target.value})}
                    placeholder="Enter ID or registration number"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="utilityServices">Utility Services</Label>
                <select
                  id="utilityServices"
                  value={formData.utilityServices}
                  onChange={(e) => setFormData({...formData, utilityServices: e.target.value})}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value="">Select utility service</option>
                  <option value="electricity">Electricity</option>
                  <option value="water">Water</option>
                  <option value="both">Both Electricity & Water</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="physicalLocation">Physical Location *</Label>
                  <Input
                    id="physicalLocation"
                    value={formData.physicalLocation}
                    onChange={(e) => setFormData({...formData, physicalLocation: e.target.value})}
                    placeholder="e.g., nairobi/utawala"
                  />
                </div>
                <div>
                  <Label htmlFor="areaAndTown">Area & Town</Label>
                  <Input
                    id="areaAndTown"
                    value={formData.areaAndTown}
                    onChange={(e) => setFormData({...formData, areaAndTown: e.target.value})}
                    placeholder="e.g., Nairobi"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="propertyType">Property Type *</Label>
                  <select
                    id="propertyType"
                    value={formData.propertyType}
                    onChange={(e) => setFormData({...formData, propertyType: e.target.value})}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="">Select property type</option>
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="industrial">Industrial</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="applicationType">Application Type *</Label>
                  <select
                    id="applicationType"
                    value={formData.applicationType}
                    onChange={(e) => setFormData({...formData, applicationType: e.target.value})}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="">Select application type</option>
                    <option value="new">New</option>
                    <option value="transfer">Transfer</option>
                    <option value="upgrade">Upgrade</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mainMeterAccount">Main Meter Account</Label>
                  <Input
                    id="mainMeterAccount"
                    value={formData.mainMeterAccount}
                    onChange={(e) => setFormData({...formData, mainMeterAccount: e.target.value})}
                    placeholder="Enter main meter account number"
                  />
                </div>
                <div>
                  <Label htmlFor="currentReading">Current Reading</Label>
                  <Input
                    id="currentReading"
                    value={formData.currentReading}
                    onChange={(e) => setFormData({...formData, currentReading: e.target.value})}
                    placeholder="e.g., 1 kWh"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="suppliesOtherAreas">Supplies Other Areas</Label>
                <select
                  id="suppliesOtherAreas"
                  value={formData.suppliesOtherAreas}
                  onChange={(e) => setFormData({...formData, suppliesOtherAreas: e.target.value})}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value="">Select option</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div>
                <Label htmlFor="additionalNotes">Additional Notes</Label>
                <Textarea
                  id="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={(e) => setFormData({...formData, additionalNotes: e.target.value})}
                  placeholder="Any additional information or special requirements"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleSubmitApplication}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 mr-2" />
                      Submit Application
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsApplicationFormOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {applications.length === 0 ? (
          <Card>
            <CardContent className="py-6">
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  You haven't submitted any sub-meter application forms yet.
                </p>
                <Dialog open={isApplicationFormOpen} onOpenChange={setIsApplicationFormOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Apply for Submeter
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ) : (
          applications.map((app) => (
            <Card key={app.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold">{app.fullName}</h3>
                    <p className="text-sm text-muted-foreground">
                      Submitted on {format(new Date(app.submissionDate), 'PPP')}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={
                        app.status === 'approved' ? 'secondary' :
                        app.status === 'rejected' ? 'destructive' :
                        'default'
                      }
                      className={
                        app.status === 'approved' ? 'bg-green-100 text-green-800 hover:bg-green-100/80' :
                        app.status === 'rejected' ? 'bg-red-100 text-red-800 hover:bg-red-100/80' :
                        'bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80'
                      }
                      >
                        {app.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {app.propertyType} • {app.applicationType}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(app)}
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Application Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Application Details
            </DialogTitle>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Full Name</Label>
                  <p className="text-sm bg-gray-50 p-2 rounded">{selectedApplication.fullName}</p>
                </div>
                <div>
                  <Label className="font-semibold">Status</Label>
                  <Badge variant={
                    selectedApplication.status === 'approved' ? 'secondary' :
                    selectedApplication.status === 'rejected' ? 'destructive' :
                    'default'
                  }>
                    {selectedApplication.status}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Property Type</Label>
                  <p className="text-sm bg-gray-50 p-2 rounded">{selectedApplication.propertyType}</p>
                </div>
                <div>
                  <Label className="font-semibold">Application Type</Label>
                  <p className="text-sm bg-gray-50 p-2 rounded">{selectedApplication.applicationType}</p>
                </div>
              </div>
              <div>
                <Label className="font-semibold">Submission Date</Label>
                <p className="text-sm bg-gray-50 p-2 rounded">
                  {format(new Date(selectedApplication.submissionDate), 'PPP')}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
