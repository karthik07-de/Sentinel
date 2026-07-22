"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Globe, Mail, Image, QrCode, ShieldAlert, TrendingUp, Clock, Activity, ChevronRight } from "lucide-react";
import { CyberScoreRing } from "@/components/dashboard/CyberScoreRing";
import { ThreatChart } from "@/components/charts/ThreatChart";
import { MOCK_ACTIVITY_FEED, MOCK_SECURITY_TIPS } from "@/constants/mock-data";
import { formatRelativeTime, cn } from "@/lib/utils";
import { dashboardApi, DashboardData } from "@/lib/api";

const quickActions = [
  { label: "Scan URL", href: "/dashboard/url-scanner", icon: Globe, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  { label: "Scan Email", href: "/dashboard/email-scanner", icon: Mail, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  { label: "Scan Image", href: "/dashboard/image-scanner", icon: Image, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  { label: "Scan QR", href: "/dashboard/qr-scanner", icon: QrCode, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
];

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.get()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const user = data?.user;
  const stats = data?.stats;
  const recentScans = data?.recentScans?.slice(0, 5) ?? [];
  const chartData = data?.chartData ?? [];
  const activityFeed = data?.activityFeed?.length ? data.activityFeed : MOCK_ACTIVITY_FEED;

  const firstName = user?.name?.split(" ")[0] ?? "there";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">{greeting}, {firstName} 👋</h1>
        <p className="text-slate-400 mt-1 text-sm">Here&apos;s your security overview for today.</p>
      </motion.div>

      {/* Cyber Score + Stats */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <div className="lg:col-span-1 glass-card border border-white/[0.08] p-6 flex flex-col items-center justify-center">
          <CyberScoreRing score={user?.cyberScore ?? 50} size={160} />
          <h3 className="text-white font-semibold mt-4 mb-1">Cyber Health Score</h3>
          <p className="text-slate-500 text-xs text-center">Complete more scans to improve your score</p>
          <div className="mt-3 flex items-center gap-1 text-emerald-400 text-xs font-medium">
            <TrendingUp className="w-3.5 h-3.5" />+3 this week
          </div>
        </div>

        <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: "Total Scans", value: stats?.totalScans ?? 0, icon: Activity, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
            { label: "Threats Blocked", value: stats?.threatsBlocked ?? 0, icon: ShieldAlert, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
            { label: "URLs Scanned", value: stats?.urlsScanned ?? 0, icon: Globe, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
            { label: "Emails Analyzed", value: stats?.emailsAnalyzed ?? 0, icon: Mail, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
            { label: "Scan Streak", value: `${stats?.streak ?? 0}d`, icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
            { label: "Last Scan", value: stats?.lastScan ? formatRelativeTime(new Date(stats.lastScan)) : "Never", icon: Clock, color: "text-slate-400", bg: "bg-slate-500/10", border: "border-slate-500/20" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className={cn("glass-card border p-4 flex flex-col gap-3", stat.border)}>
                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", stat.bg)}>
                  <Icon className={cn("w-4 h-4", stat.color)} />
                </div>
                <div>
                  <div className={cn("text-2xl font-bold", stat.color)}>{stat.value}</div>
                  <div className="text-slate-500 text-xs mt-0.5">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="text-white font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.href} href={action.href}
                className={cn("glass-card-hover border p-5 flex flex-col items-center gap-3 text-center group", action.border)}>
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", action.bg)}>
                  <Icon className={cn("w-6 h-6", action.color)} />
                </div>
                <span className="text-white text-sm font-medium group-hover:text-blue-300 transition-colors">{action.label}</span>
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* Chart + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="lg:col-span-2 glass-card border border-white/[0.08] p-6">
          <div className="mb-6">
            <h3 className="text-white font-semibold">Threat Activity</h3>
            <p className="text-slate-400 text-xs mt-0.5">Last 12 weeks</p>
          </div>
          <ThreatChart data={chartData.length ? chartData : undefined} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="glass-card border border-white/[0.08] p-6">
          <h3 className="text-white font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {activityFeed.slice(0, 5).map((item: any) => (
              <div key={item.id} className="flex items-start gap-3">
                <div className={cn("w-2 h-2 rounded-full mt-2 flex-shrink-0",
                  item.severity === "critical" || item.severity === "high" ? "bg-red-400" :
                  item.severity === "medium" ? "bg-amber-400" : "bg-emerald-400")} />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-300 text-xs leading-relaxed truncate">{item.message}</p>
                  <p className="text-slate-600 text-xs mt-0.5">{formatRelativeTime(new Date(item.timestamp))}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Scans */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="glass-card border border-white/[0.08]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07]">
          <h3 className="text-white font-semibold">Recent Scans</h3>
          <Link href="/dashboard/history" className="text-blue-400 text-sm hover:text-blue-300 flex items-center gap-1">
            View all <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="divide-y divide-white/[0.05]">
          {recentScans.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-8">No scans yet — run your first scan above</p>
          ) : recentScans.map((scan) => (
            <div key={scan.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-white/[0.02] transition-colors">
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                scan.type === "url" ? "bg-blue-500/10" : scan.type === "email" ? "bg-purple-500/10" :
                scan.type === "image" ? "bg-amber-500/10" : "bg-emerald-500/10")}>
                {scan.type === "url" ? <Globe className="w-4 h-4 text-blue-400" /> :
                 scan.type === "email" ? <Mail className="w-4 h-4 text-purple-400" /> :
                 scan.type === "image" ? <Image className="w-4 h-4 text-amber-400" /> :
                 <QrCode className="w-4 h-4 text-emerald-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-300 text-sm truncate font-mono">{scan.input}</p>
                <p className="text-slate-500 text-xs mt-0.5">{formatRelativeTime(new Date(scan.timestamp))}</p>
              </div>
              <div className={cn("px-2.5 py-1 rounded-lg text-xs font-semibold border flex-shrink-0",
                scan.severity === "safe" || scan.severity === "low" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                scan.severity === "medium" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                "bg-red-500/10 text-red-400 border-red-500/20")}>
                {scan.riskScore}/100
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Security Tips */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <h3 className="text-white font-semibold mb-4">Security Tips</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_SECURITY_TIPS.map((tip) => (
            <div key={tip.id} className="glass-card border border-white/[0.07] p-4 glass-card-hover">
              <div className="text-2xl mb-3">
                {tip.icon === "shield-check" ? "🛡️" : tip.icon === "key" ? "🔑" : tip.icon === "link" ? "🔗" : "🔄"}
              </div>
              <h4 className="text-white text-sm font-semibold mb-1">{tip.title}</h4>
              <p className="text-slate-400 text-xs leading-relaxed">{tip.content}</p>
              <div className="mt-3"><span className="text-xs text-blue-400 font-medium">{tip.category}</span></div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
