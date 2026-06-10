import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mediaApi } from "../services/media.api";
import type { MediaResponse, BackendPaginatedResponse, GetMediaParams } from "@/types/backend.types";

const MEDIA_KEYS = {
  ALL: ["media"] as const,
  LIST: (params?: GetMediaParams) => ["media", "list", params] as const,
  DETAIL: (id: string) => ["media", id] as const,
};

export function useMediaList(params: GetMediaParams = {}) {
  return useQuery<BackendPaginatedResponse<MediaResponse>, Error>({
    queryKey: MEDIA_KEYS.LIST(params),
    queryFn: () => mediaApi.getAll(params),
    staleTime: 2 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
}

export function useMediaItem(mediaId: string) {
  return useQuery<MediaResponse, Error>({
    queryKey: MEDIA_KEYS.DETAIL(mediaId),
    queryFn: () => mediaApi.getById(mediaId),
    staleTime: 10 * 60 * 1000,
    enabled: Boolean(mediaId),
  });
}

export function useUploadFile() {
  const queryClient = useQueryClient();

  return useMutation<
    MediaResponse,
    Error,
    File | { file: File; onProgress?: (percent: number) => void }
  >({
    mutationFn: (input) => {
      if (input instanceof File) return mediaApi.uploadSingle(input);
      return mediaApi.uploadSingle(input.file, input.onProgress);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEDIA_KEYS.ALL });
    },
  });
}

export function useUploadBulk() {
  const queryClient = useQueryClient();

  return useMutation<MediaResponse[], Error, File[]>({
    mutationFn: (files) => mediaApi.uploadBulk(files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEDIA_KEYS.ALL });
    },
  });
}

export function useDeleteMedia() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (mediaId) => mediaApi.delete(mediaId),
    onSuccess: (_, mediaId) => {
      queryClient.removeQueries({ queryKey: MEDIA_KEYS.DETAIL(mediaId) });
      queryClient.invalidateQueries({ queryKey: MEDIA_KEYS.ALL });
    },
  });
}
