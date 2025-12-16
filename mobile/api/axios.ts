import axios, { AxiosError } from "axios";
import { useAuthStore } from '@/utils/auth-store'

export const api = axios.create({
  baseURL: 'http://10.251.145.226:3000/api/v1',
  withCredentials: true,
  timeout: 10000,
});

//10.251.145.226

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});