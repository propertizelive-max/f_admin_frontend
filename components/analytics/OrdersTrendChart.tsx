"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface DataPoint {
  date: string;
  orders: number;
}

interface OrdersTrendChartProps {
  data: DataPoint[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl px-3 py-2 shadow-lg border text-sm"
      style={{ background: "white", borderColor: "var(--color-border)" }}
    >
      <p className="text-[12px] mb-1" style={{ color: "var(--color-text-muted)" }}>{label}</p>
      <p className="font-semibold text-[#3b82f6]">{payload[0].value} orders</p>
    </div>
  );
}

export function OrdersTrendChart({ data }: OrdersTrendChartProps) {
  const avg = Math.round(data.reduce((s, d) => s + d.orders, 0) / data.length);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(26,28,27,0.06)"
          vertical={false}
        />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: "#9a9b9b" }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#9a9b9b" }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(59,130,246,0.15)", strokeWidth: 1 }} />
        <ReferenceLine
          y={avg}
          stroke="#3b82f6"
          strokeDasharray="4 4"
          strokeOpacity={0.35}
        />
        <Line
          type="monotone"
          dataKey="orders"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: "#3b82f6", stroke: "white", strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function OrdersTrendChartSkeleton() {
  return (
    <div className="h-[220px] animate-pulse flex items-center justify-center">
      <div className="w-full h-[2px] bg-gray-100 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100" />
      </div>
    </div>
  );
}
