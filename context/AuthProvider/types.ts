import { ReactNode } from "react";

export interface IUser {
  id?: string;
  email?: string;
  role?: string;
  name?: string;
  token?: string;
  hasAuthenticatedUser?: boolean;
  defaultRestaurantId?: string;
  restaurantName?: string;
  plan?: string
}
export interface AuthResult {
  success: boolean;
  message?: string;
  status?: number;
};
export interface IContext {
  user: IUser | null;
  loading: boolean;
  authenticate: (email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  validateToken: (token?: string) => Promise<boolean>;
}

export interface IAuthProvider {
  children: ReactNode;
}
