
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getBlogPosts } from '@/data/blogPosts';
import { PlusCircle, ExternalLink, Newspaper } from 'lucide-react';
import Image from 'next/image';
import { BlogActionsCell } from '@/components/admin/BlogActionsCell';
import type { BlogPost } from '@/lib/types';
import { formatDate } from '@/lib/utils/date';

export default async function AdminBlogListPage() {
  const posts: BlogPost[] = await getBlogPosts(); 

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Newspaper className="h-7 w-7 text-primary" />
          <div>
            <h1 className="text-2xl font-semibold">Blog Posts</h1>
            <p className="text-muted-foreground">Manage your articles here. Data saved to JSON.</p>
          </div>
        </div>
        <Button asChild>
          <Link href="/admin/blog/create">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Post
          </Link>
        </Button>
      </div>

      {posts.length === 0 ? (
        <Card className="shadow-md">
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">No blog posts yet. Start by creating one!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {posts.map((post: BlogPost) => (
            <Card key={post.slug} className="flex flex-col shadow-md hover:shadow-lg transition-shadow">
              <div className="aspect-[3/2] w-full relative bg-muted rounded-t-lg overflow-hidden">
                <Image
                  src={post.imageUrl || 'https://placehold.co/600x400.png'}
                  alt={post.title}
                  fill
                  className="object-cover"
                  data-ai-hint={post.imageHint || post.title.split(' ').slice(0,2).join(' ').toLowerCase() || 'article image'}
                />
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold line-clamp-2 leading-tight">{post.title}</CardTitle>
                <CardDescription className="text-xs text-muted-foreground pt-1">
                  {formatDate(post.date)} &bull; {post.category}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow pt-0">
                <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
                 <p className="text-xs text-muted-foreground mt-2">By {post.author}</p>
              </CardContent>
              <CardFooter className="gap-2 pt-3 items-center">
                <BlogActionsCell slug={post.slug} title={post.title} />
                <Button variant="ghost" size="icon" asChild className="shrink-0 ml-auto">
                  <Link href={`/blog/${post.slug}`} target="_blank" aria-label="View post">
                     <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
