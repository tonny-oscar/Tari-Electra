'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail, PhoneIcon, Clock } from "lucide-react";
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

export function FreeEstimateSection() {
  return (
    <motion.section
      className="py-16 lg:py-24 bg-secondary min-h-screen"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={sectionVariants}
    >
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h1
            className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Get Your Free Estimate
          </motion.h1>
          <motion.p
            className="mt-6 text-xl text-muted-foreground"
            variants={itemVariants}
          >
            Contact us today for a personalized quote
          </motion.p>
        </div>

        <motion.div variants={itemVariants} className="max-w-2xl mx-auto">
          <Card className="shadow-2xl">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl">Get Your Free Estimate</CardTitle>
              <CardDescription className="text-lg">Contact us today for a personalized quote</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid gap-6">
                <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-300">
                  <div className="p-3 bg-blue-500 rounded-full mr-4">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-900 text-lg">📧 Email Us</h3>
                    <a href="mailto:hello@tari.africa" className="text-blue-700 hover:text-blue-900 font-semibold text-lg">hello@tari.africa</a>
                  </div>
                </div>
                
                <div className="flex items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200 hover:shadow-md transition-all duration-300">
                  <div className="p-3 bg-green-500 rounded-full mr-4">
                    <PhoneIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-green-900 text-lg">📞 Call Us</h3>
                    <a href="tel:0717777668" className="text-green-700 hover:text-green-900 font-semibold text-lg">0717777668</a>
                  </div>
                </div>
                
                <div className="flex items-center p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200 hover:shadow-md transition-all duration-300">
                  <div className="p-3 bg-emerald-500 rounded-full mr-4">
                    <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-emerald-900 text-lg">💬 WhatsApp</h3>
                    <a href="https://wa.me/254717777668?text=Hello%2C%20I%27m%20interested%20in%20your%20sub-metering%20services.%20Could%20you%20please%20provide%20me%20with%20more%20information%3F" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-900 font-semibold text-lg">0717777668</a>
                  </div>
                </div>
                
                <div className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200 hover:shadow-md transition-all duration-300">
                  <div className="p-3 bg-purple-500 rounded-full mr-4">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-purple-900 text-lg">🕘 Business Hours</h3>
                    <p className="text-purple-700 font-semibold text-lg">9:00 AM – 5:00 PM (Mon–Fri)</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl border-2 border-gradient-to-r from-indigo-200 to-purple-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/30 to-purple-100/30"></div>
                <div className="relative z-10 text-center space-y-4">
                  <div className="relative inline-block">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-xl flex items-center justify-center border-4 border-white animate-pulse">
                      <div className="text-3xl">👥</div>
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-3 border-white flex items-center justify-center animate-bounce">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-bold text-xl text-gray-800 flex items-center justify-center gap-2">
                      🎆 Customer Support Agent
                    </h4>
                    <p className="text-lg text-gray-700 font-semibold bg-white/60 px-4 py-2 rounded-full inline-block">
                      Ready to assist you 24/7
                    </p>
                    <div className="flex justify-center space-x-3 pt-2">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer">
                        <PhoneIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12,3C17.5,3 22,6.58 22,11C22,15.42 17.5,19 12,19C10.76,19 9.57,18.82 8.47,18.5C5.55,21 2,21 2,21C4.33,18.67 4.7,17.1 4.75,16.5C3.05,15.07 2,13.13 2,11C2,6.58 6.5,3 12,3Z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute top-3 left-3 opacity-30">
                  <div className="text-2xl animate-spin-slow">✨</div>
                </div>
                <div className="absolute bottom-3 right-3 opacity-30">
                  <div className="text-2xl animate-bounce">🚀</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.section>
  );
}