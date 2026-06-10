"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { ProductStatus } from "@/constants/enums";
import { ROUTES } from "@/constants/routes";
import type { ProductResponse } from "@/types/backend.types";

// ── Status badge ──────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<ProductStatus, { label: string; dot: string; bg: string; text: string }> = {
  [ProductStatus.DRAFT]:        { label: "Draft",        dot: "bg-amber-400",  bg: "bg-amber-50",   text: "text-amber-700"  },
  [ProductStatus.PUBLISHED]:    { label: "Published",    dot: "bg-blue-400",   bg: "bg-blue-50",    text: "text-blue-700"   },
  [ProductStatus.ACTIVE]:       { label: "Active",       dot: "bg-green-500",  bg: "bg-green-50",   text: "text-green-700"  },
  [ProductStatus.ARCHIVED]:     { label: "Archived",     dot: "bg-gray-400",   bg: "bg-gray-100",   text: "text-gray-500"   },
  [ProductStatus.OUT_OF_STOCK]: { label: "Out of Stock", dot: "bg-red-400",    bg: "bg-red-50",     text: "text-red-600"    },
};

function StatusBadge({ status }: { status: ProductStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG[ProductStatus.DRAFT];
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium", cfg.bg, cfg.text)}>
      <span className={cn("w-1.5 h-1.5 rounded-full", cfg.dot)} />
      {cfg.label}
    </span>
  );
}

// ── Product thumbnail ─────────────────────────────────────────────────────────

function ProductThumb({ src, name }: { src?: string; name: string }) {
  return (
    <div
      className="w-10 h-10 rounded-xl overflow-hidden shrink-0 flex items-center justify-center"
      style={{ background: "var(--color-nav-active-bg)" }}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: "var(--color-accent)", opacity: 0.5 }}>
          <rect x="1" y="1" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="5.5" cy="5.5" r="1.5" fill="currentColor" />
          <path d="M1 10l4-3 3 2.5 2-1.5 5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}

// ── Stock indicator ───────────────────────────────────────────────────────────

function StockCell({ qty }: { qty: number }) {
  const color = qty === 0 ? "text-red-500" : qty <= 10 ? "text-amber-600" : "text-[#1a1c1b]";
  return (
    <span className={cn("text-[13px] font-medium", color)}>
      {qty}
      {qty === 0 && (
        <span className="ml-1.5 text-[10px] font-normal text-red-400">(out)</span>
      )}
      {qty > 0 && qty <= 10 && (
        <span className="ml-1.5 text-[10px] font-normal text-amber-500">(low)</span>
      )}
    </span>
  );
}

// ── Delete modal ──────────────────────────────────────────────────────────────

