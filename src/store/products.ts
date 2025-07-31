import { db } from '@/lib/firebase/client';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import type { Product } from '@/lib/types';
import { create } from 'zustand';

interface ProductStore {
  products: Product[];
  featuredProducts: Product[];
  isLoading: boolean;
  error: string | null;
  setProducts: (products: Product[]) => void;
  setFeaturedProducts: (products: Product[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useProductStore = create<ProductStore>((set: any) => ({
  products: [],
  featuredProducts: [],
  isLoading: true,
  error: null,
  setProducts: (products: Product[]) => set({ products }),
  setFeaturedProducts: (products: Product[]) => set({ featuredProducts: products }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setError: (error: string | null) => set({ error })
}));

export function initializeProductListeners() {
  const { setProducts, setFeaturedProducts, setLoading, setError } = useProductStore.getState();

  try {
    setLoading(true);
    // Query for all active products
    const productsQuery = query(
      collection(db, 'products'),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    );

    // Listen for product changes
    const unsubscribe = onSnapshot(productsQuery, (snapshot) => {
      const productsList = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || 'Unnamed Product',
          description: data.description || '',
          price: Number(data.price) || 0,
          category: data.category || 'General',
          imageUrl: data.imageUrl || '',
          imageHint: data.imageHint || '',
          features: data.features || [],
          stock: Number(data.stock) || 0,
          rating: Number(data.rating) || 0,
          status: data.status || 'active'
        } as Product;
      });

      setProducts(productsList);
      // Set featured products (e.g., top 4 products by rating)
      const featured = [...productsList]
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 4);
      setFeaturedProducts(featured);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
      setLoading(false);
    });

    return unsubscribe;
  } catch (error) {
    console.error('Error setting up product listeners:', error);
    setError('Failed to initialize product listeners');
    setLoading(false);
  }
}
