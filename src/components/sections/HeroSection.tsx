
'use client';

import { Button } from "@/components/ui/button";
import { CheckCircle, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const heroVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
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
    <section className="relative bg-secondary py-20 md:py-28 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        {/* Optional subtle background pattern or image */}
      </div>
      <motion.div
        className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10"
        variants={heroVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Text Content Column */}
          <div className="text-center md:text-left">
            <motion.div variants={itemVariants} className="mb-4 md:mb-6 flex justify-center md:justify-start">
              <Zap className="h-12 w-12 md:h-16 md:w-16 text-primary" />
            </motion.div>
            <motion.h1
              className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
              variants={itemVariants}
            >
              Empower Your Property with Tari Electra
            </motion.h1>
            <motion.p
              className="mt-4 md:mt-6 max-w-xl mx-auto md:mx-0 text-lg text-muted-foreground sm:text-xl"
              variants={itemVariants}
            >
              Meter separation for landlords and property owners.
            </motion.p>

            <motion.div
              className="mt-6 md:mt-8 space-y-3"
              variants={itemVariants}
            >
              {bulletPoints.map((point) => (
                <div key={point} className="flex items-center justify-center md:justify-start">
                  <CheckCircle className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                  <span className="text-muted-foreground text-base">{point}</span>
                </div>
              ))}
            </motion.div>

            <motion.div
              className="mt-8 md:mt-10"
              variants={itemVariants}
            >
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/contact">
                  Request Free Estimate
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Image Column */}
          <motion.div
            className="relative aspect-square md:aspect-[4/3] lg:aspect-[3/2] max-w-md mx-auto md:max-w-none w-full mt-10 md:mt-0"
            variants={itemVariants}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Image
              src="https://placehold.co/800x600.png" 
              alt="Smart meter solutions for modern buildings"
              fill
              className="object-cover rounded-xl shadow-2xl"
              data-ai-hint="smart meter"
              priority
            />
          </motion.div>
        </div>
      </motion.div>
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent z-0"></div>
    </section>
  );
}
