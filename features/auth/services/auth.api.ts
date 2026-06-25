import { apiClient } from "@/lib/api/axios";
import type { LoginCredentials, UserResponse } from "@/types";

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<UserResponse> => {
    await apiClient.post("/auth/login", credentials);
    return apiClient.get<UserResponse>("/user/profile").then((r) => r.data);
  },

  getProfile: (): Promise<UserResponse> =>
    apiClient.get<UserResponse>("/user/profile").then((r) => r.data),

  logout: async (): Promise<void> => {
    try {
      await apiClient.post("/auth/logout");
    } catch {
      // Best-effort — server-side cookie clearing; proceed regardless
    }
  },
};
