"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { OrderStatus } from "@/constants/enums";
import { ROUTES } from "@/constants/routes";
import { getNextStatuses } from "@/lib/orderTransitions";
import type { AdminOrderResponse } from "@/types/backend.types";

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; dot: string }> = {
  [OrderStatus.PENDING]:    { label: "Pending",    color: "#6b7280", bg: "#f3f4f6", dot: "#9ca3af" },
  [OrderStatus.PROCESSING]: { label: "Processing", color: "#b45309", bg: "#fffbeb", dot: "#f59e0b" },
  [OrderStatus.SHIPPED]:    { label: "Shipped",    color: "#1d4ed8", bg: "#eff6ff", dot: "#3b82f6" },
  [OrderStatus.DELIVERED]:  { label: "Delivered",  color: "#15803d", bg: "#f0fdf4", dot: "#22c55e" },
  [OrderStatus.CANCELLED]:  { label: "Cancelled",  color: "#dc2626", bg: "#fef2f2", dot: "#ef4444" },
};

function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG[OrderStatus.PENDING];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap"
      style={{ color: cfg.color, background: cfg.bg }}
    >
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: cfg.dot }} />
      {cfg.label}
    </span>
  );
}

interface StatusModalProps {
  order: AdminOrderResponse;
  onConfirm: (newStatus: OrderStatus) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

function StatusModal({ order, onConfirm, onCancel, isLoading }: StatusModalProps) {
  const [selected, setSelected] = useState<OrderStatus | null>(null);
  const allowed = getNextStatuses(order.orderStatus as OrderStatus);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/25 backdrop-blur-[2px]" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "var(--color-nav-active-bg)" }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 3v6l4 2" stroke="var(--color-accent)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="9" cy="9" r="7.5" stroke="var(--color-accent)" strokeWidth="1.4" opacity="0.5" />
            </svg>
          </div>
          <div>
            <p className="text-[15px] font-semibold text-[#1a1c1b]">Update Order Status</p>
            <p className="text-[12px]" style={{ color: "var(--color-text-muted)" }}>
              #{order.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
        </div>

        <div className="mb-4 flex items-center gap-2">
          <span className="text-[12px]" style={{ color: "var(--color-text-muted)" }}>Current:</span>
          <OrderStatusBadge status={order.orderStatus as OrderStatus} />
        </div>

        {allowed.length === 0 ? (
          <p className="text-[13px] text-center py-4" style={{ color: "var(--color-text-secondary)" }}>
            This order cannot be updated further.
          </p>
        ) : (
          <>
            <p className="text-[12px] font-medium mb-3" style={{ color: "var(--color-text-secondary)" }}>
              Move to:
            </p>
            <div className="flex flex-col gap-2 mb-6">
              {allowed.map((s) => {
                const cfg = STATUS_CONFIG[s];
                return (
                  <button
                    key={s}
                    onClick={() => setSelected(s)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all",
                      selected === s
                        ? "border-[var(--color-accent)] bg-[var(--color-accent-light)]"
                        : "border-[var(--color-border)] hover:border-[rgba(26,28,27,0.2)]"
                    )}
                  >
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: cfg.dot }} />
                    <span className="text-[13px] font-medium" style={{ color: cfg.color }}>{cfg.label}</span>
                    {selected === s && (
                      <svg className="ml-auto" width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2.5 7l3 3 6-6" stroke="var(--color-accent)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => selected && onConfirm(selected)}
                disabled={!selected || isLoading}
                className="flex-1 py-2.5 rounded-lg text-[13px] font-medium text-white transition-opacity disabled:opacity-50"
                style={{ background: "var(--color-accent)" }}
              >
                {isLoading ? "Updating…" : "Update Status"}
              </button>
              <button
                onClick={onCancel}
                className="flex-1 py-2.5 rounded-lg text-[13px] font-medium transition-colors"
                style={{ background: "rgba(26,28,27,0.06)", color: "var(--color-text-secondary)" }}
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function OrderTableSkeleton() {
  const cols = ["Order", "Customer", "Amount", "Payment", "Status", "Date", "Actions"];
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
            {cols.map((h) => (
              <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold tracking-wider uppercase" style={{ color: "var(--color-text-muted)" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }).map((_, i) => (
            <tr key={i} style={{ borderBottom: "1px solid var(--color-border)" }}>
              {[80, 120, 60, 80, 72, 72, 56].map((w, j) => (
                <td key={j} className="px-4 py-3.5">
                  <div className="h-3 rounded animate-pulse" style={{ width: w, background: "rgba(26,28,27,0.07)" }} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function OrderEmptyState({ hasSearch }: { hasSearch?: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: "var(--color-nav-active-bg)" }}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M2 4H5L7.5 17H20.5L23 8H6" stroke="var(--color-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="10" cy="22" r="2" fill="var(--color-accent)" opacity="0.6" />
          <circle cx="19" cy="22" r="2" fill="var(--color-accent)" opacity="0.6" />
        </svg>
      </div>
      <p className="text-[15px] font-medium text-[#1a1c1b] mb-1">
        {hasSearch ? "No orders match your search" : "No orders yet"}
      </p>
      <p className="text-[13px]" style={{ color: "var(--color-text-muted)" }}>
        {hasSearch ? "Try adjusting your search or filter." : "Orders from customers will appear here."}
      </p>
    </div>
  );
}

interface OrderTableProps {
  orders: AdminOrderResponse[];
  hasSearch?: boolean;
  onUpdateStatus: (id: string, status: OrderStatus) => Promise<void>;
}

export function OrderTable({ orders, hasSearch, onUpdateStatus }: OrderTableProps) {
  const [statusModalOrder, setStatusModalOrder] = useState<AdminOrderResponse | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function handleStatusConfirm(newStatus: OrderStatus) {
    if (!statusModalOrder) return;
    setUpdatingId(statusModalOrder.id);
    setStatusModalOrder(null);
    try {
      await onUpdateStatus(statusModalOrder.id, newStatus);
    } finally {
      setUpdatingId(null);
    }
  }

  if (orders.length === 0) return <OrderEmptyState hasSearch={hasSearch} />;

  const cols = ["Order", "Customer", "Amount", "Payment", "Status", "Date", "Actions"];

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
              {cols.map((h) => (
                <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold tracking-wider uppercase whitespace-nowrap" style={{ color: "var(--color-text-muted)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const isUpdating = updatingId === order.id;
              const nextStatuses = getNextStatuses(order.orderStatus as OrderStatus);
              return (
                <tr
                  key={order.id}
                  className={cn("transition-colors", isUpdating && "opacity-50 pointer-events-none")}
                  style={{ borderBottom: "1px solid var(--color-border)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(26,28,27,0.018)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "")}
                >
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="text-[12px] font-mono font-medium" style={{ color: "var(--color-accent)" }}>
                      #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <p className="text-[13px] font-medium text-[#1a1c1b] truncate max-w-[160px]">{order.user.name}</p>
                    <p className="text-[11px] truncate max-w-[160px]" style={{ color: "var(--color-text-muted)" }}>{order.email}</p>
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="text-[13px] font-semibold text-[#1a1c1b]">
                      ₹{order.totalAmount.toLocaleString("en-IN")}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span
                      className="text-[11px] font-medium px-2 py-0.5 rounded-md"
                      style={{ background: "rgba(26,28,27,0.04)", color: "var(--color-text-secondary)" }}
                    >
                      {order.paymentMethod}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <OrderStatusBadge status={order.orderStatus as OrderStatus} />
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="text-[12px]" style={{ color: "var(--color-text-muted)" }}>
                      {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-0.5">
                      <Link
                        href={ROUTES.ORDERS.DETAILS(order.id)}
                        title="View Details"
                        className="p-2 rounded-lg transition-colors hover:bg-[var(--color-accent-light)]"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M1 7s2.5-4.5 6-4.5S13 7 13 7s-2.5 4.5-6 4.5S1 7 1 7z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                          <circle cx="7" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.4" />
                        </svg>
                      </Link>
                      <button
                        title="Update Status"
                        onClick={() => setStatusModalOrder(order)}
                        disabled={nextStatuses.length === 0}
                        className="p-2 rounded-lg transition-colors hover:bg-[var(--color-accent-light)] disabled:opacity-30 disabled:cursor-not-allowed"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M7 2v3l2-1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M2.5 9A5 5 0 107 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {statusModalOrder && (
        <StatusModal
          order={statusModalOrder}
          onConfirm={handleStatusConfirm}
          onCancel={() => setStatusModalOrder(null)}
          isLoading={!!updatingId}
        />
      )}
    </>
  );
}
