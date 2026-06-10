import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth.store";
import { UserRole } from "@/constants/enums";
import type { LoginCredentials, AuthTokens, User } from "@/types";
import { authApi } from "../services/auth.api";

export function useLogin() {
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (data) => {
      // Flat localStorage keys — read by axios request interceptor
      localStorage.setItem("accessToken", data.accessToken);
      if (data.refreshToken) localStorage.setItem("refreshToken", data.refreshToken);

      // Cookie — read by Next.js middleware (Edge Runtime cannot access localStorage)
      document.cookie = `accessToken=${data.accessToken}; path=/; SameSite=Strict`;

      // Zustand auth store — drives isAuthenticated + usePermissions
      const tokens: AuthTokens = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken ?? "",
      };
      const user: User = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: UserRole.ADMIN,
        createdAt: new Date().toISOString(),
      };
      useAuthStore.getState().setAuth(user, tokens);
    },
  });
}
