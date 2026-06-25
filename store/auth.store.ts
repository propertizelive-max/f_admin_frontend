import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (user: User) => void;
  clearAuth: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setAuth: (user) =>
        set({ user, isAuthenticated: true }),

      clearAuth: () =>
        set({ user: null, isAuthenticated: false }),

      updateUser: (partial) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partial } : null,
        })),
    }),
    { name: "auth-store" }
  )
);
