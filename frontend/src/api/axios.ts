import axios, { AxiosError } from "axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { API_BASE_URL } from '@/config'

const MAX_RETRY = 1;

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
});

const refreshApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError & { config?: any }) => {
    const originalRequest = err.config;

    if (err.code === "ECONNABORTED") {
      console.error("Request timed out");
      return Promise.reject(err);
    }

    if (err.response?.status === 401) {
      const token = useAuthStore.getState().accessToken;

      if (!token) {
        useAuthStore.getState().logout();
        return Promise.reject(err);
      }

      if (!originalRequest._retryCount) originalRequest._retryCount = 0;

      if (originalRequest._retryCount >= MAX_RETRY) {
        return Promise.reject(err);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retryCount += 1;
      isRefreshing = true;

      try {
        const { data } = await refreshApi.post("/admin/refresh");
        useAuthStore.getState().setAccessToken(data.access_token);
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        processQueue(null, data.access_token);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(err);
  }
);
