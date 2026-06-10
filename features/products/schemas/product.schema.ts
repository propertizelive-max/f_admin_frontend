import { z } from "zod";
import { ProductStatus } from "@/constants/enums";

export const productSchema = z
  .object({
    title: z
      .string()
      .min(1, "Product title is required")
      .max(200, "Title must be 200 characters or less"),
    description: z.string().optional(),
    categoryId: z.string().min(1, "Category is required"),
    price: z
      .number({ message: "Price is required" })
      .positive("Price must be greater than 0"),
    discountPrice: z.number().positive("Discount price must be greater than 0").optional(),
    stock: z.number().int().min(0, "Stock cannot be negative").optional(),
    sku: z.string().max(100).optional(),
    material: z.string().max(100).optional(),
    status: z.nativeEnum(ProductStatus).optional(),
    color: z.string().max(100).optional(),
    dimensions: z.string().max(100).optional(),
    weight: z.number().positive().optional(),
    finish: z.string().max(100).optional(),
    style: z.string().max(100).optional(),
    careInstructions: z.string().optional(),
    warranty: z.string().max(200).optional(),
    images: z
      .array(z.string().min(1))
      .min(1, "At least one image is required")
      .max(10, "Maximum 10 images allowed"),
    diagramUrl: z.string().optional(),
  })
  .refine((data) => !data.discountPrice || data.discountPrice < data.price, {
    message: "Discount price must be less than the regular price",
    path: ["discountPrice"],
  });

export type ProductFormValues = z.infer<typeof productSchema>;
