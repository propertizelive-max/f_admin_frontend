import { UserRole } from "@/constants/enums";

type Permission =
  | "analytics:read"
  | "categories:read"
  | "categories:write"
  | "categories:delete"
  | "products:read"
  | "products:write"
  | "products:delete"
  | "orders:read"
  | "orders:write"
  | "users:read"
  | "users:write";

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    "analytics:read",
    "categories:read", "categories:write", "categories:delete",
    "products:read", "products:write", "products:delete",
    "orders:read", "orders:write",
    "users:read", "users:write",
  ],
  [UserRole.MANAGER]: [
    "analytics:read",
    "categories:read",
    "products:read", "products:write",
    "orders:read", "orders:write",
  ],
  [UserRole.USER]: [],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function canAccess(role: UserRole, permissions: Permission[]): boolean {
  return permissions.every((p) => hasPermission(role, p));
}
