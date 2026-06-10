import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import { orderApi } from "../services/order.api";
import type { UpdateOrderStatusRequest } from "@/types/backend.types";

export function useUpdateOrderStatus(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateOrderStatusRequest) => orderApi.updateStatus(id, payload),
    onSuccess: (updatedOrder) => {
      queryClient.setQueryData(QUERY_KEYS.ORDERS.DETAIL(id), updatedOrder);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS.ALL });
    },
  });
}
