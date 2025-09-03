'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { getBlogPost, type BlogPost } from '@/data/blogPosts';
import { useEffect, useState, use } from 'react';
import Link from 'next/link';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
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
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8">
              <p className="text-center text-muted-foreground">Loading post...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
              <p className="text-muted-foreground mb-4">The blog post you're looking for doesn't exist.</p>
              <Button asChild>
                <Link href="/blog">Back to Blog</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button asChild variant="outline" size="sm">
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>
          </div>

          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
            {post.imageUrl && (
              <div className="w-full">
                <img 
                  src={post.imageUrl} 
                  alt={post.title} 
                  className="w-full h-auto object-contain"
                />
              </div>
            )}
            
            <CardContent className="p-8 md:p-12">
              <header className="mb-8">
                <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-gray-900 leading-tight">{post.title}</h1>
                <div className="flex items-center gap-6 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <time className="font-medium">
                      {post.createdAt?.toDate?.()?.toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }) || 'Recently'}
                    </time>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    <span className="font-medium">Tari Electra Team</span>
                  </div>
                </div>
              </header>

              <article className="prose prose-lg max-w-none">
                <div className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                  {post.content}
                </div>
              </article>

              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="text-center">
                  <h3 className="text-2xl font-serif font-semibold mb-6 text-gray-900">Ready to get started?</h3>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button asChild size="lg">
                      <Link href="/products">Explore Our Products</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <Link href="/contact">Contact Us</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}