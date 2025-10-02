import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Users, Target, Cog, Phone, Mail } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - Tari Electra',
  description: 'Learn more about Tari Electra and why we are the preferred choice for smart sub-metering solutions.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Empowering Property Owners Through Technology.
            </h1>
            <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
          </div>

          {/* Our Story */}
          <Card className="mb-12 border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <Users className="h-8 w-8 text-primary mr-4" />
                <h2 className="text-3xl font-bold text-gray-900">Who We Are</h2>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                Tari is a leading provider of innovative utility submetering solutions in Kenya. We specialize in empowering property owners with the technology to efficiently manage electricity and water resources. Our systems are built to drive cost savings, promote sustainability, and simplify property management.
              </p>
            </CardContent>
          </Card>

          {/* Our Mission */}
          <Card className="mb-12 border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <Target className="h-8 w-8 text-primary mr-4" />
                <h2 className="text-3xl font-bold text-gray-900">What Drives Us</h2>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                To empower property owners with advanced metering technology that promotes resource efficiency, cost savings, and sustainable utility management. We believe in creating a transparent ecosystem where both landlords and tenants benefit from accurate, usage-based billing.
              </p>
            </CardContent>
          </Card>

          {/* Our Process */}
          <Card className="mb-12 border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <Cog className="h-8 w-8 text-primary mr-4" />
                <h2 className="text-3xl font-bold text-gray-900">How We Work With You</h2>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Our commitment to you goes beyond just providing a meter. We offer a complete, end-to-end service to ensure your success.
              </p>
              
              <div className="space-y-6">
                {[
                  {
                    step: '1',
                    title: 'Site Assessment',
                    description: 'Our technical team conducts a comprehensive site assessment to determine your specific needs.'
                  },
                  {
                    step: '2',
                    title: 'Professional Installation',
                    description: 'Certified technicians install and configure your meters to the highest industry standards.'
                  },
                  {
                    step: '3',
                    title: 'Seamless Activation & Go-Live',
                    description: 'We handle the entire setup to get you started, instantly activating your revenue stream and connecting your properties to our secure billing platform.'
                  },
                  
                  {
                    step: '4',
                    title: 'Ongoing Support',
                    description: 'We stand by our solutions with 24/7 technical support, regular system updates, and warranty services.'
                  }
                ].map((item) => (
                  <div key={item.step} className="flex items-start space-x-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-700">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <Card className="border-0 shadow-xl bg-gradient-to-r from-primary to-primary/80 text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Property Management?</h3>
              <p className="text-lg mb-6 opacity-90">
                Let's discuss how our smart metering solutions can help you save costs and improve efficiency.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button asChild size="lg" variant="secondary">
                  <Link href="/contact">
                    <Mail className="mr-2 h-5 w-5" />
                    Get In Touch
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Link href="/products">
                    <CheckCircle className="mr-2 h-5 w-5" />
                    View Our Solutions
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
