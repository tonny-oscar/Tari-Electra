
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { blogPosts } from '@/data/blogPosts';
import { PlusCircle, Edit, Trash2, ExternalLink, Newspaper } from 'lucide-react';
import Image from 'next/image';

export default function AdminBlogListPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Newspaper className="h-7 w-7 text-primary" />
          <div>
            <h1 className="text-2xl font-semibold">Blog Posts</h1>
            <p className="text-muted-foreground">Manage your articles here.</p>
          </div>
        </div>
        <Button asChild>
          <Link href="/admin/blog/create">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Post
          </Link>
        </Button>
      </div>

      {blogPosts.length === 0 ? (
        <Card className="shadow-md">
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">No blog posts yet. Start by creating one!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {blogPosts.map((post) => (
            <Card key={post.slug} className="flex flex-col shadow-md hover:shadow-lg transition-shadow">
              {post.imageUrl && (
                 <div className="aspect-[16/9] w-full relative"> {/* common aspect ratio */}
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      className="object-cover rounded-t-lg"
                      data-ai-hint={post.imageHint || 'article image'}
                    />
                  </div>
              )}
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold line-clamp-2 leading-tight">{post.title}</CardTitle>
                <CardDescription className="text-xs text-muted-foreground pt-1">
                  {new Date(post.date).toLocaleDateString()} &bull; {post.category}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow pt-0">
                <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
                 <p className="text-xs text-muted-foreground mt-2">By {post.author}</p>
              </CardContent>
              <CardFooter className="gap-2 pt-3">
                <Button variant="outline" size="sm" disabled className="flex-1"> {/* Disabled for prototype */}
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
                <Button variant="outline" size="sm" disabled className="text-destructive hover:text-destructive-foreground hover:bg-destructive/90 border-destructive/50 flex-1"> {/* Disabled for prototype */}
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
                <Button variant="ghost" size="icon" asChild className="shrink-0">
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
