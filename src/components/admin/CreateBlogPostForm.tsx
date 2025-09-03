'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { addBlogPost, updateBlogPost } from '@/data/blogPosts';
import { useRouter } from 'next/navigation';

interface BlogPost {
  id?: string;
  title: string;
  content: string;
  slug: string;
  published: boolean;
  imageUrl?: string;
}

interface CreateBlogPostFormProps {
  initialData?: BlogPost;
  mode?: 'create' | 'edit';
}

export function CreateBlogPostForm({ initialData, mode = 'create' }: CreateBlogPostFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    slug: initialData?.slug || '',
    published: initialData?.published || false,
    imageUrl: initialData?.imageUrl || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (mode === 'create') {
        const id = await addBlogPost(formData);
        if (id) {
          toast({
            title: 'Blog Post Created!',
            description: 'Your blog post has been saved successfully.',
          });
          router.push('/admin/blog');
        } else {
          throw new Error('Failed to create blog post');
        }
      } else {
        const success = await updateBlogPost(initialData?.id || '', formData);
        if (success) {
          toast({
            title: 'Blog Post Updated!',
            description: 'Your blog post has been updated successfully.',
          });
          router.push('/admin/blog');
        } else {
          throw new Error('Failed to update blog post');
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save blog post.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Save className="h-5 w-5" />
          {mode === 'create' ? 'Create New Blog Post' : 'Edit Blog Post'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter blog post title..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="blog-post-url-slug"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Featured Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setFormData({ ...formData, imageUrl: reader.result as string });
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="cursor-pointer"
            />
            <p className="text-xs text-muted-foreground">Upload an image for your blog post</p>
            {formData.imageUrl && (
              <div className="mt-2">
                <img 
                  src={formData.imageUrl} 
                  alt="Preview" 
                  className="w-32 h-32 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write your blog post content here... No rules, write however you feel!"
              rows={15}
              className="min-h-[400px]"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="rounded"
            />
            <Label htmlFor="published">Publish immediately</Label>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Blog Post' : 'Update Blog Post'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}