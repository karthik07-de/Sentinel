"use client";

import { motion } from "framer-motion";
import { getRiskColor, getRiskLabel } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface RiskMeterProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function RiskMeter({ score, size = "md", showLabel = true }: RiskMeterProps) {
  const color = getRiskColor(score);
  const label = getRiskLabel(score);

  const sizeMap = {
    sm: { width: 120, height: 60, strokeWidth: 6, textSize: "text-xl", radius: 48 },
    md: { width: 180, height: 90, strokeWidth: 8, textSize: "text-3xl", radius: 72 },
    lg: { width: 240, height: 120, strokeWidth: 10, textSize: "text-4xl", radius: 96 },
  };

  const { width, height, strokeWidth, textSize, radius } = sizeMap[size];
  const normalizedRadius = radius - strokeWidth / 2;
  const semicircumference = Math.PI * normalizedRadius;
  const dashOffset = semicircumference - (score / 100) * semicircumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width, height }}>
        <svg width={width} height={height + strokeWidth} viewBox={`0 0 ${width} ${height + strokeWidth}`}>
          <defs>
            <linearGradient id={`meterGrad_${score}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22C55E" />
              <stop offset="40%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          </defs>
          {/* Background arc */}
          <path
            d={`M ${strokeWidth / 2} ${height} A ${normalizedRadius} ${normalizedRadius} 0 0 1 ${width - strokeWidth / 2} ${height}`}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Progress arc */}
          <motion.path
            d={`M ${strokeWidth / 2} ${height} A ${normalizedRadius} ${normalizedRadius} 0 0 1 ${width - strokeWidth / 2} ${height}`}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={semicircumference}
            initial={{ strokeDashoffset: semicircumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
          />
        </svg>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center pb-1">
          <motion.span
            className={cn("font-bold text-white", textSize)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}
          </motion.span>
          <span className="text-slate-500 text-sm">/100</span>
        </div>
      </div>
      {showLabel && (
        <div
          className="mt-2 px-3 py-1 rounded-full text-sm font-semibold border"
          style={{
            color,
            backgroundColor: `${color}15`,
            borderColor: `${color}30`,
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}
