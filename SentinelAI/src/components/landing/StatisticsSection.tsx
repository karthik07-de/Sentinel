"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ShieldAlert, Users, Link2, Mail } from "lucide-react";

function useCountUp(target: number, duration: number = 2000, active: boolean = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, active]);

  return count;
}

function formatStat(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M+`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K+`;
  return `${num}+`;
}

const stats = [
  {
    label: "Threats Detected",
    value: 2847391,
    icon: ShieldAlert,
    color: "from-red-500 to-rose-600",
    textColor: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    glow: "shadow-[0_0_30px_rgba(239,68,68,0.15)]",
    desc: "Malicious URLs, phishing emails, and scam content blocked",
  },
  {
    label: "Protected Users",
    value: 1200000,
    icon: Users,
    color: "from-blue-500 to-cyan-500",
    textColor: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    glow: "shadow-[0_0_30px_rgba(59,130,246,0.15)]",
    desc: "Individuals and teams secured across 140 countries",
  },
  {
    label: "URLs Scanned",
    value: 98400000,
    icon: Link2,
    color: "from-purple-500 to-violet-600",
    textColor: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    glow: "shadow-[0_0_30px_rgba(139,92,246,0.15)]",
    desc: "Links analyzed in real-time with 99.2% accuracy",
  },
  {
    label: "Emails Analyzed",
    value: 45600000,
    icon: Mail,
    color: "from-emerald-500 to-teal-500",
    textColor: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    glow: "shadow-[0_0_30px_rgba(34,197,94,0.15)]",
    desc: "Phishing and impersonation emails caught before they spread",
  },
];

function StatCard({ stat, index }: { stat: (typeof stats)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const count = useCountUp(stat.value, 2500, isInView);
  const { icon: Icon } = stat;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`glass-card-hover border ${stat.border} ${stat.glow} p-6`}
    >
      <div className={`w-12 h-12 rounded-xl ${stat.bg} border ${stat.border} flex items-center justify-center mb-4`}>
        <Icon className={`w-6 h-6 ${stat.textColor}`} />
      </div>
      <div className={`text-3xl sm:text-4xl font-bold ${stat.textColor} mb-1 font-mono`}>
        {formatStat(count)}
      </div>
      <div className="text-white font-semibold mb-2">{stat.label}</div>
      <p className="text-slate-400 text-sm leading-relaxed">{stat.desc}</p>
    </motion.div>
  );
}

export function StatisticsSection() {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
            Real-Time Protection
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Protecting millions,{" "}
            <span className="gradient-text">every second</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Our AI processes millions of threats daily across every scan type, keeping
            your digital life secure around the clock.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
