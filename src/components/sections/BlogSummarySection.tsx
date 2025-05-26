import Link from "next/link";
import Image from "next/image";
import { blogPosts } from "@/data/blogPosts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CalendarDays, UserCircle } from "lucide-react";

export function BlogSummarySection() {
  const recentPosts = blogPosts.slice(0, 3); // Display latest 3 posts

  return (
    <section id="blog-summary" className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Latest Insights & Advice
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Stay informed with our articles on energy saving, metering laws, and landlord tips.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {recentPosts.map((post) => (
            <Card key={post.slug} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="aspect-video w-full relative">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                    data-ai-hint={post.imageHint}
                  />
                </div>
              </Link>
              <CardHeader>
                <Link href={`/blog/${post.slug}`}>
                  <CardTitle className="text-xl font-semibold hover:text-primary transition-colors">{post.title}</CardTitle>
                </Link>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-2">
                  <div className="flex items-center">
                    <CalendarDays className="mr-1.5 h-4 w-4" />
                    {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <div className="flex items-center">
                    <UserCircle className="mr-1.5 h-4 w-4" />
                    {post.author}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>{post.excerpt}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button asChild variant="link" className="px-0 text-primary">
                  <Link href={`/blog/${post.slug}`}>
                    Read More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        {blogPosts.length > 3 && (
          <div className="mt-12 text-center">
            <Button asChild size="lg">
              <Link href="/blog">
                View All Articles <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
