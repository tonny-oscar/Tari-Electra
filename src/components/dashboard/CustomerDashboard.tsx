'use client';

import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import {
  ShoppingCart,
  Package,
  Truck,
  CheckCircle,
  Clock,
  User,
  LogOut,
  Plus,
  Minus,
  Trash2,
  Home,
  Settings,
  CreditCard,
  Star,
  MapPin,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Zap
} from 'lucide-react';
import { doc, getDoc, collection, query, where, orderBy, onSnapshot, updateDoc } from 'firebase/firestore';
import {
  createOrder,
  type Product,
  type CartItem,
  type Order
} from '@/lib/firebase/store';
import { auth, db } from '@/lib/firebase/client';
import {
  type CustomerData,
  type SubmeterApplication
} from '@/lib/firebase/firestore';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SubmeterTab } from './SubmeterTab';

// Utility function to sanitize strings for logging
const sanitizeForLog = (str: string): string => {
  return str.replace(/[\r\n\t]/g, ' ').substring(0, 100);
};

// Utility function to sanitize user input for display
const sanitizeUserInput = (input: string): string => {
  return input.replace(/[<>"'&]/g, (match) => {
    const entities: { [key: string]: string } = {
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '&': '&amp;'
    };
    return entities[match] || match;
  });
};

// Validate user ID format
const isValidUserId = (uid: string): boolean => {
  return /^[a-zA-Z0-9_-]+$/.test(uid) && uid.length > 0 && uid.length < 128;
};

interface TrackingStage {
  id: number;
  name: string;
  icon: any;
  color: string;
}

