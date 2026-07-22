"use client";

import { motion } from "framer-motion";
import { Upload, Brain, Database, Shield, FileText } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Upload",
    description:
      "Paste a URL, email, upload an image, or provide a QR code. Our interface supports all input types seamlessly.",
    icon: Upload,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    connector: "from-blue-500/50 to-purple-500/50",
  },
  {
    step: "02",
    title: "AI Analysis",
    description:
      "Our multi-model AI pipeline processes your input through pattern recognition, NLP, and behavioral analysis simultaneously.",
    icon: Brain,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    connector: "from-purple-500/50 to-amber-500/50",
  },
  {
    step: "03",
    title: "Threat Intelligence",
    description:
      "Results are cross-referenced with 70+ global threat feeds, malware databases, and real-time IOC streams.",
    icon: Database,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    connector: "from-amber-500/50 to-emerald-500/50",
  },
  {
    step: "04",
    title: "Risk Engine",
    description:
      "Our proprietary risk scoring engine weighs 200+ factors to calculate a precise 0–100 threat score with full explainability.",
    icon: Shield,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    connector: "from-emerald-500/50 to-indigo-500/50",
  },
  {
    step: "05",
    title: "Cyber Report",
    description:
      "Receive a detailed, actionable report with risk breakdown, AI explanation, threat indicators, and specific recommendations.",
    icon: FileText,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    connector: null,
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/20 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-4">
            How It Works
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            From input to insight{" "}
            <span className="gradient-text">in seconds</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Our five-stage pipeline delivers enterprise-grade threat analysis
            faster than you can blink.
          </p>
        </motion.div>

        {/* Desktop timeline */}
        <div className="hidden lg:flex items-start gap-0 relative">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.step} className="flex-1 relative flex flex-col items-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex flex-col items-center"
                >
                  {/* Step circle */}
                  <div className="relative mb-6">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${step.bg} ${step.border} relative z-10`}
                    >
                      <Icon className={`w-7 h-7 ${step.color}`} />
                    </div>
                    <div
                      className={`absolute inset-0 rounded-2xl blur-lg opacity-40 ${step.bg}`}
                    />
                    {/* Step number */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-background border border-white/20 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{step.step}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className={`text-lg font-semibold mb-2 ${step.color}`}>
                    {step.title}
                  </h3>
                  <p className="text-slate-400 text-sm text-center leading-relaxed px-2">
                    {step.description}
                  </p>
                </motion.div>

                {/* Connector line */}
                {step.connector && (
                  <div
                    className="absolute top-8 left-[calc(50%+32px)] right-0 h-px"
                    style={{
                      background: `linear-gradient(90deg, ${step.connector.replace("from-", "").replace("to-", "")})`,
                    }}
                  >
                    <div
                      className={`h-full bg-gradient-to-r ${step.connector}`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile timeline */}
        <div className="lg:hidden space-y-4">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex gap-4 items-start"
              >
                {/* Left: icon + connector */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center border ${step.bg} ${step.border} flex-shrink-0`}
                  >
                    <Icon className={`w-5 h-5 ${step.color}`} />
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-px flex-1 mt-2 bg-gradient-to-b from-blue-500/30 to-transparent min-h-[2rem]" />
                  )}
                </div>

                {/* Right: content */}
                <div className="pb-6">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-slate-500 font-mono">{step.step}</span>
                    <h3 className={`font-semibold ${step.color}`}>{step.title}</h3>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
