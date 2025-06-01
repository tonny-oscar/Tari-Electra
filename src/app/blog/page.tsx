
import Link from "next/link";
import Image from "next/image";
import { getBlogPosts } from "@/data/blogPosts"; 
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CalendarDays, UserCircle, Tag } from "lucide-react";
import type { Metadata } from 'next';
import { headers } from 'next/headers'; 
import { unstable_noStore as noStore } from 'next/cache'; 
import type { BlogPost } from "@/lib/types";
import { BlogSubscriptionForm } from "@/components/blog/BlogSubscriptionForm"; // Import the new component

export const metadata: Metadata = {
  title: "Blog - Tari Electra",
  description: "Articles and insights on energy saving, sub-metering, and landlord advice.",
};

export default async function BlogPage() {
  headers(); 
  noStore(); 
  
  console.log('[BlogPage] Fetching blog posts from Firestore for public page...');
  const posts: BlogPost[] = await getBlogPosts(); 
  console.log(`[BlogPage] Public page fetched ${posts.length} posts:`, posts.map(p => ({ slug: p.slug, title: p.title })));

  return (
    <div className="bg-secondary">
      <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Tari Electra Blog
          </h1>
          <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay informed with our latest articles, tips, and news on smart sub-metering and energy management.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl text-muted-foreground">No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Card key={post.slug} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-background">
                 <Link href={`/blog/${post.slug}`} className="block">
                  <div className="aspect-[3/2] w-full relative bg-muted">
                    <Image
                      src={post.imageUrl || 'https://placehold.co/600x400.png'}
                      alt={post.title}
                      fill
                      className="object-cover"
                      data-ai-hint={post.imageHint || post.title.split(' ').slice(0,2).join(' ').toLowerCase() || 'article image'}
                    />
                  </div>
                </Link>
                <CardHeader>
                  <div className="mb-2">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      <Tag className="mr-1.5 h-3.5 w-3.5" />
                      {post.category}
                    </span>
                  </div>
                  <Link href={`/blog/${post.slug}`}>
                    <CardTitle className="text-2xl font-semibold leading-tight hover:text-primary transition-colors">{post.title}</CardTitle>
                  </Link>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-3">
                    <div className="flex items-center">
                      <CalendarDays className="mr-1.5 h-4 w-4" />
                      {new Date(post.date as string).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <div className="flex items-center">
                      <UserCircle className="mr-1.5 h-4 w-4" />
                      {post.author}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription className="text-base">{post.excerpt}</CardDescription>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="link" className="px-0 text-primary text-base">
                    <Link href={`/blog/${post.slug}`}>
                      Read More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Add Subscription Form Section */}
        <div className="mt-16 md:mt-24 max-w-xl mx-auto">
            <BlogSubscriptionForm />
        </div>

      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const posts = await getBlogPosts(); 
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
