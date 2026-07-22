"use client";

import { motion } from "framer-motion";
import { User, Shield, Mail, Calendar, Award, TrendingUp, Zap } from "lucide-react";
import { useAppStore } from "@/store";
import { CyberScoreRing } from "@/components/dashboard/CyberScoreRing";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { user } = useAppStore();

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <User className="w-5 h-5 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Profile</h1>
        </div>
        <p className="text-slate-400 text-sm">Your account information and achievements.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card border border-white/[0.08] p-6 flex flex-col items-center text-center"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-white font-bold text-lg">{user.name}</h2>
          <p className="text-slate-400 text-sm mt-1">{user.email}</p>
          <div className="mt-3 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 capitalize">
            {user.plan} Plan
          </div>
          <div className="mt-4 w-full pt-4 border-t border-white/[0.07] space-y-2 text-sm">
            <div className="flex items-center gap-2 text-slate-400">
              <Mail className="w-4 h-4 text-slate-500" />
              {user.email}
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Calendar className="w-4 h-4 text-slate-500" />
              Joined {user.joinedAt.toLocaleDateString()}
            </div>
          </div>
        </motion.div>

        {/* Cyber score */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card border border-white/[0.08] p-6 flex flex-col items-center justify-center"
        >
          <CyberScoreRing score={user.cyberScore} size={140} />
          <h3 className="text-white font-semibold mt-4">Cyber Health Score</h3>
          <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            +3 this week
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card border border-white/[0.08] p-6 space-y-4"
        >
          <h3 className="text-white font-semibold">Activity Stats</h3>
          {[
            { label: "Total Scans", value: user.stats.totalScans },
            { label: "Threats Blocked", value: user.stats.threatsBlocked },
            { label: "Current Streak", value: `${user.stats.streak} days` },
            { label: "URLs Scanned", value: user.stats.urlsScanned },
            { label: "Emails Analyzed", value: user.stats.emailsAnalyzed },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">{stat.label}</span>
              <span className="text-white font-semibold text-sm">{stat.value}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card border border-white/[0.08] p-6"
      >
        <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          Achievements
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {user.achievements.map((ach) => (
            <div
              key={ach.id}
              className={cn(
                "flex flex-col items-center text-center p-4 rounded-xl border transition-all",
                ach.locked
                  ? "border-white/5 opacity-40"
                  : "border-amber-500/20 bg-amber-500/5"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center mb-2 text-2xl",
                ach.locked ? "bg-white/5" : "bg-amber-500/10"
              )}>
                {ach.locked ? "🔒" : <Zap className="w-6 h-6 text-amber-400" />}
              </div>
              <p className="text-white text-xs font-semibold">{ach.title}</p>
              <p className="text-slate-500 text-[10px] mt-0.5">{ach.description}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
