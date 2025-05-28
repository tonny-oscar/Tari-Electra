
import { CreateBlogPostForm } from '@/components/admin/CreateBlogPostForm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit3 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { findBlogPost } from '@/data/blogPosts';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

type EditBlogPostPageProps = {
  params: { slug: string };
};

export async function generateMetadata({ params }: EditBlogPostPageProps): Promise<Metadata> {
  const post = findBlogPost(params.slug);
  if (!post) {
    return {
      title: 'Post Not Found - Admin Edit',
    };
  }
  return {
    title: `Edit: ${post.title} - Admin`,
    description: `Edit the blog post titled "${post.title}".`,
  };
}

export default function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const postToEdit = findBlogPost(params.slug);

  if (!postToEdit) {
    notFound();
  }

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
            <Edit3 className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Edit Blog Post</CardTitle>
          </div>
          <CardDescription>Modify the details for your article. Changes are in-memory for this prototype.</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateBlogPostForm 
            mode="edit" 
            initialData={postToEdit} 
            currentSlug={postToEdit.slug} 
          />
        </CardContent>
      </Card>
    </div>
  );
}
