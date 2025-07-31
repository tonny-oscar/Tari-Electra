'use client';

import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Share2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface ServiceRequest {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  serviceType: string;
  description: string;
  requestDate: string;
  preferredDate: string;
  status: string;
  location: string;
  contactNumber: string;
  urgency: string;
  attachments?: string[];
}

export function ServiceRequestsAdmin() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const requestsQuery = query(
      collection(db, 'service-requests'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(requestsQuery, (snapshot) => {
      const requestsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ServiceRequest[];
      
      setRequests(requestsList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const generatePDF = (request: ServiceRequest) => {
    const doc = new jsPDF();

    // Add company logo or header
    doc.setFontSize(20);
    doc.text('Service Request Details', 20, 20);

    // Add request details
    doc.setFontSize(12);
    const details = [
      ['Request ID', request.id],
      ['Customer Name', request.customerName],
      ['Customer Email', request.customerEmail],
      ['Service Type', request.serviceType],
      ['Description', request.description],
      ['Request Date', new Date(request.requestDate).toLocaleDateString()],
      ['Preferred Date', new Date(request.preferredDate).toLocaleDateString()],
      ['Status', request.status],
      ['Location', request.location],
      ['Contact Number', request.contactNumber],
      ['Urgency', request.urgency],
    ];

    // @ts-ignore
    doc.autoTable({
      startY: 30,
      head: [['Field', 'Value']],
      body: details,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
    });

    // Save the PDF
    doc.save(`service-request-${request.id}.pdf`);
  };

  const shareRequest = async (request: ServiceRequest) => {
    try {
      const doc = new jsPDF();
      
      doc.setFontSize(20);
      doc.text('Service Request Details', 20, 20);
      
      doc.setFontSize(12);
      const details = [
        ['Request ID', request.id],
        ['Customer Name', request.customerName],
        ['Service Type', request.serviceType],
        ['Description', request.description],
        ['Request Date', new Date(request.requestDate).toLocaleDateString()],
        ['Status', request.status],
      ];

      // @ts-ignore
      doc.autoTable({
        startY: 30,
        head: [['Field', 'Value']],
        body: details,
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185] },
      });

      // Convert PDF to blob
      const pdfBlob = doc.output('blob');
      
      // Create a shareable file
      const file = new File([pdfBlob], `service-request-${request.id}.pdf`, {
        type: 'application/pdf',
      });

      // Use Web Share API if available
      if (navigator.share) {
        await navigator.share({
          files: [file],
          title: 'Service Request Details',
          text: `Service request details for ${request.customerName}`,
        });
      } else {
        // Fallback to downloading if Web Share API is not available
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `service-request-${request.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error sharing request:', error);
    }
  };

  if (loading) {
    return <div>Loading service requests...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Service Requests</h2>
      
      <div className="grid gap-6">
        {requests.map((request) => (
          <Card key={request.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Request #{request.id.slice(-8)}</CardTitle>
                  <p className="text-sm text-gray-500">{request.customerName}</p>
                </div>
                <Badge
                  variant={
                    request.status === 'completed'
                      ? 'default'
                      : request.status === 'in-progress'
                      ? 'secondary'
                      : request.status === 'pending'
                      ? 'outline'
                      : 'destructive'
                  }
                >
                  {request.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Service Type</p>
                    <p>{request.serviceType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Urgency</p>
                    <p>{request.urgency}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Request Date</p>
                    <p>{new Date(request.requestDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Preferred Date</p>
                    <p>{new Date(request.preferredDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Description</p>
                  <p className="mt-1">{request.description}</p>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => generatePDF(request)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareRequest(request)}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
