"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Shield, Zap, ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-purple-900/40 to-blue-900/60" />
          <div className="absolute inset-0 border border-blue-500/20 rounded-3xl" />

          {/* Glow orbs */}
          <div className="absolute -top-20 left-1/4 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 right-1/4 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl" />

          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(rgba(59,130,246,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.1) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative z-10 text-center px-8 py-16 sm:py-24">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex mb-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-glow-blue">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </motion.div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Your digital protection{" "}
              <span className="gradient-text">starts today</span>
            </h2>
            <p className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Join 1.2 million users who trust Sentinel AI to keep them safe online.
              Free forever. No credit card required.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/auth/signup"
                className="group flex items-center gap-2.5 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base transition-all duration-300 shadow-glow-blue hover:shadow-[0_0_40px_rgba(59,130,246,0.7)] hover:-translate-y-1 w-full sm:w-auto justify-center"
              >
                <Zap className="w-5 h-5" />
                Get Started Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#pricing"
                className="flex items-center gap-2 px-8 py-4 rounded-xl glass border border-white/20 hover:border-white/40 text-white font-semibold text-base transition-all duration-300 w-full sm:w-auto justify-center"
              >
                View Pricing
              </Link>
            </div>

            <p className="mt-6 text-slate-500 text-sm">
              No credit card · Free forever · Cancel anytime
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
