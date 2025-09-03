
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CardContent, CardFooter } from '@/components/ui/card';
import { AlertCircle, Loader2, Save, Edit3, Upload, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { ProductFormState, Product } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { addCustomerProductAction, updateCustomerProductAction } from '@/app/actions/customerProductActions';
import { addHomepageProductAction, updateHomepageProductAction } from '@/app/actions/homepageProductActions';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type CreateProductFormProps = {
  initialData?: Partial<Product>;
  currentId?: string;
  mode?: 'create' | 'edit';
  isHomepageProduct?: boolean;
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

export function CreateProductForm({ initialData, currentId, mode = 'create', isHomepageProduct = false }: CreateProductFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [formState, setFormState] = useState<ProductFormState>(initialFormState);
  const formRef = useRef<HTMLFormElement>(null);
  const imageUrlRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);
  const [selectedCategory, setSelectedCategory] = useState(initialData?.category || '');
  const [selectedSubcategory, setSelectedSubcategory] = useState(initialData?.subcategory || '');
  
  const subcategoryOptions: Record<string, string[]> = {
    'Water Meter': ['Prepaid Meter', 'Smart Meter'],
    'Energy Meter': ['Prepaid Meter', 'Smart Meter']
  };
  
  // Reset subcategory when category changes
  React.useEffect(() => {
    if (selectedCategory && !subcategoryOptions[selectedCategory]?.includes(selectedSubcategory)) {
      setSelectedSubcategory('');
    }
  }, [selectedCategory, selectedSubcategory]);

  const handleFormAction = async (formData: FormData) => {
    console.log('[CreateProductForm] handleFormAction called. Mode:', mode);
    console.log('[CreateProductForm] FormData entries:', Array.from(formData.entries()));
    setFormState(prev => ({ ...prev, message: '', fields: undefined, isError: false, isSuccess: false })); 

    const productData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      category: formData.get('category') as string,
      subcategory: formData.get('subcategory') as string,
      features: (formData.get('features') as string)?.split(',').map(f => f.trim()).filter(Boolean) || [],
      specifications: (formData.get('specifications') as string)?.split(',').map(s => s.trim()).filter(Boolean) || [],
      imageUrl: formData.get('imageUrl') as string,
      imageHint: formData.get('imageHint') as string,
    };

    let result;
    if (mode === 'edit' && currentId) {
      if (isHomepageProduct) {
        result = await updateHomepageProductAction(currentId, productData);
      } else {
        result = await updateCustomerProductAction(currentId, productData);
      }
    } else {
      if (isHomepageProduct) {
        result = await addHomepageProductAction(productData);
      } else {
        result = await addCustomerProductAction(productData);
      }
    }
    
    if (result.isSuccess) {
      setFormState({
        message: result.message,
        isSuccess: true,
        isError: false,
      });
      if (mode === 'create') {
        formRef.current?.reset();
        setImagePreview(null);
      }
      // Don't reset form data on edit - keep existing values
    } else {
      setFormState({
        message: result.message,
        isSuccess: false,
        isError: true,
      });
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
        } else if (mode === 'edit' && 'updatedProduct' in formState && (formState as any).updatedProduct) {
          // Potentially reset message for edit, or handle as needed
          // setFormState(prev => ({ ...prev, isSuccess: false, message: '' })); 
          if((formState as any).updatedProduct.imageUrl) setImagePreview((formState as any).updatedProduct.imageUrl);
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
            <Label htmlFor="category" className="text-sm font-semibold text-gray-700">Category *</Label>
            <div className="relative">
              <select
                id="category"
                name="category"
                value={selectedCategory}
                onChange={(e) => {
                  const newCategory = e.target.value;
                  setSelectedCategory(newCategory);
                  setSelectedSubcategory(''); // Reset subcategory when category changes
                }}
                className="appearance-none flex h-12 w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 shadow-sm transition-all duration-200 hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
              >
                <option value="" className="text-gray-500">Choose a category...</option>
                <option value="Water Meter" className="font-medium">💧 Water Meter</option>
                <option value="Energy Meter" className="font-medium">⚡ Energy Meter</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            {formState.fields?.category && <p className="text-sm text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="h-4 w-4" />{formState.fields.category.join(', ')}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subcategory" className="text-sm font-semibold text-gray-700">Subcategory *</Label>
            <div className="relative">
              <select
                id="subcategory"
                name="subcategory"
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                disabled={!selectedCategory}
                className={`appearance-none flex h-12 w-full rounded-lg border-2 bg-white px-4 py-3 text-sm font-medium shadow-sm transition-all duration-200 ${
                  !selectedCategory 
                    ? 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed' 
                    : 'border-gray-200 text-gray-900 hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10'
                }`}
              >
                <option value="">
                  {!selectedCategory ? 'Select category first...' : 'Choose subcategory...'}
                </option>
                {/* Water Meter Options */}
                {selectedCategory === 'Water Meter' && (
                  <>
                    <option value="Prepaid Meter">💳 Prepaid Meter</option>
                    <option value="Smart Meter">🔌 Smart Meter</option>
                  </>
                )}
                {/* Energy Meter Options */}
                {selectedCategory === 'Energy Meter' && (
                  <>
                    <option value="Prepaid Meter">💳 Prepaid Meter</option>
                    <option value="Smart Meter">🔌 Smart Meter</option>
                  </>
                )}
              </select>
              <ChevronDown className={`absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 pointer-events-none transition-colors ${
                !selectedCategory ? 'text-gray-300' : 'text-gray-400'
              }`} />
            </div>
            {formState.fields?.subcategory && <p className="text-sm text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="h-4 w-4" />{formState.fields.subcategory.join(', ')}</p>}
            {selectedCategory && (
              <p className="text-xs text-blue-600 mt-1">
                ✨ Available: Prepaid Meter, Smart Meter
              </p>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="features">Features (comma-separated)</Label>
          <Textarea 
            id="features" 
            name="features" 
            placeholder="e.g., STS Compliant, Tamper Detection, Low Credit Warning" 
            rows={3} 
            defaultValue={initialData?.features?.join(', ') || ''} 
          />
           <p className="text-xs text-muted-foreground">Enter features separated by commas.</p>
          {formState.fields?.features && <p className="text-sm text-destructive mt-1">{formState.fields.features.join(', ')}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="specifications">Specifications (comma-separated)</Label>
          <Textarea 
            id="specifications" 
            name="specifications" 
            placeholder="e.g., Voltage: 240V, Current: 60A, Accuracy: Class 1, Display: LCD" 
            rows={3} 
            defaultValue={initialData?.specifications?.join(', ') || ''} 
          />
           <p className="text-xs text-muted-foreground">Enter technical specifications separated by commas.</p>
          {formState.fields?.specifications && <p className="text-sm text-destructive mt-1">{formState.fields.specifications.join(', ')}</p>}
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

