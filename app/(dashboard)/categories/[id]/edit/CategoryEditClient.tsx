"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout";
import { CategoryForm } from "@/components/category";
import { useCategory } from "@/features/categories/hooks/useCategory";
import { useUpdateCategory } from "@/features/categories/hooks/useUpdateCategory";
import { ROUTES } from "@/constants/routes";
import type { CategoryFormValues } from "@/features/categories/schemas/category.schema";
import { extractApiErrorMessage } from "@/lib/api/error";

function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FormSkeleton() {
  return (
    <div className="space-y-5">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i}>
          <div
            className="h-3 w-24 rounded mb-1.5 animate-pulse"
            style={{ background: "rgba(26,28,27,0.08)" }}
          />
          <div
            className={`rounded-lg animate-pulse ${i === 1 ? "h-24" : "h-10"}`}
            style={{ background: "rgba(26,28,27,0.05)" }}
          />
        </div>
      ))}
      <div className="flex gap-3 pt-2">
        <div className="h-10 w-36 rounded-lg animate-pulse" style={{ background: "rgba(139,107,71,0.2)" }} />
        <div className="h-10 w-20 rounded-lg animate-pulse" style={{ background: "rgba(26,28,27,0.06)" }} />
      </div>
    </div>
  );
}

interface CategoryEditClientProps {
  categoryId: string;
}

export function CategoryEditClient({ categoryId }: CategoryEditClientProps) {
  const router = useRouter();
  const { data: category, isLoading, isError } = useCategory(categoryId);
  const { mutateAsync, isPending } = useUpdateCategory(categoryId);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleSubmit(values: CategoryFormValues) {
    setSubmitError(null);
    try {
      await mutateAsync({
        name: values.name,
        description: values.description,
        isActive: values.isActive,
        image: values.image,
      });
      router.push(ROUTES.CATEGORIES.LIST);
    } catch (err: unknown) {
      setSubmitError(extractApiErrorMessage(err));
    }
  }

  return (
    <div className="px-8 py-7 max-w-[1400px] mx-auto">
      <Link
        href={ROUTES.CATEGORIES.LIST}
        className="inline-flex items-center gap-2 text-[13px] mb-7 transition-opacity hover:opacity-70"
        style={{ color: "var(--color-text-secondary)" }}
      >
        <BackIcon />
        Back to Categories
      </Link>

      <PageHeader
        label="Categories"
        title={isLoading ? "Edit Category" : `Edit "${category?.name ?? ""}"`}
        subtitle="Update this category's information"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div
          className="lg:col-span-2 rounded-2xl p-6"
          style={{
            background: "var(--color-sidebar-bg)",
            border: "1px solid var(--color-border)",
          }}
        >
          {submitError && (
            <div className="mb-5 flex items-start gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-200">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 shrink-0">
                <circle cx="8" cy="8" r="7" fill="#ef4444" opacity="0.15" />
                <path d="M8 5v3.5M8 10.5v.5" stroke="#ef4444" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <p className="text-[13px] text-red-700">{submitError}</p>
            </div>
          )}
          {isLoading ? (
            <FormSkeleton />
          ) : isError || !category ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="8" stroke="#ef4444" strokeWidth="1.5" />
                  <path d="M10 6v5M10 13v1" stroke="#ef4444" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-[14px] font-medium text-[#1a1c1b]">Category not found</p>
              <p className="text-[12px]" style={{ color: "var(--color-text-muted)" }}>
                This category may have been deleted.
              </p>
              <Link
                href={ROUTES.CATEGORIES.LIST}
                className="mt-2 px-4 py-2 rounded-lg text-[13px] font-medium text-white"
                style={{ background: "var(--color-accent)" }}
              >
                Back to list
              </Link>
            </div>
          ) : (
            <CategoryForm
              mode="edit"
              defaultValues={{
                name: category.name,
                description: category.description ?? undefined,
                isActive: category.isActive,
              }}
              existingImageUrl={category.imageUrl ?? undefined}
              onSubmit={handleSubmit}
              isSubmitting={isPending}
            />
          )}
        </div>

        {!isLoading && category && (
          <div className="space-y-4">
            <div
              className="rounded-2xl p-5 space-y-3"
              style={{
                background: "var(--color-sidebar-bg)",
                border: "1px solid var(--color-border)",
              }}
            >
              <p
                className="text-[12px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--color-text-muted)" }}
              >
                Category Info
              </p>

              {category.imageUrl && (
                <div className="w-full h-32 rounded-xl overflow-hidden bg-[#f0ece5]">
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="space-y-2 pt-1">
                {[
                  {
                    label: "Created",
                    value: new Date(category.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }),
                  },
                  {
                    label: "Updated",
                    value: new Date(category.updatedAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }),
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-[12px]" style={{ color: "var(--color-text-muted)" }}>
                      {label}
                    </span>
                    <span className="text-[12px] font-medium text-[#1a1c1b]">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
