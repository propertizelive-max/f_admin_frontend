import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import { productApi } from "../services/product.api";
import type { UpdateProductRequest } from "@/types/backend.types";

export function useUpdateProduct(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProductRequest) => productApi.update(id, data),
    onSuccess: (updated) => {
      queryClient.setQueryData(QUERY_KEYS.PRODUCTS.DETAIL(id), updated);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.ALL });
    },
  });
}
