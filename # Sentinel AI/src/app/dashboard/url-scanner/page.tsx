"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Search, Loader2, AlertTriangle, CheckCircle, Info, Shield, ExternalLink, Copy, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { RiskMeter } from "@/components/scanner/RiskMeter";
import { cn } from "@/lib/utils";
import { urlScannerApi, ThreatResult } from "@/lib/api";

export default function URLScannerPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ThreatResult | null>(null);
  const [showTechnical, setShowTechnical] = useState(false);
  const [stage, setStage] = useState("");

  const stages = ["Resolving domain…", "Querying VirusTotal…", "Running AI model…", "Computing risk score…"];

  const handleScan = async () => {
    if (!url.trim()) { toast.error("Please enter a URL to scan"); return; }
    setLoading(true); setResult(null);
    for (const s of stages) { setStage(s); await new Promise((r) => setTimeout(r, 400)); }
    try {
      const res = await urlScannerApi.analyze(url);
      setResult(res);
      setStage("");
    } catch (err: any) {
      toast.error("Scan failed", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const severity = result?.severity ?? "safe";
  const isSafe = severity === "safe" || severity === "low";

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Globe className="w-5 h-5 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">URL Scanner</h1>
        </div>
        <p className="text-slate-400 text-sm">Analyze any URL for threats, phishing, and malware.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass-card border border-white/10 p-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input type="text" value={url} onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleScan()}
              placeholder="https://example.com"
              className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 text-sm transition-colors" />
          </div>
          <button onClick={handleScan} disabled={loading}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all disabled:opacity-50 shadow-glow-blue">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {loading ? "Scanning…" : "Scan URL"}
          </button>
        </div>
        {loading && stage && (
          <p className="mt-3 text-blue-400 text-xs flex items-center gap-2">
            <Loader2 className="w-3 h-3 animate-spin" />{stage}
          </p>
        )}
      </motion.div>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
            {/* Risk overview */}
            <div className={cn("glass-card border p-6", isSafe ? "border-emerald-500/30 bg-emerald-500/5" : "border-red-500/30 bg-red-500/5")}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <RiskMeter score={result.riskScore} size="md" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {isSafe ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : <AlertTriangle className="w-5 h-5 text-red-400" />}
                    <h2 className="text-xl font-bold text-white">{isSafe ? "Safe URL" : `${result.threatType?.replace("_", " ")} Detected`}</h2>
                  </div>
                  <p className="text-slate-400 text-sm font-mono truncate">{result.input}</p>
                  {result.technicalDetails?.ipAddress && (
                    <p className="text-slate-500 text-xs mt-1">IP: {result.technicalDetails.ipAddress}</p>
                  )}
                </div>
              </div>
            </div>

            {/* AI Explanation */}
            <div className="glass-card border border-blue-500/20 bg-blue-500/5 p-6">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold">AI</span>
                </div>AI Analysis
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">{result.details.aiExplanation}</p>
            </div>

            {/* Indicators */}
            {result.details.indicators?.length > 0 && (
              <div className="glass-card border border-white/10 p-6">
                <h3 className="text-white font-semibold mb-4">Threat Indicators</h3>
                <div className="space-y-2">
                  {result.details.indicators.map((ind, i) => (
                    <div key={i} className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.07]">
                      <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300 text-sm">{ind}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            <div className="glass-card border border-white/10 p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />Recommendations
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

            {/* Technical Details toggle */}
            <div className="glass-card border border-white/10">
              <button onClick={() => setShowTechnical(!showTechnical)}
                className="w-full flex items-center justify-between px-6 py-4 text-white font-semibold hover:bg-white/[0.02] transition-colors">
                <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-slate-400" />Technical Details</span>
                {showTechnical ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {showTechnical && (
                <div className="px-6 pb-6 space-y-2 border-t border-white/[0.07] pt-4">
                  {[
                    ["IP Address", result.technicalDetails?.ipAddress],
                    ["SSL Certificate", result.technicalDetails?.sslCertificate ? "Valid" : "Missing / Invalid"],
                    ["Malware Detections", result.technicalDetails?.malwareDetections !== undefined ? `${result.technicalDetails.malwareDetections} / ${result.technicalDetails.totalEngines} engines` : null],
                  ].filter(([, v]) => v).map(([k, v]) => (
                    <div key={k as string} className="flex justify-between text-sm">
                      <span className="text-slate-500">{k}</span>
                      <span className="text-slate-200 font-mono">{v as string}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
