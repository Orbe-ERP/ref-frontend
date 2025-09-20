import React, { createContext, useState, useEffect, useCallback, useContext } from "react";
import { IContext, IAuthProvider, IUser } from "./types";
import {
  LoginRequest,
  ValidateToken,
  getUserAsyncStorage,
  setUserAsyncStorage,
} from "./utils";
import useRestaurant from "@/hooks/useRestaurant";

export const AuthContext = createContext<IContext>({} as IContext);

export const AuthProvider = ({ children }: IAuthProvider) => {

  const {selectRestaurant} = useRestaurant()

  const [user, setUser] = useState<IUser | null>({
    hasAuthenticatedUser: false,
  } as IUser);
  const [loading, setLoading] = useState(true);

  // Inicializa usuário do AsyncStorage e valida token
  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      const storedUser = await getUserAsyncStorage();

      if (storedUser) {
        const isTokenValid = await validateToken(storedUser.token);
        if (isTokenValid) {
          setUser(storedUser);
        } else {
          await logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const validateToken = useCallback(async (token?: string) => {
    if (!token) return false;
    try {
      const response = await ValidateToken();
      return response?.hasAuthenticatedUser ?? false;
    } catch (error) {
      console.error("Token inválido ou erro de autenticação", error);
      return false;
    }
  }, []);

  const authenticate = useCallback(async (email: string, password: string) => {
    try {
      const response = await LoginRequest(email, password);
      if (!response || !response.payload) return false;

      const payload: IUser = {
        role: response.payload.role,
        hasAuthenticatedUser: true,
        token: response.payload.token,
        defaultRestaurantId: response.payload.defaultRestaurantId,
        restaurantName: response.payload.restaurantName,
      };

      setUser(payload);
      await setUserAsyncStorage(payload);

          selectRestaurant({
        id: payload.defaultRestaurantId!,
        name: payload.restaurantName!,
      });


      return true;
    } catch (error) {
      console.error("Erro ao autenticar", error);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    await setUserAsyncStorage(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, authenticate, logout, validateToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};
