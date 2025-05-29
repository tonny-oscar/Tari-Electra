
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { findBlogPost } from '@/data/blogPosts'; 
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, CalendarDays, UserCircle, Tag } from 'lucide-react';
import type { Metadata } from 'next';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = findBlogPost(params.slug); 
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }
  return {
    title: `${post.title} - Tari Electra Blog`,
    description: post.excerpt,
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = findBlogPost(params.slug); 

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <article className="prose prose-lg dark:prose-invert max-w-none mx-auto bg-card p-6 sm:p-8 lg:p-10 rounded-xl shadow-xl">
          <div className="mb-8">
            <Button asChild variant="outline" size="sm" className="mb-6">
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>
            
            <div className="mb-3">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <Tag className="mr-1.5 h-3.5 w-3.5" />
                {post.category}
              </span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl mb-3">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <CalendarDays className="mr-1.5 h-4 w-4" />
                Published on {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <div className="flex items-center">
                <UserCircle className="mr-1.5 h-4 w-4" />
                By {post.author}
              </div>
            </div>
          </div>

          <div className="aspect-video w-full relative overflow-hidden rounded-lg mb-8 shadow-md bg-muted">
              <Image
              src={post.imageUrl || 'https://placehold.co/800x450.png'}
              alt={post.title}
              fill
              className="object-cover"
              data-ai-hint={post.imageHint || post.title.split(' ').slice(0,2).join(' ').toLowerCase() || 'article image'}
              priority
              />
          </div>
          
          <Separator className="my-8" />

          <div className="text-foreground space-y-6 text-base md:text-lg" dangerouslySetInnerHTML={{ __html: post.content }} />

        </article>
      </div>
    </div>
  );
}
