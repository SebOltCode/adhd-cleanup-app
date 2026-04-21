import axios, { AxiosInstance } from "axios";
import { useMemo } from "react";
import { useAuth } from "../providers/AuthProvider";

export const useApiClient = (): AxiosInstance => {
  const { apiBaseUrl, token } = useAuth();

  return useMemo(() => {
    const instance = axios.create({
      baseURL: apiBaseUrl,
      timeout: 10000,
    });

    instance.interceptors.request.use((config) => {
      if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return instance;
  }, [apiBaseUrl, token]);
};
