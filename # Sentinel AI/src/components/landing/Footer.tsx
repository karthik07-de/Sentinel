"use client";

import Link from "next/link";
import { Shield, Twitter, Github, Linkedin, Mail, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const footerLinks = {
  Product: [
    { label: "URL Scanner", href: "#" },
    { label: "Email Scanner", href: "#" },
    { label: "QR Scanner", href: "#" },
    { label: "AI Copilot", href: "#" },
    { label: "Threat History", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Resources: [
    { label: "Documentation", href: "#" },
    { label: "API Reference", href: "#" },
    { label: "Security Status", href: "#" },
    { label: "Changelog", href: "#" },
    { label: "Browser Extension", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
    { label: "GDPR", href: "#" },
    { label: "Security", href: "#" },
  ],
};

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="relative border-t border-white/[0.06] bg-[#020617]">
      {/* Top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Top section */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group w-fit">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-lg">
                Sentinel<span className="text-blue-400">AI</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
              Protecting your digital life with the most advanced AI cybersecurity
              platform. Real-time threat detection, 24/7 protection.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3">
              {[
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Github, href: "#", label: "GitHub" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
                { icon: Mail, href: "#", label: "Email" },
              ].map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg glass border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-blue-500/30 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-semibold text-sm mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-slate-400 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="glass-card p-6 mb-10 border border-white/[0.08] rounded-2xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h4 className="text-white font-semibold mb-1">Stay ahead of threats</h4>
              <p className="text-slate-400 text-sm">
                Weekly cybersecurity insights and threat reports, no spam.
              </p>
            </div>
            {subscribed ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-emerald-400 text-sm font-medium flex items-center gap-2"
              >
                ✓ You&apos;re subscribed!
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="flex items-center gap-2 w-full md:w-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 md:w-64 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                />
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors whitespace-nowrap"
                >
                  Subscribe <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-white/[0.06]">
          <p className="text-slate-500 text-sm">
            © 2024 Sentinel AI. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>All systems operational</span>
          </div>
          <div className="flex items-center gap-1 text-slate-500 text-sm">
            <span>SOC 2</span>
            <span className="text-slate-600">·</span>
            <span>ISO 27001</span>
            <span className="text-slate-600">·</span>
            <span>GDPR</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
