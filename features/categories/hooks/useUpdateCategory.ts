import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import { categoryApi } from "../services/category.api";
import type { UpdateCategoryRequest } from "@/types/backend.types";

export function useUpdateCategory(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCategoryRequest) => categoryApi.update(id, data),
    onSuccess: (updatedCategory) => {
      queryClient.setQueryData(QUERY_KEYS.CATEGORIES.DETAIL(id), updatedCategory);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES.ALL });
    },
  });
}
