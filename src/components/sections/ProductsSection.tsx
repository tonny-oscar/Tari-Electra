
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Gauge, SplitSquareHorizontal, CheckCircle, ShoppingBag } from "lucide-react"; // Assuming ShoppingBag is for default
import { motion } from "framer-motion";
import type { Product } from "@/lib/types";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

type ProductsSectionProps = {
  products: Product[];
};

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.2 }
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function ProductsSection({ products }: ProductsSectionProps) {
  const hasProducts = products && products.length > 0;

  const getCategoryIcon = (category: string) => {
    if (category.toLowerCase().includes('meter')) {
      return <Gauge className="h-10 w-10 text-primary" />;
    } else if (category.toLowerCase().includes('service')) {
      return <SplitSquareHorizontal className="h-10 w-10 text-primary" />;
    }
    return <ShoppingBag className="h-10 w-10 text-primary" />; // Default icon
  };

  return (
    <motion.section
      id="products" // id can remain if used for direct linking, but nav scrolls to /products page
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
        </div>
        {hasProducts ? (
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 items-stretch">
            {products.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col h-full bg-background overflow-hidden">
                  <div className="aspect-[3/2] w-full relative bg-muted">
                    <Image
                      src={product.imageUrl || 'https://placehold.co/600x400.png'}
                      alt={product.name}
                      fill
                      className="object-cover"
                      data-ai-hint={product.imageHint || product.name.split(' ').slice(0,2).join(' ').toLowerCase() || 'product image'}
                    />
                  </div>
                  <CardHeader className="items-center text-center pt-6">
                    <div className="p-3 bg-primary/10 rounded-full mb-3 inline-block">
                       {getCategoryIcon(product.category)}
                    </div>
                    <CardTitle className="text-2xl font-semibold">{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardDescription className="text-base text-muted-foreground mb-6 text-center h-20 overflow-hidden line-clamp-4">{product.description}</CardDescription>
                    {product.features && product.features.length > 0 && (
                      <div className="space-y-2 mb-4">
                        <h4 className="text-sm font-semibold text-foreground text-center mb-2">Key Features:</h4>
                        {product.features.slice(0,3).map((feature, index) => ( // Show max 3 features, add index here
                          <div key={`${feature}-${index}`} className="flex items-start text-sm"> {/* Use feature + index for key */}
                            <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex-col items-center pt-4 border-t">
                     <p className="text-center text-primary font-bold text-2xl mb-4">
                      KES {product.price > 0 ? product.price.toFixed(2) : "Request Quote"}
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
          <motion.p 
            className="text-center text-muted-foreground text-lg py-10"
            variants={itemVariants}
          >
            No products currently available. Please check back soon!
          </motion.p>
        )}
      </div>
    </motion.section>
  );
}
