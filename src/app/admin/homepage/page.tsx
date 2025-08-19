import { HomepageSettingsForm } from '@/components/admin/HomepageSettingsForm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { getHomepageSettings } from '@/data/homepageSettings';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Homepage Settings - Admin',
  description: 'Manage settings for the Tari Electra homepage.',
};

// Loading component for Suspense
function SettingsLoading() {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Settings className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl">Homepage Settings</CardTitle>
        </div>
        <CardDescription>
          Loading homepage settings...
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      </CardContent>
    </Card>
  );
}

// Settings content component
async function SettingsContent() {
  const currentSettings = await getHomepageSettings();
  
  return (
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
  );
}

export default function AdminHomepageSettingsPage() {
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
      
      <Suspense fallback={<SettingsLoading />}>
        <SettingsContent />
      </Suspense>
    </div>
  );
}