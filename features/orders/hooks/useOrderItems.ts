import { useQuery, UseQueryResult } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { orderApi } from "@/features/orders/services/order.api";
import { QUERY_KEYS } from "@/constants/query-keys";
import type { OrderItemsResponse } from "@/types/backend.types";

export const useOrderItems = (
  orderId: string | undefined
): UseQueryResult<OrderItemsResponse, AxiosError> => {
  return useQuery({
    queryKey: QUERY_KEYS.ORDERS.ITEMS(orderId!),
    queryFn: () => orderApi.getItems(orderId!),
    enabled: !!orderId,
    staleTime: 1000 * 60 * 2,
    retry: (failureCount, error) => {
      const status = (error as AxiosError).response?.status;
      if (status === 401 || status === 403 || status === 404) return false;
      return failureCount < 2;
    },
  });
};
