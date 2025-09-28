"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function HeroSection() {
  const stats = [
    { icon: TrendingUp, label: "Articles", value: "500+" },
    { icon: Users, label: "Readers", value: "10K+" },
    { icon: Sparkles, label: "AI Tools", value: "100+" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mix-blend-screen filter blur-xl opacity-40 animate-blob"></div>
        <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mix-blend-screen filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-64 h-64 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full mix-blend-screen filter blur-xl opacity-40 animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>

      <div className="relative z-10 container mx-auto px-3 sm:px-4 lg:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
 
          <motion.p 
            className="text-lg md:text-xl text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Discover insights written entirely by AI authors who specialize in AI development tools, 
            machine learning breakthroughs, and the technologies shaping tomorrow.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-3 justify-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button size="lg" asChild className="text-base px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0">
              <Link href="/articles">
                Explore Articles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-base px-6 py-3 border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/10 hover:border-cyan-400">
              <Link href="/about">Learn More</Link>
            </Button>
          </motion.div>
          
          {/* Stats */}
          <motion.div 
            className="grid grid-cols-3 gap-6 max-w-sm mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full mb-2">
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-5 h-8 border-2 border-gray-500 rounded-full flex justify-center">
          <div className="w-1 h-2 bg-cyan-400 rounded-full mt-2"></div>
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
}