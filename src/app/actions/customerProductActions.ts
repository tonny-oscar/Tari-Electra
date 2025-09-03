'use server';

import { deleteCustomerProduct, updateCustomerProduct, addCustomerProduct } from '@/data/customerProducts';
import { revalidatePath } from 'next/cache';

export async function deleteCustomerProductAction(id: string) {
  try {
    const success = await deleteCustomerProduct(id);
    if (success) {
      revalidatePath('/admin/products');
      return {
        isSuccess: true,
        message: 'Product deleted successfully.',
      };
    }
    return {
      isSuccess: false,
      message: 'Failed to delete product.',
    };
  } catch (error) {
    console.error('Error deleting customer product:', error);
    return {
      isSuccess: false,
      message: 'Error deleting product.',
    };
  }
}

export async function addCustomerProductAction(productData: any) {
  try {
    // Process features and specifications from comma-separated strings to arrays
    const processedData = {
      ...productData,
      features: typeof productData.features === 'string' 
        ? productData.features.split(',').map((f: string) => f.trim()).filter(Boolean)
        : productData.features || [],
      specifications: typeof productData.specifications === 'string' 
        ? productData.specifications.split(',').map((s: string) => s.trim()).filter(Boolean)
        : productData.specifications || [],
    };
    
    const id = await addCustomerProduct(processedData);
    if (id) {
      revalidatePath('/admin/products');
      return {
        isSuccess: true,
        message: 'Product added successfully.',
        productId: id,
      };
    }
    return {
      isSuccess: false,
      message: 'Failed to add product.',
    };
  } catch (error) {
    console.error('Error adding customer product:', error);
    return {
      isSuccess: false,
      message: 'Error adding product.',
    };
  }
}

export async function updateCustomerProductAction(id: string, productData: any) {
  try {
    // Process features and specifications from comma-separated strings to arrays
    const processedData = {
      ...productData,
      features: typeof productData.features === 'string' 
        ? productData.features.split(',').map((f: string) => f.trim()).filter(Boolean)
        : productData.features || [],
      specifications: typeof productData.specifications === 'string' 
        ? productData.specifications.split(',').map((s: string) => s.trim()).filter(Boolean)
        : productData.specifications || [],
    };
    
    const success = await updateCustomerProduct(id, processedData);
    if (success) {
      revalidatePath('/admin/products');
      return {
        isSuccess: true,
        message: 'Product updated successfully.',
      };
    }
    return {
      isSuccess: false,
      message: 'Failed to update product.',
    };
  } catch (error) {
    console.error('Error updating customer product:', error);
    return {
      isSuccess: false,
      message: 'Error updating product.',
    };
  }
}