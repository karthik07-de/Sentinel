"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Search,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Shield,
  Info,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_RESULTS: Record<
  string,
  {
    score: number;
    label: string;
    type: string;
    indicators: string[];
    color: string;
    bg: string;
    border: string;
    icon: React.ElementType;
  }
> = {
  phishing: {
    score: 91,
    label: "Critical Threat",
    type: "Phishing / Credential Harvesting",
    indicators: [
      "Domain registered 3 days ago",
      "Not an official PayPal domain",
      "SSL certificate mismatch",
      "Detected by 18/67 engines",
    ],
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    icon: AlertTriangle,
  },
  safe: {
    score: 5,
    label: "Safe",
    type: "Legitimate Website",
    indicators: [
      "Domain registered 20+ years ago",
      "Valid SSL certificate",
      "0/67 engine detections",
      "Verified organization",
    ],
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    icon: CheckCircle,
  },
};

const SAMPLE_URLS = [
  { url: "https://paypal-secure-verify.xyz/login", type: "phishing", label: "Phishing URL" },
  { url: "https://github.com/microsoft/vscode", type: "safe", label: "Safe URL" },
];

type ScanStage = "idle" | "virustotal" | "ai" | "ocr" | "engine" | "done";

const STAGES: { key: ScanStage; label: string; duration: number }[] = [
  { key: "virustotal", label: "Querying VirusTotal…", duration: 600 },
  { key: "ai", label: "AI model analyzing…", duration: 700 },
  { key: "ocr", label: "IOC extraction…", duration: 500 },
  { key: "engine", label: "Risk engine scoring…", duration: 600 },
  { key: "done", label: "Report ready", duration: 0 },
];

export function LiveDemoSection() {
  const [url, setUrl] = useState("");
  const [stage, setStage] = useState<ScanStage>("idle");
  const [result, setResult] = useState<keyof typeof DEMO_RESULTS | null>(null);
  const [completedStages, setCompletedStages] = useState<ScanStage[]>([]);

  const runScan = async (inputUrl?: string) => {
    const scanUrl = inputUrl ?? url;
    if (!scanUrl.trim()) return;

    setStage("virustotal");
    setResult(null);
    setCompletedStages([]);

    const isPhishing =
      scanUrl.includes("paypal-secure") ||
      scanUrl.includes("verify.xyz") ||
      scanUrl.includes("secure-login") ||
      scanUrl.includes("crypto-rewards");
    const resultType = isPhishing ? "phishing" : "safe";

    for (const s of STAGES) {
      setStage(s.key);
      if (s.duration) await new Promise((r) => setTimeout(r, s.duration));
      setCompletedStages((prev) => [...prev, s.key]);
    }

    setResult(resultType);
  };

  const scanResult = result ? DEMO_RESULTS[result] : null;
  const Icon = scanResult?.icon ?? Shield;

  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-4">
            Interactive Demo
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Try it{" "}
            <span className="gradient-text">right now</span>
          </h2>
          <p className="text-slate-400 text-lg">
            Paste any URL and see our AI analyze it in real-time. No signup required.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="glass-card border border-white/10 rounded-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/[0.08] flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Globe className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-white font-semibold">URL Scanner</span>
            <span className="ml-auto text-xs text-slate-500 flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Demo
            </span>
          </div>

          <div className="p-6 space-y-6">
            {/* Input */}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && runScan()}
                  placeholder="Paste a URL to analyze, e.g. https://example.com"
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 text-sm transition-colors"
                />
              </div>
              <button
                onClick={() => runScan()}
                disabled={stage !== "idle" && stage !== "done" && result === null}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-glow-blue"
              >
                {stage !== "idle" && !result ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                {stage !== "idle" && !result ? "Scanning…" : "Scan URL"}
              </button>
            </div>

            {/* Sample URLs */}
            <div className="flex flex-wrap gap-2">
              <span className="text-slate-500 text-xs self-center">Try:</span>
              {SAMPLE_URLS.map((s) => (
                <button
                  key={s.url}
                  onClick={() => {
                    setUrl(s.url);
                    runScan(s.url);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass border border-white/10 hover:border-white/20 text-slate-300 text-xs transition-colors"
                >
                  <ChevronRight className="w-3 h-3" />
                  {s.label}
                </button>
              ))}
            </div>

            {/* Scanning stages */}
            <AnimatePresence>
              {stage !== "idle" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  {STAGES.map((s) => {
                    const isDone = completedStages.includes(s.key);
                    const isCurrent = stage === s.key && !isDone;
                    return (
                      <div
                        key={s.key}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300",
                          isDone ? "bg-emerald-500/5 border border-emerald-500/20" : 
                          isCurrent ? "bg-blue-500/10 border border-blue-500/30" :
                          "bg-white/[0.02] border border-transparent"
                        )}
                      >
                        {isDone ? (
                          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        ) : isCurrent ? (
                          <Loader2 className="w-4 h-4 text-blue-400 animate-spin flex-shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-white/20 flex-shrink-0" />
                        )}
                        <span
                          className={cn(
                            "text-sm",
                            isDone ? "text-emerald-400" :
                            isCurrent ? "text-blue-400" :
                            "text-slate-500"
                          )}
                        >
                          {s.label}
                        </span>
                        {isDone && (
                          <span className="ml-auto text-emerald-400 text-xs">✓</span>
                        )}
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Result */}
            <AnimatePresence>
              {scanResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ type: "spring", bounce: 0.3 }}
                  className={cn(
                    "rounded-xl p-5 border",
                    scanResult.bg,
                    scanResult.border
                  )}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", scanResult.bg)}>
                        <Icon className={`w-5 h-5 ${scanResult.color}`} />
                      </div>
                      <div>
                        <div className={`font-bold text-lg ${scanResult.color}`}>
                          {scanResult.label}
                        </div>
                        <div className="text-slate-400 text-sm">{scanResult.type}</div>
                      </div>
                    </div>
                    {/* Risk meter */}
                    <div className="text-right">
                      <div className={`text-3xl font-bold ${scanResult.color}`}>
                        {scanResult.score}
                        <span className="text-lg text-slate-500">/100</span>
                      </div>
                      <div className="text-slate-500 text-xs">Risk Score</div>
                    </div>
                  </div>

                  {/* Risk bar */}
                  <div className="h-2 bg-white/5 rounded-full mb-4 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${scanResult.score}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{
                        background: scanResult.score > 60
                          ? "linear-gradient(90deg, #EF4444, #f97316)"
                          : "linear-gradient(90deg, #22C55E, #84cc16)",
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {scanResult.indicators.map((ind) => (
                      <div key={ind} className="flex items-start gap-2 text-sm">
                        <Info className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${scanResult.color}`} />
                        <span className="text-slate-300">{ind}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/[0.07]">
                    <p className="text-slate-400 text-xs">
                      This is a demo result.{" "}
                      <a href="/auth/signup" className="text-blue-400 hover:underline">
                        Sign up free
                      </a>{" "}
                      for full reports, AI explanations, and unlimited scans.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
