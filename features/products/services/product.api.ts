import { apiClient } from "@/lib/api/axios";
import type {
  ProductResponse,
  BackendPaginatedResponse,
  GetProductsParams,
  CreateProductRequest,
  UpdateProductRequest,
} from "@/types/backend.types";

export const productApi = {
  async create(data: CreateProductRequest): Promise<ProductResponse> {
    const { data: res } = await apiClient.post<ProductResponse>("/products", data);
    return res;
  },

  async getAll(params: GetProductsParams = {}): Promise<BackendPaginatedResponse<ProductResponse>> {
    const { data } = await apiClient.get<BackendPaginatedResponse<ProductResponse>>(
      "/products",
      { params }
    );
    return data;
  },

  async getById(id: string): Promise<ProductResponse> {
    const { data } = await apiClient.get<ProductResponse>(`/products/${id}`);
    return data;
  },

  async update(id: string, data: UpdateProductRequest): Promise<ProductResponse> {
    const { data: res } = await apiClient.patch<ProductResponse>(`/products/${id}`, data);
    return res;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/products/${id}`);
  },

  async toggleFeatured(id: string): Promise<ProductResponse> {
    const { data } = await apiClient.patch<ProductResponse>(`/products/${id}/featured`);
    return data;
  },

  async toggleActive(id: string): Promise<ProductResponse> {
    const { data } = await apiClient.patch<ProductResponse>(`/products/${id}/active`);
    return data;
  },
};
