import { AxiosError } from "axios";
import type { BackendHttpError, BackendValidationError } from "@/types/backend.types";

export function extractApiErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as BackendHttpError | BackendValidationError | undefined;
    if (!data) return "Network error. Please check your connection.";

    if (Array.isArray(data.message)) {
      return data.message.join(". ");
    }
    return data.message ?? "An unexpected error occurred.";
  }
  return "An unexpected error occurred.";
}
