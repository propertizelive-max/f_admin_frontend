"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { OrderStatus } from "@/constants/enums";
import { ROUTES } from "@/constants/routes";
import { getNextStatuses, isTerminalStatus } from "@/lib/orderTransitions";
import type { AdminOrderResponse, OrderItemDetail, OrderItemsResponse } from "@/types/backend.types";

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; dot: string }> = {
  [OrderStatus.PENDING]:    { label: "Pending",    color: "#6b7280", bg: "#f3f4f6", dot: "#9ca3af" },
  [OrderStatus.PROCESSING]: { label: "Processing", color: "#b45309", bg: "#fffbeb", dot: "#f59e0b" },
  [OrderStatus.SHIPPED]:    { label: "Shipped",    color: "#1d4ed8", bg: "#eff6ff", dot: "#3b82f6" },
  [OrderStatus.DELIVERED]:  { label: "Delivered",  color: "#15803d", bg: "#f0fdf4", dot: "#22c55e" },
  [OrderStatus.CANCELLED]:  { label: "Cancelled",  color: "#dc2626", bg: "#fef2f2", dot: "#ef4444" },
};

const STATUS_FLOW: OrderStatus[] = [
  OrderStatus.PENDING,
  OrderStatus.PROCESSING,
  OrderStatus.SHIPPED,
  OrderStatus.DELIVERED,
];

function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG[OrderStatus.PENDING];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium"
      style={{ color: cfg.color, background: cfg.bg }}
    >
      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: cfg.dot }} />
      {cfg.label}
    </span>
  );
}

interface StatusUpdatePanelProps {
  order: AdminOrderResponse;
  onUpdateStatus: (status: OrderStatus) => Promise<void>;
}

