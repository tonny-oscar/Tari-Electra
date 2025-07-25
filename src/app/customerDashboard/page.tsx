// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { useRouter } from 'next/navigation';
// import { 
//   ShoppingCart, 
//   Package, 
//   Truck, 
//   CheckCircle, 
//   Clock, 
//   User, 
//   LogOut, 
//   Plus, 
//   Minus, 
//   Trash2,
//   Home,
//   Settings,
//   CreditCard
// } from 'lucide-react';
// import { auth, db } from '@/lib/firebase/client';
// import { 
//   doc, 
//   getDoc, 
//   updateDoc, 
//   collection, 
//   addDoc, 
//   query, 
//   where, 
//   orderBy, 
//   onSnapshot 
// } from 'firebase/firestore';
// import { signOut } from 'firebase/auth';
// import { useToast } from '@/hooks/use-toast';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';

// interface Product {
//   id: string;
//   name: string;
//   price: number;
//   image: string;
//   stock: number;
//   description?: string;
// }

// interface CartItem extends Product {
//   quantity: number;
// }

// interface Order {
//   id: string;
//   items: CartItem[];
//   total: number;
//   status: number;
//   createdAt: string;
//   estimatedDelivery: string;
//   trackingNumber?: string;
// }

// interface CustomerData {
//   firstName: string;
//   lastName: string;
//   email: string;
//   role: string;
//   orders: Order[];
//   profile: {
//     phone: string;
//     address: string;
//     city: string;
//     country: string;
//   };
// }

// export default function CustomerDashboard() {
//   const [user, loading, error] = useAuthState(auth);
//   const [customerData, setCustomerData] = useState<CustomerData | null>(null);
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const router = useRouter();
//   const { toast } = useToast();

//   // Sample products - in production, this would come from Firestore
//   const [products] = useState<Product[]>([
//     { 
//       id: '1', 
//       name: 'Wireless Headphones', 
//       price: 99.99, 
//       image: '🎧', 
//       stock: 15,
//       description: 'High-quality wireless headphones with noise cancellation'
//     },
//     { 
//       id: '2', 
//       name: 'Smart Watch', 
//       price: 249.99, 
//       image: '⌚', 
//       stock: 8,
//       description: 'Feature-rich smartwatch with health monitoring'
//     },
//     { 
//       id: '3', 
//       name: 'Laptop Stand', 
//       price: 79.99, 
//       image: '💻', 
//       stock: 20,
//       description: 'Ergonomic adjustable laptop stand'
//     },
//     { 
//       id: '4', 
//       name: 'Bluetooth Speaker', 
//       price: 129.99, 
//       image: '🔊', 
//       stock: 12,
//       description: 'Portable wireless speaker with premium sound'
//     },
//     { 
//       id: '5', 
//       name: 'Phone Case', 
//       price: 24.99, 
//       image: '📱', 
//       stock: 25,
//       description: 'Protective case with wireless charging support'
//     }
//   ]);

//   // Order tracking stages
//   const trackingStages = [
//     { id: 1, name: 'Order Received', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
//     { id: 2, name: 'Order Consolidated', icon: Package, color: 'bg-blue-100 text-blue-800' },
//     { id: 3, name: 'Order Packaged', icon: Package, color: 'bg-purple-100 text-purple-800' },
//     { id: 4, name: 'Order Dispatched', icon: Truck, color: 'bg-orange-100 text-orange-800' }
//   ];

//   // Authentication check and data loading
//   useEffect(() => {
//     if (loading) return;
    
//     if (!user) {
//       router.push('/login');
//       return;
//     }

//     const loadCustomerData = async () => {
//       try {
//         const customerDoc = await getDoc(doc(db, 'customers', user.uid));
        
//         if (!customerDoc.exists()) {
//           toast({
//             title: 'Account Not Found',
//             description: 'Customer account not found. Please sign up.',
//             variant: 'destructive',
//           });
//           await signOut(auth);
//           router.push('/signup');
//           return;
//         }

