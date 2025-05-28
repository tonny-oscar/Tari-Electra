
'use server';

import type { Product, ProductFormState } from '@/lib/types';
import { updateProduct, findProduct } from '@/data/products';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const UpdateProductSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  price: z.coerce.number().positive({ message: 'Price must be a positive number.' }),
  category: z.string().min(2, { message: 'Category must be at least 2 characters.' }),
  features: z.string().optional(),
});

export async function updateProductAction(
  currentId: string,
  prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  console.log('[updateProductAction] Action invoked for ID:', currentId);

  const rawFormData = {
    name: formData.get('name'),
    description: formData.get('description'),
    price: formData.get('price'),
    category: formData.get('category'),
    features: formData.get('features'),
  };
  console.log('[updateProductAction] Parsed raw form data:', rawFormData);

  const validatedFields = UpdateProductSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    console.error('[updateProductAction] Validation failed:', fieldErrors);
    return {
      message: 'Invalid product data. Please check the highlighted fields.',
      fields: fieldErrors,
      isError: true,
      isSuccess: false,
    };
  }
  console.log('[updateProductAction] Validation successful. Validated data:', validatedFields.data);

  try {
    const productToUpdate = findProduct(currentId);
    if (!productToUpdate) {
      console.error('[updateProductAction] Product not found with ID:', currentId);
      return {
        message: `Error: Product with ID "${currentId}" not found.`,
        isError: true,
        isSuccess: false,
      };
    }
    
    const { features, ...restOfData } = validatedFields.data;
    const featuresString = features || ''; 
    const featuresArray = featuresString.split(',').map(f => f.trim()).filter(f => f.length > 0);

    const dataToUpdate: Partial<Omit<Product, 'id'>> = {
        ...restOfData, 
        features: featuresArray,
    };
    console.log('[updateProductAction] Data for updateProduct:', dataToUpdate);
        
    const updatedProduct = updateProduct(currentId, dataToUpdate);

    if (!updatedProduct) {
        console.error('[updateProductAction] updateProduct returned null for ID:', currentId);
        return {
            message: `Failed to update product "${currentId}". Product not found or update failed.`,
            isError: true,
            isSuccess: false,
        };
    }
    
    console.log('[updateProductAction] Product Updated (In-Memory):', updatedProduct);
    
    revalidatePath('/admin/products');
    revalidatePath(`/admin/products/edit/${currentId}`);
    revalidatePath('/products'); // Revalidate public products page

    return {
      message: `Product "${updatedProduct.name}" updated successfully (in-memory).`,
      isError: false,
      isSuccess: true,
      updatedProduct: updatedProduct,
    };
  } catch (error) {
    console.error('[updateProductAction] Error updating product:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      message: `Error updating product: ${errorMessage}`,
      isError: true,
      isSuccess: false,
    };
  }
}
