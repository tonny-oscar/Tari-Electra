
'use client';

import React, { useEffect, useRef } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CardContent, CardFooter } from '@/components/ui/card';
import { AlertCircle, Loader2, Save, Edit3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { BlogFormState, BlogPost } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { createBlogAction } from '@/app/actions/createBlogAction';
import { updateBlogAction } from '@/app/actions/updateBlogAction';

type CreateBlogPostFormProps = {
  initialData?: Partial<BlogPost>;
  currentSlug?: string; 
  mode?: 'create' | 'edit';
};

const initialFormState: BlogFormState = {
  message: '',
};

function SubmitButton({ mode }: { mode: 'create' | 'edit' }) {
  const { pending } = useFormStatus();
  const isEditing = mode === 'edit';
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full md:w-auto">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (isEditing ? <Edit3 className="mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />)}
      {isEditing ? 'Update Post' : 'Create Post'}
    </Button>
  );
}

export function CreateBlogPostForm({ initialData, currentSlug, mode = 'create' }: CreateBlogPostFormProps) {
  const { toast } = useToast();
  
  const actionToUse = mode === 'edit' && currentSlug 
    ? updateBlogAction.bind(null, currentSlug) 
    : createBlogAction;

  const [state, formAction] = useActionState(actionToUse, initialFormState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.isSuccess && state.message) {
      toast({
        title: 'Success!',
        description: state.message,
        variant: 'default',
        duration: 5000,
      });
      if (mode === 'create') {
        formRef.current?.reset();
      }
    } else if (state.isError && state.message && !state.fields) {
      toast({
        title: 'Error',
        description: state.message,
        variant: 'destructive',
        duration: 5000,
      });
    }
  }, [state, toast, mode]);

  return (
    <form action={formAction} ref={formRef}>
      <CardContent className="space-y-6 p-0 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" placeholder="Your Awesome Blog Post Title" defaultValue={initialData?.title} />
            {state.fields?.title && <p className="text-sm text-destructive mt-1">{state.fields.title.join(', ')}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input 
              id="slug" 
              name="slug" 
              placeholder="your-awesome-blog-post-title" 
              defaultValue={initialData?.slug}
              readOnly={mode === 'edit'} 
              className={mode === 'edit' ? 'bg-muted/50 cursor-not-allowed' : ''}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Lowercase alphanumeric & hyphens (e.g., my-first-post).
              {mode === 'edit' && <span className="font-semibold"> Cannot be changed after creation.</span>}
            </p>
            {state.fields?.slug && <p className="text-sm text-destructive mt-1">{state.fields.slug.join(', ')}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input id="author" name="author" placeholder="John Doe" defaultValue={initialData?.author} />
            {state.fields?.author && <p className="text-sm text-destructive mt-1">{state.fields.author.join(', ')}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input id="category" name="category" placeholder="e.g., Technology, News" defaultValue={initialData?.category} />
            {state.fields?.category && <p className="text-sm text-destructive mt-1">{state.fields.category.join(', ')}</p>}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea id="excerpt" name="excerpt" placeholder="A short summary of your blog post..." rows={3} defaultValue={initialData?.excerpt} />
          {state.fields?.excerpt && <p className="text-sm text-destructive mt-1">{state.fields.excerpt.join(', ')}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content (HTML or Text)</Label>
          <Textarea 
            id="content" 
            name="content" 
            placeholder="Write your full blog post content here. You can use HTML for formatting." 
            rows={10} 
            defaultValue={initialData?.content} 
          />
          {state.fields?.content && <p className="text-sm text-destructive mt-1">{state.fields.content.join(', ')}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input id="imageUrl" name="imageUrl" type="url" placeholder="https://example.com/image.png" defaultValue={initialData?.imageUrl || ''} />
                {state.fields?.imageUrl && <p className="text-sm text-destructive mt-1">{state.fields.imageUrl.join(', ')}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="imageHint">Image AI Hint</Label>
                <Input id="imageHint" name="imageHint" placeholder="e.g., modern building" defaultValue={initialData?.imageHint || ''} />
                <p className="text-xs text-muted-foreground">Optional. One or two keywords for AI image search.</p>
                {state.fields?.imageHint && <p className="text-sm text-destructive mt-1">{state.fields.imageHint.join(', ')}</p>}
            </div>
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
      <CardFooter className="pt-6 flex justify-end">
        <SubmitButton mode={mode} />
      </CardFooter>
    </form>
  );
}
