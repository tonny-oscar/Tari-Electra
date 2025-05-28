
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gauge, SplitSquareHorizontal, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/lib/types"; // Import the Product type

// Define the props for the component
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

// Accept products as a prop
export function ProductsSection({ products }: ProductsSectionProps) {
  // No longer fetching products here, it's passed as a prop

  // Fallback for when services array is needed for the title/description (if products is empty)
  // Or adjust the UI to reflect that the product list is dynamic
  const hasProducts = products && products.length > 0;

  return (
    <motion.section
      id="products" // This id might still be useful if you want to link to it from other parts of the site
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
            Our Products & Services
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
                <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col h-full">
                  <CardHeader className="items-center text-center">
                    <div className="p-4 bg-primary/10 rounded-full mb-4">
                      {/* Choose icon based on category or a default one */}
                      {product.category === 'Prepaid Meters' || product.category === 'Smart Meters' ? (
                        <Gauge className="h-10 w-10 text-primary" />
                      ) : product.category === 'Services' ? (
                        <SplitSquareHorizontal className="h-10 w-10 text-primary" />
                      ) : (
                        <Gauge className="h-10 w-10 text-primary" /> // Default icon
                      )}
                    </div>
                    <CardTitle className="text-2xl font-semibold">{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardDescription className="text-base text-muted-foreground mb-6 text-center">{product.description}</CardDescription>
                    {product.features && product.features.length > 0 && (
                      <div className="space-y-3">
                        {product.features.map((feature) => (
                          <div key={feature} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-center text-primary font-semibold text-lg mt-4">
                      KES {product.price > 0 ? product.price.toFixed(2) : "Request Quote"}
                    </p>
                  </CardContent>
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
