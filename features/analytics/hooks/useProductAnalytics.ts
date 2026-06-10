import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import { analyticsApi } from "../services/analytics.api";

export function useProductAnalytics() {
  return useQuery({
    queryKey: QUERY_KEYS.ANALYTICS.PRODUCTS,
    queryFn: () => analyticsApi.getProducts(),
    staleTime: 1000 * 60 * 5,
  });
}
