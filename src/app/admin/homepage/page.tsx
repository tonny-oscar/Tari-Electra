
import { HomepageSettingsForm } from '@/components/admin/HomepageSettingsForm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { getHomepageSettings } from '@/data/homepageSettings'; // Firestore version
import type { Metadata } from 'next';
import { unstable_noStore as noStore } from 'next/cache'; // Add noStore

export const metadata: Metadata = {
  title: 'Homepage Settings - Admin',
  description: 'Manage settings for the Tari Electra homepage.',
};

export default async function AdminHomepageSettingsPage() { // Make async
  noStore(); // Ensure fresh data
  const currentSettings = await getHomepageSettings(); // Await Firestore call

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-start mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin Dashboard
          </Link>
        </Button>
      </div>
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Homepage Settings</CardTitle>
          </div>
          <CardDescription>
            Modify settings for your homepage, such as the Hero Section image. 
            Changes are saved to Firestore.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <HomepageSettingsForm initialSettings={currentSettings} />
        </CardContent>
      </Card>
    </div>
  );
}
