"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface DataPoint {
  month: string;
  sales: number;
  orders: number;
}

interface MonthlySalesChartProps {
  data: DataPoint[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl px-3 py-2 shadow-lg border text-sm min-w-[130px]"
      style={{ background: "white", borderColor: "var(--color-border)" }}
    >
      <p className="text-[12px] font-medium mb-2" style={{ color: "var(--color-text-secondary)" }}>{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4 mb-0.5">
          <span className="text-[12px]" style={{ color: "var(--color-text-muted)" }}>
            {p.dataKey === "sales" ? "Revenue" : "Orders"}
          </span>
          <span className="text-[12px] font-semibold" style={{ color: p.color }}>
            {p.dataKey === "sales" ? `₹${(p.value / 1000).toFixed(0)}k` : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export function MonthlySalesChart({ data }: MonthlySalesChartProps) {
  const maxSales = Math.max(...data.map((d) => d.sales));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barGap={4}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(26,28,27,0.06)"
          vertical={false}
        />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: "#9a9b9b" }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#9a9b9b" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(26,28,27,0.03)", radius: 6 }} />
        <Bar dataKey="sales" radius={[6, 6, 0, 0]} maxBarSize={40}>
          {data.map((entry) => (
            <Cell
              key={entry.month}
              fill={entry.sales === maxSales ? "#8b6b47" : "#d4bfa8"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function MonthlySalesChartSkeleton() {
  return (
    <div className="h-[220px] animate-pulse flex items-end gap-3 px-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-lg bg-gray-100"
          style={{ height: `${25 + Math.random() * 65}%` }}
        />
      ))}
    </div>
  );
}
