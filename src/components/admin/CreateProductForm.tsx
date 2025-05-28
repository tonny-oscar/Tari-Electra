
'use client';

import React, { useEffect, useRef } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CardContent, CardFooter } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Loader2, Save, Edit3, ShoppingBag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { ProductFormState, Product } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { createProductAction } from '@/app/actions/createProductAction';
import { updateProductAction } from '@/app/actions/updateProductAction';

type CreateProductFormProps = {
  initialData?: Partial<Product>;
  currentId?: string; // Used for identifying the product to update
  mode?: 'create' | 'edit';
};

const initialFormState: ProductFormState = {
  message: '',
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
  
  const actionToUse = mode === 'edit' && currentId 
    ? updateProductAction.bind(null, currentId)
    : createProductAction;

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
        {/* Product ID (read-only if editing) */}
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
          {state.fields?.name && <p className="text-sm text-destructive mt-1">{state.fields.name.join(', ')}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" placeholder="Detailed description of the product..." rows={4} defaultValue={initialData?.description} />
          {state.fields?.description && <p className="text-sm text-destructive mt-1">{state.fields.description.join(', ')}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="price">Price (KES)</Label>
            <Input id="price" name="price" type="number" placeholder="e.g., 2500.00" defaultValue={initialData?.price?.toString()} step="0.01" />
            {state.fields?.price && <p className="text-sm text-destructive mt-1">{state.fields.price.join(', ')}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input id="category" name="category" placeholder="e.g., Prepaid Meters, Services" defaultValue={initialData?.category} />
            {state.fields?.category && <p className="text-sm text-destructive mt-1">{state.fields.category.join(', ')}</p>}
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
          {state.fields?.features && <p className="text-sm text-destructive mt-1">{state.fields.features.join(', ')}</p>}
        </div>

        {/* Image URL and Hint are not directly editable in this form for simplicity,
            they are handled by the addProduct/updateProduct logic with placeholders.
            A real app would have image upload capabilities. */}

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
