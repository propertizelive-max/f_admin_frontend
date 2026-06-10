import { apiClient } from "@/lib/api/axios";
import type { MediaResponse, BackendPaginatedResponse, GetMediaParams } from "@/types/backend.types";

export const mediaApi = {
  async uploadSingle(
    file: File,
    onUploadProgress?: (progressPercent: number) => void
  ): Promise<MediaResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await apiClient.post<MediaResponse>("/media/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: onUploadProgress
        ? (progressEvent) => {
            const percent = progressEvent.total
              ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
              : 0;
            onUploadProgress(percent);
          }
        : undefined,
    });
    return data;
  },

  async uploadBulk(files: File[]): Promise<MediaResponse[]> {
    if (files.length > 10) throw new Error("Cannot upload more than 10 files at once");

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const { data } = await apiClient.post<MediaResponse[]>("/media/upload/bulk", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  async getAll(params: GetMediaParams = {}): Promise<BackendPaginatedResponse<MediaResponse>> {
    const { data } = await apiClient.get<BackendPaginatedResponse<MediaResponse>>("/media", { params });
    return data;
  },

  async getById(mediaId: string): Promise<MediaResponse> {
    const { data } = await apiClient.get<MediaResponse>(`/media/${mediaId}`);
    return data;
  },

  async delete(mediaId: string): Promise<void> {
    await apiClient.delete(`/media/${mediaId}`);
  },
};
