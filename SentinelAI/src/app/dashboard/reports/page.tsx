"use client";

import { motion } from "framer-motion";
import { FileText, Download, TrendingUp, Shield, AlertTriangle, CheckCircle } from "lucide-react";
import { useAppStore } from "@/store";
import { ThreatChart } from "@/components/charts/ThreatChart";

export default function ReportsPage() {
  const { user, scanHistory } = useAppStore();

  const totalThreats = scanHistory.filter((s) => s.severity === "high" || s.severity === "critical").length;
  const safeScansPct = Math.round((scanHistory.filter((s) => s.severity === "safe" || s.severity === "low").length / scanHistory.length) * 100);

  const summaryCards = [
    { label: "Total Scans", value: scanHistory.length, icon: Shield, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { label: "Threats Found", value: totalThreats, icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
    { label: "Safe Scans", value: `${safeScansPct}%`, icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { label: "Cyber Score", value: user.cyberScore, icon: TrendingUp, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-slate-500/10 border border-slate-500/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-slate-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Reports</h1>
          </div>
          <p className="text-slate-400 text-sm">Your security summary and analytics.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all shadow-glow-blue">
          <Download className="w-4 h-4" />
          Export PDF
        </button>
      </motion.div>

      {/* Summary cards */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className={`glass-card border p-5 ${card.border}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${card.bg}`}>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
              <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
              <div className="text-slate-500 text-xs mt-0.5">{card.label}</div>
            </div>
          );
        })}
      </motion.div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card border border-white/[0.08] p-6"
      >
        <h3 className="text-white font-semibold mb-6">Threat Activity (Last 12 Weeks)</h3>
        <ThreatChart />
      </motion.div>

      {/* Scan breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card border border-white/[0.08] p-6"
      >
        <h3 className="text-white font-semibold mb-4">Scan Breakdown</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {[
            { label: "URLs", value: user.stats.urlsScanned, color: "text-blue-400" },
            { label: "Emails", value: user.stats.emailsAnalyzed, color: "text-purple-400" },
            { label: "Images", value: user.stats.imagesScanned, color: "text-amber-400" },
            { label: "QR Codes", value: user.stats.qrCodesScanned, color: "text-emerald-400" },
          ].map((item) => (
            <div key={item.label} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className={`text-3xl font-bold ${item.color}`}>{item.value}</div>
              <div className="text-slate-500 text-sm mt-1">{item.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
