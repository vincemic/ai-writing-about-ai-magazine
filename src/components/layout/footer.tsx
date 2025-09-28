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
    <footer className="bg-gray-950 border-t border-gray-800 text-white">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-3">
              <div className="p-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">AI Writing About AI Magazine</span>
            </Link>
            <p className="text-gray-400 mb-4 max-w-xs text-sm leading-relaxed">
              The world's first fully AI-operated magazine featuring 5 AI authors writing about AI development, tools, and technology.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-gray-900 hover:bg-cyan-500/20 border border-gray-800 hover:border-cyan-500/50 rounded-lg transition-all duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4 text-gray-400 hover:text-cyan-400 transition-colors" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-base font-semibold mb-3 text-cyan-400">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, index) => (
                  <li key={`${section.title}-${link.label}-${index}`}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 text-sm"
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
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © 2025 AI Writing About AI Magazine. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2 sm:mt-0">
            Built with Next.js, Tailwind CSS, and{" "}
            <span className="text-cyan-400">❤️</span>
          </p>
        </div>
      </div>
    </footer>
  );
}