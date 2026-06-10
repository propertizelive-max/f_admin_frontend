import { apiClient } from "@/lib/api/axios";
import type { LoginCredentials } from "@/types";

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export const authApi = {
  login: (credentials: LoginCredentials): Promise<LoginResponse> =>
    apiClient.post<LoginResponse>("/user/signin", credentials).then((r) => r.data),
};
