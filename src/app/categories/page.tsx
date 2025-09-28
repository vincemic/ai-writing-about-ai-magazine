"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Zap, Brain, Cog, Telescope } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const categories = [
  {
    name: "AI Tools",
    slug: "ai-tools",
    description: "Latest AI-powered development tools and utilities that enhance developer productivity",
    icon: Zap,
    color: "from-blue-500 to-blue-600",
    articleCount: 25,
    features: ["Code Completion", "Bug Detection", "Code Generation", "Documentation"]
  },
  {
    name: "Machine Learning",
    slug: "machine-learning",
    description: "MLOps, model deployment, and integrating machine learning into development workflows",
    icon: Brain,
    color: "from-purple-500 to-purple-600",
    articleCount: 18,
    features: ["MLOps", "Model Training", "Data Pipelines", "Deployment"]
  },
  {
    name: "Automation",
    slug: "automation",
    description: "Automated testing, CI/CD improvements, and workflow automation using AI",
    icon: Cog,
    color: "from-green-500 to-green-600",
    articleCount: 22,
    features: ["Test Generation", "CI/CD", "Workflow Automation", "Code Review"]
  },
  {
    name: "Future Tech",
    slug: "future-tech",
    description: "Emerging technologies and future trends in AI-powered software development",
    icon: Telescope,
    color: "from-orange-500 to-orange-600",
    articleCount: 15,
    features: ["No-Code AI", "Edge Computing", "Quantum Computing", "AR/VR Development"]
  },
];

export default function CategoriesPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Explore <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Categories</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Dive deep into specific areas of AI-powered development. From cutting-edge tools 
              to emerging technologies, find exactly what you're looking for.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 gap-8"
          >
            {categories.map((category) => (
              <motion.div key={category.slug} variants={itemVariants}>
                <Link href={`/categories/${category.slug}`}>
                  <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 bg-white group">
                    <CardContent className="p-0">
                      {/* Header with gradient background */}
                      <div className={`bg-gradient-to-r ${category.color} p-6 text-white`}>
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                            <category.icon className="h-8 w-8" />
                          </div>
                          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                            {category.articleCount} Articles
                          </Badge>
                        </div>
                        <h2 className="text-2xl font-bold mb-2">{category.name}</h2>
                        <p className="text-white/90 leading-relaxed">
                          {category.description}
                        </p>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-3">Popular Topics:</h3>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {category.features.map((feature) => (
                            <Badge key={feature} variant="outline" className="text-sm">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center text-blue-600 group-hover:text-blue-700 font-medium">
                          Explore {category.name} →
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comprehensive Coverage
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our content spans the entire spectrum of AI-powered development, 
              ensuring you stay informed about all the latest trends and tools.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { label: "Total Articles", value: "80+", icon: "📚" },
              { label: "Expert Authors", value: "25+", icon: "👨‍💻" },
              { label: "Weekly Updates", value: "5+", icon: "🔄" },
              { label: "Community Members", value: "10K+", icon: "👥" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="text-center"
              >
                <div className="text-4xl mb-3">{stat.icon}</div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Browse all our articles or use our search functionality to find specific topics, 
              tools, or techniques you're interested in.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/articles"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-colors"
              >
                Browse All Articles
              </Link>
              <Link
                href="/articles"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Search Articles
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}