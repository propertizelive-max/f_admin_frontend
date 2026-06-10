"use client";

import { cn } from "@/utils/cn";

interface MetricCardProps {
  label: string;
  value: string;
  sub?: string;
  growth?: number;
  icon: React.ReactNode;
  accent?: boolean;
  className?: string;
}

export function MetricCard({ label, value, sub, growth, icon, accent, className }: MetricCardProps) {
  const isPositive = growth !== undefined && growth >= 0;

  return (
    <div
      className={cn(
        "relative flex flex-col gap-4 rounded-2xl p-5 overflow-hidden",
        accent
          ? "text-white"
          : "bg-white border",
        className
      )}
      style={
        accent
          ? { background: "var(--color-accent)", borderColor: "transparent" }
          : { borderColor: "var(--color-border)" }
      }
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
            accent ? "bg-white/15" : "bg-[var(--color-accent-light)]"
          )}
          style={accent ? undefined : { color: "var(--color-accent)" }}
        >
          {icon}
        </div>
        {growth !== undefined && (
          <span
            className={cn(
              "text-[11px] font-semibold px-2 py-0.5 rounded-full",
              isPositive
                ? "bg-green-50 text-green-600"
                : "bg-red-50 text-red-500"
            )}
            style={
              accent
                ? { background: "rgba(255,255,255,0.2)", color: "white" }
                : undefined
            }
          >
            {isPositive ? "+" : ""}{growth}%
          </span>
        )}
      </div>

      {/* Value */}
      <div>
        <p
          className={cn(
            "text-[28px] font-semibold leading-none tracking-tight mb-1",
            accent ? "text-white" : "text-[#1a1c1b]"
          )}
        >
          {value}
        </p>
        <p
          className={cn(
            "text-[13px] font-medium",
            accent ? "text-white/70" : "text-[#9a9b9b]"
          )}
        >
          {label}
        </p>
        {sub && (
          <p
            className={cn(
              "text-[12px] mt-1",
              accent ? "text-white/60" : "text-[#9a9b9b]"
            )}
          >
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

export function MetricCardSkeleton() {
  return (
    <div
      className="rounded-2xl p-5 border animate-pulse"
      style={{ borderColor: "var(--color-border)", background: "white" }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-gray-100" />
        <div className="w-14 h-5 rounded-full bg-gray-100" />
      </div>
      <div className="w-28 h-7 rounded-lg bg-gray-100 mb-2" />
      <div className="w-20 h-3.5 rounded bg-gray-100" />
    </div>
  );
}
