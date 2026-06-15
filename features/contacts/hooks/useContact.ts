import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import { contactApi } from "../services/contact.api";

export function useContact(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.CONTACTS.DETAIL(id),
    queryFn: () => contactApi.getById(id),
    staleTime: 60 * 1000,
    enabled: !!id,
  });
}
