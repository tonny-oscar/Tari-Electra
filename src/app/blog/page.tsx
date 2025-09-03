'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, ArrowRight } from 'lucide-react';
import { getPublishedBlogPosts, type BlogPost } from '@/data/blogPosts';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      const publishedPosts = await getPublishedBlogPosts();
      setPosts(publishedPosts);
      setLoading(false);
    };
    loadPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Classic Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-5xl font-serif font-bold text-gray-900 mb-4">Our Journal</h1>
            <div className="w-24 h-1 bg-primary mx-auto mb-4"></div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Insights, innovations, and stories from the world of smart metering technology
            </p>
            <p className="text-sm text-gray-500 mt-2">{posts.length} articles published</p>
          </div>

          {loading ? (
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <div className="animate-pulse">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading our latest stories...</p>
                </div>
              </CardContent>
            </Card>
          ) : posts.length === 0 ? (
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">Coming Soon</h3>
                <p className="text-gray-600 text-lg max-w-md mx-auto">
                  We're crafting thoughtful stories about innovation in smart metering. Check back soon for our first articles.
                </p>
              </CardContent>
            </Card>
        ) : (
          <div className="grid gap-8">
            {posts.map((post, index) => (
              <article key={post.id} className={`group ${index === 0 ? 'lg:grid-cols-2' : ''}`}>
                <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-sm">
                  <div className={`${index === 0 ? 'lg:flex' : 'flex'} ${post.imageUrl ? '' : 'flex-col'}`}>
                    {post.imageUrl && (
                      <div className={`${index === 0 ? 'lg:w-1/2' : 'w-full lg:w-80'} relative overflow-hidden`}>
                        <img 
                          src={post.imageUrl} 
                          alt={post.title} 
                          className={`w-full ${index === 0 ? 'h-64 lg:h-full' : 'h-48'} object-cover group-hover:scale-105 transition-transform duration-700`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    )}
                    <CardContent className={`${index === 0 ? 'lg:w-1/2' : 'flex-1'} p-8`}>
                      <div className="flex items-center gap-2 text-sm text-primary/70 mb-3">
                        <Calendar className="h-4 w-4" />
                        <time className="font-medium">
                          {post.createdAt?.toDate?.()?.toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          }) || 'Recently'}
                        </time>
                      </div>
                      
                      <Link href={`/blog/${post.slug}`} className="block group-hover:text-primary transition-colors">
                        <h2 className={`${index === 0 ? 'text-3xl' : 'text-2xl'} font-serif font-bold text-gray-900 mb-4 leading-tight`}>
                          {post.title}
                        </h2>
                      </Link>
                      
                      <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                        {post.content.substring(0, index === 0 ? 200 : 150)}...
                      </p>
                      
                      <Link href={`/blog/${post.slug}`}>
                        <Button 
                          variant="ghost" 
                          className="group/btn p-0 h-auto font-semibold text-primary hover:text-primary/80 hover:bg-transparent"
                        >
                          Continue Reading
                          <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </CardContent>
                  </div>
                </Card>
              </article>
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}