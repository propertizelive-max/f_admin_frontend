"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout";
import { OrderTable, OrderTableSkeleton } from "@/components/order";
import { OrderStatus } from "@/constants/enums";
import { QUERY_KEYS } from "@/constants";
import { useOrders } from "@/features/orders/hooks/useOrders";
import { orderApi } from "@/features/orders/services/order.api";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/utils/cn";

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10 10l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      {direction === "left" ? (
        <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

const STATUS_OPTIONS = [
  { label: "All Status",  value: "" },
  { label: "Pending",     value: OrderStatus.PENDING },
  { label: "Processing",  value: OrderStatus.PROCESSING },
  { label: "Shipped",     value: OrderStatus.SHIPPED },
  { label: "Delivered",   value: OrderStatus.DELIVERED },
  { label: "Cancelled",   value: OrderStatus.CANCELLED },
];

const PAGE_SIZE = 10;

export function OrderListClient() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const debouncedSearch = useDebounce(search, 350);

  const { data, isLoading, isError } = useOrders({
    page,
    limit: PAGE_SIZE,
    search: debouncedSearch || undefined,
    orderStatus: statusFilter || undefined,
  });

  const queryClient = useQueryClient();
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, orderStatus }: { id: string; orderStatus: OrderStatus }) =>
      orderApi.updateStatus(id, { orderStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS.ALL });
    },
  });

  function showToast(type: "success" | "error", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  }

  async function handleUpdateStatus(id: string, orderStatus: OrderStatus) {
    try {
      await updateStatusMutation.mutateAsync({ id, orderStatus });
      showToast("success", "Order status updated successfully.");
    } catch {
      showToast("error", "Failed to update order status. Please try again.");
    }
  }

  const orders = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? 0;
  const hasSearch = !!(debouncedSearch || statusFilter);

  return (
    <div className="px-8 py-7 max-w-[1400px] mx-auto">
      {toast && (
        <div
          className={cn(
            "fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-medium shadow-lg",
            toast.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          )}
        >
          {toast.type === "success" ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" fill="#22c55e" opacity="0.15" />
              <path d="M5 8l2 2 4-4" stroke="#22c55e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" fill="#ef4444" opacity="0.15" />
              <path d="M8 5v3.5M8 10.5v.5" stroke="#ef4444" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          )}
          {toast.msg}
        </div>
      )}

      <PageHeader
        label="Commerce"
        title="Orders"
        subtitle="Manage and track customer orders"
      />

      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "var(--color-sidebar-bg)", border: "1px solid var(--color-border)" }}
      >
        <div
          className="flex items-center gap-3 px-5 py-4"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          <div className="relative flex-1 max-w-xs">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--color-text-muted)" }}>
              <SearchIcon />
            </span>
            <input
              type="search"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by order ID or customer…"
              className="w-full pl-9 pr-3.5 py-2 text-[13px] rounded-lg border outline-none transition-colors bg-white text-[#1a1c1b] placeholder:text-[#9a9b9b]"
              style={{ borderColor: "var(--color-border)" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-accent)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
            />
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value as OrderStatus | ""); setPage(1); }}
              className="pl-3.5 pr-8 py-2 text-[13px] rounded-lg border outline-none appearance-none cursor-pointer bg-white text-[#1a1c1b] transition-colors"
              style={{ borderColor: "var(--color-border)" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-accent)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" style={{ color: "var(--color-text-muted)" }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>

          {!isLoading && (
            <span className="ml-auto text-[12px] shrink-0" style={{ color: "var(--color-text-muted)" }}>
              {total} {total === 1 ? "order" : "orders"}
            </span>
          )}
        </div>

        {isLoading ? (
          <OrderTableSkeleton />
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="8" stroke="#ef4444" strokeWidth="1.5" />
                <path d="M10 6v5M10 13v1" stroke="#ef4444" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-[14px] font-medium text-[#1a1c1b]">Failed to load orders</p>
            <p className="text-[12px]" style={{ color: "var(--color-text-muted)" }}>Check your connection and try again.</p>
          </div>
        ) : (
          <OrderTable
            orders={orders}
            hasSearch={hasSearch}
            onUpdateStatus={handleUpdateStatus}
          />
        )}

        {!isLoading && !isError && totalPages > 1 && (
          <div
            className="flex items-center justify-between px-5 py-3.5"
            style={{ borderTop: "1px solid var(--color-border)" }}
          >
            <span className="text-[12px]" style={{ color: "var(--color-text-muted)" }}>
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg transition-colors disabled:opacity-40 hover:bg-[rgba(26,28,27,0.06)]"
                style={{ color: "var(--color-text-secondary)" }}
              >
                <ChevronIcon direction="left" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let p = i + 1;
                if (totalPages > 5) {
                  if (page <= 3) p = i + 1;
                  else if (page >= totalPages - 2) p = totalPages - 4 + i;
                  else p = page - 2 + i;
                }
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className="w-8 h-8 rounded-lg text-[12px] font-medium transition-colors"
                    style={p === page ? { background: "var(--color-accent)", color: "white" } : { color: "var(--color-text-secondary)" }}
                    onMouseEnter={(e) => { if (p !== page) e.currentTarget.style.background = "rgba(26,28,27,0.06)"; }}
                    onMouseLeave={(e) => { if (p !== page) e.currentTarget.style.background = ""; }}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg transition-colors disabled:opacity-40 hover:bg-[rgba(26,28,27,0.06)]"
                style={{ color: "var(--color-text-secondary)" }}
              >
                <ChevronIcon direction="right" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
