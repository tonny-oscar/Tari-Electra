'use client';

import { CreateBlogPostForm } from '@/components/admin/CreateBlogPostForm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { getBlogPost, type BlogPost } from '@/data/blogPosts';
import { useEffect, useState, use } from 'react';

interface EditBlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const resolvedParams = use(params);

  useEffect(() => {
    const loadPost = async () => {
      const blogPost = await getBlogPost(resolvedParams.slug);
      setPost(blogPost);
      setLoading(false);
    };
    loadPost();
  }, [resolvedParams.slug]);

  if (loading) {
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
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Loading blog post...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!post) {
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
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Post Not Found</h2>
            <p className="text-muted-foreground">The blog post you're trying to edit doesn't exist.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
      
      <CreateBlogPostForm mode="edit" initialData={post} currentId={post.id} />
    </div>
  );
}