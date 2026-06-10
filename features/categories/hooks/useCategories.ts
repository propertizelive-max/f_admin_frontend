import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import { categoryApi } from "../services/category.api";
import type { GetCategoriesParams } from "@/types/backend.types";

export function useCategories(params?: GetCategoriesParams) {
  return useQuery({
    queryKey: QUERY_KEYS.CATEGORIES.LIST(params),
    queryFn: () => categoryApi.getAll(params),
    staleTime: 3 * 60 * 1000,
    placeholderData: (previousData: any) => previousData,
  });
}
