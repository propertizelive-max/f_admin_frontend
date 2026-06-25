"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth.store";
import { UserRole } from "@/constants/enums";
import { Role } from "@/types";
import { authApi } from "../services/auth.api";

export function useAuthBootstrap() {
  const router = useRouter();
  const { setAuth, clearAuth } = useAuthStore();

  const { data, isError, isSuccess } = useQuery({
    queryKey: ["auth", "profile"],
    queryFn: authApi.getProfile,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (isError) {
      clearAuth();
      router.replace("/login");
      return;
    }

    if (isSuccess && data) {
      if (data.role !== Role.ADMIN && data.role !== Role.MANAGER) {
        clearAuth();
        router.replace("/login");
        return;
      }

      setAuth({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role as unknown as UserRole,
        avatar: data.picture ?? undefined,
        createdAt: data.createdAt,
      });
    }
  }, [isError, isSuccess, data, clearAuth, setAuth, router]);
}
