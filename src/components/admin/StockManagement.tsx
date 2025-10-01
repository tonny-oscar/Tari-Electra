'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Package, AlertTriangle, Plus, Minus, Save, Bell, Trash2 } from 'lucide-react';
import { collection, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { StockAlerts } from './StockAlerts';
import { addProductStock } from '@/lib/firebase/store';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  image?: string;
  category?: string;
}

export function StockManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [stockUpdates, setStockUpdates] = useState<{ [key: string]: number }>({});
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'customerProducts'), (snapshot) => {
      const productsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      
      setProducts(productsList);
      setLoading(false);

      // Check for out of stock items
      const outOfStock = productsList.filter(p => p.stock === 0);
      if (outOfStock.length > 0) {
        toast({
          title: 'Stock Alert',
          description: `${outOfStock.length} product(s) are out of stock`,
          variant: 'destructive',
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [toast]);

  const updateStock = async (productId: string, newStock: number) => {
    try {
      const product = products.find(p => p.id === productId);
      const currentStock = product?.stock || 0;
      const difference = newStock - currentStock;
      
      // Update in all collections
      const collections = ['customerProducts', 'products', 'homepageProducts'];
      for (const collectionName of collections) {
        try {
          await updateDoc(doc(db, collectionName, productId), {
            stock: Math.max(0, newStock),
            updatedAt: new Date().toISOString(),
            status: newStock === 0 ? 'inactive' : 'active'
          });
        } catch (error) {
          // Product might not exist in this collection, continue
        }
      }
      
      // Use addProductStock if increasing stock
      if (difference > 0) {
        await addProductStock(productId, difference);
      }

      toast({
        title: 'Stock Updated',
        description: `Stock ${difference > 0 ? 'increased' : 'decreased'} successfully.`,
      });

      // Clear the local update
      setStockUpdates(prev => {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      });
    } catch (error) {
      console.error('Error updating stock:', error);
      toast({
        title: 'Update Failed',
        description: 'Failed to update stock. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleStockChange = (productId: string, change: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const currentStock = stockUpdates[productId] ?? product.stock;
    const newStock = Math.max(0, currentStock + change);
    
    setStockUpdates(prev => ({
      ...prev,
      [productId]: newStock
    }));
  };

  const handleDirectStockChange = (productId: string, value: string) => {
    const newStock = parseInt(value) || 0;
    setStockUpdates(prev => ({
      ...prev,
      [productId]: Math.max(0, newStock)
    }));
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      const collections = ['customerProducts', 'products', 'homepageProducts'];
      for (const collectionName of collections) {
        try {
          await deleteDoc(doc(db, collectionName, productId));
        } catch (error) {
          // Product might not exist in this collection, continue
        }
      }

      toast({
        title: 'Product Deleted',
        description: 'Product has been successfully deleted.',
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Delete Failed',
        description: 'Failed to delete product. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Stock Management</h1>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  const outOfStockCount = products.filter(p => p.stock === 0).length;
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 5).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Stock Management</h1>
        <div className="flex gap-2">
          <Badge variant={outOfStockCount > 0 ? "destructive" : "secondary"}>
            {outOfStockCount} Out of Stock
          </Badge>
          <Badge variant={lowStockCount > 0 ? "outline" : "secondary"}>
            {lowStockCount} Low Stock
          </Badge>
        </div>
      </div>

      <StockAlerts />

      <div className="grid gap-4">
        {products.map((product) => {
          const currentStock = stockUpdates[product.id] ?? product.stock;
          const hasChanges = stockUpdates[product.id] !== undefined;
          
          return (
            <Card key={product.id} className={`${product.stock === 0 ? 'border-red-200 bg-red-50' : product.stock <= 5 ? 'border-yellow-200 bg-yellow-50' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {product.image && product.image.startsWith('http') ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.category || 'General'}</p>
                      <p className="text-sm font-medium">KES {product.price.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStockChange(product.id, -1)}
                        disabled={currentStock === 0}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      
                      <Input
                        type="number"
                        value={currentStock}
                        onChange={(e) => handleDirectStockChange(product.id, e.target.value)}
                        className="w-20 text-center"
                        min="0"
                      />
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStockChange(product.id, 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Badge variant={currentStock === 0 ? "destructive" : currentStock <= 5 ? "outline" : "default"}>
                        {currentStock === 0 ? "Out of Stock" : `${currentStock} in stock`}
                      </Badge>
                      
                      {currentStock === 0 && (
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                      )}
                    </div>

                    <div className="flex gap-2">
                      {hasChanges && (
                        <Button
                          onClick={() => updateStock(product.id, currentStock)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Save className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                      )}
                      <Button
                        onClick={() => deleteProduct(product.id)}
                        size="sm"
                        variant="destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {products.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground">Products will appear here once they are added.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}