export function CustomerDashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [submeterApplications, setSubmeterApplications] = useState<SubmeterApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [meters, setMeters] = useState<any[]>([]);
  const [metersLoading, setMetersLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  // Load submeter applications
  useEffect(() => {
    if (!user?.uid || !isValidUserId(user.uid)) return;

    const q = query(
      collection(db, 'submeterApplications'),
      where('userId', '==', user.uid),
      orderBy('submissionDate', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SubmeterApplication[];
      setSubmeterApplications(apps);
    }, (error) => {
      console.error('Error loading submeter applications:', sanitizeForLog(error.message));
      toast({
        title: 'Error',
        description: 'Failed to load submeter applications.',
        variant: 'destructive',
      });
    });

    return () => unsubscribe();
  }, [user, toast]);

  // Order tracking stages
  const trackingStages: TrackingStage[] = [
    { id: 1, name: 'Order Received', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
    { id: 2, name: 'Order Consolidated', icon: Package, color: 'bg-blue-100 text-blue-800' },
    { id: 3, name: 'Order Packaged', icon: Package, color: 'bg-purple-100 text-purple-800' },
    { id: 4, name: 'Order Dispatched', icon: Truck, color: 'bg-orange-100 text-orange-800' }
  ];

  // Authentication check and data loading
  useEffect(() => {
    let isSubscribed = true;
    let unsubscribeOrders: (() => void) | undefined;

    if (loading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    const loadCustomerData = async () => {
      try {
        if (!isValidUserId(user.uid)) {
          throw new Error('Invalid user ID');
        }

        const customerDoc = await getDoc(doc(db, 'customers', user.uid));

        if (!customerDoc.exists()) {
          if (isSubscribed) {
            toast({
              title: 'Account Not Found',
              description: 'Customer account not found. Please sign up.',
              variant: 'destructive',
            });
            await signOut(auth);
            router.push('/signup');
          }
          return;
        }

        if (!isSubscribed) return;

        const data = customerDoc.data() as CustomerData;
        setCustomerData(data);

        // Try optimized orders query first
        const tryOptimizedOrdersQuery = () => {
          const ordersQuery = query(
            collection(db, 'orders'),
            where('customerId', '==', user.uid),
            orderBy('createdAt', 'desc')
          );

          return onSnapshot(ordersQuery, (snapshot) => {
            if (!isSubscribed) return;

            const ordersList = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as Order[];
            setOrders(ordersList);
            setIsLoading(false);
          }, (error) => {
            console.error('Optimized query failed, trying fallback:', sanitizeForLog(error.message));

            if (error.code === 'failed-precondition') {
              tryFallbackOrdersQuery();
            } else {
              console.error('Error fetching orders:', sanitizeForLog(error.message));
              if (isSubscribed) {
                toast({
                  title: 'Error',
                  description: 'Failed to load orders. Please try again.',
                  variant: 'destructive',
                });
                setIsLoading(false);
              }
            }
          });
        };

        const tryFallbackOrdersQuery = () => {
          console.log('Using fallback query for orders');
          const simpleOrdersQuery = query(
            collection(db, 'orders'),
            where('customerId', '==', user.uid)
          );

          return onSnapshot(simpleOrdersQuery, (snapshot) => {
            if (!isSubscribed) return;

            const ordersList = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as Order[];

            ordersList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setOrders(ordersList);
            setIsLoading(false);

            toast({
              title: 'Orders Loaded',
              description: 'Orders loaded using fallback method.',
            });
          }, (error) => {
            console.error('Fallback orders query failed:', sanitizeForLog(error.message));
            if (isSubscribed) {
              toast({
                title: 'Error Loading Orders',
                description: 'Unable to load your orders. Please try again later.',
                variant: 'destructive',
              });
              setIsLoading(false);
            }
          });
        };

        unsubscribeOrders = tryOptimizedOrdersQuery();

      } catch (error) {
        console.error('Error loading customer data:', sanitizeForLog(String(error)));
        if (isSubscribed) {
          toast({
            title: 'Error',
            description: 'Failed to load customer data.',
            variant: 'destructive',
          });
          setIsLoading(false);
        }
      }
    };

    loadCustomerData();

    return () => {
      isSubscribed = false;
      if (unsubscribeOrders) {
        unsubscribeOrders();
      }
    };
  }, [user, loading, router, toast]);

  // Load products from Firestore
  useEffect(() => {
    let isSubscribed = true;
    let unsubscribe: (() => void) | undefined;

    const loadProducts = async () => {
      try {
        setProductsLoading(true);

        const tryOptimizedQuery = () => {
          const productsQuery = collection(db, 'customerProducts');

          return onSnapshot(productsQuery, (snapshot) => {
            if (!isSubscribed) return;

            console.log('Products snapshot received:', snapshot.size, 'documents');
            const productsList = snapshot.docs.map(doc => {
              const data = doc.data();
              console.log('Product data:', doc.id, data);
              return {
                id: doc.id,
                name: sanitizeUserInput(data.name || 'Unnamed Product'),
                price: Number(data.price) || 0,
                image: sanitizeUserInput(data.image || data.imageUrl || '📦'),
                stock: Number(data.stock) || 100,
                description: sanitizeUserInput(data.description || 'No description available'),
                rating: Number(data.rating) || 4.0,
                category: sanitizeUserInput(data.category || 'General')
              } as Product;
            });

            console.log('Processed products:', productsList);
            setProducts(productsList);
            setProductsLoading(false);
          }, (error) => {
            console.error('Error loading products:', sanitizeForLog(error.message));
            if (isSubscribed) {
              toast({
                title: 'Error Loading Products',
                description: 'Failed to load products. Please refresh the page.',
                variant: 'destructive',
              });
              setProductsLoading(false);
            }
          });
        };

        // Remove fallback query since we're using simple collection query
        const tryFallbackQuery = () => {
          console.log('Fallback not needed with simple collection query');
        };

        unsubscribe = tryOptimizedQuery();
        console.log('Products listener set up for customerProducts collection');

      } catch (error) {
        console.error('Error setting up products listener:', sanitizeForLog(String(error)));
        if (isSubscribed) {
          toast({
            title: 'Setup Error',
            description: 'Failed to initialize products. Please refresh the page.',
            variant: 'destructive',
          });
          setProductsLoading(false);
        }
      }
    };

    loadProducts();

    
    return () => {
      isSubscribed = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [toast]);

  // Load meters from Firestore
  useEffect(() => {
    let isSubscribed = true;
    let unsubscribe: (() => void) | undefined;

    const loadMeters = async () => {
      try {
        setMetersLoading(true);
        const metersQuery = query(collection(db, 'meters'));

        unsubscribe = onSnapshot(metersQuery, (snapshot) => {
          if (!isSubscribed) return;

          const metersList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          setMeters(metersList);
          setMetersLoading(false);
        }, (error) => {
          console.error('Error loading meters:', sanitizeForLog(error.message));
          if (isSubscribed) {
            setMetersLoading(false);
          }
        });
      } catch (error) {
        console.error('Error setting up meters listener:', sanitizeForLog(String(error)));
        if (isSubscribed) {
          setMetersLoading(false);
        }
      }
    };

    loadMeters();

    return () => {
      isSubscribed = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Cart functions
 
 
 const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      toast({
        title: 'Out of Stock',
        description: `${product.name} is currently out of stock.`,
        variant: 'destructive',
      });
      return;
    }

    const existingItem = cart.find(item => item.id === product.id);
    const currentQuantityInCart = existingItem ? existingItem.quantity : 0;


    if (currentQuantityInCart >= product.stock) {
      toast({
        title: 'Stock Limit Reached',
        description: `Only ${product.stock} items available for ${product.name}.`,
        variant: 'destructive',
      });
      return;
    }

    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }

    toast({
      title: 'Added to Cart',
      description: `${product.name} added to your cart.`,
    });
  };

  const updateCartQuantity = (productId: string, change: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setCart(cart.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + change;

        if (change > 0 && newQuantity > product.stock) {
          toast({
            title: 'Stock Limit Reached',
            description: `Only ${product.stock} items available for ${product.name}.`,
            variant: 'destructive',
          });
          return item;
        }

        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const placeOrder = async () => {
    if (cart.length === 0 || !user?.uid || !isValidUserId(user.uid)) return;

    try {
      const orderData = {
        customerId: user.uid,
        customerEmail: user.email || '',
        items: cart,
        total: getCartTotal(),
        status: 1,
        createdAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        trackingNumber: `TRK${Date.now()}`
      };

      const { orderId, orderNumber } = await createOrder(orderData);

      toast({
        title: 'Order Placed!',
        description: `Order ${orderNumber} has been placed successfully.`,
      });

      setCart([]);
      setActiveTab('orders');

    } catch (error) {
      console.error('Error placing order:', sanitizeForLog(String(error)));
      toast({
        title: 'Order Failed',
        description: 'Failed to place order. Please try again.',
        variant: 'destructive',
      });
    }
  };



  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
    } catch (error) {
      console.error('Logout error:', sanitizeForLog(String(error)));
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!customerData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Failed to load customer data.</p>
          <Button onClick={() => router.push('/login')} className="mt-4">
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  
  // Navigation tabs
  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: Home },
    { id: 'submeters', name: 'Submeter', icon: Zap },
    { id: 'products', name: 'Products', icon: Package },
    { id: 'cart', name: 'Cart', icon: ShoppingCart, badge: cart.length },
    { id: 'orders', name: 'Orders', icon: Truck },
    { id: 'profile', name: 'Profile', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-12 h-12 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-800">Tari Electra</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {sanitizeUserInput(customerData.firstName)} {sanitizeUserInput(customerData.lastName)}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64">
            <Card>
              <CardContent className="p-6">
                <nav className="space-y-2">
                  {tabs.map(tab => {
                    const TabIcon = tab.icon;
                    return (
                      <Button
                        key={tab.id}
                        variant={activeTab === tab.id ? "default" : "ghost"}
                        className={`w-full justify-start ${activeTab === tab.id ? '' : 'hover:bg-gray-100'
                          }`}
                        onClick={() => setActiveTab(tab.id)}
                      >
                        <TabIcon className="w-4 h-4 mr-3" />
                        {tab.name}
                        {tab.badge && tab.badge > 0 && (
                          <Badge variant="secondary" className="ml-auto">
                            {tab.badge}
                          </Badge>
                        )}
                      </Button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'dashboard' && (
              <DashboardTab
                customerData={customerData}
                orders={orders}
                cart={cart}
                trackingStages={trackingStages}
                products={products}
                addToCart={addToCart}
                meters={meters}
                metersLoading={metersLoading}
              />
            )}
            {activeTab === 'products' && (
              <ProductsTab
                products={products}
                addToCart={addToCart}
                cart={cart}
                isLoading={productsLoading}
              />
            )}
            {activeTab === 'cart' && (
              <CartTab
                cart={cart}
                updateCartQuantity={updateCartQuantity}
                removeFromCart={removeFromCart}
                getCartTotal={getCartTotal}
                placeOrder={placeOrder}
                setActiveTab={setActiveTab}
              />
            )}
            {activeTab === 'orders' && (
              <OrdersTab
                orders={orders}
                trackingStages={trackingStages}
                setActiveTab={setActiveTab}
              />
            )}
            {activeTab === 'profile' && (
              <ProfileTab
                customerData={customerData}
                user={user}
              />
            )}
            {activeTab === 'submeters' && (
              <SubmeterTab
                applications={submeterApplications}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Dashboard Tab Component
function DashboardTab({ customerData, orders, cart, trackingStages, products, addToCart, meters, metersLoading }: {
  customerData: CustomerData;
  orders: Order[];
  cart: CartItem[];
  trackingStages: TrackingStage[];
  products: Product[];
  addToCart: (product: Product) => void;
  meters: any[];
  metersLoading: boolean;
}) {
  const recentOrders = orders.slice(0, 3);
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
  const featuredProducts = products.slice(0, 4);
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-2">
            Welcome back, {sanitizeUserInput(customerData.firstName)}!
          </h1>
          <p className="text-blue-100">Here's what's happening with your orders</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cart Items</p>
                <p className="text-2xl font-bold">{cart.length}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Orders</p>
                <p className="text-2xl font-bold">
                  {orders.filter((order: Order) => order.status < 4).length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold">KSH {totalSpent.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No orders yet</p>
              <p className="text-sm text-gray-500 mb-4">Start shopping to see your orders here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => {
                const currentStage = trackingStages.find(stage => stage.id === order.status);
                return (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Order {order.orderNumber || `#${order.id.slice(-8)}`}</p>
                      <p className="text-sm text-gray-600">
                        {order.items.length} items • KSH {order.total.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      {currentStage && (
                        <Badge className={currentStage.color}>
                          {currentStage.name}
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Featured Products */}
      <Card>
        <CardHeader>
          <CardTitle>Featured Products ({products.length} total products)</CardTitle>
        </CardHeader>
        <CardContent>
          {featuredProducts.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No products available</p>
              <p className="text-sm text-gray-500">Products will appear when added by admin</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredProducts.map((product) => (
                <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="aspect-square w-full bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                    {product.image && product.image !== '📦' ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`text-4xl text-gray-400 ${product.image && product.image !== '📦' ? 'hidden' : ''}`}>📦</div>
                  </div>
                  <h4 className="font-medium text-sm mb-1 truncate">{sanitizeUserInput(product.name)}</h4>
                  <p className="text-lg font-bold text-blue-600 mb-2">KSH {product.price.toFixed(2)}</p>
                  <Button
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    size="sm"
                    className="w-full"
                  >
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Meters */}
      <Card>
        <CardHeader>
          <CardTitle>Meters ({meters.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {metersLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading meters...</p>
            </div>
          ) : meters.length === 0 ? (
            <div className="text-center py-8">
              <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No meters available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {meters.map((meter) => (
                <div key={meter.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-3">
                    <Zap className="w-8 h-8 text-blue-600 mr-3" />
                    <div>
                      <h4 className="font-medium">{sanitizeUserInput(meter.name || meter.id)}</h4>
                      <p className="text-sm text-gray-600">{sanitizeUserInput(meter.type || 'Meter')}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    {meter.reading && (
                      <div className="flex justify-between">
                        <span>Reading:</span>
                        <span className="font-medium">{meter.reading} kWh</span>
                      </div>
                    )}
                    {meter.status && (
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <Badge variant={meter.status === 'active' ? 'default' : 'secondary'}>
                          {sanitizeUserInput(meter.status)}
                        </Badge>
                      </div>
                    )}
                    {meter.location && (
                      <div className="flex justify-between">
                        <span>Location:</span>
                        <span className="font-medium">{sanitizeUserInput(meter.location)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Products Tab Component
function ProductsTab({ products, addToCart, cart, isLoading }: {
  products: Product[];
  addToCart: (product: Product) => void;
  cart: CartItem[];
  isLoading: boolean;
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category || 'General')))];

  // Filter and sort products
  const filteredAndSortedProducts = React.useMemo(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => (product.category || 'General') === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'stock':
          aValue = a.stock;
          bValue = b.stock;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [products, selectedCategory, searchTerm, sortBy, sortOrder]);

  const getCartItemQuantity = (productId: string) => {
    const item = cart.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Products</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="w-full h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const { toast } = useToast();

  if (products.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No products available</h3>
            <p className="text-gray-600">Products will appear here once they are added by the admin.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <h1 className="text-2xl font-bold">Products ({filteredAndSortedProducts.length})</h1>
        
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64"
          />
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="stock">Sort by Stock</option>
          </select>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </Button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Products Grid */}
      {filteredAndSortedProducts.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Product Image */}
              <div className="aspect-video w-full relative bg-gray-100">
                {product.image && product.image !== '📦' ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`w-full h-full flex items-center justify-center ${product.image && product.image !== '📦' ? 'hidden' : ''}`}>
                  <div className="text-6xl text-gray-400">📦</div>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="font-semibold text-lg mb-2">{sanitizeUserInput(product.name)}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-3">{sanitizeUserInput(product.description)}</p>
                  <div className="flex items-center justify-center space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(product.rating || 0)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                          }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">
                      ({product.rating || 0})
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-blue-600">
                    KSH {product.price.toFixed(2)}
                  </span>
                  <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </Badge>
                </div>

                <div className="space-y-2">
                  {getCartItemQuantity(product.id) > 0 && (
                    <div className="text-center">
                      <Badge variant="secondary">
                        {getCartItemQuantity(product.id)} in cart
                      </Badge>
                    </div>
                  )}
                  <Button
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Cart Tab Component
function CartTab({ cart, updateCartQuantity, removeFromCart, getCartTotal, placeOrder, setActiveTab }: {
  cart: CartItem[];
  updateCartQuantity: (productId: string, change: number) => void;
  removeFromCart: (productId: string) => void;
  getCartTotal: () => number;
  placeOrder: () => Promise<void>;
  setActiveTab: (tab: string) => void;
}) {
  if (cart.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Shopping Cart</h1>
        <Card>
          <CardContent className="p-12 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">Add some products to get started</p>
            <Button onClick={() => setActiveTab('products')}>
              Browse Products
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Shopping Cart ({cart.length} items)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {item.image && item.image !== '📦' && !item.image.startsWith('http') ? (
                      <span className="text-2xl">{item.image}</span>
                    ) : item.image && item.image.startsWith('http') ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`text-2xl text-gray-400 ${item.image && item.image.startsWith('http') ? 'hidden' : item.image && item.image !== '📦' ? 'hidden' : ''}`}>📦</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                    <p className="text-lg font-bold text-blue-600">
                      KSH {item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateCartQuantity(item.id, -1)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateCartQuantity(item.id, 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      KSH {(item.price * item.quantity).toFixed(2)}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>KSH {getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>KSH {(getCartTotal() * 0.1).toFixed(2)}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>KSH {(getCartTotal() * 1.1).toFixed(2)}</span>
                </div>
              </div>
              <Button onClick={placeOrder} className="w-full" size="lg">
                <CreditCard className="w-4 h-4 mr-2" />
                Place Order
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Orders Tab Component
function OrdersTab({ orders, trackingStages, setActiveTab }: {
  orders: Order[];
  trackingStages: TrackingStage[];
  setActiveTab: (tab: string) => void;
}) {
  if (orders.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Your Orders</h1>
        <Card>
          <CardContent className="p-12 text-center">
            <Truck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-6">When you place orders, they'll appear here</p>
            <Button onClick={() => setActiveTab('products')}>
              Start Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Your Orders ({orders.length})</h1>

      <div className="space-y-6">
        {orders.map((order) => {
          const currentStage = trackingStages.find(stage => stage.id === order.status);
          const StageIcon = currentStage?.icon || Package;

          return (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      Order {order.orderNumber || `#${order.id.slice(-8)}`}
                    </CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>KSH {order.total.toFixed(2)}</span>
                      <span>•</span>
                      <span>{order.items.length} items</span>
                    </div>
                  </div>
                  <div className="text-right">
                    {currentStage && (
                      <Badge className={currentStage.color}>
                        <StageIcon className="w-3 h-3 mr-1" />
                        {currentStage.name}
                      </Badge>
                    )}
                    {order.trackingNumber && (
                      <p className="text-xs text-gray-500 mt-1">
                        Tracking: {order.trackingNumber}
                      </p>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                            {item.image && item.image !== '📦' && !item.image.startsWith('http') ? (
                              <span className="text-lg">{item.image}</span>
                            ) : item.image && item.image.startsWith('http') ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                }}
                              />
                            ) : null}
                            <div className={`text-lg text-gray-400 ${item.image && item.image.startsWith('http') ? 'hidden' : item.image && item.image !== '📦' ? 'hidden' : ''}`}>📦</div>
                          </div>
                          <div>
                            <p className="font-medium">{sanitizeUserInput(item.name)}</p>
                            <p className="text-sm text-gray-600">
                              Qty: {item.quantity} × KSH {item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <p className="font-semibold">
                          KSH {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Order Progress */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-3">Order Progress</h4>
                    <div className="flex items-center justify-between">
                      {trackingStages.map((stage, index) => {
                        const isCompleted = order.status >= stage.id;
                        const isCurrent = order.status === stage.id;
                        const StageIcon = stage.icon;

                        return (
                          <div key={stage.id} className="flex items-center">
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${isCompleted
                              ? 'bg-blue-600 border-blue-600 text-white'
                              : isCurrent
                                ? 'border-blue-600 text-blue-600'
                                : 'border-gray-300 text-gray-400'
                              }`}>
                              <StageIcon className="w-4 h-4" />
                            </div>
                            <div className="ml-2 hidden sm:block">
                              <p className={`text-xs font-medium ${isCompleted || isCurrent ? 'text-blue-600' : 'text-gray-400'
                                }`}>
                                {stage.name}
                              </p>
                            </div>
                            {index < trackingStages.length - 1 && (
                              <div className={`w-8 sm:w-16 h-0.5 mx-2 ${order.status > stage.id ? 'bg-blue-600' : 'bg-gray-300'
                                }`} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Estimated Delivery */}
                  {order.estimatedDelivery && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Estimated Delivery:</span>
                      <span className="font-medium">
                        {new Date(order.estimatedDelivery).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// Profile Tab Component
function ProfileTab({ customerData, user }: {
  customerData: CustomerData;
  user: any;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: customerData.firstName,
    lastName: customerData.lastName,
    phone: customerData.profile?.phone || '',
    address: customerData.profile?.address || '',
    city: customerData.profile?.city || '',
    country: customerData.profile?.country || ''
  });
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      await updateDoc(doc(db, 'customers', user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        profile: {
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          country: formData.country
        },
        updatedAt: new Date().toISOString()
      });

      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully.',
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', sanitizeForLog(String(error)));
      toast({
        title: 'Update Failed',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: customerData.firstName,
      lastName: customerData.lastName,
      phone: customerData.profile?.phone || '',
      address: customerData.profile?.address || '',
      city: customerData.profile?.city || '',
      country: customerData.profile?.country || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Profile Settings</h1>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Settings className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="space-x-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                {isEditing ? (
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                ) : (
                  <p className="p-2 bg-gray-50 rounded">{sanitizeUserInput(customerData.firstName)}</p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                {isEditing ? (
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                ) : (
                  <p className="p-2 bg-gray-50 rounded">{sanitizeUserInput(customerData.lastName)}</p>
                )}
              </div>
            </div>

            <div>
              <Label>Email Address</Label>
              <div className="flex items-center p-2 bg-gray-50 rounded">
                <Mail className="w-4 h-4 mr-2 text-gray-500" />
                <span>{sanitizeUserInput(customerData.email)}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter your phone number"
                />
              ) : (
                <div className="flex items-center p-2 bg-gray-50 rounded">
                  <Phone className="w-4 h-4 mr-2 text-gray-500" />
                  <span>{sanitizeUserInput(customerData.profile?.phone || 'Not provided')}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle>Address Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address">Street Address</Label>
              {isEditing ? (
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter your street address"
                  rows={3}
                />
              ) : (
                <div className="flex items-start p-2 bg-gray-50 rounded">
                  <MapPin className="w-4 h-4 mr-2 text-gray-500 mt-0.5" />
                  <span>{sanitizeUserInput(customerData.profile?.address || 'Not provided')}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                {isEditing ? (
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Enter your city"
                  />
                ) : (
                  <p className="p-2 bg-gray-50 rounded">{sanitizeUserInput(customerData.profile?.city || 'Not provided')}</p>
                )}
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                {isEditing ? (
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="Enter your country"
                  />
                ) : (
                  <p className="p-2 bg-gray-50 rounded">{sanitizeUserInput(customerData.profile?.country || 'Not provided')}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Account Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600">Member Since</p>
              <p className="font-semibold">
                {user?.metadata?.creationTime
                  ? new Date(user.metadata.creationTime).toLocaleDateString()
                  : 'N/A'
                }
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Package className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="font-semibold">{customerData.orders?.length || 0}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Star className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-sm text-gray-600">Customer Status</p>
              <p className="font-semibold">
                {customerData.role ? (customerData.role === 'customer' ? 'Regular Customer' : customerData.role.charAt(0).toUpperCase() + customerData.role.slice(1)) : 'Regular Customer'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}