import type { CreateCategoryRequest, UpdateCategoryRequest } from "@/types/backend.types";

export function buildCategoryFormData(
  data: CreateCategoryRequest | UpdateCategoryRequest
): FormData {
  const formData = new FormData();

  if ("name" in data && data.name !== undefined) {
    formData.append("name", data.name);
  }
  if (data.description !== undefined) {
    formData.append("description", data.description);
  }
  if ("isActive" in data && data.isActive !== undefined) {
    formData.append("isActive", String(data.isActive));
  }
  if (data.image instanceof File) {
    formData.append("image", data.image);
  }

  return formData;
}