//         const data = customerDoc.data() as CustomerData;
//         setCustomerData(data);

//         // Load orders from Firestore
//         const ordersQuery = query(
//           collection(db, 'orders'),
//           where('customerId', '==', user.uid),
//           orderBy('createdAt', 'desc')
//         );

//         const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
//           const ordersList = snapshot.docs.map(doc => ({
//             id: doc.id,
//             ...doc.data()
//           })) as Order[];
//           setOrders(ordersList);
//         });

//         setIsLoading(false);
//         return () => unsubscribe();
//       } catch (error) {
//         console.error('Error loading customer data:', error);
//         toast({
//           title: 'Error',
//           description: 'Failed to load customer data.',
//           variant: 'destructive',
//         });
//         setIsLoading(false);
//       }
//     };

//     loadCustomerData();
//   }, [user, loading, router, toast]);

//   // Cart functions
//   const addToCart = (product: Product) => {
//     const existingItem = cart.find(item => item.id === product.id);
//     if (existingItem) {
//       setCart(cart.map(item =>
//         item.id === product.id
//           ? { ...item, quantity: item.quantity + 1 }
//           : item
//       ));
//     } else {
//       setCart([...cart, { ...product, quantity: 1 }]);
//     }
//     toast({
//       title: 'Added to Cart',
//       description: `${product.name} added to your cart.`,
//     });
//   };

//   const updateCartQuantity = (productId: string, change: number) => {
//     setCart(cart.map(item => {
//       if (item.id === productId) {
//         const newQuantity = item.quantity + change;
//         return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
//       }
//       return item;
//     }).filter(item => item.quantity > 0));
//   };

//   const removeFromCart = (productId: string) => {
//     setCart(cart.filter(item => item.id !== productId));
//   };

//   const getCartTotal = () => {
//     return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
//   };

//   const placeOrder = async () => {
//     if (cart.length === 0 || !user) return;

//     try {
//       const orderData = {
//         customerId: user.uid,
//         customerEmail: user.email,
//         items: cart,
//         total: getCartTotal(),
//         status: 1,
//         createdAt: new Date().toISOString(),
//         estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
//         trackingNumber: `TRK${Date.now()}`
//       };

//       const docRef = await addDoc(collection(db, 'orders'), orderData);
      
//       toast({
//         title: 'Order Placed!',
//         description: `Order #${docRef.id} has been placed successfully.`,
//       });

//       setCart([]);
//       setActiveTab('orders');

//       // Simulate order status updates (in production, this would be handled by backend)
//       setTimeout(() => updateOrderStatus(docRef.id, 2), 3000);
//       setTimeout(() => updateOrderStatus(docRef.id, 3), 8000);
//       setTimeout(() => updateOrderStatus(docRef.id, 4), 15000);

//     } catch (error) {
//       console.error('Error placing order:', error);
//       toast({
//         title: 'Order Failed',
//         description: 'Failed to place order. Please try again.',
//         variant: 'destructive',
//       });
//     }
//   };

//   const updateOrderStatus = async (orderId: string, newStatus: number) => {
//     try {
//       await updateDoc(doc(db, 'orders', orderId), {
//         status: newStatus,
//         updatedAt: new Date().toISOString()
//       });
//     } catch (error) {
//       console.error('Error updating order status:', error);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       router.push('/login');
//       toast({
//         title: 'Logged Out',
//         description: 'You have been successfully logged out.',
//       });
//     } catch (error) {
//       console.error('Logout error:', error);
//     }
//   };

