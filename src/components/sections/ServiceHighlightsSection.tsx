import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Lightbulb, ShieldCheck, Users } from "lucide-react";

const highlights = [
  {
    icon: <BarChart3 className="h-10 w-10 text-primary" />,
    title: "Accurate Billing",
    description: "Ensure fair and precise utility billing for each tenant based on actual consumption.",
  },
  {
    icon: <Lightbulb className="h-10 w-10 text-primary" />,
    title: "Energy Conservation",
    description: "Promote responsible energy use by making tenants aware of their consumption patterns.",
  },
  {
    icon: <ShieldCheck className="h-10 w-10 text-primary" />,
    title: "Reduced Disputes",
    description: "Minimize billing conflicts with transparent and easy-to-understand utility data.",
  },
  {
    icon: <Users className="h-10 w-10 text-primary" />,
    title: "Enhanced Property Value",
    description: "Modernize your property with smart technology, increasing its appeal and value.",
  },
];

export function ServiceHighlightsSection() {
  return (
    <section id="services" className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Why Choose Tari Smart Power?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Empowering landlords with cutting-edge sub-metering technology.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {highlights.map((highlight) => (
            <Card key={highlight.title} className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                  {highlight.icon}
                </div>
                <CardTitle className="text-xl font-semibold">{highlight.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{highlight.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
