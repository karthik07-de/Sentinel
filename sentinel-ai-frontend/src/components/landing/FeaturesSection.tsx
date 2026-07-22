"use client";

import { motion } from "framer-motion";
import {
  Globe,
  Mail,
  Image,
  QrCode,
  Brain,
  Activity,
  History,
  Bot,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  globe: Globe,
  mail: Mail,
  image: Image,
  "qr-code": QrCode,
  brain: Brain,
  activity: Activity,
  history: History,
  bot: Bot,
};

const features = [
  {
    id: "url",
    title: "AI URL Scanner",
    description:
      "Paste any URL and our AI instantly analyzes it against 70+ threat intelligence feeds including VirusTotal, Shodan, and proprietary models.",
    icon: "globe",
    gradient: "from-blue-500/20 to-cyan-500/10",
    border: "border-blue-500/20 hover:border-blue-500/40",
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/10",
    badge: "Most Used",
    badgeColor: "bg-blue-500/20 text-blue-300",
    glow: "hover:shadow-[0_0_40px_rgba(59,130,246,0.1)]",
  },
  {
    id: "email",
    title: "Email Scanner",
    description:
      "Detect sophisticated phishing attempts, brand impersonation, malicious attachments, and social engineering tactics in any email.",
    icon: "mail",
    gradient: "from-purple-500/20 to-pink-500/10",
    border: "border-purple-500/20 hover:border-purple-500/40",
    iconColor: "text-purple-400",
    iconBg: "bg-purple-500/10",
    glow: "hover:shadow-[0_0_40px_rgba(139,92,246,0.1)]",
  },
  {
    id: "image",
    title: "Screenshot Scanner",
    description:
      "Upload screenshots of suspicious messages or documents. Our OCR engine extracts text and identifies scam patterns with 97% accuracy.",
    icon: "image",
    gradient: "from-amber-500/20 to-orange-500/10",
    border: "border-amber-500/20 hover:border-amber-500/40",
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/10",
    glow: "hover:shadow-[0_0_40px_rgba(245,158,11,0.1)]",
  },
  {
    id: "qr",
    title: "QR Code Scanner",
    description:
      "Never scan a QR code blindly again. Upload or paste QR codes to decode and analyze the destination URL before visiting.",
    icon: "qr-code",
    gradient: "from-emerald-500/20 to-teal-500/10",
    border: "border-emerald-500/20 hover:border-emerald-500/40",
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10",
    glow: "hover:shadow-[0_0_40px_rgba(34,197,94,0.1)]",
  },
  {
    id: "intel",
    title: "Threat Intelligence",
    description:
      "Real-time access to global threat databases, CVE feeds, dark web monitoring, and live IOC streams from 70+ intelligence sources.",
    icon: "brain",
    gradient: "from-red-500/20 to-rose-500/10",
    border: "border-red-500/20 hover:border-red-500/40",
    iconColor: "text-red-400",
    iconBg: "bg-red-500/10",
    badge: "New",
    badgeColor: "bg-red-500/20 text-red-300",
    glow: "hover:shadow-[0_0_40px_rgba(239,68,68,0.1)]",
  },
  {
    id: "score",
    title: "Cyber Health Score",
    description:
      "Your personal cybersecurity rating from 0-100. Improves as you practice safer habits, complete tips, and stay threat-free.",
    icon: "activity",
    gradient: "from-violet-500/20 to-purple-500/10",
    border: "border-violet-500/20 hover:border-violet-500/40",
    iconColor: "text-violet-400",
    iconBg: "bg-violet-500/10",
    glow: "hover:shadow-[0_0_40px_rgba(139,92,246,0.1)]",
  },
  {
    id: "history",
    title: "Threat History",
    description:
      "Full audit trail of every scan with detailed reports, trend analysis, and exportable data. Your complete security timeline.",
    icon: "history",
    gradient: "from-slate-500/20 to-slate-600/10",
    border: "border-slate-500/20 hover:border-slate-500/40",
    iconColor: "text-slate-400",
    iconBg: "bg-slate-500/10",
    glow: "hover:shadow-[0_0_40px_rgba(148,163,184,0.1)]",
  },
  {
    id: "copilot",
    title: "AI Copilot",
    description:
      "Your personal AI security expert available 24/7. Ask questions, get threat analysis explained, and receive personalized security advice.",
    icon: "bot",
    gradient: "from-blue-500/20 to-indigo-500/10",
    border: "border-indigo-500/20 hover:border-indigo-500/40",
    iconColor: "text-indigo-400",
    iconBg: "bg-indigo-500/10",
    badge: "AI",
    badgeColor: "bg-indigo-500/20 text-indigo-300",
    glow: "hover:shadow-[0_0_40px_rgba(99,102,241,0.1)]",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-4">
            Complete Protection Suite
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Everything you need to stay{" "}
            <span className="gradient-text">secure</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Eight powerful AI tools working together to protect every aspect
            of your digital presence — from links to emails to QR codes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feat, i) => {
            const Icon = iconMap[feat.icon] ?? Globe;
            return (
              <motion.div
                key={feat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className={cn(
                  "group relative glass-card border transition-all duration-300 cursor-pointer p-5",
                  feat.border,
                  feat.glow
                )}
              >
                {/* Gradient background on hover */}
                <div
                  className={cn(
                    "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br",
                    feat.gradient
                  )}
                />

                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={cn(
                        "w-11 h-11 rounded-xl flex items-center justify-center",
                        feat.iconBg
                      )}
                    >
                      <Icon className={cn("w-5 h-5", feat.iconColor)} />
                    </div>
                    {feat.badge && (
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-semibold",
                          feat.badgeColor
                        )}
                      >
                        {feat.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-white font-semibold mb-2 group-hover:text-blue-300 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">
                    {feat.description}
                  </p>

                  <div
                    className={cn(
                      "flex items-center gap-1 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity",
                      feat.iconColor
                    )}
                  >
                    Learn more <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
