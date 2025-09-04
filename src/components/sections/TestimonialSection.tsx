'use client';

import { testimonials } from "@/data/testimonials";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Star, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

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

const avatarImages = [
  "/62ab4fd5-eecc-446e-95d1-81940a23ab45.jpeg",
  "/477cc64d-5ac2-4def-8e0c-5615c4375fdb.jpeg",
  "/ecbe469f-539e-42fa-aa6c-c800bab509e1.jpeg"
];

export function TestimonialSection() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <motion.div 
        className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            variants={itemVariants}
          >
            What Our Clients Say
          </motion.h2>
          <motion.p 
            className="mt-4 text-lg text-muted-foreground"
            variants={itemVariants}
          >
            Real feedback from satisfied property owners and partners.
          </motion.p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div key={testimonial.id} variants={itemVariants}>
              <Card className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage 
                        src={avatarImages[index % avatarImages.length]} 
                        alt={`${testimonial.name} profile picture`}
                        className="object-cover"
                        data-ai-hint="person portrait" 
                      />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {testimonial.avatarFallback}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}{testimonial.company ? ` at ${testimonial.company}`: ''}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="flex mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
 
                  <blockquote className="italic text-muted-foreground relative pl-8">
                    <MessageSquare className="absolute left-0 top-0 h-5 w-5 text-primary/50" />
                    "{testimonial.quote}"
                  </blockquote>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
