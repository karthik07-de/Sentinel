"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, ChevronDown, Menu, Shield, Sun, Moon } from "lucide-react";
import { useAppStore } from "@/store";
import { formatRelativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function Topbar() {
  const { user, notifications, markNotificationRead, markAllNotificationsRead, toggleSidebar } = useAppStore();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="h-16 border-b border-white/[0.07] flex items-center px-4 sm:px-6 gap-4 sticky top-0 z-20 bg-[#020617]/90 backdrop-blur-xl">
      {/* Mobile menu */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search scans, threats, reports…"
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/[0.08] text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-blue-500/30 transition-colors"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-mono text-slate-600 border border-white/10">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifs(!showNotifs);
              setShowProfile(false);
            }}
            className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px] font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifs && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-80 glass-card border border-white/10 rounded-xl shadow-xl overflow-hidden z-50"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
                  <span className="text-white font-semibold text-sm">Notifications</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-blue-400 text-xs hover:text-blue-300 transition-colors"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notif) => (
                    <button
                      key={notif.id}
                      onClick={() => markNotificationRead(notif.id)}
                      className={cn(
                        "w-full flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left",
                        !notif.read && "bg-blue-500/5"
                      )}
                    >
                      <div className={cn(
                        "w-2 h-2 rounded-full mt-2 flex-shrink-0",
                        notif.severity === "critical" ? "bg-red-400" :
                        notif.severity === "high" ? "bg-orange-400" :
                        notif.severity === "safe" ? "bg-emerald-400" :
                        "bg-blue-400"
                      )} />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium">{notif.title}</p>
                        <p className="text-slate-400 text-xs mt-0.5 truncate">{notif.message}</p>
                        <p className="text-slate-600 text-xs mt-1">{formatRelativeTime(notif.timestamp)}</p>
                      </div>
                      {!notif.read && <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0 mt-2" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifs(false);
            }}
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-white/5 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-white text-sm font-medium leading-none mb-0.5">{user.name}</div>
              <div className="text-slate-500 text-xs capitalize">{user.plan} plan</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-56 glass-card border border-white/10 rounded-xl shadow-xl overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-white/[0.07]">
                  <p className="text-white font-medium text-sm">{user.name}</p>
                  <p className="text-slate-500 text-xs">{user.email}</p>
                </div>
                {[
                  { label: "Profile", href: "/dashboard/profile" },
                  { label: "Settings", href: "/dashboard/settings" },
                  { label: "Upgrade to Premium", href: "#" },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="block px-4 py-2.5 text-slate-300 hover:text-white hover:bg-white/5 text-sm transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
                <div className="border-t border-white/[0.07]">
                  <a
                    href="/auth/login"
                    className="block px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/5 text-sm transition-colors"
                  >
                    Sign out
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Click outside handler */}
      {(showNotifs || showProfile) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => {
            setShowNotifs(false);
            setShowProfile(false);
          }}
        />
      )}
    </header>
  );
}
