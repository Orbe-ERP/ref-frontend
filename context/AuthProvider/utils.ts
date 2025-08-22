import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "@/services/api";
import { IUser } from "./types";

// Chave para AsyncStorage
const STORAGE_KEY = "u";

// Salva ou remove usuário do AsyncStorage
export async function setUserAsyncStorage(user: IUser | null) {
  try {
    if (user?.hasAuthenticatedUser) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      await AsyncStorage.removeItem(STORAGE_KEY);
    }
  } catch (error) {
    console.error("Erro ao salvar usuário no AsyncStorage", error);
  }
}

// Recupera usuário do AsyncStorage
export async function getUserAsyncStorage(): Promise<IUser | null> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : null;
  } catch (error) {
    console.error("Erro ao ler usuário do AsyncStorage", error);
    return null;
  }
}

// Requisição de login
export async function LoginRequest(
  email: string,
  password: string
): Promise<{ payload: { token: string; role: string } } | null> {
  try {
    const request = await api.post("signin", { email, password });
    return request.data;
  } catch (error) {
    console.error("Erro no login", error);
    return null;
  }
}

// Valida token do usuário
export async function ValidateToken(): Promise<{ hasAuthenticatedUser: boolean } | null> {
  try {
    const request = await api.post("validateToken");
    return request.data;
  } catch (error) {
    console.error("Erro ao validar token", error);
    return null;
  }
}
