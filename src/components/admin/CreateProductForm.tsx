
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CardContent, CardFooter } from '@/components/ui/card';
import { AlertCircle, Loader2, Save, Edit3, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { ProductFormState, Product } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { createProductAction } from '@/app/actions/createProductAction';
import { updateProductAction } from '@/app/actions/updateProductAction';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type CreateProductFormProps = {
  initialData?: Partial<Product>;
  currentId?: string;
  mode?: 'create' | 'edit';
};

const initialFormState: ProductFormState = {
  message: '',
  isError: false,
  isSuccess: false,
};

function SubmitButton({ mode }: { mode: 'create' | 'edit' }) {
  const { pending } = useFormStatus();
  const isEditing = mode === 'edit';
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full md:w-auto">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (isEditing ? <Edit3 className="mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />)}
      {isEditing ? 'Update Product' : 'Create Product'}
    </Button>
  );
}

export function CreateProductForm({ initialData, currentId, mode = 'create' }: CreateProductFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [formState, setFormState] = useState<ProductFormState>(initialFormState);
  const formRef = useRef<HTMLFormElement>(null);
  const imageUrlRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);

  const handleFormAction = async (formData: FormData) => {
    console.log('[CreateProductForm] handleFormAction called. Mode:', mode);
    console.log('[CreateProductForm] FormData entries:', Array.from(formData.entries()));
    setFormState(prev => ({ ...prev, message: '', fields: undefined, isError: false, isSuccess: false })); 

    let result: ProductFormState;
    if (mode === 'edit' && currentId) {
      result = await updateProductAction(currentId, initialFormState, formData);
    } else {
      result = await createProductAction(initialFormState, formData);
    }
    console.log('[CreateProductForm] Server action result:', result);
    setFormState(result);
    if (result.isSuccess) {
        if(mode === 'create') {
          setImagePreview(null); 
        } else if (result.updatedProduct?.imageUrl) {
          setImagePreview(result.updatedProduct.imageUrl);
        }
    }
  };

  useEffect(() => {
    console.log('[CreateProductForm] Form state changed:', formState);
    if (formState.message) {
      if (formState.isSuccess) {
        toast({
          title: 'Success!',
          description: formState.message,
          variant: 'default',
          duration: 5000,
        });
        if (mode === 'create' && formRef.current) {
          formRef.current.reset();
          setImagePreview(null); 
          // Reset local state after successful create
          setFormState(initialFormState); 
        } else if (mode === 'edit' && formState.updatedProduct) {
          // Potentially reset message for edit, or handle as needed
          // setFormState(prev => ({ ...prev, isSuccess: false, message: '' })); 
          if(formState.updatedProduct.imageUrl) setImagePreview(formState.updatedProduct.imageUrl);
          router.refresh(); // Good practice to refresh after edit
        }
      } else if (formState.isError && !formState.fields) { 
        toast({
          title: 'Error',
          description: formState.message,
          variant: 'destructive',
          duration: 5000,
        });
         // setFormState(prev => ({ ...prev, isError: false, message: '' })); 
      }
    }
  }, [formState, toast, mode, router]);
  
  useEffect(() => {
    if (initialData?.imageUrl) {
      setImagePreview(initialData.imageUrl);
    }
    if (mode === 'create' && !initialData?.imageUrl) {
        setImagePreview(null);
    }
  }, [initialData, mode]);

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
      setImagePreview(initialData?.imageUrl || null);
      if (imageUrlRef.current) {
          imageUrlRef.current.value = initialData?.imageUrl || ''; 
      }
    }
  };

  return (
    <form action={handleFormAction} ref={formRef}>
      <CardContent className="space-y-6 p-0 md:p-6">
        {mode === 'edit' && initialData?.id && (
          <div className="space-y-2">
            <Label htmlFor="id-display">Product ID</Label>
            <Input id="id-display" name="id-display" defaultValue={initialData.id} readOnly className="bg-muted/50 cursor-not-allowed" />
            <p className="text-xs text-muted-foreground">Product ID cannot be changed.</p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input id="name" name="name" placeholder="e.g., Tari Standard Meter" defaultValue={initialData?.name} />
          {formState.fields?.name && <p className="text-sm text-destructive mt-1">{formState.fields.name.join(', ')}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" placeholder="Detailed description of the product..." rows={4} defaultValue={initialData?.description} />
          {formState.fields?.description && <p className="text-sm text-destructive mt-1">{formState.fields.description.join(', ')}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="price">Price (KES)</Label>
            <Input id="price" name="price" type="number" placeholder="e.g., 2500.00" defaultValue={initialData?.price?.toString()} step="0.01" />
            {formState.fields?.price && <p className="text-sm text-destructive mt-1">{formState.fields.price.join(', ')}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input id="category" name="category" placeholder="e.g., Prepaid Meters, Services" defaultValue={initialData?.category} />
            {formState.fields?.category && <p className="text-sm text-destructive mt-1">{formState.fields.category.join(', ')}</p>}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="features">Features (comma-separated)</Label>
          <Textarea 
            id="features" 
            name="features" 
            placeholder="e.g., STS Compliant, Tamper Detection, Low Credit Warning" 
            rows={3} 
            defaultValue={initialData?.features?.join(', ')} 
          />
           <p className="text-xs text-muted-foreground">Enter features separated by commas.</p>
          {formState.fields?.features && <p className="text-sm text-destructive mt-1">{formState.fields.features.join(', ')}</p>}
        </div>
        
        <div className="space-y-2">
            <Label htmlFor="imageFile">Upload Image (Optional)</Label>
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
            <Label>Image Preview</Label>
            <Image 
              src={imagePreview} 
              alt="Image preview" 
              width={200} 
              height={200} 
              className="rounded-md border object-contain" 
              onError={() => setImagePreview('https://placehold.co/200x200.png?text=Invalid+Image')}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input 
              id="imageUrl" 
              name="imageUrl" 
              type="text" 
              placeholder="https://example.com/image.png or populated by upload" 
              defaultValue={initialData?.imageUrl || ''}
              ref={imageUrlRef} 
              onChange={(e) => setImagePreview(e.target.value)} 
            />
            {formState.fields?.imageUrl && <p className="text-sm text-destructive mt-1">{formState.fields.imageUrl.join(', ')}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageHint">Image AI Hint</Label>
            <Input id="imageHint" name="imageHint" placeholder="e.g., smart meter" defaultValue={initialData?.imageHint || ''} />
            <p className="text-xs text-muted-foreground">Optional. One or two keywords for AI image generation.</p>
            {formState.fields?.imageHint && <p className="text-sm text-destructive mt-1">{formState.fields.imageHint.join(', ')}</p>}
          </div>
        </div>

        {formState.isError && formState.fields && formState.message && (
           <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Form Error</AlertTitle>
            <AlertDescription>
              {formState.message} Please correct the highlighted fields.
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

