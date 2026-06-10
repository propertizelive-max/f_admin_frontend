import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import { orderApi } from "../services/order.api";
import type { GetAdminOrdersParams } from "@/types/backend.types";

export function useOrders(params?: GetAdminOrdersParams) {
  return useQuery({
    queryKey: QUERY_KEYS.ORDERS.LIST(params),
    queryFn: () => orderApi.getAll(params),
    staleTime: 60 * 1000,
    placeholderData: (previousData: any) => previousData,
  });
}
