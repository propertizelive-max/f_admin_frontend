import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import env from "@/config/env";

export const apiClient = axios.create({
  baseURL: env.API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);
