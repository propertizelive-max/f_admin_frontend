"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { ProductStatus } from "@/constants/enums";
import { ROUTES } from "@/constants/routes";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { useUploadBulk, useUploadFile } from "@/features/media/hooks/useMedia";
import {
  productSchema,
  type ProductFormValues,
} from "@/features/products/schemas/product.schema";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-[12px] text-red-500">{message}</p>;
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-[13px] font-medium text-[#1a1c1b] mb-1.5">
      {children}
      {required && <span className="ml-0.5 text-red-500">*</span>}
    </label>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: "var(--color-sidebar-bg)", border: "1px solid var(--color-border)" }}
    >
      <h2
        className="text-[11px] font-semibold uppercase tracking-wider mb-5"
        style={{ color: "var(--color-text-muted)" }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

const inputBase =
  "w-full px-3.5 py-2.5 text-[14px] rounded-lg border outline-none transition-colors bg-white text-[#1a1c1b] placeholder:text-[#9a9b9b]";
const inputBorder = "border-[rgba(26,28,27,0.15)] focus:border-[#8b6b47]";
const inputError = "border-red-300 focus:border-red-400";
const selectBase =
  "w-full px-3.5 py-2.5 text-[14px] rounded-lg border outline-none appearance-none cursor-pointer bg-white text-[#1a1c1b] transition-colors pr-9";

function ChevronDown() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: "var(--color-text-muted)" }}>
      <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Gallery image uploader ─────────────────────────────────────────────────────

interface GalleryUploaderProps {
  images: string[];
  onImagesChange: (urls: string[]) => void;
  imagesError?: string;
}