//   if (loading || isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading your dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!customerData) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-red-600">Failed to load customer data.</p>
//           <Button onClick={() => router.push('/login')} className="mt-4">
//             Back to Login
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   // Navigation tabs
//   const tabs = [
//     { id: 'dashboard', name: 'Dashboard', icon: Home },
//     { id: 'products', name: 'Products', icon: Package },
//     { id: 'cart', name: 'Cart', icon: ShoppingCart, badge: cart.length },
//     { id: 'orders', name: 'Orders', icon: Truck },
//     { id: 'profile', name: 'Profile', icon: Settings }
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center space-x-4">
//               <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
//                 <User className="w-5 h-5 text-white" />
//               </div>
//               <span className="font-semibold text-gray-800">Customer Portal</span>
//             </div>
//             <div className="flex items-center space-x-4">
//               <span className="text-sm text-gray-600">
//                 Welcome, {customerData.firstName} {customerData.lastName}
//               </span>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={handleLogout}
//                 className="flex items-center space-x-2"
//               >
//                 <LogOut className="w-4 h-4" />
//                 <span>Logout</span>
//               </Button>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="flex flex-col lg:flex-row gap-8">
//           {/* Sidebar Navigation */}
//           <div className="lg:w-64">
//             <Card>
//               <CardContent className="p-6">
//                 <nav className="space-y-2">
//                   {tabs.map(tab => {
//                     const TabIcon = tab.icon;
//                     return (
//                       <Button
//                         key={tab.id}
//                         variant={activeTab === tab.id ? "default" : "ghost"}
//                         className={`w-full justify-start ${
//                           activeTab === tab.id ? '' : 'hover:bg-gray-100'
//                         }`}
//                         onClick={() => setActiveTab(tab.id)}
//                       >
//                         <TabIcon className="w-4 h-4 mr-3" />
//                         {tab.name}
//                         {tab.badge && tab.badge > 0 && (
//                           <Badge variant="secondary" className="ml-auto">
//                             {tab.badge}
//                           </Badge>
//                         )}
//                       </Button>
//                     );
//                   })}
//                 </nav>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Main Content */}
//           <div className="flex-1">
//             {activeTab === 'dashboard' && (
//               <DashboardTab 
//                 customerData={customerData} 
//                 orders={orders} 
//                 cart={cart}
//                 trackingStages={trackingStages}
//               />
//             )}
//             {activeTab === 'products' && (
//               <ProductsTab 
//                 products={products} 
//                 addToCart={addToCart}
//                 cart={cart}
//               />
//             )}
//             {activeTab === 'cart' && (
//               <CartTab 
//                 cart={cart}
//                 updateCartQuantity={updateCartQuantity}
//                 removeFromCart={removeFromCart}
//                 getCartTotal={getCartTotal}
//                 placeOrder={placeOrder}
//                 setActiveTab={setActiveTab}
//               />
//             )}
//             {activeTab === 'orders' && (
//               <OrdersTab 
//                 orders={orders}
//                 trackingStages={trackingStages}
//                 setActiveTab={setActiveTab}
//               />
//             )}
//             {activeTab === 'profile' && (
//               <ProfileTab 
//                 customerData={customerData}
//                 user={user}
//               />
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Dashboard Tab Component
// function DashboardTab({ customerData, orders, cart, trackingStages }: any) {
//   const recentOrders = orders.slice(0, 3);

//   return (
//     <div className="space-y-6">
//       <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
//         <CardContent className="p-6">
//           <h1 className="text-2xl font-bold mb-2">
//             Welcome back, {customerData.firstName}!
//           </h1>
//           <p className="text-blue-100">Here's what's happening with your orders</p>
//         </CardContent>
//       </Card>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Total Orders</p>
//                 <p className="text-2xl font-bold">{orders.length}</p>
//               </div>
//               <Package className="w-8 h-8 text-blue-600" />
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Cart Items</p>
//                 <p className="text-2xl font-bold">{cart.length}</p>
//               </div>
//               <ShoppingCart className="w-8 h-8 text-green-600" />
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Active Orders</p>
//                 <p className="text-2xl font-bold">
//                   {orders.filter((order: Order) => order.status < 4).length}
//                 </p>
//               </div>
//               <Clock className="w-8 h-8 text-orange-600" />
//             </div>
//           </CardContent>
//         </Card> 