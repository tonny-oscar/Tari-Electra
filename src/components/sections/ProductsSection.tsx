'use client';

import {
  Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter
} from "@/components/ui/card";
import { Gauge, SplitSquareHorizontal, CheckCircle, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/lib/types";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useProductStore, initializeProductListeners } from "@/store/products";

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

export function ProductsSection() {
  const { products, isLoading } = useProductStore();
  const hasProducts = products?.length > 0;
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const unsubscribe = initializeProductListeners();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const getCategoryIcon = (category: string) => {
    const lower = category.toLowerCase();
    if (lower.includes('meter')) return <Gauge className="h-10 w-10 text-primary" />;
    if (lower.includes('service')) return <SplitSquareHorizontal className="h-10 w-10 text-primary" />;
    return <ShoppingBag className="h-10 w-10 text-primary" />;
  };

  const handleAddToCart = (product: Product) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to add products to your cart.",
      });
      return;
    }

    addToCart(product);
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
        </div>

        {hasProducts ? (
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 items-stretch">
            {products.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col h-full bg-background overflow-hidden">
                  <div className="aspect-[3/2] w-full relative bg-muted">
                    <Image
                      src={product.imageUrl || DEFAULT_IMAGE}
                      alt={product.name || "Product Image"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <CardHeader className="items-center text-center pt-6">
                    <div className="p-3 bg-primary/10 rounded-full mb-3 inline-block">
                      {getCategoryIcon(product.category)}
                    </div>
                    <CardTitle className="text-2xl font-semibold">{product.name}</CardTitle>
                  </CardHeader>

                  <CardContent className="flex-grow">
                    <CardDescription className="text-base text-muted-foreground mb-6 text-center h-20 overflow-hidden line-clamp-4">
                      {product.description}
                    </CardDescription>

                    {Array.isArray(product.features) && product.features.length > 0 && (
                      <div className="space-y-2 mb-4">
                        <h4 className="text-sm font-semibold text-foreground text-center mb-2">Key Features:</h4>
                        {product.features.slice(0, 3).map((feature, index) => (
                          <div key={`${feature}-${index}`} className="flex items-start text-sm">
                            <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="flex-col items-center pt-4 border-t">
                    <p className="text-center text-primary font-bold text-2xl mb-4">
                      {product.price > 0 ? `KES ${product.price.toFixed(2)}` : 'Request Quote'}
                    </p>
                    <Button asChild className="w-full">
                      <Link href="/contact">Inquire Now</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
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


