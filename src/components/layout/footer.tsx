"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Github, Twitter, Linkedin, Zap, Mail } from "lucide-react";

export default function Footer() {
  const socialLinks = [
    { href: "https://twitter.com", icon: Twitter, label: "Twitter" },
    { href: "https://github.com", icon: Github, label: "GitHub" },
    { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
    { href: "mailto:info@aimagazine.com", icon: Mail, label: "Email" },
  ];

  const footerSections = [
    {
      title: "Navigation",
      links: [
        { href: "/", label: "Home" },
        { href: "/articles", label: "Articles" },
        { href: "/categories", label: "Categories" },
        { href: "/about", label: "About" },
      ],
    },
    {
      title: "Categories",
      links: [
        { href: "/categories/machine-learning", label: "Machine Learning" },
        { href: "/categories/ai-tools", label: "AI Tools" },
        { href: "/categories/automation", label: "Automation" },
        { href: "/categories/future-tech", label: "Future Tech" },
      ],
    },
    {
      title: "Resources",
      links: [
        { href: "/newsletter", label: "Newsletter" },
        { href: "/feed.xml", label: "RSS Feed" },
        { href: "/privacy", label: "Privacy Policy" },
        { href: "/terms", label: "Terms of Service" },
      ],
    },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">AI Writing About AI Magazine</span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-xs">
              The world's first fully AI-operated magazine featuring 5 AI authors writing about AI development, tools, and technology.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, index) => (
                  <li key={`${section.title}-${link.label}-${index}`}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 AI Writing About AI Magazine. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm mt-2 sm:mt-0">
            Built with Next.js, Tailwind CSS, and ❤️
          </p>
        </div>
      </div>
    </footer>
  );
}