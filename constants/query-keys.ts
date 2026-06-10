export const QUERY_KEYS = {
  ANALYTICS: {
    OVERVIEW: ["analytics", "overview"] as const,
    SALES: ["analytics", "sales"] as const,
    PRODUCTS: ["analytics", "products"] as const,
  },

  CATEGORIES: {
    ALL: ["categories"] as const,
    LIST: (params?: object) => ["categories", "list", params] as const,
    DETAIL: (id: string) => ["categories", id] as const,
  },

  PRODUCTS: {
    ALL: ["products"] as const,
    LIST: (params?: object) => ["products", "list", params] as const,
    DETAIL: (id: string) => ["products", id] as const,
  },

  ORDERS: {
    ALL: ["orders"] as const,
    LIST: (params?: object) => ["orders", "list", params] as const,
    DETAIL: (id: string) => ["orders", id] as const,
    ITEMS: (id: string) => ["orders", id, "items"] as const,
  },
} as const;
