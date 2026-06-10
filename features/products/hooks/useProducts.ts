import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import { productApi } from "../services/product.api";
import type { GetProductsParams } from "@/types/backend.types";

export function useProducts(params?: GetProductsParams) {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCTS.LIST(params),
    queryFn: () => productApi.getAll(params),
    staleTime: 3 * 60 * 1000,
    placeholderData: (previousData: any) => previousData,
  });
}
