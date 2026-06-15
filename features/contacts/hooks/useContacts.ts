import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import { contactApi } from "../services/contact.api";
import type { GetContactsParams } from "@/types/backend.types";

export function useContacts(params?: GetContactsParams) {
  return useQuery({
    queryKey: QUERY_KEYS.CONTACTS.LIST(params),
    queryFn: () => contactApi.getAll(params),
    staleTime: 60 * 1000,
    placeholderData: (previousData: any) => previousData,
  });
}
