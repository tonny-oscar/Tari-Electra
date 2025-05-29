
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardContent, CardFooter } from '@/components/ui/card';
import { AlertCircle, Loader2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { HomepageSettings, HomepageSettingsFormState } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { updateHomepageSettingsAction } from '@/app/actions/updateHomepageSettingsAction';
import Image from 'next/image';

type HomepageSettingsFormProps = {
  initialSettings: HomepageSettings;
};

const initialFormState: HomepageSettingsFormState = {
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full md:w-auto">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
      Update Settings
    </Button>
  );
}

export function HomepageSettingsForm({ initialSettings }: HomepageSettingsFormProps) {
  const { toast } = useToast();
  const [state, formAction] = useFormState(updateHomepageSettingsAction, initialFormState);
  const formRef = useRef<HTMLFormElement>(null);
  const imageUrlRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialSettings?.heroImageUrl || null);

  useEffect(() => {
    if (state.isSuccess && state.message) {
      toast({
        title: 'Success!',
        description: state.message,
        variant: 'default',
        duration: 5000,
      });
      if (state.updatedSettings?.heroImageUrl) {
        setImagePreview(state.updatedSettings.heroImageUrl);
      }
    } else if (state.isError && state.message && !state.fields) {
      toast({
        title: 'Error',
        description: state.message,
        variant: 'destructive',
        duration: 5000,
      });
    }
  }, [state, toast]);

  useEffect(() => {
    // Update preview if initialSettings change (e.g., after successful save and re-fetch)
    setImagePreview(initialSettings?.heroImageUrl || null);
    if (imageUrlRef.current) {
        imageUrlRef.current.value = initialSettings?.heroImageUrl || '';
    }
  }, [initialSettings]);


  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setImagePreview(dataUrl);
        if (imageUrlRef.current) {
          imageUrlRef.current.value = dataUrl;
        }
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(initialSettings?.heroImageUrl || null); 
      if (imageUrlRef.current) {
        imageUrlRef.current.value = initialSettings?.heroImageUrl || '';
      }
    }
  };

  return (
    <form action={formAction} ref={formRef}>
      <CardContent className="space-y-6 p-0 md:p-6">
        <h3 className="text-lg font-medium text-foreground">Hero Section</h3>
        
        <div className="space-y-2">
            <Label htmlFor="imageFile">Upload Hero Image (Optional)</Label>
            <Input 
                id="imageFile" 
                name="imageFile" 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
            <p className="text-xs text-muted-foreground">Upload an image or provide a URL below. Upload will populate URL field.</p>
        </div>

        {imagePreview && (
          <div className="space-y-2">
            <Label>Hero Image Preview</Label>
            <Image 
              src={imagePreview} 
              alt="Hero image preview" 
              width={300} 
              height={200} // Assuming a 3:2 aspect ratio for preview
              className="rounded-md border object-contain bg-muted"
              onError={() => setImagePreview('https://placehold.co/300x200.png?text=Invalid+Image')}
            />
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="heroImageUrl">Hero Image URL</Label>
            <Input 
              id="heroImageUrl" 
              name="heroImageUrl" 
              type="text" 
              placeholder="https://example.com/hero.png or populated by upload" 
              defaultValue={initialSettings?.heroImageUrl || ''}
              ref={imageUrlRef}
              onChange={(e) => setImagePreview(e.target.value)} 
            />
            {state.fields?.heroImageUrl && <p className="text-sm text-destructive mt-1">{state.fields.heroImageUrl.join(', ')}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="heroImageHint">Hero Image AI Hint</Label>
            <Input 
              id="heroImageHint" 
              name="heroImageHint" 
              placeholder="e.g., modern building technology" 
              defaultValue={initialSettings?.heroImageHint || ''} 
            />
            <p className="text-xs text-muted-foreground">Optional. One or two keywords for AI image search.</p>
            {state.fields?.heroImageHint && <p className="text-sm text-destructive mt-1">{state.fields.heroImageHint.join(', ')}</p>}
          </div>
        </div>
        
        {/* Placeholder for more homepage settings in the future */}
        {/* <Separator className="my-6" />
        <h3 className="text-lg font-medium text-foreground">Other Section</h3>
        ... more fields ... */}

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
        <SubmitButton />
      </CardFooter>
    </form>
  );
}
