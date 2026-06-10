import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import { productApi } from "../services/product.api";

export function useToggleActive(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => productApi.toggleActive(productId),
    onSuccess: (updated) => {
      queryClient.setQueryData(QUERY_KEYS.PRODUCTS.DETAIL(productId), updated);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.ALL });
    },
  });
}
