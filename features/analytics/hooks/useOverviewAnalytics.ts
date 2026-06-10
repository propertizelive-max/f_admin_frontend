import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import { analyticsApi } from "../services/analytics.api";

export function useOverviewAnalytics() {
  return useQuery({
    queryKey: QUERY_KEYS.ANALYTICS.OVERVIEW,
    queryFn: () => analyticsApi.getDashboard(),
    staleTime: 1000 * 60 * 2,
  });
}
