"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_FAQ } from "@/constants/mock-data";

export function FAQSection() {
  const [openId, setOpenId] = useState<string | null>("faq_01");

  return (
    <section className="py-24 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-4">
            FAQ
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Common{" "}
            <span className="gradient-text">questions</span>
          </h2>
          <p className="text-slate-400 text-lg">
            Everything you need to know about Sentinel AI.
          </p>
        </motion.div>

        <div className="space-y-3">
          {MOCK_FAQ.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                "glass-card border rounded-xl overflow-hidden transition-all duration-300",
                openId === item.id ? "border-blue-500/30" : "border-white/[0.07]"
              )}
            >
              <button
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                onClick={() => setOpenId(openId === item.id ? null : item.id)}
              >
                <span
                  className={cn(
                    "font-semibold transition-colors",
                    openId === item.id ? "text-white" : "text-slate-300"
                  )}
                >
                  {item.question}
                </span>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 flex-shrink-0 transition-all duration-300",
                    openId === item.id
                      ? "rotate-180 text-blue-400"
                      : "text-slate-500"
                  )}
                />
              </button>

              <AnimatePresence>
                {openId === item.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-slate-400 text-sm leading-relaxed border-t border-white/[0.06] pt-4">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
