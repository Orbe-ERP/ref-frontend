import { getUserAsyncStorage } from "@/context/AuthProvider/utils";
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3001/",
});

api.interceptors.request.use(
  async (config) => {
    try {
      const user = await getUserAsyncStorage();
      config.headers.Authorization = user?.token ? `Bearer ${user.token}` : "";
    } catch (error) {
      console.error("Erro ao obter token do usuário:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
