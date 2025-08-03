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
    transition: { staggerChildren: 0.2, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const bulletPoints = [
  "Prepaid Sub-Meters",
  "No Bill Disputes",
  "Easy Power Management",
];

type HeroSectionProps = {
  imageUrl?: string;
  imageHint?: string;
};

export function HeroSection({
  imageUrl,
  imageHint = "smart meter",
}: HeroSectionProps) {
  // Provide a fallback image and validate the imageUrl
  const validImageUrl = imageUrl && imageUrl.trim() !== '' 
    ? imageUrl 
    : null; // Use null to trigger gradient fallback

  return (
    <section className="relative h-[80vh] md:h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <motion.div
        className="absolute inset-0 z-0"
        variants={imageVariants}
        initial="hidden"
        animate="visible"
      >
        {validImageUrl ? (
          <Image
            src={validImageUrl}
            alt="Smart meter solutions for modern buildings"
            fill
            sizes="100vw"
            className="object-cover object-center"
            data-ai-hint={imageHint}
            priority
            onError={(e) => {
              // Handle image load errors - could trigger a state update to show gradient
              console.warn('Failed to load hero image:', validImageUrl);
            }}
          />
        ) : (
          // Fallback gradient background if no image is available
          <div className="w-full h-full bg-gradient-to-br from-blue-900 via-slate-800 to-emerald-900" />
        )}
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/50 z-20" />
      </motion.div>

      {/* Optional Background Noise Pattern */}
      <div className="absolute inset-0 bg-[url('/patterns/noise.svg')] bg-repeat opacity-10 z-30 pointer-events-none" />

      {/* Main Content */}
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-40">
        <motion.div
          className="text-center text-white"
          variants={heroVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div variants={itemVariants} className="mb-6 flex justify-center">
            <div className="p-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <Zap className="h-12 w-12 md:h-16 md:w-16 text-white" />
            </div>
          </motion.div>

          <motion.h1
            className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl mb-4"
            variants={itemVariants}
          >
            Empower Your Property with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              Tari Electra
            </span>
          </motion.h1>

          <motion.span
            className="block text-blue-300 font-semibold text-lg md:text-xl mb-6"
            variants={itemVariants}
          >
            Smart Sub-Metering Solutions
          </motion.span>

          <motion.p
            className="max-w-2xl mx-auto text-lg md:text-xl text-gray-200 mb-8"
            variants={itemVariants}
          >
            Meter separation for landlords and property owners.
          </motion.p>

          {/* Bullet Points */}
          <motion.div className="mb-10 space-y-3 max-w-md mx-auto" variants={itemVariants}>
            {bulletPoints.map((point, index) => (
              <motion.div
                key={point}
                className="flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
              >
                <CheckCircle className="h-5 w-5 text-emerald-400 mr-3 flex-shrink-0" />
                <span className="text-white text-base font-medium">{point}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div className="mb-8" variants={itemVariants}>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white border-0 shadow-2xl px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              <Link href="/free-estimate" aria-label="Request a free estimate">
                Request Free Estimate
              </Link>
            </Button>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <motion.div
              className="w-5 h-8 border-2 border-white/40 rounded-full flex justify-center cursor-pointer"
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-0.5 h-2 bg-white/60 rounded-full mt-1.5 animate-pulse" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}