import { CreateBlogPostForm } from '@/components/admin/CreateBlogPostForm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface EditBlogPostPageProps {
  params: {
    slug: string;
  };
}

export default function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-start mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog Management
          </Link>
        </Button>
      </div>
      
      <CreateBlogPostForm mode="edit" />
    </div>
  );
}