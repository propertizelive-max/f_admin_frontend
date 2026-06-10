export const ROUTES = {
  LOGIN: "/login",
  DASHBOARD: "/analytics/overview",

  ANALYTICS: {
    OVERVIEW: "/analytics/overview",
    SALES: "/analytics/sales",
    PRODUCTS: "/analytics/products",
  },

  CATEGORIES: {
    LIST: "/categories",
    CREATE: "/categories/create",
    EDIT: (id: string) => `/categories/${id}/edit`,
    VIEW: (id: string) => `/categories/${id}`,
  },

  PRODUCTS: {
    LIST: "/products",
    CREATE: "/products/create",
    EDIT: (id: string) => `/products/${id}/edit`,
    DETAILS: (id: string) => `/products/${id}`,
  },

  ORDERS: {
    LIST: "/orders",
    DETAILS: (id: string) => `/orders/${id}`,
  },
} as const;
