"use client";

import { MetricCard, MetricCardSkeleton } from "@/components/analytics";
import { useProductAnalytics } from "@/features/analytics/hooks/useProductAnalytics";

// ── Icons ─────────────────────────────────────────────────────────────────────

function BestSellerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 2l2.09 4.26L17 7.27l-3.5 3.41.83 4.82L10 13.27l-4.33 2.23.83-4.82L3 7.27l4.91-.01L10 2z" fill="currentColor" opacity="0.9" />
    </svg>
  );
}

function LowStockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 3v9M10 15v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.4" opacity="0.3" />
    </svg>
  );
}

function OutOfStockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.4" opacity="0.3" />
      <path d="M7 7l6 6M13 7l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatCurrency(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}k`;
  return `₹${n.toFixed(0)}`;
}

function EmptyRow({ message }: { message: string }) {
  return (
    <div
      className="py-12 flex items-center justify-center"
      style={{ borderTop: "1px solid var(--color-border)" }}
    >
      <p className="text-[13px]" style={{ color: "var(--color-text-muted)" }}>
        {message}
      </p>
    </div>
  );
}

function TableSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="p-5 space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-11 rounded-xl bg-gray-100 animate-pulse" />
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ProductAnalyticsPage() {
  const { data, isLoading, isError } = useProductAnalytics();

  const bestSellers = data?.bestSellingProducts ?? [];
  const lowStock = data?.lowStockProducts ?? [];
  const outOfStock = data?.outOfStockProducts ?? [];

  if (isError) {
    return (
      <div className="px-8 py-7">
        <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
          <p className="text-[14px] font-medium text-red-600">Failed to load product analytics</p>
          <p className="text-[12px] text-red-400 mt-1">Please check your connection and try again</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 py-7 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-[28px] font-normal leading-tight text-[#1a1c1b]"
          style={{ fontFamily: "var(--font-molengo), serif" }}
        >
          Products
        </h1>
        <p className="text-[14px] mt-1" style={{ color: "var(--color-text-secondary)" }}>
          Product performance, inventory status and sales metrics
        </p>
      </div>

      {/* ── Summary cards ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <MetricCardSkeleton key={i} />)
        ) : (
          <>
            <MetricCard
              label="Best Selling Products"
              value={`${bestSellers.length}`}
              sub="Ranked by revenue"
              icon={<BestSellerIcon />}
              accent
            />
            <MetricCard
              label="Low Stock Products"
              value={`${lowStock.length}`}
              sub="Needs restocking"
              icon={<LowStockIcon />}
            />
            <MetricCard
              label="Out of Stock"
              value={`${outOfStock.length}`}
              sub="Currently unavailable"
              icon={<OutOfStockIcon />}
            />
          </>
        )}
      </div>

      {/* ── Best Selling Products ─────────────────────────────────────────── */}
      <div
        className="rounded-2xl border bg-white overflow-hidden mb-4"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div className="px-5 py-4 border-b" style={{ borderColor: "var(--color-border)" }}>
          <h3 className="text-[14px] font-semibold text-[#1a1c1b]">Best Selling Products</h3>
          {!isLoading && bestSellers.length > 0 && (
            <p className="text-[12px] mt-0.5" style={{ color: "var(--color-text-muted)" }}>
              Ranked by total revenue generated
            </p>
          )}
        </div>
        {isLoading ? (
          <TableSkeleton rows={5} />
        ) : bestSellers.length === 0 ? (
          <EmptyRow message="No sales data available yet" />
        ) : (
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
                    className="px-5 py-3 text-left font-medium w-10"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    #
                  </th>
                  <th
                    className="px-5 py-3 text-left font-medium"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    Product
                  </th>
                  <th
                    className="px-5 py-3 text-right font-medium"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    Units Sold
                  </th>
                  <th
                    className="px-5 py-3 text-right font-medium"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody>
                {bestSellers.map((product, i) => (
                  <tr
                    key={product.productId}
                    className="hover:bg-[var(--color-accent-light)] transition-colors"
                    style={{
                      borderBottom:
                        i < bestSellers.length - 1
                          ? "1px solid var(--color-border)"
                          : undefined,
                    }}
                  >
                    <td
                      className="px-5 py-3.5 font-medium"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {i + 1}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-[#1a1c1b]">{product.title}</td>
                    <td
                      className="px-5 py-3.5 text-right"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      {product.totalSold}
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold text-[#1a1c1b]">
                      {formatCurrency(product.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Low Stock & Out of Stock ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Low Stock */}
        <div
          className="rounded-2xl border bg-white overflow-hidden"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div
            className="px-5 py-4 border-b flex items-center gap-2.5"
            style={{ borderColor: "var(--color-border)" }}
          >
            <h3 className="text-[14px] font-semibold text-[#1a1c1b]">Low Stock</h3>
            {!isLoading && lowStock.length > 0 && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">
                {lowStock.length}
              </span>
            )}
          </div>
          {isLoading ? (
            <TableSkeleton rows={4} />
          ) : lowStock.length === 0 ? (
            <EmptyRow message="No low stock products" />
          ) : (
            <div>
              {lowStock.map((product, i) => (
                <div
                  key={product.productId}
                  className="px-5 py-3.5 flex items-center justify-between hover:bg-[var(--color-accent-light)] transition-colors"
                  style={{
                    borderBottom:
                      i < lowStock.length - 1 ? "1px solid var(--color-border)" : undefined,
                  }}
                >
                  <span className="text-[13px] font-medium text-[#1a1c1b]">{product.title}</span>
                  <span className="text-[12px] font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-600">
                    {product.stock} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Out of Stock */}
        <div
          className="rounded-2xl border bg-white overflow-hidden"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div
            className="px-5 py-4 border-b flex items-center gap-2.5"
            style={{ borderColor: "var(--color-border)" }}
          >
            <h3 className="text-[14px] font-semibold text-[#1a1c1b]">Out of Stock</h3>
            {!isLoading && outOfStock.length > 0 && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-500">
                {outOfStock.length}
              </span>
            )}
          </div>
          {isLoading ? (
            <TableSkeleton rows={4} />
          ) : outOfStock.length === 0 ? (
            <EmptyRow message="All products are in stock" />
          ) : (
            <div>
              {outOfStock.map((product, i) => (
                <div
                  key={product.productId}
                  className="px-5 py-3.5 flex items-center justify-between hover:bg-[var(--color-accent-light)] transition-colors"
                  style={{
                    borderBottom:
                      i < outOfStock.length - 1 ? "1px solid var(--color-border)" : undefined,
                  }}
                >
                  <span className="text-[13px] font-medium text-[#1a1c1b]">{product.title}</span>
                  <span className="text-[12px] font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-500">
                    Out of stock
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
