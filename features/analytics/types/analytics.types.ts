// ── Dashboard Analytics (/admin/analytics/dashboard) ────────────────────────

export interface DashboardSalesMetrics {
  totalRevenue: number;
  todayRevenue: number;
  monthlyRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
}

export interface DashboardOrderMetrics {
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

export interface DashboardUserMetrics {
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
  repeatCustomers: number;
}

export interface DashboardAnalytics {
  sales: DashboardSalesMetrics;
  orders: DashboardOrderMetrics;
  users: DashboardUserMetrics;
}

// ── Sales Analytics (/admin/analytics/sales) ─────────────────────────────────

export interface RevenueTrendPoint {
  date: string;
  revenue: number;
  orderCount: number;
  averageOrderValue: number;
}

export interface SalesAnalytics {
  revenueTrend: RevenueTrendPoint[];
  totalSales: number;
}

// ── Product Analytics (/admin/analytics/products) ────────────────────────────

export interface BestSellingProduct {
  productId: string;
  title: string;
  totalSold: number;
  revenue: number;
}

export interface LowStockProduct {
  productId: string;
  title: string;
  stock: number;
}

export interface ProductAnalytics {
  bestSellingProducts: BestSellingProduct[];
  lowStockProducts: LowStockProduct[];
  outOfStockProducts: LowStockProduct[];
}

// ── Shared ────────────────────────────────────────────────────────────────────

export interface AnalyticsDateRange {
  from?: string;
  to?: string;
}
