
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Headset, Users, Zap } from "lucide-react";
import { motion } from "framer-motion"; // Added this import

const highlights = [
  {
    icon: <DollarSign className="h-10 w-10 text-primary" />,
    title: "Affordable Pricing",
    description: "Competitive and transparent pricing for all property sizes.",
  },
  {
    icon: <Headset className="h-10 w-10 text-primary" />,
    title: "24/7 Customer Support",
    description: "Always available for installation help or questions.",
  },
  {
    icon: <Users className="h-10 w-10 text-primary" />,
    title: "Qualified Experts",
    description: "Trusted technicians with verified experience.",
  },
  {
    icon: <Zap className="h-10 w-10 text-primary" />, // Assuming Zap for Fast Installation
    title: "Fast Installation",
    description: "Same-day service in selected areas.",
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

export function ServiceHighlightsSection() {
  return (
    <motion.section
      id="about" // Keep id if used for direct navigation/linking, otherwise can be removed for multi-page setup
      className="py-16 lg:py-24 bg-background"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionVariants}
    >
      <div
        className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <h2
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Why Choose Us
          </h2>
          <p
            className="mt-4 text-lg text-muted-foreground"
          >
            Discover the Tari Electra advantage for your property management needs.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {highlights.map((highlight) => (
            <motion.div key={highlight.title} variants={itemVariants}>
              <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                <CardHeader>
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                    {highlight.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold">{highlight.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">{highlight.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
