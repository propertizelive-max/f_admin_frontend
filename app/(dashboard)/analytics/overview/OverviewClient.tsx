"use client";

import {
  MetricCard,
  MetricCardSkeleton,
  RevenueTrendChart,
  RevenueTrendChartSkeleton,
  OrdersTrendChart,
  OrdersTrendChartSkeleton,
  MonthlySalesChart,
  MonthlySalesChartSkeleton,
  ChartCard,
  ChartCardSkeleton,
} from "@/components/analytics";
import { useOverviewAnalytics } from "@/features/analytics/hooks/useOverviewAnalytics";
import { useSalesAnalytics } from "@/features/analytics/hooks/useSalesAnalytics";
import type { RevenueTrendPoint } from "@/features/analytics/types/analytics.types";

// ── Icons ─────────────────────────────────────────────────────────────────────

function RevenueIcon() {
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

function CustomersIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="8" cy="7" r="3" fill="currentColor" opacity="0.5" />
      <circle cx="14" cy="7" r="2.5" fill="currentColor" opacity="0.3" />
      <path d="M2 17c0-3.31 2.69-6 6-6s6 2.69 6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M14 11c1.93.5 3 2.04 3 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.5" />
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

function PendingIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.4" opacity="0.3" />
      <path d="M10 6v4.5l3 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CompletedIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" fill="currentColor" opacity="0.12" />
      <path d="M6.5 10.5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TodayIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="3" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.4" opacity="0.4" />
      <path d="M6 3V1M14 3V1M2 8h16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="10" cy="13" r="2" fill="currentColor" opacity="0.7" />
    </svg>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatCurrency(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}k`;
  return `₹${n.toFixed(0)}`;
}

function formatNumber(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return `${n}`;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function aggregateByMonth(trend: RevenueTrendPoint[]) {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const map = new Map<string, { sales: number; orders: number }>();
  for (const p of trend) {
    const key = monthNames[new Date(p.date).getMonth()];
    const existing = map.get(key) ?? { sales: 0, orders: 0 };
    map.set(key, { sales: existing.sales + p.revenue, orders: existing.orders + p.orderCount });
  }
  return Array.from(map.entries()).map(([month, v]) => ({ month, ...v }));
}

function computeGrowth(trend: RevenueTrendPoint[], key: "revenue" | "orderCount") {
  if (trend.length < 2) return 0;
  const mid = Math.floor(trend.length / 2);
  const first = trend.slice(0, mid).reduce((s, p) => s + p[key], 0) / mid;
  const second = trend.slice(mid).reduce((s, p) => s + p[key], 0) / (trend.length - mid);
  if (first === 0) return 0;
  return Math.round(((second - first) / first) * 1000) / 10;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function OverviewClient() {
  const { data: dashboard, isLoading: dashLoading, isError } = useOverviewAnalytics();
  const { data: salesData, isLoading: salesLoading } = useSalesAnalytics();

  const isLoading = dashLoading || salesLoading;

  const trend = salesData?.revenueTrend ?? [];
  const revenueTrendChart = trend.map((p) => ({ date: formatDate(p.date), revenue: p.revenue }));
  const ordersTrendChart = trend.map((p) => ({ date: formatDate(p.date), orders: p.orderCount }));
  const monthlySales = aggregateByMonth(trend);
  const revenueGrowth = computeGrowth(trend, "revenue");
  const ordersGrowth = computeGrowth(trend, "orderCount");

  if (isError) {
    return (
      <div className="px-8 py-7">
        <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
          <p className="text-[14px] font-medium text-red-600">Failed to load analytics</p>
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
            Overview
          </h1>
          <p className="text-[14px] mt-1" style={{ color: "var(--color-text-secondary)" }}>
            Your store performance at a glance
          </p>
        </div>
        <span
          className="text-[12px] px-3 py-1.5 rounded-lg font-medium mt-1"
          style={{ background: "var(--color-accent-light)", color: "var(--color-accent)" }}
        >
          Live Data
        </span>
      </div>

      {/* ── Primary metric cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <MetricCardSkeleton key={i} />)
        ) : (
          <>
            <MetricCard
              label="Total Revenue"
              value={formatCurrency(dashboard?.sales.totalRevenue ?? 0)}
              sub={`Monthly: ${formatCurrency(dashboard?.sales.monthlyRevenue ?? 0)}`}
              growth={revenueGrowth || undefined}
              icon={<RevenueIcon />}
              accent
            />
            <MetricCard
              label="Total Orders"
              value={formatNumber(dashboard?.sales.totalOrders ?? 0)}
              sub="All time"
              growth={ordersGrowth || undefined}
              icon={<OrdersIcon />}
            />
            <MetricCard
              label="Total Customers"
              value={formatNumber(dashboard?.users.totalUsers ?? 0)}
              sub={`${dashboard?.users.newUsers ?? 0} new this period`}
              icon={<CustomersIcon />}
            />
            <MetricCard
              label="Avg. Order Value"
              value={formatCurrency(dashboard?.sales.averageOrderValue ?? 0)}
              sub="Per transaction"
              icon={<AvgOrderIcon />}
            />
          </>
        )}
      </div>

      {/* ── Secondary metric cards ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <MetricCardSkeleton key={i} />)
        ) : (
          <>
            <MetricCard
              label="Pending Orders"
              value={`${dashboard?.orders.pending ?? 0}`}
              sub="Awaiting action"
              icon={<PendingIcon />}
            />
            <MetricCard
              label="Delivered Orders"
              value={`${dashboard?.orders.delivered ?? 0}`}
              sub="Successfully fulfilled"
              icon={<CompletedIcon />}
            />
            <MetricCard
              label="Today's Revenue"
              value={formatCurrency(dashboard?.sales.todayRevenue ?? 0)}
              sub="Today"
              icon={<TodayIcon />}
            />
          </>
        )}
      </div>

      {/* ── Charts row ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
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
              badge={
                <span
                  className="text-[12px] font-semibold px-2.5 py-1 rounded-lg"
                  style={{ background: "var(--color-accent-light)", color: "var(--color-accent)" }}
                >
                  {revenueGrowth >= 0 ? "+" : ""}{revenueGrowth}%
                </span>
              }
            >
              <RevenueTrendChart data={revenueTrendChart} />
            </ChartCard>

            <ChartCard
              title="Orders Trend"
              subtitle="Daily orders over time"
              className="lg:col-span-2"
              badge={
                <span className="text-[12px] font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600">
                  {ordersGrowth >= 0 ? "+" : ""}{ordersGrowth}%
                </span>
              }
            >
              <OrdersTrendChart data={ordersTrendChart} />
            </ChartCard>
          </>
        ) : (
          <>
            <div
              className="lg:col-span-3 rounded-2xl border flex items-center justify-center p-12"
              style={{ borderColor: "var(--color-border)" }}
            >
              <p className="text-[13px]" style={{ color: "var(--color-text-muted)" }}>No revenue trend data</p>
            </div>
            <div
              className="lg:col-span-2 rounded-2xl border flex items-center justify-center p-12"
              style={{ borderColor: "var(--color-border)" }}
            >
              <p className="text-[13px]" style={{ color: "var(--color-text-muted)" }}>No orders trend data</p>
            </div>
          </>
        )}
      </div>

      {/* ── Monthly Sales ────────────────────────────────────────────────── */}
      {isLoading ? (
        <ChartCardSkeleton />
      ) : monthlySales.length > 0 ? (
        <ChartCard
          title="Monthly Sales"
          subtitle={`Revenue breakdown for ${new Date().getFullYear()}`}
          badge={
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: "var(--color-accent)" }} />
                <span style={{ color: "var(--color-text-muted)" }}>Peak month</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#d4bfa8]" />
                <span style={{ color: "var(--color-text-muted)" }}>Regular</span>
              </span>
            </div>
          }
        >
          <MonthlySalesChart data={monthlySales} />
        </ChartCard>
      ) : (
        <div
          className="rounded-2xl border flex items-center justify-center p-12"
          style={{ borderColor: "var(--color-border)" }}
        >
          <p className="text-[13px]" style={{ color: "var(--color-text-muted)" }}>No monthly sales data</p>
        </div>
      )}
    </div>
  );
}
