'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, TrendingUp, Shield, Zap, CheckCircle, ArrowRight, Award, Clock, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { AuthButtons } from '@/components/AuthButtons';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-primary/10 to-secondary/20">
        <div className="container mx-auto px-4 py-12 lg:py-20">
          {/* Large Zap Icon */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10">
            <Zap className="h-96 w-96 text-primary" />
          </div>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight text-foreground mt-8">
                  Your Online Store for Prepaid Water & Electricity Meters.
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-12">
                Tari provides innovative submetering solutions for property owners, empowering you with 
                <span className="font-semibold text-primary"> real-time consumption data</span>, 
                <span className="font-semibold text-primary"> automated billing</span>, and 
                <span className="font-semibold text-primary"> enhanced operational efficiency</span>.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-6">
                {/* ✅ Button redirects to /free-estimate */}
                {/* <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-4 text-lg shadow-xl hover:scale-105 transition-transform"
                >
                  <Link href="/free-estimate">
                    Request a Quote
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button> */}
              </div>
            </div>
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
                  Stop revenue loss and billing disputes for good. Our solution ensures hassle-free revenue collection with tamper-proof meters that prevent manipulation. You get automated payments, clear consumption tracking, and total peace of mind—all designed to protect your income and maximize your returns.
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
  );
}
