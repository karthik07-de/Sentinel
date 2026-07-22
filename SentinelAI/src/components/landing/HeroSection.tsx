"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Shield,
  Play,
  Zap,
  Lock,
  CheckCircle,
  Globe,
  Mail,
  AlertTriangle,
  Activity,
  Cpu,
} from "lucide-react";

const floatingIcons = [
  { Icon: Shield, color: "text-blue-400", top: "15%", left: "8%", size: "w-6 h-6", delay: 0 },
  { Icon: Lock, color: "text-purple-400", top: "25%", right: "10%", size: "w-5 h-5", delay: 0.5 },
  { Icon: AlertTriangle, color: "text-amber-400", top: "60%", left: "5%", size: "w-5 h-5", delay: 1 },
  { Icon: Globe, color: "text-cyan-400", bottom: "20%", right: "8%", size: "w-6 h-6", delay: 1.5 },
  { Icon: Mail, color: "text-pink-400", top: "70%", right: "15%", size: "w-4 h-4", delay: 0.8 },
  { Icon: Activity, color: "text-emerald-400", top: "40%", left: "3%", size: "w-4 h-4", delay: 1.2 },
  { Icon: Cpu, color: "text-indigo-400", bottom: "30%", left: "12%", size: "w-5 h-5", delay: 0.3 },
];

