import { notFound } from 'next/navigation';
import { getBlogPostBySlug, getBlogPosts } from '@/data/blogPosts';
import type { Metadata } from 'next';
import { CalendarDays, UserCircle, Tag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

type BlogPostPageProps = {
  params: { slug: string };
};

// --- Metadata ---
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  try {
    const post = await getBlogPostBySlug(params.slug);

    if (!post) {
      return {
        title: 'Post Not Found - Tari Electra Blog',
      };
    }

    return {
      title: `${post.title} - Tari Electra Blog`,
      description: post.excerpt,
    };
  } catch (error) {
    return {
      title: 'Post Not Found - Tari Electra Blog',
    };
  }
}

// --- Page Component ---
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  try {
    const post = await getBlogPostBySlug(params.slug);

    if (!post) {
      notFound();
    }

    return (
      <div className="bg-background">
        <div className="container mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Button asChild variant="ghost">
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>
          </div>

          <article>
            <header className="mb-8">
              <div className="mb-4">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  <Tag className="mr-1.5 h-3.5 w-3.5" />
                  {post.category}
                </span>
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-6">
                {post.title}
              </h1>

              <div className="flex items-center space-x-6 text-muted-foreground mb-8">
                <div className="flex items-center">
                  <CalendarDays className="mr-2 h-5 w-5" />
                  {new Date(post.date as string).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
                <div className="flex items-center">
                  <UserCircle className="mr-2 h-5 w-5" />
                  {post.author}
                </div>
              </div>

              {post.imageUrl && (
                <div className="aspect-[2/1] w-full relative bg-muted rounded-lg overflow-hidden mb-8">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </header>

            <div className="prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
          </article>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading blog post:', error);
    notFound();
  }
}

// --- Static Params for SSG ---
export async function generateStaticParams() {
  try {
    const posts = await getBlogPosts();
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params for blog posts:', error);
    return [];
  }
}
