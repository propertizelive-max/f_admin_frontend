import { useAuthStore } from "@/store";
import { hasPermission, canAccess } from "@/lib/auth/permissions";
import type { UserRole } from "@/constants/enums";

export function usePermissions() {
  const user = useAuthStore((s) => s.user);
  const role = user?.role as UserRole | undefined;

  return {
    role,
    can: (permission: Parameters<typeof hasPermission>[1]) =>
      role ? hasPermission(role, permission) : false,
    canAll: (permissions: Parameters<typeof canAccess>[1]) =>
      role ? canAccess(role, permissions) : false,
  };
}
