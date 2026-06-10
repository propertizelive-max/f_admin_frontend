import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import { analyticsApi } from "../services/analytics.api";
import type { AnalyticsDateRange } from "../types/analytics.types";

export function useSalesAnalytics(range?: AnalyticsDateRange) {
  return useQuery({
    queryKey: [...QUERY_KEYS.ANALYTICS.SALES, range],
    queryFn: () => analyticsApi.getSales(range),
    staleTime: 1000 * 60 * 5,
  });
}
