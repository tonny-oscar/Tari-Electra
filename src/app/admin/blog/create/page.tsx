
import { CreateBlogPostForm } from '@/components/admin/CreateBlogPostForm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Feather } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export const metadata = {
  title: 'Create New Blog Post - Admin',
  description: 'Draft and publish a new article for the Tari Electra blog.',
};

export default function CreateBlogPostPage() {
  return (
    <div className="space-y-6">
       <div className="flex items-center justify-start mb-6">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog List
            </Link>
          </Button>
        </div>
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Feather className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Create New Blog Post</CardTitle>
          </div>
          <CardDescription>Fill in the details for your new article. This form currently logs data to the console.</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateBlogPostForm />
        </CardContent>
      </Card>
    </div>
  );
}
