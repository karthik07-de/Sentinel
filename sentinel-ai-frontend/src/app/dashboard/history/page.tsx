"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { History, Globe, Mail, Image, QrCode, Search, Filter, Loader2 } from "lucide-react";
import { formatRelativeTime, cn } from "@/lib/utils";
import { dashboardApi, ScanHistory } from "@/lib/api";

const typeIcons: Record<string, React.ElementType> = { url: Globe, email: Mail, image: Image, qr: QrCode };
const typeColors: Record<string, string> = { url: "text-blue-400 bg-blue-500/10", email: "text-purple-400 bg-purple-500/10", image: "text-amber-400 bg-amber-500/10", qr: "text-emerald-400 bg-emerald-500/10" };
const severityBadge: Record<string, string> = {
  safe: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", low: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  medium: "text-amber-400 bg-amber-500/10 border-amber-500/20", high: "text-red-400 bg-red-500/10 border-red-500/20",
  critical: "text-red-400 bg-red-500/20 border-red-500/30",
};

export default function HistoryPage() {
  const [scans, setScans] = useState<ScanHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    dashboardApi.getScans({ limit: 100 })
      .then((res) => setScans(res.items))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = scans.filter((s) => {
    const matchSearch = s.input.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || s.type === filterType;
    return matchSearch && matchType;
  });

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-slate-500/10 border border-slate-500/20 flex items-center justify-center">
            <History className="w-5 h-5 text-slate-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Threat History</h1>
        </div>
        <p className="text-slate-400 text-sm">Full audit trail of all your scans.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search scan history…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-blue-500/40 transition-colors" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          {(["all", "url", "email", "image", "qr"] as const).map((t) => (
            <button key={t} onClick={() => setFilterType(t)}
              className={cn("px-3 py-2 rounded-xl text-xs font-medium transition-all capitalize",
                filterType === t ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : "glass border border-white/10 text-slate-400 hover:text-white")}>
              {t}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="glass-card border border-white/[0.08]">
        <div className="px-6 py-4 border-b border-white/[0.07] flex items-center justify-between">
          <span className="text-white font-semibold">All Scans</span>
          <span className="text-slate-500 text-sm">{loading ? "Loading…" : `${filtered.length} results`}</span>
        </div>
        <div className="divide-y divide-white/[0.05]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <History className="w-8 h-8 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">{scans.length === 0 ? "No scans yet — run your first scan!" : "No scans match your filters"}</p>
            </div>
          ) : filtered.map((scan) => {
            const Icon = typeIcons[scan.type] || Globe;
            return (
              <div key={scan.id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors">
                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0", typeColors[scan.type])}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-200 text-sm font-mono truncate">{scan.input}</p>
                  <p className="text-slate-500 text-xs mt-0.5 capitalize">{scan.type} scan · {formatRelativeTime(new Date(scan.timestamp))}</p>
                </div>
                <div className={cn("px-2.5 py-1 rounded-lg text-xs font-semibold border flex-shrink-0", severityBadge[scan.severity] || severityBadge.safe)}>
                  {scan.riskScore}/100
                </div>
                <div className={cn("px-2 py-1 rounded-lg text-xs font-medium capitalize flex-shrink-0",
                  scan.status === "completed" ? "text-emerald-400" : "text-slate-400")}>
                  {scan.status}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
