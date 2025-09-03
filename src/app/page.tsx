'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, TrendingUp, Shield, Zap, CheckCircle, ArrowRight, Users, BarChart3, Clock, Award } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const { user, isAdmin, isCustomer } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* Hero Background Image */}
      <div 
        className="absolute inset-0 bg-gray-900"
        style={{
          backgroundImage: "url('/e028f8be-87a9-4864-995b-7138e613c62c.jpeg')",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundSize: 'contain'
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative z-10 container mx-auto px-4 py-12 lg:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight text-white drop-shadow-lg mt-8">
                Smart Utility Management,
                <br />
                <span className="text-primary">Simplified.</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed mb-12">
                Tari provides innovative submetering solutions for property owners, empowering you with 
                <span className="font-semibold text-primary"> real-time consumption data</span>, 
                <span className="font-semibold text-primary"> automated billing</span>, and 
                <span className="font-semibold text-primary"> enhanced operational efficiency</span>.
              </p>
              
             <div className="flex flex-col sm:flex-row justify-center gap-6">
  <Button
    asChild
    size="lg"
    className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-4 text-lg shadow-xl hover:scale-105 transition-transform"
  >
    <Link href="/contact">
      Request a Quote
      <ArrowRight className="ml-2 h-5 w-5" />
    </Link>
  </Button>

  {mounted && !user && (
    <Button
      asChild
      size="lg"
      className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-4 text-lg shadow-xl hover:scale-105 transition-transform"
    >
      <Link href="/signup">Get Started Free</Link>
    </Button>
  )}
</div>

              
              {/* Dashboard shortcuts for logged in users */}
              {mounted && user && (
                <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                  {isAdmin && (
                    <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                      <Link href="/admin">
                        <BarChart3 className="mr-2 h-5 w-5" />
                        Admin Dashboard
                      </Link>
                    </Button>
                  )}
                  {isCustomer && (
                    <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90">
                      <Link href="/customer/dashboard">
                        <Users className="mr-2 h-5 w-5" />
                        My Dashboard
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-20 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Take Control of Your Property's Utility Costs.
                </h2>
                <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  Are you facing rising operational expenses, tenant disputes over utility bills, and time-consuming manual collections? 
                  Traditional flat-rate billing is inefficient and unfair. Tari introduces a transparent, accountable, and streamlined 
                  way to manage electricity and water consumption across your properties.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    icon: DollarSign,
                    title: 'Reduce Costs',
                    description: 'Lower property operating expenses by 15-30%.'
                  },
                  {
                    icon: TrendingUp,
                    title: 'Improve Cash Flow',
                    description: 'Ensure upfront payments with our prepaid system.'
                  },
                  {
                    icon: Shield,
                    title: 'Promote Accountability',
                    description: 'Tenants pay for actual usage, encouraging conservation.'
                  },
                  {
                    icon: Clock,
                    title: 'Increase Efficiency',
                    description: 'Automate billing, collection, and monitoring processes.'
                  }
                ].map((benefit, index) => (
                  <div key={index} className="group hover:-translate-y-2 transition-transform duration-300">
                    <Card className="h-full border-0 shadow-xl bg-background hover:shadow-2xl transition-all duration-300">
                      <CardContent className="p-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <benefit.icon className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-4">{benefit.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Tari Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-8">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                    The Smarter Choice for Utility Submetering.
                  </h2>
                  
                  <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                    We empower property owners with advanced technology that delivers tangible results. 
                    From our tamper-proof meters to a comprehensive management dashboard, our solution 
                    is designed to protect your revenue, provide stress-free monitoring, and deliver 
                    a significant return on investment.
                  </p>
                  
                  <div className="hover:scale-105 transition-transform">
                    <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-4 text-lg shadow-xl">
                      <Link href="/products">
                        Discover Our Solutions
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { icon: Shield, title: 'Tamper-Proof', desc: 'Advanced security features' },
                    { icon: BarChart3, title: 'Real-Time Data', desc: 'Live consumption monitoring' },
                    { icon: DollarSign, title: 'ROI Focused', desc: 'Guaranteed return on investment' },
                    { icon: CheckCircle, title: '24/7 Support', desc: 'Always here when you need us' }
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="p-6 bg-card rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border"
                    >
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="font-bold text-foreground mb-2">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}