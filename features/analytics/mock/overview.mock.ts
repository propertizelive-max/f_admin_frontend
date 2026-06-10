export const MOCK_OVERVIEW_METRICS = {
  totalRevenue: 1245200,
  totalOrders: 1847,
  totalProducts: 312,
  totalCategories: 24,
  totalCustomers: 8924,
  pendingOrders: 142,
  completedOrders: 1543,
  revenueGrowth: 18.4,
  ordersGrowth: 12.7,
};

const today = new Date();
export const MOCK_REVENUE_TREND = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(today);
  d.setDate(d.getDate() - (29 - i));
  const base = 38000 + Math.sin(i * 0.4) * 8000;
  const trend = i * 600;
  const noise = (Math.random() - 0.3) * 5000;
  return {
    date: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    revenue: Math.round(Math.max(base + trend + noise, 20000)),
  };
});

export const MOCK_ORDERS_TREND = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(today);
  d.setDate(d.getDate() - (29 - i));
  const base = 55 + Math.sin(i * 0.35) * 12;
  const trend = i * 0.8;
  const noise = (Math.random() - 0.4) * 10;
  return {
    date: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    orders: Math.round(Math.max(base + trend + noise, 20)),
  };
});

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const MOCK_MONTHLY_SALES = months.map((month, i) => ({
  month,
  sales: Math.round(85000 + Math.sin(i * 0.55) * 25000 + i * 8000 + Math.random() * 12000),
  orders: Math.round(140 + Math.sin(i * 0.55) * 40 + i * 12 + Math.random() * 20),
}));
