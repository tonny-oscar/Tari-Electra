
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CardContent, CardFooter } from '@/components/ui/card';
import { AlertCircle, Loader2, Save, Edit3 } from 'lucide-react'; // Removed CheckCircle, ShoppingBag
import { useToast } from '@/hooks/use-toast';
import type { ProductFormState, Product } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { createProductAction } from '@/app/actions/createProductAction';
import { updateProductAction } from '@/app/actions/updateProductAction';

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
  const [formState, setFormState] = useState<ProductFormState>(initialFormState);
  const formRef = useRef<HTMLFormElement>(null);

  const handleFormAction = async (formData: FormData) => {
    console.log('[CreateProductForm] handleFormAction called. Mode:', mode);
    // Log formData entries
    // @ts-ignore
    for (let pair of formData.entries()) {
      console.log(`[CreateProductForm] FormData: ${pair[0]}= ${pair[1]}`);
    }

    let result: ProductFormState;
    if (mode === 'edit' && currentId) {
      result = await updateProductAction(currentId, initialFormState, formData);
    } else {
      result = await createProductAction(initialFormState, formData);
    }
    console.log('[CreateProductForm] Server action result:', result);
    setFormState(result);
  };

  useEffect(() => {
    console.log('[CreateProductForm] useEffect triggered. FormState:', formState);
    if (formState.isSuccess && formState.message) {
      toast({
        title: 'Success!',
        description: formState.message,
        variant: 'default',
        duration: 5000,
      });
      if (mode === 'create' && formRef.current) {
        formRef.current.reset();
      }
      // Reset form state after showing toast to prevent re-triggering
      setFormState(initialFormState); 
    } else if (formState.isError && formState.message) { // Simplified condition for error toast
      toast({
        title: 'Error',
        description: formState.message,
        variant: 'destructive',
        duration: 5000,
      });
       // Reset form state after showing toast
       setFormState(initialFormState);
    }
  }, [formState, toast, mode]);

  return (
    <form action={handleFormAction} ref={formRef}>
      <CardContent className="space-y-6 p-0 md:p-6">
        {mode === 'edit' && initialData?.id && (
          <div className="space-y-2">
            <Label htmlFor="id">Product ID</Label>
            <Input id="id" name="id" defaultValue={initialData.id} readOnly className="bg-muted/50 cursor-not-allowed" />
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
