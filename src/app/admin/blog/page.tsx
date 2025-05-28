
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { blogPosts } from '@/data/blogPosts'; // Using existing mock data for display
import { PlusCircle, Edit, Trash2, ExternalLink } from 'lucide-react';
import Image from 'next/image';

export default function AdminBlogListPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Blog Posts</h1>
          <p className="text-muted-foreground">Manage your articles here.</p>
        </div>
        <Button asChild>
          <Link href="/admin/blog/create">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Post
          </Link>
        </Button>
      </div>

      {blogPosts.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">No blog posts yet. Start by creating one!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Card key={post.slug} className="flex flex-col">
              {post.imageUrl && (
                 <div className="aspect-video w-full relative">
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      className="object-cover rounded-t-lg"
                      data-ai-hint={post.imageHint || 'article image'}
                    />
                  </div>
              )}
              <CardHeader>
                <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  {new Date(post.date).toLocaleDateString()} &bull; By {post.author} &bull; {post.category}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
              </CardContent>
              <CardFooter className="gap-2">
                <Button variant="outline" size="sm" disabled> {/* Disabled for prototype */}
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
                <Button variant="outline" size="sm" disabled className="text-destructive hover:text-destructive-foreground hover:bg-destructive/90 border-destructive/50"> {/* Disabled for prototype */}
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
                <Button variant="ghost" size="sm" asChild className="ml-auto">
                  <Link href={`/blog/${post.slug}`} target="_blank">
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
