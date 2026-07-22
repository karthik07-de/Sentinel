"use client";

import { motion } from "framer-motion";
import { Check, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { MOCK_PRICING } from "@/constants/mock-data";

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/10 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
            Simple Pricing
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Protect what matters,{" "}
            <span className="gradient-text">your way</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Start free, upgrade when you need more. No hidden fees, no long-term contracts.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {MOCK_PRICING.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={cn(
                "relative rounded-2xl border transition-all duration-300",
                plan.highlighted
                  ? "bg-gradient-to-b from-blue-950/80 to-purple-950/40 border-blue-500/40 shadow-[0_0_60px_rgba(59,130,246,0.2)] -mt-4 pb-4"
                  : "glass-card border-white/10 hover:border-white/20"
              )}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold shadow-glow-blue">
                    <Zap className="w-3 h-3" />
                    {plan.badge}
                  </div>
                </div>
              )}

              <div className="p-8">
                {/* Plan name */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                  <p className="text-slate-400 text-sm">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-end gap-1">
                    <span className="text-5xl font-bold text-white">
                      {plan.price === 0 ? "Free" : `$${plan.price}`}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-slate-400 mb-2">/{plan.period}</span>
                    )}
                  </div>
                  {plan.price > 0 && (
                    <p className="text-slate-500 text-sm mt-1">
                      Billed monthly · Cancel anytime
                    </p>
                  )}
                </div>

                {/* CTA */}
                <Link
                  href="/auth/signup"
                  className={cn(
                    "flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 mb-8",
                    plan.highlighted
                      ? "bg-blue-600 hover:bg-blue-500 text-white shadow-glow-blue hover:shadow-[0_0_30px_rgba(59,130,246,0.6)]"
                      : "border border-white/15 hover:border-white/30 text-white hover:bg-white/5"
                  )}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </Link>

                {/* Features */}
                <ul className="space-y-3">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-3">
                      <div
                        className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                          plan.highlighted
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-emerald-500/20 text-emerald-400"
                        )}
                      >
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="text-slate-300 text-sm">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enterprise row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-8 glass-card border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div>
            <h4 className="text-white font-bold text-lg mb-1">
              Enterprise & Teams
            </h4>
            <p className="text-slate-400 text-sm">
              Custom pricing for larger teams with SSO, audit logs, SIEM integration,
              SLA guarantees, and dedicated security support.
            </p>
          </div>
          <Link
            href="#contact"
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/15 hover:border-blue-500/40 text-white font-semibold text-sm transition-all whitespace-nowrap"
          >
            Contact Sales <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
