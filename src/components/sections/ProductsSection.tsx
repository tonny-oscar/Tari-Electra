'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gauge, SplitSquareHorizontal, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const services = [
  {
    icon: <Gauge className="h-10 w-10 text-primary" />,
    title: "Tari Prepaid Sub-Meters",
    description: "Each tenant gets an individual meter, empowering them with control over their electricity usage and promoting accountability.",
    keyPoints: [
      "Tenant accountability for usage",
      "No shared bills or disputes",
      "Real-time usage tracking",
    ],
  },
  {
    icon: <SplitSquareHorizontal className="h-10 w-10 text-primary" />,
    title: "Meter Separation",
    description: "We professionally rewire or install dedicated meters for each tenant unit, ensuring fair and accurate billing.",
    keyPoints: [
      "Ideal for landlords and property managers",
      "Simplified electricity management",
      "Prevents unfair disconnections due to group bills",
    ],
  },
];

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

export function ProductsSection() {
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
        </div>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 items-stretch">
          {services.map((service) => (
            <motion.div key={service.title} variants={itemVariants}>
              <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col h-full">
                <CardHeader className="items-center text-center">
                  <div className="p-4 bg-primary/10 rounded-full mb-4">
                    {service.icon}
                  </div>
                  <CardTitle className="text-2xl font-semibold">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription className="text-base text-muted-foreground mb-6 text-center">{service.description}</CardDescription>
                  <div className="space-y-3">
                    {service.keyPoints.map((point) => (
                      <div key={point} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{point}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}