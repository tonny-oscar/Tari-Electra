import { Button } from "@/components/ui/button";
import { Calculator, Info, Phone, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative bg-secondary py-20 md:py-32">
      <div className="absolute inset-0 opacity-10">
         {/* Optional subtle background pattern or image */}
      </div>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <Zap className="mx-auto h-16 w-16 text-primary mb-6" />
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Power Up Your Property with Smart Sub-Metering
        </h1>
        <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground sm:text-xl md:text-2xl">
          Tari Smart Power provides innovative solutions for landlords to manage utility costs efficiently and transparently.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/#estimator">
              <Calculator className="mr-2 h-5 w-5" /> Get a Free Estimate
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
            <Link href="/#contact">
              <Phone className="mr-2 h-5 w-5" /> Contact Us
            </Link>
          </Button>
           <Button asChild variant="ghost" size="lg" className="w-full sm:w-auto text-primary hover:text-primary/90 hover:bg-primary/10">
            <Link href="/#services">
              <Info className="mr-2 h-5 w-5" /> Learn More
            </Link>
          </Button>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
}
