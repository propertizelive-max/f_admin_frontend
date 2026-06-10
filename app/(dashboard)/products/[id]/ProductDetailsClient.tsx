"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/utils/cn";
import { ProductStatus } from "@/constants/enums";
import { ProductImageType } from "@/types/backend.types";
import { ROUTES } from "@/constants/routes";
import { useProduct } from "@/features/products/hooks/useProduct";
import { useDeleteProduct } from "@/features/products/hooks/useDeleteProduct";
import { useToggleFeatured } from "@/features/products/hooks/useToggleFeatured";
import { useToggleActive } from "@/features/products/hooks/useToggleActive";
import { PageHeader } from "@/components/layout";
import type { ProductResponse } from "@/types/backend.types";

// ── Icons ──────────────────────────────────────────────────────────────────────

function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M9.5 2.5l2 2-7 7H2.5v-2l7-7z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 3.5h10M5 3.5V2.5a.5.5 0 01.5-.5h3a.5.5 0 01.5.5v1M5.5 6v4M8.5 6v4M3 3.5l.7 7.5a.5.5 0 00.5.5h5.6a.5.5 0 00.5-.5L11 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StarIcon({ filled }: { filled?: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M7 1.5l1.5 3.1 3.4.5-2.5 2.4.6 3.4L7 9.4l-3 1.5.6-3.4L2.1 5.1l3.4-.5L7 1.5z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
        fill={filled ? "currentColor" : "none"}
      />
    </svg>
  );
}

function ToggleIcon({ on }: { on?: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      {on ? (
        <>
          <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3" />
          <circle cx="7" cy="7" r="2" fill="currentColor" />
        </>
      ) : (
        <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3" />
      )}
    </svg>
  );
}

// ── Status config ──────────────────────────────────────────────────────────────

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
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium", cfg.bg, cfg.text)}>
      <span className={cn("w-1.5 h-1.5 rounded-full", cfg.dot)} />
      {cfg.label}
    </span>
  );
}

// ── Delete modal ───────────────────────────────────────────────────────────────

function DeleteModal({ name, onConfirm, onCancel, isPending }: {
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
  isPending?: boolean;
}) {
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
            <p className="text-[12px]" style={{ color: "var(--color-text-muted)" }}>This action cannot be undone.</p>
          </div>
        </div>
        <p className="text-[13px] mb-6" style={{ color: "var(--color-text-secondary)" }}>
          Are you sure you want to delete <strong className="text-[#1a1c1b]">{name}</strong>? This will permanently remove the product and all its data.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 py-2.5 rounded-lg text-[13px] font-medium text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-60"
          >
            {isPending ? "Deleting…" : "Delete"}
          </button>
          <button
            onClick={onCancel}
            disabled={isPending}
            className="flex-1 py-2.5 rounded-lg text-[13px] font-medium transition-colors disabled:opacity-60"
            style={{ background: "rgba(26,28,27,0.06)", color: "var(--color-text-secondary)" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Section card ───────────────────────────────────────────────────────────────

function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "var(--color-sidebar-bg)", border: "1px solid var(--color-border)" }}
    >
      {title && (
        <p
          className="text-[11px] font-semibold uppercase tracking-wider mb-4"
          style={{ color: "var(--color-text-muted)" }}
        >
          {title}
        </p>
      )}
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5" style={{ borderBottom: "1px solid var(--color-border)" }}>
      <span className="text-[12px] shrink-0" style={{ color: "var(--color-text-muted)" }}>{label}</span>
      <span className="text-[13px] font-medium text-[#1a1c1b] text-right">{value ?? "—"}</span>
    </div>
  );
}

// ── Skeleton ───────────────────────────────────────────────────────────────────

function DetailsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-3 w-24 rounded mb-7" style={{ background: "rgba(26,28,27,0.07)" }} />
      <div className="h-7 w-64 rounded mb-2" style={{ background: "rgba(26,28,27,0.08)" }} />
      <div className="h-3 w-40 rounded mb-8" style={{ background: "rgba(26,28,27,0.05)" }} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {[280, 160, 140].map((h, i) => (
            <div key={i} className="rounded-2xl" style={{ height: h, background: "rgba(26,28,27,0.05)", border: "1px solid var(--color-border)" }} />
          ))}
        </div>
        <div className="space-y-4">
          {[140, 120, 100].map((h, i) => (
            <div key={i} className="rounded-2xl" style={{ height: h, background: "rgba(26,28,27,0.05)", border: "1px solid var(--color-border)" }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Image viewer ───────────────────────────────────────────────────────────────

function ImageViewer({ images }: { images: ProductResponse["images"] }) {
  const gallery = images
    .filter((img) => img.imageType === ProductImageType.GALLERY)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const diagram = images.find((img) => img.imageType === ProductImageType.DIAGRAM);

  const [selected, setSelected] = useState(0);
  const allImages = [...gallery, ...(diagram ? [diagram] : [])];

  if (allImages.length === 0) {
    return (
      <div
        className="w-full aspect-[4/3] rounded-xl flex items-center justify-center"
        style={{ background: "var(--color-nav-active-bg)" }}
      >
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ color: "var(--color-accent)", opacity: 0.3 }}>
          <rect x="4" y="4" width="40" height="40" rx="6" stroke="currentColor" strokeWidth="2" />
          <circle cx="16" cy="16" r="4" fill="currentColor" />
          <path d="M4 30l12-10 8 7 6-5 14 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        className="w-full aspect-[4/3] rounded-xl overflow-hidden flex items-center justify-center"
        style={{ background: "var(--color-nav-active-bg)" }}
      >
        <img
          src={allImages[selected].imageUrl}
          alt="Product"
          className="w-full h-full object-contain"
        />
      </div>

      {allImages.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {allImages.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setSelected(idx)}
              className={cn(
                "w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 flex items-center justify-center",
                selected === idx
                  ? "border-[var(--color-accent)] opacity-100"
                  : "border-transparent opacity-60 hover:opacity-90"
              )}
              style={{ background: "var(--color-nav-active-bg)" }}
              title={img.imageType === ProductImageType.DIAGRAM ? "Diagram" : `Image ${idx + 1}`}
            >
              <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
              {img.imageType === ProductImageType.DIAGRAM && (
                <span
                  className="absolute text-[8px] font-bold px-1 py-0.5 rounded"
                  style={{ background: "var(--color-accent)", color: "white", bottom: 2, left: 2 }}
                >
                  DWG
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

interface ProductDetailsClientProps {
  productId: string;
}

export function ProductDetailsClient({ productId }: ProductDetailsClientProps) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const { data: product, isLoading, isError } = useProduct(productId);
  const deleteMutation = useDeleteProduct();
  const featuredMutation = useToggleFeatured(productId);
  const activeMutation = useToggleActive(productId);

  function showToast(type: "success" | "error", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  }

  async function handleDelete() {
    try {
      await deleteMutation.mutateAsync(productId);
      router.push(ROUTES.PRODUCTS.LIST);
    } catch {
      setShowDeleteModal(false);
      showToast("error", "Failed to delete product. Please try again.");
    }
  }

  async function handleToggleFeatured() {
    try {
      await featuredMutation.mutateAsync();
      showToast("success", product?.isFeatured ? "Removed from featured." : "Marked as featured.");
    } catch {
      showToast("error", "Failed to update featured status.");
    }
  }

  async function handleToggleActive() {
    try {
      await activeMutation.mutateAsync();
      showToast("success", product?.isActive ? "Product deactivated." : "Product activated.");
    } catch {
      showToast("error", "Failed to update active status.");
    }
  }

  if (isLoading) {
    return (
      <div className="px-8 py-7 max-w-[1400px] mx-auto">
        <DetailsSkeleton />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="px-8 py-7 max-w-[1400px] mx-auto">
        <Link
          href={ROUTES.PRODUCTS.LIST}
          className="inline-flex items-center gap-2 text-[13px] mb-7 transition-opacity hover:opacity-70"
          style={{ color: "var(--color-text-secondary)" }}
        >
          <BackIcon />
          Back to Products
        </Link>
        <div
          className="rounded-2xl p-12 flex flex-col items-center gap-4 text-center"
          style={{ background: "var(--color-sidebar-bg)", border: "1px solid var(--color-border)" }}
        >
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8" stroke="#ef4444" strokeWidth="1.5" />
              <path d="M10 6v5M10 13v1" stroke="#ef4444" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-[15px] font-medium text-[#1a1c1b]">Product not found</p>
          <p className="text-[13px]" style={{ color: "var(--color-text-muted)" }}>
            This product may have been deleted or does not exist.
          </p>
          <Link
            href={ROUTES.PRODUCTS.LIST}
            className="mt-2 px-5 py-2.5 rounded-lg text-[13px] font-medium text-white"
            style={{ background: "var(--color-accent)" }}
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const hasDiscount = !!product.discountPrice && product.discountPrice < product.price;
  const savings = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  const stockColor =
    product.stock === 0
      ? "text-red-500"
      : product.stock <= 10
      ? "text-amber-600"
      : "text-green-600";

  const stockLabel =
    product.stock === 0
      ? "Out of Stock"
      : product.stock <= 10
      ? `Low Stock (${product.stock} left)`
      : `In Stock (${product.stock})`;

  return (
    <div className="px-8 py-7 max-w-[1400px] mx-auto">
      {/* Toast */}
      {toast && (
        <div
          className={cn(
            "fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-medium shadow-lg transition-all",
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

      {/* Back */}
      <Link
        href={ROUTES.PRODUCTS.LIST}
        className="inline-flex items-center gap-2 text-[13px] mb-7 transition-opacity hover:opacity-70"
        style={{ color: "var(--color-text-secondary)" }}
      >
        <BackIcon />
        Back to Products
      </Link>

      {/* Header */}
      <PageHeader
        label="Catalogue"
        title={product.title}
        subtitle={`SKU: ${product.sku ?? "—"}  ·  ${product.category?.name ?? "Uncategorised"}`}
        actions={
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleToggleFeatured}
              disabled={featuredMutation.isPending}
              title={product.isFeatured ? "Remove from featured" : "Mark as featured"}
              className={cn(
                "inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all border disabled:opacity-50",
                product.isFeatured
                  ? "text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100"
                  : "border-[var(--color-border)] hover:bg-[var(--color-accent-light)]"
              )}
              style={!product.isFeatured ? { color: "var(--color-text-secondary)" } : undefined}
            >
              <StarIcon filled={product.isFeatured} />
              {featuredMutation.isPending ? "…" : product.isFeatured ? "Featured" : "Feature"}
            </button>

            <button
              onClick={handleToggleActive}
              disabled={activeMutation.isPending}
              title={product.isActive ? "Deactivate product" : "Activate product"}
              className={cn(
                "inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all border disabled:opacity-50",
                product.isActive
                  ? "text-green-700 bg-green-50 border-green-200 hover:bg-green-100"
                  : "border-[var(--color-border)] hover:bg-[var(--color-accent-light)]"
              )}
              style={!product.isActive ? { color: "var(--color-text-secondary)" } : undefined}
            >
              <ToggleIcon on={product.isActive} />
              {activeMutation.isPending ? "…" : product.isActive ? "Active" : "Inactive"}
            </button>

            <Link
              href={ROUTES.PRODUCTS.EDIT(product.id)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-opacity hover:opacity-80"
              style={{ background: "var(--color-accent-light)", color: "var(--color-accent)" }}
            >
              <EditIcon />
              Edit
            </Link>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium text-red-500 bg-red-50 hover:bg-red-100 transition-colors border border-red-100"
            >
              <TrashIcon />
              Delete
            </button>
          </div>
        }
      />

      {/* Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
        {/* Left — images + details */}
        <div className="lg:col-span-2 space-y-5">
          {/* Image viewer */}
          <Card>
            <ImageViewer images={product.images} />
          </Card>

          {/* Description */}
          {product.description && (
            <Card title="Description">
              <p className="text-[14px] leading-relaxed whitespace-pre-line" style={{ color: "var(--color-text-secondary)" }}>
                {product.description}
              </p>
            </Card>
          )}

          {/* Physical details */}
          <Card title="Physical Details">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Material", value: product.material },
                { label: "Color", value: product.color },
                { label: "Finish", value: product.finish },
                { label: "Style", value: product.style },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-[11px] mb-1" style={{ color: "var(--color-text-muted)" }}>{label}</p>
                  <p className="text-[13px] font-medium text-[#1a1c1b]">{value ?? "—"}</p>
                </div>
              ))}
            </div>
            <div
              className="grid grid-cols-2 gap-4 mt-5 pt-5"
              style={{ borderTop: "1px solid var(--color-border)" }}
            >
              {[
                { label: "Dimensions", value: product.dimensions },
                { label: "Weight", value: product.weight != null ? `${product.weight} kg` : null },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-[11px] mb-1" style={{ color: "var(--color-text-muted)" }}>{label}</p>
                  <p className="text-[13px] font-medium text-[#1a1c1b]">{value ?? "—"}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Care & Warranty */}
          {(product.careInstructions || product.warranty) && (
            <Card title="Care & Warranty">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {product.careInstructions && (
                  <div>
                    <p className="text-[12px] font-medium text-[#1a1c1b] mb-2">Care Instructions</p>
                    <p className="text-[13px] leading-relaxed whitespace-pre-line" style={{ color: "var(--color-text-secondary)" }}>
                      {product.careInstructions}
                    </p>
                  </div>
                )}
                {product.warranty && (
                  <div>
                    <p className="text-[12px] font-medium text-[#1a1c1b] mb-2">Warranty</p>
                    <p className="text-[13px] leading-relaxed whitespace-pre-line" style={{ color: "var(--color-text-secondary)" }}>
                      {product.warranty}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Right — pricing, inventory, meta */}
        <div className="space-y-4">
          {/* Pricing */}
          <Card title="Pricing">
            {hasDiscount ? (
              <div className="space-y-3">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-[28px] font-bold text-[#1a1c1b]">
                    ₹{product.discountPrice!.toLocaleString("en-IN")}
                  </span>
                  <span
                    className="text-[16px] line-through"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                </div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-semibold bg-green-50 text-green-700">
                  {savings}% off
                </span>
                <div
                  className="pt-3 mt-1"
                  style={{ borderTop: "1px solid var(--color-border)" }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[12px]" style={{ color: "var(--color-text-muted)" }}>Original Price</span>
                    <span className="text-[13px] font-medium text-[#1a1c1b]">₹{product.price.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[12px]" style={{ color: "var(--color-text-muted)" }}>Discount Price</span>
                    <span className="text-[13px] font-medium text-green-600">₹{product.discountPrice!.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[12px]" style={{ color: "var(--color-text-muted)" }}>Customer Saves</span>
                    <span className="text-[13px] font-semibold text-green-600">
                      ₹{(product.price - product.discountPrice!).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-baseline gap-1.5">
                <span className="text-[28px] font-bold text-[#1a1c1b]">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                <span className="text-[13px]" style={{ color: "var(--color-text-muted)" }}>MRP</span>
              </div>
            )}
          </Card>

          {/* Inventory */}
          <Card title="Inventory">
            <div>
              <InfoRow label="SKU" value={
                product.sku ? (
                  <span className="font-mono text-[12px]">{product.sku}</span>
                ) : "—"
              } />
              <InfoRow label="Stock" value={
                <span className={cn("font-semibold", stockColor)}>{stockLabel}</span>
              } />
            </div>
          </Card>

          {/* Status & Visibility */}
          <Card title="Status & Visibility">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[12px]" style={{ color: "var(--color-text-muted)" }}>Status</span>
                <StatusBadge status={product.status} />
              </div>
              <div
                className="flex items-center justify-between pt-2.5"
                style={{ borderTop: "1px solid var(--color-border)" }}
              >
                <span className="text-[12px]" style={{ color: "var(--color-text-muted)" }}>Featured</span>
                <span className={cn("text-[12px] font-medium px-2.5 py-1 rounded-full", product.isFeatured ? "bg-amber-50 text-amber-700" : "bg-gray-100 text-gray-500")}>
                  {product.isFeatured ? "Yes" : "No"}
                </span>
              </div>
              <div
                className="flex items-center justify-between pt-2.5"
                style={{ borderTop: "1px solid var(--color-border)" }}
              >
                <span className="text-[12px]" style={{ color: "var(--color-text-muted)" }}>Active</span>
                <span className={cn("text-[12px] font-medium px-2.5 py-1 rounded-full", product.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500")}>
                  {product.isActive ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </Card>

          {/* Category */}
          <Card title="Category">
            {product.category ? (
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: "var(--color-nav-active-bg)" }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: "var(--color-accent)" }}>
                    <rect x="1" y="1" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.3" />
                    <rect x="7.5" y="1" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.3" />
                    <rect x="1" y="7.5" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.3" />
                    <rect x="7.5" y="7.5" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.3" />
                  </svg>
                </div>
                <div>
                  <p className="text-[13px] font-medium text-[#1a1c1b]">{product.category.name}</p>
                  <p className="text-[11px] font-mono mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                    /{product.category.slug}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-[13px]" style={{ color: "var(--color-text-muted)" }}>Uncategorised</p>
            )}
          </Card>

          {/* Metadata */}
          <Card title="Metadata">
            <div>
              <InfoRow label="ID" value={<span className="font-mono text-[11px]">{product.id.slice(0, 8)}…</span>} />
              <InfoRow label="Slug" value={<span className="font-mono text-[11px]">{product.slug}</span>} />
              <InfoRow
                label="Created"
                value={new Date(product.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              />
              <InfoRow
                label="Updated"
                value={new Date(product.updatedAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              />
            </div>
          </Card>
        </div>
      </div>

      {/* Delete modal */}
      {showDeleteModal && (
        <DeleteModal
          name={product.title}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
          isPending={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
