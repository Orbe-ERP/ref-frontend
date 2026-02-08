import { getUserAsyncStorage } from "@/context/AuthProvider/utils";
import axios from "axios";

let onLogout: (() => Promise<void>) | null = null;

export const setLogoutHandler = (handler: () => Promise<void>) => {
  onLogout = handler;
};

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

api.interceptors.request.use(
  async (config) => {
    try {
      const user = await getUserAsyncStorage();
      config.headers.Authorization = user?.token ? `Bearer ${user.token}` : "";
    } catch (error) {
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      console.warn("Token expirado ou inválido. Efetuando logout...");

      if (onLogout) {
        await onLogout();
      }
    }

    return Promise.reject(error);
  },
);