function StatusUpdatePanel({ order, onUpdateStatus }: StatusUpdatePanelProps) {
  const [selected, setSelected] = useState<OrderStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const currentStatus = order.orderStatus as OrderStatus;
  const allowed = getNextStatuses(currentStatus);
  const isFinal = isTerminalStatus(currentStatus);

  async function handleUpdate() {
    if (!selected) return;
    setIsLoading(true);
    try {
      await onUpdateStatus(selected);
      setSelected(null);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "var(--color-sidebar-bg)", border: "1px solid var(--color-border)" }}
    >
      <p className="text-[13px] font-semibold text-[#1a1c1b] mb-4">Order Status</p>

      {currentStatus !== OrderStatus.CANCELLED && (
        <div className="mb-5">
          <div className="flex items-center gap-0">
            {STATUS_FLOW.map((s, idx) => {
              const currentIdx = STATUS_FLOW.indexOf(currentStatus);
              const isPast = idx < currentIdx;
              const isCurrent = idx === currentIdx;
              const isFuture = idx > currentIdx;
              const cfg = STATUS_CONFIG[s];

              return (
                <div key={s} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all"
                      style={{
                        background: isPast || isCurrent ? cfg.dot : "rgba(26,28,27,0.06)",
                        border: isCurrent ? `2px solid ${cfg.dot}` : "none",
                      }}
                    >
                      {isPast && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                      {isCurrent && <span className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <span
                      className="text-[9px] font-medium whitespace-nowrap"
                      style={{ color: isFuture ? "var(--color-text-muted)" : cfg.color }}
                    >
                      {cfg.label}
                    </span>
                  </div>
                  {idx < STATUS_FLOW.length - 1 && (
                    <div
                      className="flex-1 h-[2px] mb-4 mx-1 transition-all"
                      style={{ background: isPast ? STATUS_CONFIG[STATUS_FLOW[idx]].dot : "rgba(26,28,27,0.08)" }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <span className="text-[12px]" style={{ color: "var(--color-text-muted)" }}>Current status</span>
        <StatusBadge status={currentStatus} />
      </div>

      {currentStatus === OrderStatus.CANCELLED && order.cancelReason && (
        <div className="mb-4 px-3 py-2.5 rounded-xl bg-red-50 border border-red-100">
          <p className="text-[12px] text-red-700">Cancel reason: {order.cancelReason}</p>
        </div>
      )}

      {isFinal ? (
        <div
          className="text-[12px] text-center py-3 rounded-xl"
          style={{ background: "rgba(26,28,27,0.04)", color: "var(--color-text-muted)" }}
        >
          {currentStatus === OrderStatus.DELIVERED ? "Order completed" : "Order cancelled"}
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2 mb-4">
            {allowed.map((s) => {
              const cfg = STATUS_CONFIG[s];
              return (
                <button
                  key={s}
                  onClick={() => setSelected(s === selected ? null : s)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-xl border text-left transition-all",
                    selected === s
                      ? "border-[var(--color-accent)] bg-[var(--color-accent-light)]"
                      : "border-[var(--color-border)] hover:border-[rgba(26,28,27,0.2)]"
                  )}
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: cfg.dot }} />
                  <span className="text-[13px] font-medium flex-1" style={{ color: cfg.color }}>{cfg.label}</span>
                  {selected === s && (
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                      <path d="M2 6.5l3 3 6-6" stroke="var(--color-accent)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
          <button
            onClick={handleUpdate}
            disabled={!selected || isLoading}
            className="w-full py-2.5 rounded-xl text-[13px] font-medium text-white transition-opacity disabled:opacity-50"
            style={{ background: "var(--color-accent)" }}
          >
            {isLoading ? "Updating…" : "Update Status"}
          </button>
        </>
      )}
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "var(--color-sidebar-bg)", border: "1px solid var(--color-border)" }}
    >
      <p className="text-[13px] font-semibold text-[#1a1c1b] mb-4">{title}</p>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5" style={{ borderBottom: "1px solid var(--color-border)" }}>
      <span className="text-[12px] shrink-0" style={{ color: "var(--color-text-muted)" }}>{label}</span>
      <span className="text-[13px] font-medium text-[#1a1c1b] text-right">{value}</span>
    </div>
  );
}

export function OrderDetailsSkeleton() {
  return (
    <div className="px-8 py-7 max-w-[1200px] mx-auto">
      <div className="h-4 w-24 rounded animate-pulse mb-6" style={{ background: "rgba(26,28,27,0.07)" }} />
      <div className="h-8 w-48 rounded animate-pulse mb-8" style={{ background: "rgba(26,28,27,0.08)" }} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl p-5" style={{ background: "var(--color-sidebar-bg)", border: "1px solid var(--color-border)" }}>
              <div className="h-3 w-28 rounded animate-pulse mb-5" style={{ background: "rgba(26,28,27,0.07)" }} />
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="h-3 rounded animate-pulse mb-3" style={{ background: "rgba(26,28,27,0.05)", width: `${60 + j * 15}%` }} />
              ))}
            </div>
          ))}
        </div>
        <div className="rounded-2xl p-5" style={{ background: "var(--color-sidebar-bg)", border: "1px solid var(--color-border)" }}>
          <div className="h-3 w-24 rounded animate-pulse mb-5" style={{ background: "rgba(26,28,27,0.07)" }} />
          {Array.from({ length: 4 }).map((_, j) => (
            <div key={j} className="h-3 rounded animate-pulse mb-3" style={{ background: "rgba(26,28,27,0.05)" }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function OrderItemRow({ item, isLast }: { item: OrderItemDetail; isLast: boolean }) {
  return (
    <Link
      href={ROUTES.PRODUCTS.DETAILS(item.productId)}
      className="flex items-center gap-4 py-3 rounded-xl px-1 transition-colors hover:bg-[var(--color-nav-active-bg)] group"
      style={{ borderBottom: !isLast ? "1px solid var(--color-border)" : "none" }}
    >
      <div
        className="w-14 h-14 rounded-xl overflow-hidden shrink-0 flex items-center justify-center"
        style={{ background: "var(--color-nav-active-bg)" }}
      >
        {item.productImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.productImage}
            alt={item.productTitle}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              (e.currentTarget.nextElementSibling as HTMLElement | null)?.removeAttribute("style");
            }}
          />
        ) : null}
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          style={{ color: "var(--color-accent)", opacity: 0.5, display: item.productImage ? "none" : undefined }}
        >
          <rect x="2" y="5" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" />
          <path d="M2 9h16" stroke="currentColor" strokeWidth="1.4" />
          <path d="M7 5V3M13 5V3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-[#1a1c1b] truncate group-hover:text-[var(--color-accent)] transition-colors">
          {item.productTitle || "—"}
        </p>
        {(item.productCategoryName || item.productColor || item.productSku) && (
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            {item.productCategoryName && (
              <span
                className="text-[10px] px-1.5 py-0.5 rounded-md"
                style={{ background: "var(--color-nav-active-bg)", color: "var(--color-text-muted)" }}
              >
                {item.productCategoryName}
              </span>
            )}
            {item.productColor && (
              <span
                className="text-[10px] px-1.5 py-0.5 rounded-md"
                style={{ background: "var(--color-nav-active-bg)", color: "var(--color-text-muted)" }}
              >
                {item.productColor}
              </span>
            )}
            {item.productSku && (
              <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
                SKU: {item.productSku}
              </span>
            )}
          </div>
        )}
        <p className="text-[12px] mt-0.5" style={{ color: "var(--color-text-muted)" }}>
          Qty: {item.quantity} × ₹{item.unitPrice.toLocaleString("en-IN")}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <p className="text-[13px] font-semibold text-[#1a1c1b]">
          ₹{item.totalPrice.toLocaleString("en-IN")}
        </p>
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: "var(--color-accent)" }}
        >
          <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </Link>
  );
}

interface OrderDetailsProps {
  order: AdminOrderResponse;
  orderItems: OrderItemsResponse | undefined;
  isItemsLoading?: boolean;
  onUpdateStatus: (status: OrderStatus) => Promise<void>;
}

export function OrderDetails({ order, orderItems, isItemsLoading, onUpdateStatus }: OrderDetailsProps) {
  return (
    <div className="px-8 py-7 max-w-[1200px] mx-auto">
      <Link
        href={ROUTES.ORDERS.LIST}
        className="inline-flex items-center gap-2 text-[13px] font-medium mb-6 transition-colors"
        style={{ color: "var(--color-text-muted)" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-primary)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to Orders
      </Link>

      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <p className="text-[11px] font-medium tracking-widest uppercase mb-1.5" style={{ color: "var(--color-text-muted)" }}>
            Orders
          </p>
          <h1
            className="text-[28px] font-normal leading-tight text-[#1a1c1b]"
            style={{ fontFamily: "var(--font-molengo), serif" }}
          >
            Order #{order.id.slice(0, 8).toUpperCase()}
          </h1>
          <p className="text-[14px] mt-1" style={{ color: "var(--color-text-secondary)" }}>
            Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
          </p>
        </div>
        <StatusBadge status={order.orderStatus as OrderStatus} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <SectionCard title="Customer Information">
            <InfoRow label="Account Name" value={order.user.name} />
            <InfoRow label="Full Name" value={order.fullName} />
            <InfoRow label="Email" value={order.user.email} />
            <InfoRow label="Phone" value={order.phoneNumber} />
            {order.gstin && <InfoRow label="GSTIN" value={order.gstin} />}
          </SectionCard>

          <SectionCard title="Shipping Address">
            <InfoRow label="Address" value={order.shippingAddress} />
            <InfoRow label="City" value={order.city} />
            <InfoRow label="State" value={order.state} />
            <InfoRow label="Pincode" value={order.zipCode} />
          </SectionCard>

          <SectionCard title={`Ordered Products (${orderItems?.items.length ?? order.items.length})`}>
            {isItemsLoading && !order.items.length ? (
              <div className="flex flex-col gap-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 py-3">
                    <div className="w-14 h-14 rounded-xl animate-pulse shrink-0" style={{ background: "rgba(26,28,27,0.07)" }} />
                    <div className="flex-1 flex flex-col gap-2">
                      <div className="h-3 rounded animate-pulse" style={{ background: "rgba(26,28,27,0.07)", width: "60%" }} />
                      <div className="h-2.5 rounded animate-pulse" style={{ background: "rgba(26,28,27,0.05)", width: "35%" }} />
                    </div>
                    <div className="h-3.5 w-16 rounded animate-pulse" style={{ background: "rgba(26,28,27,0.07)" }} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col">
                {(orderItems?.items ?? order.items).map((item, idx) => {
                  const items = orderItems?.items ?? order.items;
                  return (
                    <OrderItemRow key={item.productId} item={item} isLast={idx === items.length - 1} />
                  );
                })}
              </div>
            )}
          </SectionCard>
        </div>

        <div className="flex flex-col gap-6">
          <StatusUpdatePanel order={order} onUpdateStatus={onUpdateStatus} />

          <SectionCard title="Order Summary">
            <div className="flex flex-col">
              <InfoRow label="Subtotal" value={`₹${order.productAmount.toLocaleString("en-IN")}`} />
              <InfoRow
                label="Delivery"
                value={order.deliveryCharge === 0 ? "Free" : `₹${order.deliveryCharge.toLocaleString("en-IN")}`}
              />
              <InfoRow label="Payment" value={<span>{order.paymentMethod} · {order.paymentStatus}</span>} />
            </div>
            <div
              className="flex items-center justify-between mt-3 pt-3"
              style={{ borderTop: "2px solid var(--color-border)" }}
            >
              <span className="text-[14px] font-semibold text-[#1a1c1b]">Total</span>
              <span className="text-[16px] font-bold" style={{ color: "var(--color-accent)" }}>
                ₹{order.totalAmount.toLocaleString("en-IN")}
              </span>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
