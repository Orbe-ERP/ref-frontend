import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { IContext, IAuthProvider, IUser, AuthResult } from "./types";
import {
  LoginRequest,
  ValidateToken,
  getUserAsyncStorage,
  setUserAsyncStorage,
} from "./utils";
import useRestaurant from "@/hooks/useRestaurant";
import { getRestaurantById } from "@/services/restaurant";
import axios from "axios";

export const AuthContext = createContext<IContext>({} as IContext);

export const AuthProvider = ({ children }: IAuthProvider) => {
  const { selectRestaurant } = useRestaurant();

  const [user, setUser] = useState<IUser | null>({
    hasAuthenticatedUser: false,
  } as IUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      const storedUser = await getUserAsyncStorage();

      if (storedUser) {
        const isTokenValid = await validateToken(storedUser.token);

if (isTokenValid) {
  setUser(storedUser);

  if (storedUser.defaultRestaurantId && storedUser.token) {
    try {
      const restaurant = await getRestaurantById(
        storedUser.defaultRestaurantId
      );
      if (restaurant) {
        selectRestaurant(restaurant);
      }
    } catch (err) {
      console.warn("Não foi possível carregar restaurante", err);
    }
  }
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

const authenticate = useCallback(
  async (email: string, password: string) => {
    try {
      const response = await LoginRequest(email, password);

        console.log("Authenticate response:", response);

      if (!response) {
        return { success: false, message: "Erro ao autenticar" };
      }

      const payload: IUser = {
        role: response.payload.role,
        hasAuthenticatedUser: true,
        name: response.payload.name,
        email: response.payload.email,
        id: response.payload.id,
        token: response.payload.token,
        plan: response.payload.plan,
        defaultRestaurantId: response.payload.defaultRestaurantId,
        restaurantName: response.payload.restaurantName,
      };

      setUser(payload);
      await setUserAsyncStorage(payload);

      return { success: true };
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          message:
            error.response?.data?.message ??
            "E-mail ou senha inválidos",
        };
      }

      return {
        success: false,
        message: "Erro inesperado",
      };
    }
  },
  []
);


const logout = useCallback(async () => {
  setUser(null);
  selectRestaurant(null);
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
