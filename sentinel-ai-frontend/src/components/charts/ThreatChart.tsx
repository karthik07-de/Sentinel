"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { MOCK_CHART_DATA } from "@/constants/mock-data";

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ color: string; name: string; value: number }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card border border-white/10 rounded-xl px-3 py-2.5 text-sm">
        <p className="text-slate-400 mb-2">{label}</p>
        {payload.map((p) => (
          <div key={p.name} className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: p.color }}
            />
            <span className="text-slate-300 capitalize">{p.name}:</span>
            <span className="text-white font-semibold">{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function ThreatChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={MOCK_CHART_DATA} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
        <defs>
          <linearGradient id="threatGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="scansGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="safeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis
          dataKey="date"
          tick={{ fill: "#475569", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          interval={2}
        />
        <YAxis
          tick={{ fill: "#475569", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ paddingTop: "16px", fontSize: "12px", color: "#94a3b8" }}
        />
        <Area
          type="monotone"
          dataKey="threats"
          stroke="#EF4444"
          strokeWidth={2}
          fill="url(#threatGrad)"
          dot={false}
          activeDot={{ r: 4, fill: "#EF4444" }}
        />
        <Area
          type="monotone"
          dataKey="scans"
          stroke="#3B82F6"
          strokeWidth={2}
          fill="url(#scansGrad)"
          dot={false}
          activeDot={{ r: 4, fill: "#3B82F6" }}
        />
        <Area
          type="monotone"
          dataKey="safe"
          stroke="#22C55E"
          strokeWidth={2}
          fill="url(#safeGrad)"
          dot={false}
          activeDot={{ r: 4, fill: "#22C55E" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
