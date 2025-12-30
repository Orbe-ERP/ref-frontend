import { ReactNode } from "react";

export interface IUser {
  id?: string;
  email?: string;
  role?: string;
  name?: string;
  token?: string;
  plan?: string | null;
  hasAuthenticatedUser?: boolean;
}

export interface IContext {
  user: IUser | null;
  loading: boolean;
  authenticate: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  validateToken: (token?: string) => Promise<boolean>;
}

export interface IAuthProvider {
  children: ReactNode;
}
