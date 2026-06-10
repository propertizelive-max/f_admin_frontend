import { apiClient } from "@/lib/api/axios";
import type {
  DashboardAnalytics,
  SalesAnalytics,
  ProductAnalytics,
  AnalyticsDateRange,
} from "../types/analytics.types";

export const analyticsApi = {
  getDashboard: () =>
    apiClient.get<DashboardAnalytics>("/admin/analytics/dashboard").then((r) => r.data),

  getSales: (params?: AnalyticsDateRange) =>
    apiClient.get<SalesAnalytics>("/admin/analytics/sales", { params }).then((r) => r.data),

  getProducts: () =>
    apiClient.get<ProductAnalytics>("/admin/analytics/products").then((r) => r.data),
};
