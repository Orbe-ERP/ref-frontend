import { useContext } from "react";
import { AuthContext } from "@/context/AuthProvider/auth";

export default function useAuth() {
  const context = useContext(AuthContext);

  return context;
}
