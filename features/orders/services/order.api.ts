import { apiClient } from "@/lib/api/axios";
import type {
  AdminOrderResponse,
  BackendPaginatedResponse,
  GetAdminOrdersParams,
  OrderItemsResponse,
  UpdateOrderStatusRequest,
} from "@/types/backend.types";

export const orderApi = {
  async getAll(
    params: GetAdminOrdersParams = {}
  ): Promise<BackendPaginatedResponse<AdminOrderResponse> & { totalPages: number }> {
    const { data } = await apiClient.get("/admin/orders", { params });
    return data;
  },

  async getById(id: string): Promise<AdminOrderResponse> {
    const { data } = await apiClient.get<AdminOrderResponse>(`/admin/orders/${id}`);
    return data;
  },

  async updateStatus(id: string, payload: UpdateOrderStatusRequest): Promise<AdminOrderResponse> {
    const { data } = await apiClient.patch<AdminOrderResponse>(
      `/admin/orders/${id}/status`,
      payload
    );
    return data;
  },

  async getItems(orderId: string): Promise<OrderItemsResponse> {
    const { data } = await apiClient.get<OrderItemsResponse>(`/admin/orders/${orderId}/items`);
    return data;
  },
};
