import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import { orderApi } from "../services/order.api";
import type { AdminOrderResponse } from "@/types/backend.types";

export function useOrder(id: string) {
  return useQuery<AdminOrderResponse>({
    queryKey: QUERY_KEYS.ORDERS.DETAIL(id),
    queryFn: () => orderApi.getById(id),
    staleTime: 2 * 60 * 1000,
    enabled: !!id,
  });
}
