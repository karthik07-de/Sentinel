"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  LayoutDashboard,
  Globe,
  Mail,
  Image,
  QrCode,
  Bot,
  History,
  FileText,
  User,
  Settings,
  ChevronLeft,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "URL Scanner", href: "/dashboard/url-scanner", icon: Globe },
  { label: "Email Scanner", href: "/dashboard/email-scanner", icon: Mail },
  { label: "Image Scanner", href: "/dashboard/image-scanner", icon: Image },
  { label: "QR Scanner", href: "/dashboard/qr-scanner", icon: QrCode },
  { label: "AI Copilot", href: "/dashboard/copilot", icon: Bot },
  { label: "Threat History", href: "/dashboard/history", icon: History },
  { label: "Reports", href: "/dashboard/reports", icon: FileText },
];

const bottomItems = [
  { label: "Profile", href: "/dashboard/profile", icon: User },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar, user } = useAppStore();

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarOpen ? 240 : 72 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="flex-shrink-0 h-screen sticky top-0 flex flex-col border-r border-white/[0.07] bg-[#020617]/95 backdrop-blur-xl z-30 overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/[0.07]">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-glow-blue">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <AnimatePresence>
          {sidebarOpen && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="text-white font-bold text-base whitespace-nowrap"
            >
              Sentinel<span className="text-blue-400">AI</span>
            </motion.span>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {sidebarOpen && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
              className="ml-auto p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors flex-shrink-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>
        {!sidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="absolute right-3 top-5 p-1 rounded-lg text-slate-500 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4 rotate-180" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                isActive
                  ? "text-white bg-blue-500/10 border border-blue-500/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
              title={!sidebarOpen ? item.label : undefined}
            >
              <Icon
                className={cn(
                  "w-4.5 h-4.5 flex-shrink-0 transition-colors",
                  isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"
                )}
                size={18}
              />
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.15 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-blue-500/10 border border-blue-500/20 -z-10"
                  transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade badge */}
      {sidebarOpen && user.plan === "free" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mx-2 mb-3 p-3 rounded-xl bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-white text-xs font-semibold">Upgrade to Premium</span>
          </div>
          <p className="text-slate-400 text-xs mb-2">
            Unlock unlimited scans and AI Copilot
          </p>
          <Link
            href="#"
            className="block text-center py-1.5 rounded-lg bg-blue-600/80 hover:bg-blue-500/80 text-white text-xs font-semibold transition-colors"
          >
            Upgrade Now
          </Link>
        </motion.div>
      )}

      {/* Bottom items */}
      <div className="px-2 pb-4 space-y-1 border-t border-white/[0.07] pt-3">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "text-white bg-blue-500/10"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className="w-[18px] h-[18px] flex-shrink-0" />
              {sidebarOpen && <span className="whitespace-nowrap">{item.label}</span>}
            </Link>
          );
        })}
      </div>
    </motion.aside>
  );
}