const badges = [
  { icon: Zap, label: "AI Powered", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  { icon: Lock, label: "Privacy First", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
  { icon: CheckCircle, label: "99% Detection", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Hero radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-purple-600/8 rounded-full blur-[80px] pointer-events-none" />

      {/* Floating security icons */}
      {floatingIcons.map(({ Icon, color, size, delay, ...pos }, i) => (
        <motion.div
          key={i}
          className={`absolute hidden lg:flex items-center justify-center w-12 h-12 glass border border-white/10 rounded-xl`}
          style={pos as React.CSSProperties}
          animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay,
          }}
        >
          <Icon className={`${size} ${color}`} />
        </motion.div>
      ))}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
        {/* Announcement badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full glass border border-blue-500/20 text-sm">
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-slate-300">
              Introducing{" "}
              <span className="text-blue-400 font-semibold">Sentinel AI v2.0</span>{" "}
              — Smarter. Faster. More Secure.
            </span>
            <span className="ml-1 text-blue-400">→</span>
          </div>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-6"
        >
          <span className="text-white block">Protect Your</span>
          <span className="block mt-2">
            <span
              className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400"
              style={{ backgroundSize: "200% 100%", animation: "gradientShift 4s ease-in-out infinite" }}
            >
              Digital Life
            </span>
          </span>
          <span className="text-white block mt-2 text-4xl sm:text-5xl lg:text-6xl font-semibold">
            Before Scammers Strike
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          AI-powered threat detection for URLs, emails, images, and QR codes.
          Real-time protection powered by 70+ intelligence feeds. Your personal
          cyber guardian, 24/7.
        </motion.p>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {badges.map(({ icon: Icon, label, color, bg }) => (
            <div
              key={label}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium ${bg} ${color}`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link
            href="/auth/signup"
            className="group flex items-center gap-2.5 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base transition-all duration-300 shadow-glow-blue hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] hover:-translate-y-1 w-full sm:w-auto justify-center"
          >
            <Zap className="w-5 h-5" />
            Start Free — No Card Needed
            <span className="text-blue-300 group-hover:translate-x-0.5 transition-transform">→</span>
          </Link>
          <button className="flex items-center gap-3 px-8 py-4 rounded-xl glass border border-white/10 hover:border-white/20 text-white font-semibold text-base transition-all duration-300 hover:-translate-y-0.5 w-full sm:w-auto justify-center">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <Play className="w-4 h-4 text-white fill-white ml-0.5" />
            </div>
            Watch Demo
          </button>
        </motion.div>

        {/* Dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="relative mx-auto max-w-4xl"
        >
          {/* Glow behind dashboard */}
          <div className="absolute -inset-4 bg-blue-600/10 rounded-3xl blur-3xl" />
          <div className="absolute -inset-4 bg-purple-600/5 rounded-3xl blur-2xl" />

          {/* Dashboard mock */}
          <div className="relative glass-card border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.5)]">
            {/* Toolbar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.08] bg-white/[0.02]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="flex-1 mx-4">
                <div className="glass rounded-lg px-3 py-1.5 flex items-center gap-2 max-w-xs mx-auto">
                  <div className="w-3 h-3 rounded-full bg-emerald-400/80 animate-pulse" />
                  <span className="text-slate-400 text-xs font-mono">
                    app.sentinelai.io/dashboard
                  </span>
                </div>
              </div>
            </div>

            {/* Dashboard content mock */}
            <div className="p-6 grid grid-cols-4 gap-4">
              {/* Cyber score */}
              <div className="glass rounded-xl p-4 border border-white/[0.07] flex flex-col items-center justify-center col-span-1">
                <div className="relative w-16 h-16 mb-2">
                  <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                    <circle
                      cx="32" cy="32" r="26" fill="none"
                      stroke="url(#heroGrad)" strokeWidth="4"
                      strokeDasharray="163.4" strokeDashoffset="21"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">87</span>
                  </div>
                </div>
                <span className="text-slate-400 text-xs">Cyber Score</span>
              </div>

              {/* Stats */}
              <div className="col-span-3 grid grid-cols-3 gap-3">
                {[
                  { label: "Threats Blocked", value: "23", color: "text-red-400", bg: "bg-red-500/10" },
                  { label: "URLs Scanned", value: "189", color: "text-blue-400", bg: "bg-blue-500/10" },
                  { label: "Safe Rate", value: "94%", color: "text-emerald-400", bg: "bg-emerald-500/10" },
                ].map((s) => (
                  <div key={s.label} className={`glass rounded-xl p-3 border border-white/[0.07] ${s.bg}`}>
                    <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                    <div className="text-slate-500 text-xs mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Chart area mock */}
              <div className="col-span-4 glass rounded-xl p-4 border border-white/[0.07]">
                <div className="text-slate-400 text-xs mb-3">Threat Activity — Last 30 Days</div>
                <div className="flex items-end gap-1 h-12">
                  {[3, 7, 4, 9, 5, 12, 8, 6, 11, 4, 7, 9, 5, 8, 14, 6, 3, 9, 7, 11, 5, 8, 6, 4, 9, 12, 7, 5, 8, 6].map(
                    (h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t"
                        style={{
                          height: `${(h / 14) * 100}%`,
                          background: h > 10
                            ? "rgba(239,68,68,0.5)"
                            : h > 7
                            ? "rgba(245,158,11,0.5)"
                            : "rgba(59,130,246,0.4)",
                        }}
                      />
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Floating result cards */}
          <motion.div
            className="absolute -left-8 top-1/3 glass-card border border-red-500/20 bg-red-500/5 rounded-xl p-3 hidden lg:block w-44"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-red-400 text-xs font-semibold">Threat Detected</span>
            </div>
            <p className="text-slate-300 text-xs">Phishing site blocked</p>
            <p className="text-slate-500 text-xs">Risk: 94/100</p>
          </motion.div>

          <motion.div
            className="absolute -right-8 top-1/2 glass-card border border-emerald-500/20 bg-emerald-500/5 rounded-xl p-3 hidden lg:block w-40"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 text-xs font-semibold">Safe URL</span>
            </div>
            <p className="text-slate-300 text-xs">github.com/microsoft</p>
            <p className="text-slate-500 text-xs">Risk: 5/100</p>
          </motion.div>
        </motion.div>

        {/* Trust line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-12 text-slate-500 text-sm"
        >
          Trusted by{" "}
          <span className="text-slate-300 font-semibold">1.2 million</span>{" "}
          users worldwide · SOC 2 Certified · GDPR Compliant
        </motion.p>
      </div>
    </section>
  );
}
