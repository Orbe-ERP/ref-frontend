import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { IContext, IAuthProvider, IUser } from "./types";
import {
  LoginRequest,
  ValidateToken,
  getUserAsyncStorage,
  setUserAsyncStorage,
} from "./utils";

export const AuthContext = createContext<IContext>({} as IContext);

export const AuthProvider = ({ children }: IAuthProvider) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);

      const storedUser = await getUserAsyncStorage();

      if (!storedUser?.token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await ValidateToken();

        if (!response?.hasAuthenticatedUser) {
          setUser(null);
          await setUserAsyncStorage(null);
          setLoading(false);
          return;
        }

        setUser({
          ...storedUser,
          hasAuthenticatedUser: true,
        });
      } catch (error) {
        console.error("Erro ao validar token", error);
        setUser(null);
        await setUserAsyncStorage(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const authenticate = useCallback(
    async (email: string, password: string) => {
      try {
        const response = await LoginRequest(email, password);

        if (!response?.payload) return false;

        const payload: IUser = {
          id: response.payload.id,
          email: response.payload.email,
          name: response.payload.name,
          role: response.payload.role,
          token: response.payload.token,
          plan: response.payload.plan ?? null,
          hasAuthenticatedUser: true,
        };

        setUser(payload);
        await setUserAsyncStorage(payload);

        return true;
      } catch (error) {
        console.error("Erro ao autenticar", error);
        return false;
      }
    },
    []
  );

  const logout = useCallback(async () => {
    setUser(null);
    await setUserAsyncStorage(null);
  }, []);

  /**
   * Validação manual (opcional)
   */
  const validateToken = useCallback(async () => {
    try {
      const response = await ValidateToken();
      return response?.hasAuthenticatedUser ?? false;
    } catch {
      return false;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authenticate,
        logout,
        validateToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
