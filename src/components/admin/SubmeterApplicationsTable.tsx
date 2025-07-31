'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SubmeterApplication } from '@/lib/types/submeter';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

export default function SubmeterApplicationsTable() {
  const [applications, setApplications] = useState<SubmeterApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'submeterApplications'),
      orderBy('submissionDate', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as SubmeterApplication[];
      setApplications(apps);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Submission Date</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Property Type</TableHead>
            <TableHead>Application Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((app) => (
            <TableRow key={app.id}>
              <TableCell>
                {format(new Date(app.submissionDate), 'PPP')}
              </TableCell>
              <TableCell>{app.fullName}</TableCell>
              <TableCell>{app.propertyType}</TableCell>
              <TableCell>{app.applicationType}</TableCell>
              <TableCell>
                <span className={`capitalize ${
                  app.status === 'approved' ? 'text-green-600' :
                  app.status === 'rejected' ? 'text-red-600' :
                  'text-yellow-600'
                }`}>
                  {app.status}
                </span>
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // TODO: Implement view details modal
                    console.log('View details:', app.id);
                  }}
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
