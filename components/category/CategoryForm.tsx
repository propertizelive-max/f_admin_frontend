"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { ROUTES } from "@/constants/routes";
import {
  categorySchema,
  type CategoryFormValues,
} from "@/features/categories/schemas/category.schema";

interface CategoryFormProps {
  defaultValues?: { name?: string; description?: string; isActive?: boolean };
  existingImageUrl?: string;
  onSubmit: (values: CategoryFormValues) => void;
  isSubmitting?: boolean;
  mode: "create" | "edit";
}

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

const inputBase =
  "w-full px-3.5 py-2.5 text-[14px] rounded-lg border outline-none transition-colors bg-white text-[#1a1c1b] placeholder:text-[#9a9b9b]";
const inputBorder = "border-[rgba(26,28,27,0.15)] focus:border-[#8b6b47]";
const inputError = "border-red-300 focus:border-red-400";

interface ImageFieldProps {
  value: File | undefined;
  existingUrl?: string;
  onChange: (file: File | undefined) => void;
  error?: string;
}

function ImageField({ value, existingUrl, onChange, error }: ImageFieldProps) {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onChange(file);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function handleRemove() {
    setPreviewUrl(null);
    onChange(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const displayUrl = previewUrl ?? existingUrl ?? null;
  const hasImage = !!displayUrl;

  return (
    <div>
      <Label>Image</Label>

      {hasImage ? (
        <div className="flex items-start gap-4">
          <div
            className="w-32 h-32 rounded-xl overflow-hidden border shrink-0"
            style={{ borderColor: "var(--color-border)", background: "#f0ece5" }}
          >
            <img src={displayUrl!} alt="Preview" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col gap-2 pt-1">
            <p className="text-[13px] font-medium text-[#1a1c1b]">
              {value ? value.name : "Current image"}
            </p>
            <p className="text-[11px]" style={{ color: "var(--color-text-muted)" }}>
              JPG, PNG, WEBP — up to 5 MB
            </p>
            <div className="flex gap-2 mt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors"
                style={{ background: "var(--color-accent-light)", color: "var(--color-accent)" }}
              >
                Replace
              </button>
              <button
                type="button"
                onClick={handleRemove}
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
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={cn(
            "flex flex-col items-center justify-center gap-2.5 w-full rounded-xl border-2 border-dashed py-10 cursor-pointer transition-all select-none",
            dragOver
              ? "border-[#8b6b47] bg-[rgba(139,107,71,0.04)]"
              : error
              ? "border-red-300 bg-red-50/30"
              : "border-[rgba(26,28,27,0.12)] hover:border-[#8b6b47] hover:bg-[rgba(139,107,71,0.02)]"
          )}
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: dragOver ? "var(--color-accent-light)" : "rgba(26,28,27,0.05)" }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 13V5M7 8l3-3 3 3"
                stroke={dragOver ? "var(--color-accent)" : "var(--color-text-muted)"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 14v1a2 2 0 002 2h10a2 2 0 002-2v-1"
                stroke={dragOver ? "var(--color-accent)" : "var(--color-text-muted)"}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-[13px] font-medium text-[#1a1c1b]">
              {dragOver ? "Drop image here" : "Click or drag & drop"}
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: "var(--color-text-muted)" }}>
              JPG, PNG, WEBP — up to 5 MB
            </p>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />

      <FieldError message={error} />
    </div>
  );
}

export function CategoryForm({
  defaultValues,
  existingImageUrl,
  onSubmit,
  isSubmitting,
  mode,
}: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      isActive: true,
      ...defaultValues,
    },
  });

  const imageValue = watch("image");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <Label required>Category Name</Label>
        <input
          {...register("name")}
          placeholder="e.g. Living Room Furniture"
          className={cn(inputBase, errors.name ? inputError : inputBorder)}
        />
        <FieldError message={errors.name?.message} />
      </div>

      <div>
        <Label>Description</Label>
        <textarea
          {...register("description")}
          rows={4}
          placeholder="Describe what products belong to this category…"
          className={cn(inputBase, "resize-none", errors.description ? inputError : inputBorder)}
        />
        <FieldError message={errors.description?.message} />
      </div>

      <ImageField
        value={imageValue}
        existingUrl={existingImageUrl}
        onChange={(file) => setValue("image", file, { shouldValidate: true })}
        error={errors.image?.message}
      />

      <div>
        <Label>Status</Label>
        <div className="relative">
          <select
            value={watch("isActive") ? "true" : "false"}
            onChange={(e) => setValue("isActive", e.target.value === "true", { shouldValidate: false })}
            className={cn(inputBase, inputBorder, "pr-9 appearance-none cursor-pointer")}
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <span
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2"
            style={{ color: "var(--color-text-muted)" }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 rounded-lg text-[14px] font-medium text-white transition-opacity disabled:opacity-60"
          style={{ background: "var(--color-accent)" }}
        >
          {isSubmitting ? "Saving…" : mode === "create" ? "Create Category" : "Save Changes"}
        </button>
        <Link
          href={ROUTES.CATEGORIES.LIST}
          className="px-6 py-2.5 rounded-lg text-[14px] font-medium transition-colors hover:bg-[rgba(26,28,27,0.04)]"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
