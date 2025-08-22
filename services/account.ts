import { api } from "./api";

export interface AccountRegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export async function registerAccount(data: AccountRegisterData): Promise<AuthResponse> {
  try {
    const response = await api.post<AuthResponse>("/signup", data);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Erro ao registrar conta. Verifique os dados e tente novamente.";
    throw new Error(errorMessage);
  }
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  try {
    const response = await api.post<AuthResponse>("/signin", { email, password });
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Erro ao fazer login. Verifique suas credenciais.";
    throw new Error(errorMessage);
  }
}