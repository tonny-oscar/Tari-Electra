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
  Eye,
  MapPin,
  Phone,
  Mail,
  Calendar,
  DollarSign
} from 'lucide-react';
import { auth, db } from '@/lib/firebase/client';
import { 
  doc, 
  getDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  description?: string;
  rating?: number;
  category?: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: number;
  createdAt: string;
  estimatedDelivery: string;
  trackingNumber?: string;
}

interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  orders: Order[];
  profile: {
    phone: string;
    address: string;
    city: string;
    country: string;
  };
}

interface TrackingStage {
  id: number;
  name: string;
  icon: any;
  color: string;
}

export default function CustomerDashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  // Sample products - in production, this would come from Firestore
  const [products] = useState<Product[]>([
    { 
      id: '1', 
      name: 'Wireless Headphones', 
      price: 99.99, 
      image: '🎧', 
      stock: 15,
      description: 'High-quality wireless headphones with noise cancellation',
      rating: 4.5,
      category: 'Electronics'
    },
    { 
      id: '2', 
      name: 'Smart Watch', 
      price: 249.99, 
      image: '⌚', 
      stock: 8,
      description: 'Feature-rich smartwatch with health monitoring',
      rating: 4.8,
      category: 'Wearables'
    },
    { 
      id: '3', 
      name: 'Laptop Stand', 
      price: 79.99, 
      image: '💻', 
      stock: 20,
      description: 'Ergonomic adjustable laptop stand',
      rating: 4.3,
      category: 'Accessories'
    },
    { 
      id: '4', 
      name: 'Bluetooth Speaker', 
      price: 129.99, 
      image: '🔊', 
      stock: 12,
      description: 'Portable wireless speaker with premium sound',
      rating: 4.6,
      category: 'Audio'
    },
    { 
      id: '5', 
      name: 'Phone Case', 
      price: 24.99, 
      image: '📱', 
      stock: 25,
      description: 'Protective case with wireless charging support',
      rating: 4.2,
      category: 'Accessories'
    }
  ]);

  // Order tracking stages
  const trackingStages: TrackingStage[] = [
    { id: 1, name: 'Order Received', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
    { id: 2, name: 'Order Consolidated', icon: Package, color: 'bg-blue-100 text-blue-800' },
    { id: 3, name: 'Order Packaged', icon: Package, color: 'bg-purple-100 text-purple-800' },
    { id: 4, name: 'Order Dispatched', icon: Truck, color: 'bg-orange-100 text-orange-800' }
  ];

  // Authentication check and data loading
  useEffect(() => {
    if (loading) return;
    
    if (!user) {
      router.push('/login');
      return;
    }

    const loadCustomerData = async () => {
      try {
        const customerDoc = await getDoc(doc(db, 'customers', user.uid));
        
        if (!customerDoc.exists()) {
          toast({
            title: 'Account Not Found',
            description: 'Customer account not found. Please sign up.',
            variant: 'destructive',
          });
          await signOut(auth);
          router.push('/signup');
          return;
        }

        const data = customerDoc.data() as CustomerData;
        setCustomerData(data);

        // Load orders from Firestore
        const ordersQuery = query(
          collection(db, 'orders'),
          where('customerId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
          const ordersList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Order[];
          setOrders(ordersList);
        });

        setIsLoading(false);
        return () => unsubscribe();
      } catch (error) {
        console.error('Error loading customer data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load customer data.',
          variant: 'destructive',
        });
        setIsLoading(false);
      }
    };

    loadCustomerData();
  }, [user, loading, router, toast]);

  // Cart functions
  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
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
    setCart(cart.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + change;
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
    if (cart.length === 0 || !user) return;

    try {
      const orderData = {
        customerId: user.uid,
        customerEmail: user.email,
        items: cart,
        total: getCartTotal(),
        status: 1,
        createdAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        trackingNumber: `TRK${Date.now()}`
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);
      
      toast({
        title: 'Order Placed!',
        description: `Order #${docRef.id} has been placed successfully.`,
      });

      setCart([]);
      setActiveTab('orders');

      // Simulate order status updates (in production, this would be handled by backend)
      setTimeout(() => updateOrderStatus(docRef.id, 2), 3000);
      setTimeout(() => updateOrderStatus(docRef.id, 3), 8000);
      setTimeout(() => updateOrderStatus(docRef.id, 4), 15000);

    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: 'Order Failed',
        description: 'Failed to place order. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: number) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating order status:', error);
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
      console.error('Logout error:', error);
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
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-gray-800">Customer Portal</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {customerData.firstName} {customerData.lastName}
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
                        className={`w-full justify-start ${
                          activeTab === tab.id ? '' : 'hover:bg-gray-100'
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
              />
            )}
            {activeTab === 'products' && (
              <ProductsTab 
                products={products} 
                addToCart={addToCart}
                cart={cart}
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
          </div>
        </div>
      </div>
    </div>
  );
}

// Dashboard Tab Component
function DashboardTab({ customerData, orders, cart, trackingStages }: {
  customerData: CustomerData;
  orders: Order[];
  cart: CartItem[];
  trackingStages: TrackingStage[];
}) {
  const recentOrders = orders.slice(0, 3);
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-2">
            Welcome back, {customerData.firstName}!
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
                <p className="text-2xl font-bold">${totalSpent.toFixed(2)}</p>
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
                      <p className="font-medium">Order #{order.id.slice(-8)}</p>
                      <p className="text-sm text-gray-600">
                        {order.items.length} items • ${order.total.toFixed(2)}
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
    </div>
  );
}

// Products Tab Component
function ProductsTab({ products, addToCart, cart }: {
  products: Product[];
  addToCart: (product: Product) => void;
  cart: CartItem[];
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const getCartItemQuantity = (productId: string) => {
    const item = cart.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>
        <div className="flex space-x-2">
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">{product.image}</div>
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                <div className="flex items-center justify-center space-x-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating || 0)
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
                  ${product.price.toFixed(2)}
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
                  Add to Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
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
                  <div className="text-3xl">{item.image}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                    <p className="text-lg font-bold text-blue-600">
                      ${item.price.toFixed(2)}
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
                      ${(item.price * item.quantity).toFixed(2)}
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
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${(getCartTotal() * 0.1).toFixed(2)}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>${(getCartTotal() * 1.1).toFixed(2)}</span>
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
                      Order #{order.id.slice(-8)}
                    </CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>${order.total.toFixed(2)}</span>
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
                          <span className="text-2xl">{item.image}</span>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-600">
                              Qty: {item.quantity} × ${item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <p className="font-semibold">
                          ${(item.price * item.quantity).toFixed(2)}
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
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                              isCompleted 
                                ? 'bg-blue-600 border-blue-600 text-white' 
                                : isCurrent
                                ? 'border-blue-600 text-blue-600'
                                : 'border-gray-300 text-gray-400'
                            }`}>
                              <StageIcon className="w-4 h-4" />
                            </div>
                            <div className="ml-2 hidden sm:block">
                              <p className={`text-xs font-medium ${
                                isCompleted || isCurrent ? 'text-blue-600' : 'text-gray-400'
                              }`}>
                                {stage.name}
                              </p>
                            </div>
                            {index < trackingStages.length - 1 && (
                              <div className={`w-8 sm:w-16 h-0.5 mx-2 ${
                                order.status > stage.id ? 'bg-blue-600' : 'bg-gray-300'
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
      console.error('Error updating profile:', error);
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
                  <p className="p-2 bg-gray-50 rounded">{customerData.firstName}</p>
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
                  <p className="p-2 bg-gray-50 rounded">{customerData.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <Label>Email Address</Label>
              <div className="flex items-center p-2 bg-gray-50 rounded">
                <Mail className="w-4 h-4 mr-2 text-gray-500" />
                <span>{customerData.email}</span>
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
                  <span>{customerData.profile?.phone || 'Not provided'}</span>
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
                  <span>{customerData.profile?.address || 'Not provided'}</span>
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
                  <p className="p-2 bg-gray-50 rounded">{customerData.profile?.city || 'Not provided'}</p>
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
                  <p className="p-2 bg-gray-50 rounded">{customerData.profile?.country || 'Not provided'}</p>
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
                {customerData.role === 'customer' ? 'Regular' : customerData.role}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}