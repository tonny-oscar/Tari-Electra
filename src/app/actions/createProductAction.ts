
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
    const { features, ...restOfData } = validatedFields.data;
    const featuresString = features || ''; 
    const featuresArray = featuresString.split(',').map(f => f.trim()).filter(f => f.length > 0);
    
    const productToAdd: Omit<Product, 'id' | 'imageUrl' | 'imageHint'> = {
      ...restOfData,
      features: featuresArray,
    };
    
    console.log('[createProductAction] Data for addProduct:', productToAdd);
    const createdProduct = addProduct(productToAdd);

    console.log('[createProductAction] New Product Created (In-Memory):', createdProduct);
    
    revalidatePath('/admin/products');
    revalidatePath('/products'); // Revalidate public products page

    return {
      message: `Product "${createdProduct.name}" created successfully (in-memory).`,
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
