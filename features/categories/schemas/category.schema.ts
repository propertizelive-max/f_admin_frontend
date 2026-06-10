import { z } from "zod";

const MAX_IMAGE_SIZE_MB = 5;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(150, "Name must be 150 characters or less"),
  description: z
    .string()
    .max(1000, "Description must be 1000 characters or less")
    .optional(),
  isActive: z.boolean(),
  image: z
    .instanceof(File)
    .refine(
      (f) => f.size <= MAX_IMAGE_SIZE_MB * 1024 * 1024,
      `Image must be ${MAX_IMAGE_SIZE_MB}MB or less`
    )
    .refine(
      (f) => ALLOWED_IMAGE_TYPES.includes(f.type),
      "Only JPEG, PNG, WebP, and GIF images are allowed"
    )
    .optional(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
