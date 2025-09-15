'use client';

import { motion } from "framer-motion";
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
import { Gauge, SplitSquareHorizontal, CheckCircle, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/lib/types";
import Image from "next/image";
import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/context/CartContext";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";

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

const isValidUrl = (string: string) => {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
};

export function ProductsSection({ products }: { products: Product[] }) {
  const [isLoading, setIsLoading] = useState(true);
  const [productList, setProductList] = useState<Product[]>([]);
  const { user } = useAuth();
  const { addToCart, cartItems } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [scrollContainer, setScrollContainer] = useState<HTMLDivElement | null>(null);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (products) {
      setProductList(products);
      setIsLoading(false);
    }
  }, [products]);

  const hasProducts = productList?.length > 0;

  const getCartQuantity = (productId: string) => {
    const item = cartItems.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  const scrollLeft = () => {
    scrollContainer?.scrollBy({ left: -320, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollContainer?.scrollBy({ left: 320, behavior: 'smooth' });
  };

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') return productList;

    if (selectedCategory.includes(' - ')) {
      const [category, subcategory] = selectedCategory.split(' - ');
      return productList.filter(p => p.category === category && p.subcategory === subcategory);
    }

    return productList.filter(p => p.category === selectedCategory);
  }, [productList, selectedCategory]);

  const getCategoryIcon = (category: string) => {
    const lower = category?.toLowerCase() || '';
    if (lower.includes('meter')) return <Gauge className="h-10 w-10 text-primary" />;
    if (lower.includes('service')) return <SplitSquareHorizontal className="h-10 w-10 text-primary" />;
    return <ShoppingBag className="h-10 w-10 text-primary" />;
  };

  const handleAddToCart = async (product: Product) => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (addingToCart === product.id) return;

    setAddingToCart(product.id!);
    const currentQuantity = getCartQuantity(product.id!);

    try {
      addToCart(product);
      const newQuantity = currentQuantity + 1;

      toast({
        title: "Added to Cart",
        description: `${product.name} (Quantity: ${newQuantity}) added to cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive"
      });
    } finally {
      setTimeout(() => setAddingToCart(null), 1000);
    }
  };

  if (isLoading) {
    return (
      <section className="py-16 lg:py-24 bg-secondary">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

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
          <motion.h2
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            variants={itemVariants}
          >
            Our Services
          </motion.h2>
          <motion.p
            className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Providing reliable and efficient sub-metering solutions tailored to your needs.
          </motion.p>

          {/* Category Filter */}
          <motion.div className="mt-8 flex flex-wrap justify-center gap-3" variants={itemVariants}>
            {[
              { key: "all", label: "All Products" },
              // { key: "Water Meter - Prepaid Meter", label: "💳 Prepaid Water Meters" },
              // { key: "Water Meter - Smart Meter", label: "🔌 Smart Water Meters" },
              // { key: "Energy Meter - Prepaid Meter", label: "💳 Prepaid Energy Meters" },
              // { key: "Energy Meter - Smart Meter", label: "🔌 Smart Energy Meters" },
            ].map(cat => (
              <Button
                key={cat.key}
                variant={selectedCategory === cat.key ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(cat.key)}
                className="px-6"
              >
                {cat.label}
              </Button>
            ))}
          </motion.div>
        </div>

        {hasProducts ? (
          <div className="relative">
            {/* Arrows */}
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-200 hover:scale-110"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-6 w-6 text-primary" />
            </button>
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-200 hover:scale-110"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-6 w-6 text-primary" />
            </button>

            <div
              ref={setScrollContainer}
              className="flex overflow-x-auto scrollbar-hide gap-6 pb-4 snap-x snap-mandatory px-12"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id ?? `product-${index}`}
                  variants={itemVariants}
                  className="flex-none w-80 snap-start"
                >
                  <Card className="shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full bg-background overflow-hidden group hover:scale-105">
                    {/* Product Image */}
                    <div className="h-48 w-full relative bg-muted overflow-hidden">
                      {product.imageUrl && isValidUrl(product.imageUrl) ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.name || "Product Image"}
                          fill
                          className="object-contain transition-transform duration-300 group-hover:scale-110 p-2"
                          sizes="320px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="h-16 w-16 text-muted-foreground/50" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-semibold">
                        {product.category || 'General'}
                      </div>
                      {(product.price || 0) > 0 && (
                        <div className="absolute bottom-2 left-2 bg-background/90 backdrop-blur-sm text-foreground px-3 py-1 rounded-full text-sm font-bold">
                          KES {(product.price || 0).toLocaleString('en-KE')}
                        </div>
                      )}
                      <div className="absolute top-2 left-2 bg-blue-500/90 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        Stock: {product.stock || 0}
                      </div>
                    </div>

                    {/* Header */}
                    <CardHeader className="items-center text-center pt-6 pb-4">
                      <div className="p-3 bg-primary/10 rounded-full mb-3 inline-block group-hover:bg-primary/20 transition-colors">
                        {getCategoryIcon(product.category || '')}
                      </div>
                      <CardTitle className="text-xl font-semibold line-clamp-2 leading-tight">
                        {product.name || 'Unnamed Product'}
                      </CardTitle>
                    </CardHeader>

                    {/* Content */}
                    <CardContent className="flex-grow px-6">
                      <CardDescription className="text-sm text-muted-foreground mb-4 text-center line-clamp-3">
                        {product.description || 'No description available'}
                      </CardDescription>

                      {Array.isArray(product.features) && product.features.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-semibold text-foreground mb-2">Key Features:</h4>
                          <div className="space-y-1">
                            {product.features.slice(0, 4).map((feature, idx) => (
                              <div key={`${feature}-${idx}`} className="flex items-start text-xs">
                                <CheckCircle className="h-3 w-3 text-primary mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-muted-foreground line-clamp-1">{feature}</span>
                              </div>
                            ))}
                            {product.features.length > 4 && (
                              <p className="text-xs text-muted-foreground italic">
                                +{product.features.length - 4} more features
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>

                    {/* Footer */}
                    <CardFooter className="flex-col items-center pt-4 border-t px-6 pb-6">
                      {(product.price || 0) === 0 && (
                        <p className="text-center text-primary font-bold text-lg mb-3">
                          Request Quote
                        </p>
                      )}
                      <div className="flex gap-2 w-full">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="flex-1 hover:bg-primary/5">
                                📖 Learn More
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-3 text-xl">
                                  <div className="p-2 bg-primary/10 rounded-full">
                                    {getCategoryIcon(product.category || '')}
                                  </div>
                                  {product.name || 'Product Details'}
                                </DialogTitle>
                                <DialogDescription>
                                  View detailed information about this product
                                </DialogDescription>
                              </DialogHeader>

                              <div className="space-y-6">
                                {/* Large image */}
                                <div className="aspect-video w-full relative bg-muted rounded-lg overflow-hidden">
                                  {product.imageUrl && isValidUrl(product.imageUrl) ? (
                                    <Image
                                      src={product.imageUrl}
                                      alt={product.name || "Product Image"}
                                      fill
                                      className="object-contain"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <ShoppingBag className="h-24 w-24 text-muted-foreground/50" />
                                    </div>
                                  )}
                                </div>

                                {/* Description */}
                                <div>
                                  <h3 className="font-semibold mb-2 flex items-center gap-2">📋 Description</h3>
                                  <p className="text-sm text-muted-foreground leading-relaxed">
                                    {product.description || 'No description available'}
                                  </p>
                                </div>

                                {/* Pricing + Stock */}
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="bg-primary/5 p-4 rounded-lg">
                                    <h3 className="font-semibold mb-2 flex items-center gap-2">💰 Pricing</h3>
                                    <p className="text-2xl font-bold text-primary">
                                      {(product.price || 0) > 0
                                        ? `KES ${(product.price || 0).toLocaleString('en-KE')}`
                                        : 'Request Quote'}
                                    </p>
                                  </div>
                                  <div className="bg-blue-50 p-4 rounded-lg">
                                    <h3 className="font-semibold mb-2 flex items-center gap-2">📦 Stock</h3>
                                    <p
                                      className={`text-2xl font-bold ${
                                        (product.stock || 0) > 10
                                          ? 'text-green-600'
                                          : (product.stock || 0) > 0
                                          ? 'text-orange-600'
                                          : 'text-red-600'
                                      }`}
                                    >
                                      {(product.stock || 0) > 0
                                        ? `${product.stock || 0} Available`
                                        : 'Out of Stock'}
                                    </p>
                                  </div>
                                </div>

                                {/* Specifications */}
                                {product.specifications && (
                                  <div>
                                    <h3 className="font-semibold mb-3 flex items-center gap-2 text-foreground">
                                      🔧 Specifications
                                    </h3>
                                    <div className="bg-muted/50 p-4 rounded-lg border">
                                      <div className="grid gap-2">
                                        {Object.entries(product.specifications).map(([key, value]) => (
                                          <div
                                            key={key}
                                            className="flex items-start gap-2 p-2 bg-background/50 rounded-lg"
                                          >
                                            <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                            <div className="flex-1">
                                              <span className="font-medium text-foreground capitalize">
                                                {key.replace(/([A-Z])/g, ' $1')}:
                                              </span>
                                              <span className="ml-2 text-muted-foreground">{String(value)}</span>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Features */}
                                {Array.isArray(product.features) && product.features.length > 0 && (
                                  <div>
                                    <h3 className="font-semibold mb-3 flex items-center gap-2">⭐ Key Features</h3>
                                    <div className="grid gap-2">
                                      {product.features.map((feature, idx) => (
                                        <div
                                          key={`${feature}-${idx}`}
                                          className="flex items-start gap-2 p-2 bg-muted/50 rounded-lg"
                                        >
                                          <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                          <span className="text-sm">{feature}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-3 pt-4 border-t">
                                  <Button
                                    className="w-full"
                                    onClick={() => router.push('/contact')}
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
                            onClick={() => router.push('/contact')}
                          >
                            💬 Inquire
                          </Button>
                        </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Summary */}
            <div className="flex justify-center mt-6">
              <p className="text-sm text-muted-foreground bg-muted px-4 py-2 rounded-full">
                {selectedCategory === 'all'
                  ? `Showing all ${filteredProducts.length} products`
                  : `Showing ${filteredProducts.length} ${selectedCategory.replace(' - ', ' ')} products`}
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