function DeleteModal({ name, onConfirm, onCancel }: { name: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/25 backdrop-blur-[2px]" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 6.5v3.5M9 12v.5" stroke="#ef4444" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M2.5 13.5l5.8-10a.8.8 0 011.4 0l5.8 10a.8.8 0 01-.7 1.2H3.2a.8.8 0 01-.7-1.2z" stroke="#ef4444" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <p className="text-[15px] font-semibold text-[#1a1c1b]">Delete Product</p>
            <p className="text-[12px]" style={{ color: "var(--color-text-muted)" }}>
              This action cannot be undone.
            </p>
          </div>
        </div>
        <p className="text-[13px] mb-6" style={{ color: "var(--color-text-secondary)" }}>
          Are you sure you want to delete <strong className="text-[#1a1c1b]">{name}</strong>? This will
          permanently remove the product and all its data.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-lg text-[13px] font-medium text-white bg-red-500 hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-lg text-[13px] font-medium transition-colors"
            style={{ background: "rgba(26,28,27,0.06)", color: "var(--color-text-secondary)" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

export function ProductTableSkeleton() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
            {["Product", "Category", "Price", "Stock", "Status", "Created", "Actions"].map((h) => (
              <th
                key={h}
                className="text-left px-4 py-3 text-[11px] font-semibold tracking-wider uppercase"
                style={{ color: "var(--color-text-muted)" }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }).map((_, i) => (
            <tr key={i} style={{ borderBottom: "1px solid var(--color-border)" }}>
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl animate-pulse" style={{ background: "rgba(26,28,27,0.06)" }} />
                  <div className="space-y-1.5">
                    <div className="h-3 w-28 rounded animate-pulse" style={{ background: "rgba(26,28,27,0.08)" }} />
                    <div className="h-2.5 w-20 rounded animate-pulse" style={{ background: "rgba(26,28,27,0.05)" }} />
                  </div>
                </div>
              </td>
              {[16, 14, 10, 16, 18].map((w, j) => (
                <td key={j} className="px-4 py-3.5">
                  <div className="h-3 rounded animate-pulse" style={{ background: "rgba(26,28,27,0.07)", width: `${w * 4}px` }} />
                </td>
              ))}
              <td className="px-4 py-3.5">
                <div className="flex gap-1.5">
                  <div className="w-7 h-7 rounded-lg animate-pulse" style={{ background: "rgba(26,28,27,0.06)" }} />
                  <div className="w-7 h-7 rounded-lg animate-pulse" style={{ background: "rgba(26,28,27,0.06)" }} />
                  <div className="w-7 h-7 rounded-lg animate-pulse" style={{ background: "rgba(26,28,27,0.06)" }} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────

export function ProductEmptyState({ hasSearch }: { hasSearch?: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: "var(--color-nav-active-bg)" }}
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect x="3" y="7" width="22" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--color-accent)" }} />
          <path d="M9 7V5.5A1.5 1.5 0 0110.5 4h7A1.5 1.5 0 0119 5.5V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ color: "var(--color-accent)" }} />
          <circle cx="14" cy="15" r="2.5" stroke="currentColor" strokeWidth="1.3" style={{ color: "var(--color-accent)", opacity: 0.6 }} />
        </svg>
      </div>
      <p className="text-[15px] font-medium text-[#1a1c1b] mb-1">
        {hasSearch ? "No products match your search" : "No products yet"}
      </p>
      <p className="text-[13px] mb-6" style={{ color: "var(--color-text-muted)" }}>
        {hasSearch
          ? "Try adjusting your search or filter."
          : "Add your first product to start selling."}
      </p>
      {!hasSearch && (
        <Link
          href={ROUTES.PRODUCTS.CREATE}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium text-white"
          style={{ background: "var(--color-accent)" }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 2v10M2 7h10" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          Add Product
        </Link>
      )}
    </div>
  );
}

// ── Main table ────────────────────────────────────────────────────────────────

interface ProductTableProps {
  products: ProductResponse[];
  onDelete: (id: string) => Promise<void> | void;
  hasSearch?: boolean;
}

export function ProductTable({ products, onDelete, hasSearch }: ProductTableProps) {
  const [confirmItem, setConfirmItem] = useState<{ id: string; name: string } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleConfirm() {
    if (!confirmItem) return;
    setDeletingId(confirmItem.id);
    setConfirmItem(null);
    try {
      await onDelete(confirmItem.id);
    } finally {
      setDeletingId(null);
    }
  }

  if (products.length === 0) {
    return <ProductEmptyState hasSearch={hasSearch} />;
  }

  const COLS = ["Product", "Category", "Price", "Stock", "Status", "Created", "Actions"];

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
              {COLS.map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 text-[11px] font-semibold tracking-wider uppercase whitespace-nowrap"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const isDeleting = deletingId === product.id;
              const thumb = product.images?.[0]?.imageUrl;
              const hasDiscount = !!product.discountPrice && product.discountPrice < product.price;

              return (
                <tr
                  key={product.id}
                  className={cn("transition-colors", isDeleting && "opacity-50 pointer-events-none")}
                  style={{ borderBottom: "1px solid var(--color-border)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(26,28,27,0.018)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "")}
                >
                  {/* Product col */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <ProductThumb src={thumb} name={product.title} />
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium text-[#1a1c1b] truncate max-w-[200px]">
                          {product.title}
                        </p>
                        <p className="text-[11px] font-mono mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                          {product.sku ?? ""}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category col */}
                  <td className="px-4 py-3.5">
                    <span className="text-[13px]" style={{ color: "var(--color-text-secondary)" }}>
                      {product.category?.name ?? "—"}
                    </span>
                  </td>

                  {/* Price col */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {hasDiscount ? (
                      <div>
                        <p className="text-[13px] font-semibold text-[#1a1c1b]">
                          ₹{product.discountPrice!.toLocaleString("en-IN")}
                        </p>
                        <p className="text-[11px] line-through" style={{ color: "var(--color-text-muted)" }}>
                          ₹{product.price.toLocaleString("en-IN")}
                        </p>
                      </div>
                    ) : (
                      <p className="text-[13px] font-semibold text-[#1a1c1b]">
                        ₹{product.price.toLocaleString("en-IN")}
                      </p>
                    )}
                  </td>

                  {/* Stock col */}
                  <td className="px-4 py-3.5">
                    <StockCell qty={product.stock} />
                  </td>

                  {/* Status col */}
                  <td className="px-4 py-3.5">
                    <StatusBadge status={product.status} />
                  </td>

                  {/* Created col */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="text-[12px]" style={{ color: "var(--color-text-muted)" }}>
                      {new Date(product.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </td>

                  {/* Actions col */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-0.5">
                      <Link
                        href={ROUTES.PRODUCTS.DETAILS(product.id)}
                        title="View"
                        className="p-2 rounded-lg transition-colors hover:bg-[rgba(26,28,27,0.06)]"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4" />
                          <circle cx="7" cy="7" r="1.5" fill="currentColor" />
                        </svg>
                      </Link>
                      <Link
                        href={ROUTES.PRODUCTS.EDIT(product.id)}
                        title="Edit"
                        className="p-2 rounded-lg transition-colors hover:bg-[var(--color-accent-light)]"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path
                            d="M9.5 2.5l2 2-7 7H2.5v-2l7-7z"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Link>
                      <button
                        title="Delete"
                        onClick={() => setConfirmItem({ id: product.id, name: product.title })}
                        className="p-2 rounded-lg transition-colors hover:bg-red-50 hover:text-red-500"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path
                            d="M2 3.5h10M5 3.5V2.5a.5.5 0 01.5-.5h3a.5.5 0 01.5.5v1M5.5 6v4M8.5 6v4M3 3.5l.7 7.5a.5.5 0 00.5.5h5.6a.5.5 0 00.5-.5L11 3.5"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
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

      {confirmItem && (
        <DeleteModal
          name={confirmItem.name}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmItem(null)}
        />
      )}
    </>
  );
}
