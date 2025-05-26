'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Zap } from "lucide-react";
import { motion } from "framer-motion";

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 }
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function CallToActionStripSection() {
  return (
    <motion.section
      className="bg-primary text-primary-foreground py-12 md:py-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={sectionVariants}
    >
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex flex-col items-center md:flex-row md:justify-between md:items-center">
          <motion.div
            className="md:text-left mb-6 md:mb-0 max-w-xl"
            variants={itemVariants}
          >
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
              Don’t risk disconnections.
            </h2>
            <p className="text-lg md:text-xl opacity-90">
              Secure peace of mind with Tari Electra sub-meters.
            </p>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 hover:text-primary w-full sm:w-auto flex-shrink-0"
            >
              <Link href="/#contact">
                <Zap className="mr-2 h-5 w-5" /> Talk to Our Team Now
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}