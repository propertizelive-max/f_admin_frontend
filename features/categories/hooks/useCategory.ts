import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import { categoryApi } from "../services/category.api";
import type { CategoryResponse } from "@/types/backend.types";

export function useCategory(id: string) {
  return useQuery<CategoryResponse>({
    queryKey: QUERY_KEYS.CATEGORIES.DETAIL(id),
    queryFn: () => categoryApi.getById(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
}
