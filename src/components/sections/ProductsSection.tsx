'use client';



import {
  Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Gauge, SplitSquareHorizontal, CheckCircle, ShoppingBag, X, Star } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/lib/types";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const DEFAULT_IMAGE = 'https://placehold.co/600x400.png';

export function ProductsSection({ products }: { products: Product[] }) {
  const hasProducts = products?.length > 0;
  const { user, isAdmin } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category?.toLowerCase() === selectedCategory.toLowerCase());

  console.log('Selected category:', selectedCategory);
  console.log('Available categories:', [...new Set(products.map(p => p.category))]);
  console.log('Filtered products:', filteredProducts.length);

  const getCategoryIcon = (category: string) => {
    const lower = category?.toLowerCase() || '';
    if (lower.includes('meter')) return <Gauge className="h-10 w-10 text-primary" />;
    if (lower.includes('service')) return <SplitSquareHorizontal className="h-10 w-10 text-primary" />;
    return <ShoppingBag className="h-10 w-10 text-primary" />;
  };

  const handleAddToCart = (product: Product) => {
    if (!user) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return;
    }

    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <motion.section
      id="products"
      className="py-16 lg:py-24 bg-secondary"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={sectionVariants}
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl" variants={itemVariants}>
            Our Services
          </motion.h2>
          <motion.p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto" variants={itemVariants}>
            Providing reliable and efficient sub-metering solutions tailored to your needs.
          </motion.p>
          
          {/* Category Filter */}
          <motion.div className="mt-8 flex justify-center gap-4" variants={itemVariants}>
            <Button 
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => {
                console.log('Clicked All Products');
                setSelectedCategory('all');
              }}
              className="px-6"
            >
              All Products
            </Button>
            <Button 
              variant={selectedCategory === 'Water Meter' ? 'default' : 'outline'}
              onClick={() => {
                console.log('Clicked Water Meter');
                setSelectedCategory('Water Meter');
              }}
              className="px-6"
            >
              💧 Water Meters
            </Button>
            <Button 
              variant={selectedCategory === 'Energy Meter' ? 'default' : 'outline'}
              onClick={() => {
                console.log('Clicked Energy Meter');
                setSelectedCategory('Energy Meter');
              }}
              className="px-6"
            >
              ⚡ Energy Meters
            </Button>
          </motion.div>
        </div>

        {hasProducts ? (
          <div className="relative">
            <div className="flex overflow-x-auto scrollbar-hide gap-6 pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {filteredProducts.map((product) => (
                <motion.div key={product?.id || Math.random()} variants={itemVariants} className="flex-none w-80 snap-start">
                  <Card className="shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full bg-background overflow-hidden group hover:scale-105">
                    <div className="aspect-[3/2] w-full relative bg-muted overflow-hidden">
                      <Image
                        src={product?.imageUrl || DEFAULT_IMAGE}
                        alt={product?.name || "Product Image"}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        sizes="320px"
                      />
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-semibold">
                        {product?.category || 'General'}
                      </div>
                      {(product?.price || 0) > 0 && (
                        <div className="absolute bottom-2 left-2 bg-background/90 backdrop-blur-sm text-foreground px-3 py-1 rounded-full text-sm font-bold">
                          KES {(product.price || 0).toLocaleString('en-KE')}
                        </div>
                      )}
                      <div className="absolute top-2 left-2 bg-blue-500/90 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        Stock: {product?.stock || 0}
                      </div>
                    </div>
                    <CardHeader className="items-center text-center pt-6 pb-4">
                      <div className="p-3 bg-primary/10 rounded-full mb-3 inline-block group-hover:bg-primary/20 transition-colors">
                        {getCategoryIcon(product?.category || '')}
                      </div>
                      <CardTitle className="text-xl font-semibold line-clamp-2 leading-tight">{product?.name || 'Unnamed Product'}</CardTitle>
                    </CardHeader>

                    <CardContent className="flex-grow px-6">
                      <CardDescription className="text-sm text-muted-foreground mb-4 text-center line-clamp-3">
                        {product?.description || 'No description available'}
                      </CardDescription>

                      {Array.isArray(product?.features) && product.features.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-semibold text-foreground mb-2">Key Features:</h4>
                          <div className="space-y-1">
                            {product.features.slice(0, 4).map((feature, index) => (
                              <div key={`${feature || 'feature'}-${index}`} className="flex items-start text-xs">
                                <CheckCircle className="h-3 w-3 text-primary mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-muted-foreground line-clamp-1">{feature || 'Feature'}</span>
                              </div>
                            ))}
                            {product.features.length > 4 && (
                              <p className="text-xs text-muted-foreground italic">+{product.features.length - 4} more features</p>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>

                    <CardFooter className="flex-col items-center pt-4 border-t px-6 pb-6">
                      {(product?.price || 0) === 0 && (
                        <p className="text-center text-primary font-bold text-lg mb-3">
                          Request Quote
                        </p>
                      )}
                      <div className="space-y-2 w-full">
                        <Button 
                          size="sm"
                          className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300" 
                          onClick={() => {
                            if (typeof window !== 'undefined') {
                              if (!user) {
                                window.location.href = '/login';
                              } else if (user && !isAdmin) {
                                window.location.href = '/customer/dashboard';
                              }
                            }
                          }}
                        >
                          🛒 Buy Now
                        </Button>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline"
                                size="sm"
                                className="flex-1 hover:bg-primary/5" 
                              >
                                📖 Learn More
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-3 text-xl">
                                  <div className="p-2 bg-primary/10 rounded-full">
                                    {getCategoryIcon(product?.category || '')}
                                  </div>
                                  {product?.name || 'Product Details'}
                                </DialogTitle>
                              </DialogHeader>
                              
                              <div className="space-y-6">
                                <div className="aspect-video w-full relative bg-muted rounded-lg overflow-hidden">
                                  <Image
                                    src={product?.imageUrl || DEFAULT_IMAGE}
                                    alt={product?.name || "Product Image"}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                
                                <div>
                                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                                    📋 Description
                                  </h3>
                                  <p className="text-sm text-muted-foreground leading-relaxed">
                                    {product?.description || 'No description available'}
                                  </p>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="bg-primary/5 p-4 rounded-lg">
                                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                                      💰 Pricing
                                    </h3>
                                    <p className="text-2xl font-bold text-primary">
                                      {(product?.price || 0) > 0 ? `KES ${(product.price || 0).toLocaleString('en-KE')}` : 'Request Quote'}
                                    </p>
                                  </div>
                                  <div className="bg-blue-50 p-4 rounded-lg">
                                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                                      📦 Stock
                                    </h3>
                                    <p className={`text-2xl font-bold ${
                                      (product?.stock || 0) > 10 ? 'text-green-600' : 
                                      (product?.stock || 0) > 0 ? 'text-orange-600' : 'text-red-600'
                                    }`}>
                                      {(product?.stock || 0) > 0 ? `${product?.stock || 0} Available` : 'Out of Stock'}
                                    </p>
                                  </div>
                                </div>
                                
                                {Array.isArray(product?.features) && product.features.length > 0 && (
                                  <div>
                                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                                      ⭐ Key Features
                                    </h3>
                                    <div className="grid gap-2">
                                      {product.features.map((feature, index) => (
                                        <div key={`${feature || 'feature'}-${index}`} className="flex items-start gap-2 p-2 bg-muted/50 rounded-lg">
                                          <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                          <span className="text-sm">{feature || 'Feature'}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                <div className="flex gap-3 pt-4 border-t">
                                  <Button 
                                    className="flex-1 bg-gradient-to-r from-primary to-primary/80" 
                                    onClick={() => {
                                      if (typeof window !== 'undefined') {
                                        if (!user) {
                                          window.location.href = '/login';
                                        } else if (user && !isAdmin) {
                                          window.location.href = '/customer/dashboard';
                                        }
                                      }
                                    }}
                                  >
                                    🛒 Buy Now
                                  </Button>
                                  <Button 
                                    variant="outline"
                                    className="flex-1" 
                                    onClick={() => {
                                      if (typeof window !== 'undefined') {
                                        if (!user) {
                                          window.location.href = '/login';
                                        } else {
                                          window.location.href = '/contact';
                                        }
                                      }
                                    }}
                                  >
                                    💬 Get Quote
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button 
                            variant="outline"
                            size="sm"
                            className="flex-1 hover:bg-primary/5" 
                            onClick={() => {
                              if (typeof window !== 'undefined') {
                                if (!user) {
                                  window.location.href = '/login';
                                } else if (user && !isAdmin) {
                                  window.location.href = '/customer/dashboard';
                                }
                              }
                            }}
                          >
                            💬 Inquire
                          </Button>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
            <div className="flex justify-center mt-6">
              <p className="text-sm text-muted-foreground bg-muted px-4 py-2 rounded-full">
                {selectedCategory === 'all' 
                  ? `Scroll horizontally to view all ${products.length} services →`
                  : `Showing ${filteredProducts.length} ${selectedCategory} products`
                }
              </p>
            </div>
          </div>
        ) : (
          <motion.p className="text-center text-muted-foreground text-lg py-10" variants={itemVariants}>
            No products currently available. Please check back soon!
          </motion.p>
        )}
      </div>
    </motion.section>
  );
}
