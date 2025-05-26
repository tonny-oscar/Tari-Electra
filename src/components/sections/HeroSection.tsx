'use client';

import { Button } from "@/components/ui/button";
import { CheckCircle, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const heroVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 }
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const bulletPoints = [
  "Prepaid Sub-Meters",
  "No Bill Disputes",
  "Easy Power Management"
];

export function HeroSection() {
  return (
    <section id="home" className="relative bg-secondary py-20 md:py-32 lg:py-40">
      <div className="absolute inset-0 opacity-5">
        {/* Optional subtle background pattern or image */}
      </div>
      <motion.div 
        className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10"
        variants={heroVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Zap className="mx-auto h-16 w-16 text-primary mb-6" />
        </motion.div>
        <motion.h1 
          className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl"
          variants={itemVariants}
        >
          Empower Your Property with Tari Electra
        </motion.h1>
        <motion.p 
          className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground sm:text-xl md:text-2xl"
          variants={itemVariants}
        >
          Meter separation for landlords and property owners.
        </motion.p>
        
        <motion.div 
          className="mt-8 max-w-md mx-auto space-y-3"
          variants={itemVariants}
        >
          {bulletPoints.map((point) => (
            <div key={point} className="flex items-center justify-center text-left sm:text-center">
              <CheckCircle className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
              <span className="text-muted-foreground text-base sm:text-lg">{point}</span>
            </div>
          ))}
        </motion.div>

        {/* Request Free Estimate Button Removed as it pointed to the contact section 
        <motion.div 
          className="mt-10"
          variants={itemVariants}
        >
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/#contact"> 
              Request Free Estimate
            </Link>
          </Button>
        </motion.div>
        */}
      </motion.div>
      <div className="mt-12 md:mt-16 lg:mt-20 relative z-0">
        <div className="aspect-[16/9] sm:aspect-[2/1] lg:aspect-[3/1] max-w-5xl mx-auto overflow-hidden rounded-xl shadow-2xl">
            <Image
                src="https://placehold.co/1200x400.png" 
                alt="Meter installation or tenants enjoying managed power"
                width={1200}
                height={400}
                className="object-cover w-full h-full"
                data-ai-hint="meter installation tenants"
                priority
            />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
}
