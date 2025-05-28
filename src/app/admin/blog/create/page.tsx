
import { CreateBlogPostForm } from '@/components/admin/CreateBlogPostForm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Create New Blog Post - Admin',
};

export default function CreateBlogPostPage() {
  return (
    <div className="space-y-6">
       <Button asChild variant="outline" size="sm">
        <Link href="/admin/blog">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog List
        </Link>
      </Button>
      <CreateBlogPostForm />
    </div>
  );
}
