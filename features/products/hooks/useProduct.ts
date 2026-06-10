import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import { productApi } from "../services/product.api";
import type { ProductResponse } from "@/types/backend.types";

export function useProduct(id: string) {
  return useQuery<ProductResponse>({
    queryKey: QUERY_KEYS.PRODUCTS.DETAIL(id),
    queryFn: () => productApi.getById(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
}
