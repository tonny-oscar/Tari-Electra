'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { SubmeterApplicationDialog } from './SubmeterDialog';
import { SubmeterApplicationDetailsModal } from './SubmeterApplicationDetailsModal';

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

  const handleViewDetails = (application: SubmeterApplication) => {
    setSelectedApplication(application);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Submeter Application Forms</h2>
        <SubmeterApplicationDialog />
      </div>

      <div className="space-y-4">
        {applications.length === 0 ? (
          <Card>
            <CardContent className="py-6">
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  You haven't submitted any sub-meter application forms yet.
                </p>
                <SubmeterApplicationDialog />
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

      <SubmeterApplicationDetailsModal
        application={selectedApplication}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedApplication(null);
        }}
      />
    </div>
  );
}
