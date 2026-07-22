"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Loader2, AlertTriangle, CheckCircle, Scan, UserX, Clock, Flame } from "lucide-react";
import { toast } from "sonner";
import { RiskMeter } from "@/components/scanner/RiskMeter";
import { cn } from "@/lib/utils";
import { emailAnalyzerApi, EmailScanResult } from "@/lib/api";

const PLACEHOLDER = `From: security@paypa1-alerts.com
Subject: Urgent: Your account has been suspended
Date: Mon, 22 Jan 2024

Dear Valued Customer,

We have detected suspicious activity on your PayPal account. Your account has been temporarily suspended until you verify your information.

Click here to restore your account immediately:
https://paypa1-restore.xyz/verify

Failure to verify within 24 hours will result in permanent account closure.

PayPal Security Team`;

export default function EmailScannerPage() {
  const [email, setEmail] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<EmailScanResult | null>(null);

  const handleScan = async () => {
    if (!email.trim()) { toast.error("Please paste an email to analyze"); return; }
    setIsScanning(true);
    setResult(null);
    try {
      const res = await emailAnalyzerApi.analyze(email);
      setResult(res);
    } catch (err: any) {
      toast.error("Analysis failed", { description: err.message });
    } finally {
      setIsScanning(false);
    }
  };

  const isSafe = result && (result.severity === "safe" || result.severity === "low");

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <Mail className="w-5 h-5 text-purple-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Email Scanner</h1>
        </div>
        <p className="text-slate-400 text-sm">Detect phishing, impersonation, and social engineering in emails.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass-card border border-white/10 p-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-slate-300">Paste email content (headers + body)</label>
          <button onClick={() => setEmail(PLACEHOLDER)} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
            Load demo email
          </button>
        </div>
        <textarea value={email} onChange={(e) => setEmail(e.target.value)} placeholder={PLACEHOLDER} rows={10}
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 text-sm font-mono focus:outline-none focus:border-purple-500/40 transition-colors resize-none"
          disabled={isScanning} />
        <div className="flex justify-end mt-4">
          <button onClick={handleScan} disabled={isScanning}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-glow-purple">
            {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Scan className="w-4 h-4" />}
            {isScanning ? "Analyzing…" : "Analyze Email"}
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            {/* Overview */}
            <div className={cn("glass-card border p-6", isSafe ? "border-emerald-500/30 bg-emerald-500/5" : "border-red-500/30 bg-red-500/5")}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <RiskMeter score={result.riskScore} size="md" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {isSafe ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : <AlertTriangle className="w-5 h-5 text-red-400" />}
                    <h2 className="text-xl font-bold text-white">{isSafe ? "Email Appears Safe" : "Phishing Email Detected"}</h2>
                  </div>
                  <div className="space-y-1 text-sm text-slate-400">
                    {result.from && <p><span className="text-slate-500">From:</span> <span className={cn("font-mono", isSafe ? "text-slate-200" : "text-red-300")}>{result.from}</span></p>}
                    {result.subject && <p><span className="text-slate-500">Subject:</span> <span className="text-slate-200">{result.subject}</span></p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Indicators */}
            {result.indicators && Object.keys(result.indicators).length > 0 && (
              <div className="glass-card border border-white/10 p-6">
                <h3 className="text-white font-semibold mb-4">Threat Indicators</h3>
                <div className="space-y-3">
                  {Object.entries(result.indicators).map(([key, val]) => {
                    const icons: Record<string, React.ElementType> = { urgency: Clock, fear: Flame, impersonation: UserX, suspicious_links: AlertTriangle };
                    const Icon = icons[key] ?? AlertTriangle;
                    return (
                      <div key={key} className="flex items-center gap-4 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.07]">
                        <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-red-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-slate-300 text-sm">{val.label}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className={cn("font-bold text-sm", val.score > 60 ? "text-red-400" : val.score > 30 ? "text-amber-400" : "text-emerald-400")}>{val.score}%</div>
                          <div className="w-16 h-1.5 bg-white/5 rounded-full mt-1 overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${val.score}%` }} transition={{ duration: 0.8 }}
                              className={cn("h-full rounded-full", val.score > 60 ? "bg-red-400" : val.score > 30 ? "bg-amber-400" : "bg-emerald-400")} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* AI Summary */}
            <div className="glass-card border border-purple-500/20 bg-purple-500/5 p-6">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold">AI</span>
                </div>
                AI Analysis
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">{result.aiSummary}</p>
            </div>

            {/* Recommendations */}
            {result.recommendations?.length > 0 && (
              <div className="glass-card border border-white/10 p-6">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />What to do
                </h3>
                <ul className="space-y-2.5">
                  {result.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-emerald-400 text-xs font-bold">{i + 1}</span>
                      </div>
                      <span className="text-slate-300 text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
