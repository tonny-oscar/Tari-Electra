'use server';

import { addProduct, updateProduct, deleteProduct } from '@/data/products';
import { revalidatePath } from 'next/cache';

export async function addHomepageProductAction(productData: any) {
  try {
    // Process features from comma-separated string to array
    const processedData = {
      ...productData,
      features: typeof productData.features === 'string' 
        ? productData.features.split(',').map((f: string) => f.trim()).filter(Boolean)
        : productData.features || [],
    };
    
    const product = await addProduct(processedData);
    if (product) {
      revalidatePath('/admin/homepage-products');
      revalidatePath('/');
      return {
        isSuccess: true,
        message: 'Homepage product added successfully.',
        productId: product.id,
      };
    }
    return {
      isSuccess: false,
      message: 'Failed to add homepage product.',
    };
  } catch (error) {
    console.error('Error adding homepage product:', error);
    return {
      isSuccess: false,
      message: 'Error adding homepage product.',
    };
  }
}

export async function updateHomepageProductAction(id: string, productData: any) {
  try {
    // Process features from comma-separated string to array
    const processedData = {
      ...productData,
      features: typeof productData.features === 'string' 
        ? productData.features.split(',').map((f: string) => f.trim()).filter(Boolean)
        : productData.features || [],
    };
    
    const product = await updateProduct(id, processedData);
    if (product) {
      revalidatePath('/admin/homepage-products');
      revalidatePath('/');
      return {
        isSuccess: true,
        message: 'Homepage product updated successfully.',
      };
    }
    return {
      isSuccess: false,
      message: 'Failed to update homepage product.',
    };
  } catch (error) {
    console.error('Error updating homepage product:', error);
    return {
      isSuccess: false,
      message: 'Error updating homepage product.',
    };
  }
}

export async function deleteHomepageProductAction(id: string) {
  try {
    const success = await deleteProduct(id);
    if (success) {
      revalidatePath('/admin/homepage-products');
      revalidatePath('/');
      return {
        isSuccess: true,
        message: 'Homepage product deleted successfully.',
      };
    }
    return {
      isSuccess: false,
      message: 'Failed to delete homepage product.',
    };
  } catch (error) {
    console.error('Error deleting homepage product:', error);
    return {
      isSuccess: false,
      message: 'Error deleting homepage product.',
    };
  }
}