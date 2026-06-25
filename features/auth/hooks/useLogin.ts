import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth.store";
import { UserRole } from "@/constants/enums";
import { Role } from "@/types";
import type { LoginCredentials } from "@/types";
import { authApi } from "../services/auth.api";

export function useLogin() {
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const user = await authApi.login(credentials);
      if (user.role !== Role.ADMIN && user.role !== Role.MANAGER) {
        throw new Error("Access denied. This account does not have admin privileges.");
      }
      return user;
    },
    onSuccess: (user) => {
      useAuthStore.getState().setAuth({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as unknown as UserRole,
        avatar: user.picture ?? undefined,
        createdAt: user.createdAt,
      });
    },
  });
}
