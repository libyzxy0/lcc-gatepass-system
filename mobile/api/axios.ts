import axios, { AxiosError } from "axios";
import { useAuthStore } from '@/utils/auth-store'
import { API_BASE } from '@/constants/api-base'

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});