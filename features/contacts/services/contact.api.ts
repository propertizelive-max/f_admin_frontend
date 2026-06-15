import { apiClient } from "@/lib/api/axios";
import type {
  ContactResponse,
  GetContactsParams,
  BackendPaginatedResponse,
} from "@/types/backend.types";

export const contactApi = {
  async getAll(
    params: GetContactsParams = {}
  ): Promise<BackendPaginatedResponse<ContactResponse>> {
    const { data } = await apiClient.get("/contact", { params });
    return data;
  },

  async getById(id: string): Promise<ContactResponse> {
    const { data } = await apiClient.get<ContactResponse>(`/contact/${id}`);
    return data;
  },
};