function GalleryUploader({ images, onImagesChange, imagesError }: GalleryUploaderProps) {
  const imgRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const { mutate: uploadBulk, isPending: isUploading } = useUploadBulk();

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const remaining = 10 - images.length;
    const toUpload = files.slice(0, remaining);
    uploadBulk(toUpload, {
      onSuccess: (mediaList) => {
        onImagesChange([...images, ...mediaList.map((m) => m.url)]);
      },
    });
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files ?? []).filter((f) =>
      f.type.startsWith("image/")
    );
    if (!files.length) return;
    const remaining = 10 - images.length;
    uploadBulk(files.slice(0, remaining), {
      onSuccess: (mediaList) => {
        onImagesChange([...images, ...mediaList.map((m) => m.url)]);
      },
    });
  }

  function removeImage(idx: number) {
    onImagesChange(images.filter((_, i) => i !== idx));
  }

  const isEmpty = images.length === 0;

  return (
    <div>
      {!isEmpty && (
        <div className="flex flex-wrap gap-3 mb-4">
          {images.map((url, idx) => (
            <div
              key={idx}
              className="relative w-24 h-24 rounded-xl overflow-hidden border group shrink-0"
              style={{ borderColor: "var(--color-border)", background: "#f0ece5" }}
            >
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
              >
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M1 1l6 6M7 1L1 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          ))}
          {images.length < 10 && (
            <button
              type="button"
              onClick={() => imgRef.current?.click()}
              disabled={isUploading}
              className="w-24 h-24 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 transition-colors shrink-0 disabled:opacity-50"
              style={{ borderColor: "rgba(26,28,27,0.15)", color: "var(--color-text-muted)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--color-accent)";
                e.currentTarget.style.color = "var(--color-accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(26,28,27,0.15)";
                e.currentTarget.style.color = "var(--color-text-muted)";
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 4v10M4 9h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <span className="text-[10px] font-medium">Add</span>
            </button>
          )}
        </div>
      )}

      {isEmpty && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => imgRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && imgRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={cn(
            "flex flex-col items-center justify-center gap-3 w-full rounded-xl border-2 border-dashed py-12 cursor-pointer transition-all select-none mb-4",
            dragOver
              ? "border-[#8b6b47] bg-[rgba(139,107,71,0.04)]"
              : imagesError
              ? "border-red-300 bg-red-50/30"
              : "border-[rgba(26,28,27,0.12)] hover:border-[#8b6b47] hover:bg-[rgba(139,107,71,0.02)]"
          )}
        >
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: dragOver ? "var(--color-accent-light)" : "rgba(26,28,27,0.05)" }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="2" y="5" width="18" height="14" rx="2.5" stroke={dragOver ? "var(--color-accent)" : "var(--color-text-muted)"} strokeWidth="1.5" />
              <path d="M7 5V3.5A1.5 1.5 0 018.5 2h5A1.5 1.5 0 0115 3.5V5" stroke={dragOver ? "var(--color-accent)" : "var(--color-text-muted)"} strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="11" cy="12" r="2.5" stroke={dragOver ? "var(--color-accent)" : "var(--color-text-muted)"} strokeWidth="1.3" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-[13px] font-medium text-[#1a1c1b]">
              {dragOver ? "Drop images here" : "Click or drag & drop"}
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: "var(--color-text-muted)" }}>
              Images (JPG, PNG, WEBP) · Up to 10 images
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 mb-3">
        <button
          type="button"
          onClick={() => imgRef.current?.click()}
          disabled={isUploading || images.length >= 10}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-[12px] font-medium transition-colors disabled:opacity-50"
          style={{ background: "var(--color-accent-light)", color: "var(--color-accent)" }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <rect x="1" y="2.5" width="11" height="8.5" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
            <circle cx="4.5" cy="5.5" r="1" fill="currentColor" />
            <path d="M1 9l3-2.5 2 1.5 2-2 4 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {isUploading ? "Uploading…" : "Upload Images"}
        </button>
        {images.length > 0 && (
          <span className="ml-auto text-[11px]" style={{ color: "var(--color-text-muted)" }}>
            {images.length}/10 images
          </span>
        )}
      </div>

      <input
        ref={imgRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        multiple
        className="hidden"
        onChange={handleFileInput}
      />

      {imagesError && <FieldError message={imagesError} />}
    </div>
  );
}

// ── Diagram uploader ──────────────────────────────────────────────────────────

interface DiagramUploaderProps {
  value: string;
  onChange: (url: string) => void;
}

function DiagramUploader({ value, onChange }: DiagramUploaderProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const { mutate: uploadFile, isPending } = useUploadFile();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadFile(file, {
      onSuccess: (media) => onChange(media.url),
    });
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      uploadFile(file, { onSuccess: (media) => onChange(media.url) });
    }
  }

  const hasImage = !!value;

  return (
    <div>
      <div className="mb-5 mt-1 border-t" style={{ borderColor: "var(--color-border)" }} />
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-[13px] font-medium text-[#1a1c1b]">Product Diagram</p>
          <p className="text-[11px] mt-0.5" style={{ color: "var(--color-text-muted)" }}>
            Dimensional drawing or technical diagram (optional)
          </p>
        </div>
      </div>

      {hasImage ? (
        <div className="flex items-start gap-4">
          <div
            className="w-40 h-28 rounded-xl overflow-hidden border shrink-0 flex items-center justify-center"
            style={{ borderColor: "var(--color-border)", background: "#f0ece5" }}
          >
            <img src={value} alt="Diagram" className="w-full h-full object-contain p-2" />
          </div>
          <div className="flex flex-col gap-2 pt-1">
            <p className="text-[13px] font-medium text-[#1a1c1b]">Diagram uploaded</p>
            <div className="flex gap-2 mt-1">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={isPending}
                className="px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors disabled:opacity-50"
                style={{ background: "var(--color-accent-light)", color: "var(--color-accent)" }}
              >
                {isPending ? "Uploading…" : "Replace"}
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                className="px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors hover:bg-red-50 hover:text-red-500"
                style={{ background: "rgba(26,28,27,0.05)", color: "var(--color-text-muted)" }}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={() => fileRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={cn(
            "flex items-center justify-center gap-4 w-full rounded-xl border-2 border-dashed py-8 px-6 cursor-pointer transition-all select-none",
            dragOver
              ? "border-[#8b6b47] bg-[rgba(139,107,71,0.04)]"
              : "border-[rgba(26,28,27,0.12)] hover:border-[#8b6b47] hover:bg-[rgba(139,107,71,0.02)]"
          )}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: dragOver ? "var(--color-accent-light)" : "rgba(26,28,27,0.05)" }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="2" y="2" width="18" height="18" rx="2.5" stroke={dragOver ? "var(--color-accent)" : "var(--color-text-muted)"} strokeWidth="1.5" />
              <path d="M2 7h18M7 2v18" stroke={dragOver ? "var(--color-accent)" : "var(--color-text-muted)"} strokeWidth="1.2" strokeDasharray="2 1.5" />
            </svg>
          </div>
          <div>
            <p className="text-[13px] font-medium text-[#1a1c1b]">
              {isPending ? "Uploading diagram…" : dragOver ? "Drop diagram here" : "Upload product diagram"}
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: "var(--color-text-muted)" }}>
              JPG, PNG, WEBP, SVG
            </p>
          </div>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/svg+xml"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}

// ── Main form ─────────────────────────────────────────────────────────────────

interface ProductFormProps {
  defaultValues?: Partial<ProductFormValues>;
  onSubmit: (values: ProductFormValues) => void;
  isSubmitting?: boolean;
  mode: "create" | "edit";
}

export function ProductForm({ defaultValues, onSubmit, isSubmitting, mode }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      categoryId: "",
      price: 0,
      discountPrice: undefined,
      stock: 0,
      sku: "",
      material: "",
      color: "",
      finish: "",
      style: "",
      dimensions: "",
      weight: undefined,
      careInstructions: "",
      warranty: "",
      diagramUrl: "",
      images: [],
      status: ProductStatus.DRAFT,
      ...defaultValues,
    },
  });

  const { data: categoriesData } = useCategories({ limit: 100, isActive: true });
  const categories = categoriesData?.data ?? [];

  const images = watch("images") ?? [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Basic Information */}
      <SectionCard title="Basic Information">
        <div className="space-y-5">
          <div>
            <Label required>Product Title</Label>
            <input
              {...register("title")}
              placeholder="e.g. Nordic Oak Armchair"
              className={cn(inputBase, errors.title ? inputError : inputBorder)}
            />
            <FieldError message={errors.title?.message} />
          </div>

          <div>
            <Label>Description</Label>
            <textarea
              {...register("description")}
              rows={5}
              placeholder="Describe the product — materials, style, use case…"
              className={cn(inputBase, "resize-none", errors.description ? inputError : inputBorder)}
            />
            <FieldError message={errors.description?.message} />
          </div>
        </div>
      </SectionCard>

      {/* Organisation */}
      <SectionCard title="Organisation">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <Label required>Category</Label>
            <div className="relative">
              <select
                {...register("categoryId")}
                className={cn(selectBase, errors.categoryId ? inputError : inputBorder)}
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2">
                <ChevronDown />
              </span>
            </div>
            <FieldError message={errors.categoryId?.message} />
          </div>

          <div>
            <Label>Status</Label>
            <div className="relative">
              <select
                {...register("status")}
                className={cn(selectBase, inputBorder)}
              >
                <option value={ProductStatus.DRAFT}>Draft</option>
                <option value={ProductStatus.PUBLISHED}>Published</option>
                <option value={ProductStatus.ACTIVE}>Active</option>
                <option value={ProductStatus.ARCHIVED}>Archived</option>
                <option value={ProductStatus.OUT_OF_STOCK}>Out of Stock</option>
              </select>
              <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2">
                <ChevronDown />
              </span>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Pricing */}
      <SectionCard title="Pricing">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <Label required>Price (₹)</Label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px]" style={{ color: "var(--color-text-muted)" }}>
                ₹
              </span>
              <input
                {...register("price", { valueAsNumber: true })}
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                className={cn(inputBase, "pl-7", errors.price ? inputError : inputBorder)}
              />
            </div>
            <FieldError message={errors.price?.message} />
          </div>

          <div>
            <Label>Discount Price (₹)</Label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px]" style={{ color: "var(--color-text-muted)" }}>
                ₹
              </span>
              <input
                {...register("discountPrice", {
                  valueAsNumber: true,
                  setValueAs: (v) => (v === "" || isNaN(Number(v)) ? undefined : Number(v)),
                })}
                type="number"
                min="0"
                step="0.01"
                placeholder="Optional — must be less than price"
                className={cn(inputBase, "pl-7", errors.discountPrice ? inputError : inputBorder)}
              />
            </div>
            <FieldError message={errors.discountPrice?.message} />
          </div>
        </div>
      </SectionCard>

      {/* Inventory */}
      <SectionCard title="Inventory">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <Label>SKU</Label>
            <input
              {...register("sku")}
              placeholder="e.g. NOA-CHR-001"
              className={cn(inputBase, "font-mono", errors.sku ? inputError : inputBorder)}
            />
            <FieldError message={errors.sku?.message} />
          </div>

          <div>
            <Label>Stock Quantity</Label>
            <input
              {...register("stock", { valueAsNumber: true })}
              type="number"
              min="0"
              step="1"
              placeholder="0"
              className={cn(inputBase, errors.stock ? inputError : inputBorder)}
            />
            <FieldError message={errors.stock?.message} />
          </div>
        </div>
      </SectionCard>

      {/* Physical Details */}
      <SectionCard title="Physical Details">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
          <div>
            <Label>Material</Label>
            <input
              {...register("material")}
              placeholder="e.g. Solid Oak Wood"
              className={cn(inputBase, inputBorder)}
            />
          </div>

          <div>
            <Label>Color</Label>
            <input
              {...register("color")}
              placeholder="e.g. Warm Walnut"
              className={cn(inputBase, inputBorder)}
            />
          </div>

          <div>
            <Label>Finish</Label>
            <input
              {...register("finish")}
              placeholder="e.g. Matte, Glossy"
              className={cn(inputBase, inputBorder)}
            />
          </div>

          <div>
            <Label>Style</Label>
            <input
              {...register("style")}
              placeholder="e.g. Scandinavian"
              className={cn(inputBase, inputBorder)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <Label>Weight (kg)</Label>
            <input
              {...register("weight", { valueAsNumber: true, setValueAs: (v) => (v === "" || isNaN(Number(v)) ? undefined : Number(v)) })}
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              className={cn(inputBase, inputBorder)}
            />
          </div>

          <div>
            <Label>Dimensions</Label>
            <input
              {...register("dimensions")}
              placeholder="e.g. 60cm x 60cm x 120cm"
              className={cn(inputBase, inputBorder)}
            />
          </div>
        </div>
      </SectionCard>

      {/* Care & Warranty */}
      <SectionCard title="Care & Warranty">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <Label>Care Instructions</Label>
            <textarea
              {...register("careInstructions")}
              rows={4}
              placeholder="e.g. Wipe with a dry cloth…"
              className={cn(inputBase, "resize-none", inputBorder)}
            />
          </div>

          <div>
            <Label>Warranty</Label>
            <textarea
              {...register("warranty")}
              rows={4}
              placeholder="e.g. 2-year manufacturer warranty…"
              className={cn(inputBase, "resize-none", inputBorder)}
            />
          </div>
        </div>
      </SectionCard>

      {/* Media */}
      <SectionCard title="Media">
        <Label required>Product Images</Label>
        <GalleryUploader
          images={images}
          onImagesChange={(urls) => setValue("images", urls, { shouldValidate: true })}
          imagesError={errors.images?.message ?? (errors.images as any)?.root?.message}
        />
        <DiagramUploader
          value={watch("diagramUrl") ?? ""}
          onChange={(url) => setValue("diagramUrl", url)}
        />
      </SectionCard>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-7 py-2.5 rounded-lg text-[14px] font-medium text-white transition-opacity disabled:opacity-60"
          style={{ background: "var(--color-accent)" }}
        >
          {isSubmitting ? "Saving…" : mode === "create" ? "Create Product" : "Save Changes"}
        </button>
        <Link
          href={ROUTES.PRODUCTS.LIST}
          className="px-6 py-2.5 rounded-lg text-[14px] font-medium transition-colors hover:bg-[rgba(26,28,27,0.04)]"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
