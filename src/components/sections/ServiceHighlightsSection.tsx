
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Headset, Users, Zap } from "lucide-react";
// import { motion } from "framer-motion"; // Temporarily commented out

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
    icon: <Zap className="h-10 w-10 text-primary" />,
    title: "Fast Installation",
    description: "Same-day service in selected areas.",
  },
];

/* // Temporarily commented out motion variants
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
*/

export function ServiceHighlightsSection() {
  return (
    <section className="py-16 lg:py-24 bg-background"> {/* Removed id="about" as it's a dedicated page */}
      <div
        className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        // initial="hidden" // Temporarily commented out
        // whileInView="visible" // Temporarily commented out
        // viewport={{ once: true, amount: 0.2 }} // Temporarily commented out
        // variants={sectionVariants} // Temporarily commented out
      >
        <div className="text-center mb-12">
          <h2
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            // variants={itemVariants} // Temporarily commented out
          >
            Why Choose Us
          </h2>
          <p
            className="mt-4 text-lg text-muted-foreground"
            // variants={itemVariants} // Temporarily commented out
          >
            Discover the Tari Electra advantage for your property management needs.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {highlights.map((highlight) => (
            <div key={highlight.title} /* variants={itemVariants} // Temporarily commented out */>
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
