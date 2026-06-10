"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout";
import { ProductForm } from "@/components/product";
import { useCreateProduct } from "@/features/products/hooks/useCreateProduct";
import { ROUTES } from "@/constants/routes";
import type { ProductFormValues } from "@/features/products/schemas/product.schema";
import { ProductImageType } from "@/types/backend.types";
import type { CreateProductRequest } from "@/types/backend.types";

function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function CreateProductPage() {
  const router = useRouter();
  const { mutateAsync, isPending } = useCreateProduct();

  async function handleSubmit(values: ProductFormValues) {
    const apiData: CreateProductRequest = {
      title: values.title,
      description: values.description,
      categoryId: values.categoryId,
      price: values.price,
      discountPrice: values.discountPrice,
      stock: values.stock,
      sku: values.sku,
      material: values.material,
      status: values.status,
      color: values.color,
      dimensions: values.dimensions,
      weight: values.weight,
      finish: values.finish,
      style: values.style,
      careInstructions: values.careInstructions,
      warranty: values.warranty,
      images: [
        ...values.images.map((url, idx) => ({
          imageUrl: url,
          imageType: ProductImageType.GALLERY,
          sortOrder: idx,
        })),
        ...(values.diagramUrl
          ? [{ imageUrl: values.diagramUrl, imageType: ProductImageType.DIAGRAM, sortOrder: values.images.length }]
          : []),
      ],
    };
    try {
      await mutateAsync(apiData);
      router.push(ROUTES.PRODUCTS.LIST);
    } catch {
      // error surfaced by form validation or toast
    }
  }

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

      <PageHeader
        label="Catalogue"
        title="Create Product"
        subtitle="Add a new product to your store"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProductForm mode="create" onSubmit={handleSubmit} isSubmitting={isPending} />
        </div>

        <div className="space-y-4">
          <div
            className="rounded-2xl p-5"
            style={{ background: "var(--color-sidebar-bg)", border: "1px solid var(--color-border)" }}
          >
            <p
              className="text-[12px] font-semibold uppercase tracking-wider mb-3"
              style={{ color: "var(--color-text-muted)" }}
            >
              Tips
            </p>
            <ul className="space-y-3">
              {[
                "Use a clear product title customers will search for.",
                "Add at least 3 high-quality images from different angles.",
                "Set a SKU that matches your inventory system.",
                "Accurate dimensions help customers make better decisions.",
                "Set status to Draft while preparing, then publish.",
              ].map((tip) => (
                <li key={tip} className="flex items-start gap-2.5">
                  <span
                    className="mt-[3px] w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "var(--color-accent-light)" }}
                  >
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1.5 4l2 2 3-3.5" stroke="var(--color-accent)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="text-[12px] leading-snug" style={{ color: "var(--color-text-secondary)" }}>
                    {tip}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="rounded-2xl p-5"
            style={{ background: "var(--color-sidebar-bg)", border: "1px solid var(--color-border)" }}
          >
            <p
              className="text-[12px] font-semibold uppercase tracking-wider mb-3"
              style={{ color: "var(--color-text-muted)" }}
            >
              Media Guide
            </p>
            <div className="space-y-2.5">
              {[
                { label: "Images", hint: "JPG, PNG, WEBP, GIF, SVG · Up to 10 MB each" },
                { label: "Max images", hint: "10 gallery images + 1 diagram per product" },
                { label: "Min size", hint: "800 × 800 px recommended for images" },
              ].map(({ label, hint }) => (
                <div key={label}>
                  <p className="text-[12px] font-medium text-[#1a1c1b]">{label}</p>
                  <p className="text-[11px]" style={{ color: "var(--color-text-muted)" }}>{hint}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
