"use client";

import {
  MetricCard,
  MetricCardSkeleton,
  RevenueTrendChart,
  RevenueTrendChartSkeleton,
  OrdersTrendChart,
  OrdersTrendChartSkeleton,
  ChartCard,
  ChartCardSkeleton,
} from "@/components/analytics";
import { useSalesAnalytics } from "@/features/analytics/hooks/useSalesAnalytics";

// ── Icons ─────────────────────────────────────────────────────────────────────

function TotalSalesIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8Z" fill="currentColor" opacity="0.15" />
      <path d="M10 5v1.5M10 13.5V15M7.5 8.25C7.5 7.56 8.17 7 9 7h2c.83 0 1.5.56 1.5 1.25S12.33 9 11.5 9h-3c-.83 0-1.5.56-1.5 1.25s.67 1.25 1.5 1.25h2.75c.83 0 1.25.56 1.25 1.25S12.58 14 11.75 14H9c-.83 0-1.5-.56-1.5-1.25" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function OrdersIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M2 3h2l1.8 9H15l2-6H5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="7.5" cy="15.5" r="1.5" fill="currentColor" />
      <circle cx="13.5" cy="15.5" r="1.5" fill="currentColor" />
    </svg>
  );
}

function AvgOrderIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 16l4-4 3 3 5-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DailyAvgIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="3" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.4" opacity="0.4" />
      <path d="M6 3V1M14 3V1M2 8h16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M6 12h8M8 15h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatCurrency(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}k`;
  return `₹${n.toFixed(0)}`;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function formatFullDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SalesAnalyticsPage() {
  const { data: salesData, isLoading, isError } = useSalesAnalytics();

  const trend = salesData?.revenueTrend ?? [];
  const totalSales = salesData?.totalSales ?? 0;
  const totalOrders = trend.reduce((s, p) => s + p.orderCount, 0);
  const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
  const avgDailyRevenue = trend.length > 0 ? totalSales / trend.length : 0;

  const revenueTrendChart = trend.map((p) => ({ date: formatDate(p.date), revenue: p.revenue }));
  const ordersTrendChart = trend.map((p) => ({ date: formatDate(p.date), orders: p.orderCount }));

  if (isError) {
    return (
      <div className="px-8 py-7">
        <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
          <p className="text-[14px] font-medium text-red-600">Failed to load sales analytics</p>
          <p className="text-[12px] text-red-400 mt-1">Please check your connection and try again</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 py-7 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1
            className="text-[28px] font-normal leading-tight text-[#1a1c1b]"
            style={{ fontFamily: "var(--font-molengo), serif" }}
          >
            Sales
          </h1>
          <p className="text-[14px] mt-1" style={{ color: "var(--color-text-secondary)" }}>
            Revenue and order performance over time
          </p>
        </div>
      </div>

      {/* ── Summary cards ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <MetricCardSkeleton key={i} />)
        ) : (
          <>
            <MetricCard
              label="Total Sales"
              value={formatCurrency(totalSales)}
              sub="Period total"
              icon={<TotalSalesIcon />}
              accent
            />
            <MetricCard
              label="Total Orders"
              value={`${totalOrders}`}
              sub="Period total"
              icon={<OrdersIcon />}
            />
            <MetricCard
              label="Avg. Order Value"
              value={formatCurrency(avgOrderValue)}
              sub="Per transaction"
              icon={<AvgOrderIcon />}
            />
            <MetricCard
              label="Avg. Daily Revenue"
              value={formatCurrency(avgDailyRevenue)}
              sub="Per day"
              icon={<DailyAvgIcon />}
            />
          </>
        )}
      </div>

      {/* ── Charts ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
        {isLoading ? (
          <>
            <ChartCardSkeleton className="lg:col-span-3" />
            <ChartCardSkeleton className="lg:col-span-2" />
          </>
        ) : trend.length > 0 ? (
          <>
            <ChartCard
              title="Revenue Trend"
              subtitle="Daily revenue over time"
              className="lg:col-span-3"
            >
              <RevenueTrendChart data={revenueTrendChart} />
            </ChartCard>
            <ChartCard
              title="Orders Trend"
              subtitle="Daily order count"
              className="lg:col-span-2"
            >
              <OrdersTrendChart data={ordersTrendChart} />
            </ChartCard>
          </>
        ) : (
          <div
            className="lg:col-span-5 rounded-2xl border flex items-center justify-center p-16"
            style={{ borderColor: "var(--color-border)" }}
          >
            <p className="text-[14px]" style={{ color: "var(--color-text-muted)" }}>
              No trend data available for this period
            </p>
          </div>
        )}
      </div>

      {/* ── Daily breakdown table ─────────────────────────────────────────── */}
      {!isLoading && trend.length > 0 && (
        <div
          className="rounded-2xl border bg-white overflow-hidden"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div
            className="px-5 py-4 border-b"
            style={{ borderColor: "var(--color-border)" }}
          >
            <h3 className="text-[14px] font-semibold text-[#1a1c1b]">Daily Revenue Breakdown</h3>
            <p className="text-[12px] mt-0.5" style={{ color: "var(--color-text-muted)" }}>
              {trend.length} days of data
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr
                  style={{
                    background: "var(--color-bg)",
                    borderBottom: "1px solid var(--color-border)",
                  }}
                >
                  <th
                    className="px-5 py-3 text-left font-medium"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    Date
                  </th>
                  <th
                    className="px-5 py-3 text-right font-medium"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    Revenue
                  </th>
                  <th
                    className="px-5 py-3 text-right font-medium"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    Orders
                  </th>
                  <th
                    className="px-5 py-3 text-right font-medium"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    Avg. Order Value
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...trend].reverse().map((point, i) => (
                  <tr
                    key={point.date}
                    className="hover:bg-[var(--color-accent-light)] transition-colors"
                    style={{
                      borderBottom:
                        i < trend.length - 1 ? "1px solid var(--color-border)" : undefined,
                    }}
                  >
                    <td className="px-5 py-3.5 text-[#1a1c1b]">
                      {formatFullDate(point.date)}
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold text-[#1a1c1b]">
                      {formatCurrency(point.revenue)}
                    </td>
                    <td className="px-5 py-3.5 text-right" style={{ color: "var(--color-text-secondary)" }}>
                      {point.orderCount}
                    </td>
                    <td className="px-5 py-3.5 text-right" style={{ color: "var(--color-text-secondary)" }}>
                      {formatCurrency(point.averageOrderValue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Loading skeleton for table */}
      {isLoading && (
        <div
          className="rounded-2xl border bg-white overflow-hidden"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div className="px-5 py-4 border-b" style={{ borderColor: "var(--color-border)" }}>
            <div className="w-40 h-4 rounded bg-gray-100 animate-pulse" />
          </div>
          <div className="p-5 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 rounded-xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
