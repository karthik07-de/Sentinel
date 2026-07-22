"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Bell, Shield, Palette, Lock, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const sections = [
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    settings: [
      { key: "threatAlerts", label: "Threat alerts", description: "Get notified when a threat is detected", defaultOn: true },
      { key: "scanComplete", label: "Scan complete", description: "Notification when a scan finishes", defaultOn: true },
      { key: "weeklyReport", label: "Weekly report", description: "Receive your weekly security summary", defaultOn: true },
      { key: "tips", label: "Security tips", description: "Daily cybersecurity best practices", defaultOn: false },
    ],
  },
  {
    id: "privacy",
    label: "Privacy",
    icon: Shield,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    settings: [
      { key: "shareAnonymous", label: "Anonymous threat sharing", description: "Help improve detection by sharing anonymized threat data", defaultOn: true },
      { key: "analytics", label: "Usage analytics", description: "Help us improve with anonymous usage stats", defaultOn: false },
    ],
  },
  {
    id: "appearance",
    label: "Appearance",
    icon: Palette,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    settings: [
      { key: "animations", label: "Animations", description: "Enable UI animations and transitions", defaultOn: true },
      { key: "compactMode", label: "Compact mode", description: "Reduce spacing for more content on screen", defaultOn: false },
    ],
  },
];

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "w-11 h-6 rounded-full transition-colors relative flex-shrink-0",
        on ? "bg-blue-500" : "bg-white/10"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform",
          on ? "translate-x-5.5 left-0.5" : "left-0.5"
        )}
        style={{ transform: on ? "translateX(20px)" : "translateX(0)" }}
      />
    </button>
  );
}

export default function SettingsPage() {
  const [toggles, setToggles] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    sections.forEach((s) => s.settings.forEach((t) => { init[t.key] = t.defaultOn; }));
    return init;
  });

  const flip = (key: string) => setToggles((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-slate-500/10 border border-slate-500/20 flex items-center justify-center">
            <Settings className="w-5 h-5 text-slate-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
        </div>
        <p className="text-slate-400 text-sm">Manage your preferences and account settings.</p>
      </motion.div>

      {sections.map((section, i) => {
        const Icon = section.icon;
        return (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (i + 1) }}
            className="glass-card border border-white/[0.08]"
          >
            <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.07]">
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", section.bg)}>
                <Icon className={cn("w-4 h-4", section.color)} />
              </div>
              <h3 className="text-white font-semibold">{section.label}</h3>
            </div>
            <div className="divide-y divide-white/[0.05]">
              {section.settings.map((s) => (
                <div key={s.key} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <p className="text-white text-sm font-medium">{s.label}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{s.description}</p>
                  </div>
                  <Toggle on={toggles[s.key]} onToggle={() => flip(s.key)} />
                </div>
              ))}
            </div>
          </motion.div>
        );
      })}

      {/* Security */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card border border-white/[0.08]"
      >
        <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.07]">
          <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
            <Lock className="w-4 h-4 text-red-400" />
          </div>
          <h3 className="text-white font-semibold">Security</h3>
        </div>
        {[
          { label: "Change Password", description: "Update your account password" },
          { label: "Two-Factor Authentication", description: "Add extra security to your account" },
          { label: "Active Sessions", description: "Manage where you're signed in" },
        ].map((item) => (
          <button
            key={item.label}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors border-b border-white/[0.05] last:border-0"
          >
            <div className="text-left">
              <p className="text-white text-sm font-medium">{item.label}</p>
              <p className="text-slate-500 text-xs mt-0.5">{item.description}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>
        ))}
      </motion.div>

      {/* Danger zone */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card border border-red-500/20 p-6"
      >
        <h3 className="text-red-400 font-semibold mb-4">Danger Zone</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="flex-1 py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm font-medium transition-all">
            Delete All Scan History
          </button>
          <button className="flex-1 py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm font-medium transition-all">
            Delete Account
          </button>
        </div>
      </motion.div>
    </div>
  );
}
