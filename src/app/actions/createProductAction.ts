
'use server';

import type { Product, ProductFormState } from '@/lib/types';
import { addProduct } from '@/data/products';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const CreateProductSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  price: z.coerce.number().positive({ message: 'Price must be a positive number.' }),
  category: z.string().min(2, { message: 'Category must be at least 2 characters.' }),
  features: z.string().optional(), 
  imageUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  imageHint: z.string().optional(),
});

export async function createProductAction(
  prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  console.log('[createProductAction] Action invoked.');
  const rawFormData = {
    name: formData.get('name'),
    description: formData.get('description'),
    price: formData.get('price'),
    category: formData.get('category'),
    features: formData.get('features'),
    imageUrl: formData.get('imageUrl'),
    imageHint: formData.get('imageHint'),
  };
  console.log('[createProductAction] Raw form data:', rawFormData);

  const validatedFields = CreateProductSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    console.error('[createProductAction] Validation failed:', fieldErrors);
    return {
      message: 'Invalid product data. Please check the highlighted fields.',
      fields: fieldErrors,
      isError: true,
      isSuccess: false,
    };
  }
  console.log('[createProductAction] Validation successful. Validated data:', validatedFields.data);

  try {
    const { features, imageUrl, imageHint, ...restOfData } = validatedFields.data;
    const featuresString = features || ''; 
    const featuresArray = featuresString.split(',').map(f => f.trim()).filter(f => f.length > 0);
    
    const productToAdd: Omit<Product, 'id'> = {
      ...restOfData,
      features: featuresArray,
      imageUrl: imageUrl || undefined, // Store as undefined if empty string
      imageHint: imageHint || undefined,
    };
    
    console.log('[createProductAction] Data for addProduct:', productToAdd);
    const createdProduct = addProduct(productToAdd);

    console.log('[createProductAction] New Product Created (JSON):', createdProduct);
    
    revalidatePath('/admin/products');
    revalidatePath('/products'); 

    return {
      message: `Product "${createdProduct.name}" created successfully (saved to JSON).`,
      isError: false,
      isSuccess: true,
      createdProduct: createdProduct,
    };
  } catch (error) {
    console.error('[createProductAction] Error creating product:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      message: `Error creating product: ${errorMessage}`,
      isError: true,
      isSuccess: false,
    };
  }
}
