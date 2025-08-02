
'use server';

import { deleteProduct as deleteProductFromData } from '@/data/products';
import { revalidatePath } from 'next/cache';

export type DeleteProductFormState = {
  message: string;
  isError?: boolean;
  isSuccess?: boolean;
};

export async function deleteProductAction(
  id: string
): Promise<DeleteProductFormState> {
  console.log('[deleteProductAction] Action invoked for ID:', id);

  if (!id) {
    return {
      message: 'Error: Product ID is required for deletion.',
      isError: true,
      isSuccess: false,
    };
  }

  try {
    const success = await deleteProductFromData(id);

    if (success) {
      console.log('[deleteProductAction] Product Deleted (In-Memory):', id);
      revalidatePath('/admin/products');
      revalidatePath('/products'); // Revalidate public products page
      
      return {
        message: `Product with ID "${id}" deleted successfully (in-memory).`,
        isError: false,
        isSuccess: true,
      };
    } else {
      return {
        message: `Error: Product with ID "${id}" not found or deletion failed.`,
        isError: true,
        isSuccess: false,
      };
    }
  } catch (error) {
    console.error('[deleteProductAction] Error deleting product:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      message: `Error deleting product: ${errorMessage}`,
      isError: true,
      isSuccess: false,
    };
  }
}
