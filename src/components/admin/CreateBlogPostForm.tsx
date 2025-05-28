
'use client';

import React, { useEffect, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Loader2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createBlogAction, type CreateBlogFormState } from '@/app/actions/createBlogAction';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const initialState: CreateBlogFormState = {
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
      Create Post
    </Button>
  );
}

export function CreateBlogPostForm() {
  const { toast } = useToast();
  const [state, formAction] = useFormState(createBlogAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.isSuccess && state.message) {
      toast({
        title: 'Success!',
        description: state.message,
        variant: 'default',
      });
      formRef.current?.reset(); // Reset form on successful submission
      // Optionally, redirect or clear specific fields
    } else if (state.isError && state.message && !state.fields) {
      // General error not related to specific fields
      toast({
        title: 'Error',
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state, toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Blog Post</CardTitle>
        <CardDescription>Fill in the details for your new article.</CardDescription>
      </CardHeader>
      <form action={formAction} ref={formRef}>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" placeholder="Your Awesome Blog Post Title" />
            {state.fields?.title && <p className="text-sm text-destructive mt-1">{state.fields.title.join(', ')}</p>}
          </div>

          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" name="slug" placeholder="your-awesome-blog-post-title" />
            <p className="text-xs text-muted-foreground mt-1">Lowercase alphanumeric characters and hyphens only (e.g., my-first-post).</p>
            {state.fields?.slug && <p className="text-sm text-destructive mt-1">{state.fields.slug.join(', ')}</p>}
          </div>

          <div>
            <Label htmlFor="author">Author</Label>
            <Input id="author" name="author" placeholder="John Doe" />
            {state.fields?.author && <p className="text-sm text-destructive mt-1">{state.fields.author.join(', ')}</p>}
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Input id="category" name="category" placeholder="e.g., Technology, News" />
            {state.fields?.category && <p className="text-sm text-destructive mt-1">{state.fields.category.join(', ')}</p>}
          </div>
          
          <div>
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea id="excerpt" name="excerpt" placeholder="A short summary of your blog post..." rows={3} />
            {state.fields?.excerpt && <p className="text-sm text-destructive mt-1">{state.fields.excerpt.join(', ')}</p>}
          </div>

          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea id="content" name="content" placeholder="Write your full blog post content here. Basic text for now." rows={10} />
            {state.fields?.content && <p className="text-sm text-destructive mt-1">{state.fields.content.join(', ')}</p>}
          </div>

          {state.isError && state.message && state.fields && (
             <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Form Error</AlertTitle>
              <AlertDescription>
                {state.message} Please correct the highlighted fields.
              </AlertDescription>
            </Alert>
          )}

        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
