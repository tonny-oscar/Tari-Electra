// This file is no longer used on the main landing page as per the new structure.
// The main blog page at /blog still uses blogPosts data directly.
// This component can be kept for potential future use.
'use client';

import Link from "next/link";
import Image from "next/image";
import { blogPosts } from "@/data/blogPosts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CalendarDays, UserCircle } from "lucide-react";
import { motion } from "framer-motion";

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.2 }
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};


export function BlogSummarySection() {
  const recentPosts = blogPosts.slice(0, 3); // Display latest 3 posts

  return (
    <section id="blog-summary" className="py-16 lg:py-24 bg-background">
      <motion.div 
        className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={sectionVariants}
      >
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            variants={itemVariants}
          >
            Latest Insights & Advice
          </motion.h2>
          <motion.p 
            className="mt-4 text-lg text-muted-foreground"
            variants={itemVariants}
          >
            Stay informed with our articles on energy saving, metering laws, and landlord tips.
          </motion.p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {recentPosts.map((post) => (
             <motion.div key={post.slug} variants={itemVariants}>
              <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
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
            </motion.div>
          ))}
        </div>
        {blogPosts.length > 3 && (
          <motion.div className="mt-12 text-center" variants={itemVariants}>
            <Button asChild size="lg">
              <Link href="/blog">
                View All Articles <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
