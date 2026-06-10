"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { UserRole } from "@/constants/enums";
import type { User, AuthTokens } from "@/types";
import { ROUTES } from "@/constants/routes";

function decodeJwtPayload(token: string): Record<string, unknown> {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    return JSON.parse(atob(padded));
  } catch {
    return {};
  }
}

export function useGoogleCallback(token: string | null) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("No token received from Google authentication.");
      return;
    }

    const payload = decodeJwtPayload(token);

    localStorage.setItem("accessToken", token);
    document.cookie = `accessToken=${token}; path=/; SameSite=Strict`;

    const user: User = {
      id: (payload.sub as string) ?? (payload.id as string) ?? "",
      name: (payload.name as string) ?? (payload.email as string) ?? "Admin",
      email: (payload.email as string) ?? "",
      role: UserRole.ADMIN,
      createdAt: new Date().toISOString(),
    };

    const tokens: AuthTokens = {
      accessToken: token,
      refreshToken: "",
    };

    useAuthStore.getState().setAuth(user, tokens);
    router.replace(ROUTES.DASHBOARD);
  }, [token, router]);

  return { error };
}
