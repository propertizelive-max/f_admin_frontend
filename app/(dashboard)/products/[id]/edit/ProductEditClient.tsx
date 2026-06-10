"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout";
import { ProductForm } from "@/components/product";
import { useProduct } from "@/features/products/hooks/useProduct";
import { useUpdateProduct } from "@/features/products/hooks/useUpdateProduct";
import { ROUTES } from "@/constants/routes";
import type { ProductFormValues } from "@/features/products/schemas/product.schema";
import { ProductImageType } from "@/types/backend.types";
import type { UpdateProductRequest } from "@/types/backend.types";

function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EditSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl p-6"
          style={{ background: "var(--color-sidebar-bg)", border: "1px solid var(--color-border)" }}
        >
          <div className="h-3 w-32 rounded mb-5" style={{ background: "rgba(26,28,27,0.07)" }} />
          <div className="space-y-3">
            <div className="h-10 rounded-lg" style={{ background: "rgba(26,28,27,0.05)" }} />
            {i < 2 && <div className="h-10 rounded-lg" style={{ background: "rgba(26,28,27,0.04)" }} />}
          </div>
        </div>
      ))}
    </div>
  );
}

interface ProductEditClientProps {
  productId: string;
}

export function ProductEditClient({ productId }: ProductEditClientProps) {
  const router = useRouter();
  const { data: product, isLoading, isError } = useProduct(productId);
  const { mutateAsync, isPending } = useUpdateProduct(productId);

  async function handleSubmit(values: ProductFormValues) {
    const apiData: UpdateProductRequest = {
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
      // error handled by hook
    }
  }

  const galleryImages = product?.images
    .filter((img) => img.imageType === ProductImageType.GALLERY)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((img) => img.imageUrl) ?? [];

  const diagramUrl =
    product?.images.find((img) => img.imageType === ProductImageType.DIAGRAM)?.imageUrl ?? "";

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
        title="Edit Product"
        subtitle={product?.title ?? "Update product details"}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <EditSkeleton />
          </div>
        </div>
      ) : isError || !product ? (
        <div
          className="rounded-2xl p-10 flex flex-col items-center gap-4 text-center"
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
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ProductForm
              mode="edit"
              defaultValues={{
                title: product.title,
                description: product.description ?? "",
                categoryId: product.categoryId,
                price: product.price,
                discountPrice: product.discountPrice ?? undefined,
                sku: product.sku ?? "",
                stock: product.stock,
                material: product.material ?? "",
                color: product.color ?? "",
                finish: product.finish ?? "",
                style: product.style ?? "",
                dimensions: product.dimensions ?? "",
                weight: product.weight ?? undefined,
                careInstructions: product.careInstructions ?? "",
                warranty: product.warranty ?? "",
                diagramUrl,
                images: galleryImages,
                status: product.status,
              }}
              onSubmit={handleSubmit}
              isSubmitting={isPending}
            />
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
                Product Info
              </p>
              <div className="space-y-2.5">
                {[
                  { label: "ID", value: product.id.slice(0, 8) + "…" },
                  { label: "SKU", value: product.sku ?? "—" },
                  {
                    label: "Created",
                    value: new Date(product.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }),
                  },
                  {
                    label: "Updated",
                    value: new Date(product.updatedAt).toLocaleDateString("en-IN", {
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

            <div
              className="rounded-2xl p-5"
              style={{ background: "var(--color-sidebar-bg)", border: "1px solid var(--color-border)" }}
            >
              <p
                className="text-[12px] font-semibold uppercase tracking-wider mb-3"
                style={{ color: "var(--color-text-muted)" }}
              >
                Quick Actions
              </p>
              <div className="space-y-2">
                <Link
                  href={ROUTES.PRODUCTS.DETAILS(product.id)}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-[12px] font-medium w-full transition-colors"
                  style={{ background: "var(--color-accent-light)", color: "var(--color-accent)" }}
                >
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.3" />
                    <circle cx="6.5" cy="6.5" r="1.5" fill="currentColor" />
                  </svg>
                  View Product Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
