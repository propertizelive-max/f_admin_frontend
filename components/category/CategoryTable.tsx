"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { ROUTES } from "@/constants/routes";
import type { CategoryResponse } from "@/types/backend.types";

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium",
        isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", isActive ? "bg-green-500" : "bg-gray-400")} />
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

function CategoryImage({ src, name }: { src: string | null; name: string }) {
  return (
    <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 flex items-center justify-center" style={{ background: "var(--color-nav-active-bg)" }}>
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: "var(--color-accent)", opacity: 0.6 }}>
          <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" />
          <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.5" />
          <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.5" />
          <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" />
        </svg>
      )}
    </div>
  );
}

interface DeleteModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteModal({ onConfirm, onCancel }: DeleteModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/25 backdrop-blur-[2px]" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 6.5v3.5M9 12v.5" stroke="#ef4444" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M7.5 2.5h3l.5 1h3.5l-.5 12a1 1 0 01-1 1h-7a1 1 0 01-1-1l-.5-12H6l.5-1h.5z" stroke="#ef4444" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <p className="text-[15px] font-semibold text-[#1a1c1b]">Delete Category</p>
            <p className="text-[12px]" style={{ color: "var(--color-text-muted)" }}>
              This action cannot be undone.
            </p>
          </div>
        </div>
        <p className="text-[13px] mb-6" style={{ color: "var(--color-text-secondary)" }}>
          Deleting this category may affect associated products. Are you sure you want to continue?
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

export function CategoryTableSkeleton() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
            {["Category", "Slug", "Status", "Created", "Actions"].map((h) => (
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
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i} style={{ borderBottom: "1px solid var(--color-border)" }}>
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl animate-pulse" style={{ background: "rgba(26,28,27,0.06)" }} />
                  <div className="space-y-1.5">
                    <div className="h-3 w-28 rounded animate-pulse" style={{ background: "rgba(26,28,27,0.08)" }} />
                    <div className="h-2.5 w-40 rounded animate-pulse" style={{ background: "rgba(26,28,27,0.05)" }} />
                  </div>
                </div>
              </td>
              {[20, 16, 18, 14].map((w, j) => (
                <td key={j} className="px-4 py-3.5">
                  <div className={`h-3 w-${w} rounded animate-pulse`} style={{ background: "rgba(26,28,27,0.07)", width: `${w * 4}px` }} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CategoryEmptyState({ hasSearch }: { hasSearch?: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: "var(--color-nav-active-bg)" }}
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect x="2" y="2" width="11" height="11" rx="2.5" fill="currentColor" style={{ color: "var(--color-accent)" }} />
          <rect x="15" y="2" width="11" height="11" rx="2.5" fill="currentColor" style={{ color: "var(--color-accent)", opacity: 0.4 }} />
          <rect x="2" y="15" width="11" height="11" rx="2.5" fill="currentColor" style={{ color: "var(--color-accent)", opacity: 0.4 }} />
          <rect x="15" y="15" width="11" height="11" rx="2.5" fill="currentColor" style={{ color: "var(--color-accent)" }} />
        </svg>
      </div>
      <p className="text-[15px] font-medium text-[#1a1c1b] mb-1">
        {hasSearch ? "No categories match your search" : "No categories yet"}
      </p>
      <p className="text-[13px] mb-6" style={{ color: "var(--color-text-muted)" }}>
        {hasSearch
          ? "Try adjusting your search or filter."
          : "Create your first product category to get started."}
      </p>
      {!hasSearch && (
        <Link
          href={ROUTES.CATEGORIES.CREATE}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium text-white"
          style={{ background: "var(--color-accent)" }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 2v10M2 7h10" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          Add Category
        </Link>
      )}
    </div>
  );
}

interface CategoryTableProps {
  categories: CategoryResponse[];
  onDelete: (id: string) => Promise<void> | void;
  hasSearch?: boolean;
}

export function CategoryTable({ categories, onDelete, hasSearch }: CategoryTableProps) {
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleConfirm() {
    if (!confirmId) return;
    setDeletingId(confirmId);
    setConfirmId(null);
    try {
      await onDelete(confirmId);
    } finally {
      setDeletingId(null);
    }
  }

  if (categories.length === 0) {
    return <CategoryEmptyState hasSearch={hasSearch} />;
  }

  const cols = ["Category", "Slug", "Status", "Created", "Actions"];

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
              {cols.map((h) => (
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
            {categories.map((cat) => {
              const isBeingDeleted = deletingId === cat.id;
              return (
                <tr
                  key={cat.id}
                  className={cn("transition-colors", isBeingDeleted && "opacity-50 pointer-events-none")}
                  style={{ borderBottom: "1px solid var(--color-border)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(26,28,27,0.018)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "")}
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <CategoryImage src={cat.imageUrl} name={cat.name} />
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium text-[#1a1c1b] truncate max-w-[180px]">
                          {cat.name}
                        </p>
                        <p
                          className="text-[11px] truncate max-w-[220px]"
                          style={{ color: "var(--color-text-muted)" }}
                        >
                          {cat.description ?? ""}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span
                      className="text-[12px] font-mono px-2 py-0.5 rounded-md"
                      style={{
                        background: "rgba(26,28,27,0.04)",
                        color: "var(--color-text-secondary)",
                      }}
                    >
                      /{cat.slug}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <StatusBadge isActive={cat.isActive} />
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="text-[12px]" style={{ color: "var(--color-text-muted)" }}>
                      {new Date(cat.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-0.5">
                      <Link
                        href={ROUTES.CATEGORIES.EDIT(cat.id)}
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
                        onClick={() => setConfirmId(cat.id)}
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

      {confirmId && (
        <DeleteModal
          onConfirm={handleConfirm}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </>
  );
}
