"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout";
import { CategoryForm } from "@/components/category";
import { useCreateCategory } from "@/features/categories/hooks/useCreateCategory";
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

export default function CreateCategoryPage() {
  const router = useRouter();
  const { mutateAsync, isPending } = useCreateCategory();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(values: CategoryFormValues) {
    setError(null);
    try {
      await mutateAsync({
        name: values.name,
        description: values.description,
        image: values.image,
      });
      router.push(ROUTES.CATEGORIES.LIST);
    } catch (err: unknown) {
      setError(extractApiErrorMessage(err));
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
        title="Create Category"
        subtitle="Add a new product category to your catalogue"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div
          className="lg:col-span-2 rounded-2xl p-6"
          style={{
            background: "var(--color-sidebar-bg)",
            border: "1px solid var(--color-border)",
          }}
        >
          {error && (
            <div className="mb-5 flex items-start gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-200">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 shrink-0">
                <circle cx="8" cy="8" r="7" fill="#ef4444" opacity="0.15" />
                <path d="M8 5v3.5M8 10.5v.5" stroke="#ef4444" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <p className="text-[13px] text-red-700">{error}</p>
            </div>
          )}
          <CategoryForm
            mode="create"
            onSubmit={handleSubmit}
            isSubmitting={isPending}
          />
        </div>

        <div className="space-y-4">
          <div
            className="rounded-2xl p-5"
            style={{
              background: "var(--color-sidebar-bg)",
              border: "1px solid var(--color-border)",
            }}
          >
            <p
              className="text-[12px] font-semibold uppercase tracking-wider mb-3"
              style={{ color: "var(--color-text-muted)" }}
            >
              Tips
            </p>
            <ul className="space-y-2.5">
              {[
                "Use a clear, descriptive name that customers will understand.",
                "The slug is auto-generated but you can customize it.",
                "Add a high-quality image — at least 400×400px recommended.",
                "Set status to Inactive to hide the category from your store.",
              ].map((tip) => (
                <li key={tip} className="flex items-start gap-2.5">
                  <span
                    className="mt-[3px] w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "var(--color-accent-light)" }}
                  >
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path
                        d="M1.5 4l2 2 3-3.5"
                        stroke="var(--color-accent)"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span
                    className="text-[12px] leading-snug"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {tip}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
