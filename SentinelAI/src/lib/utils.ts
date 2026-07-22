import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { SeverityLevel } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSeverityColor(severity: SeverityLevel): string {
  const colors: Record<SeverityLevel, string> = {
    safe: "text-emerald-400",
    low: "text-emerald-400",
    medium: "text-amber-400",
    high: "text-red-400",
    critical: "text-red-500",
  };
  return colors[severity];
}

export function getSeverityBg(severity: SeverityLevel): string {
  const colors: Record<SeverityLevel, string> = {
    safe: "bg-emerald-500/10 border-emerald-500/20",
    low: "bg-emerald-500/10 border-emerald-500/20",
    medium: "bg-amber-500/10 border-amber-500/20",
    high: "bg-red-500/10 border-red-500/20",
    critical: "bg-red-500/20 border-red-500/30",
  };
  return colors[severity];
}

export function getRiskColor(score: number): string {
  if (score <= 20) return "#22C55E";
  if (score <= 40) return "#84cc16";
  if (score <= 60) return "#F59E0B";
  if (score <= 80) return "#f97316";
  return "#EF4444";
}

export function getRiskLabel(score: number): string {
  if (score <= 20) return "Safe";
  if (score <= 40) return "Low Risk";
  if (score <= 60) return "Medium Risk";
  if (score <= 80) return "High Risk";
  return "Critical";
}

export function getRiskSeverity(score: number): SeverityLevel {
  if (score <= 20) return "safe";
  if (score <= 40) return "low";
  if (score <= 60) return "medium";
  if (score <= 80) return "high";
  return "critical";
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

export function truncate(str: string, maxLen: number): string {
  return str.length > maxLen ? `${str.slice(0, maxLen)}...` : str;
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
