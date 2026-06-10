import { apiClient } from "@/lib/api/axios";
import { buildCategoryFormData } from "@/lib/api/formData";
import type {
  CategoryResponse,
  BackendPaginatedResponse,
  GetCategoriesParams,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/types/backend.types";

export const categoryApi = {
  async create(data: CreateCategoryRequest): Promise<CategoryResponse> {
    const { data: res } = await apiClient.post<CategoryResponse>(
      "/categories",
      buildCategoryFormData(data),
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return res;
  },

  async getAll(params: GetCategoriesParams = {}): Promise<BackendPaginatedResponse<CategoryResponse>> {
    const { data } = await apiClient.get<BackendPaginatedResponse<CategoryResponse>>(
      "/categories",
      { params }
    );
    return data;
  },

  async getById(id: string): Promise<CategoryResponse> {
    const { data } = await apiClient.get<CategoryResponse>(`/categories/${id}`);
    return data;
  },

  async update(id: string, data: UpdateCategoryRequest): Promise<CategoryResponse> {
    const { data: res } = await apiClient.patch<CategoryResponse>(
      `/categories/${id}`,
      buildCategoryFormData(data),
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return res;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/categories/${id}`);
  },
};
