import { createContext, useContext, useState } from "react";
import type { AuthPayload } from "../lib/api";

interface AuthUser {
  id: string;
  companyName: string;
  email: string;
  role: string;
}

interface AuthCtx {
  user: AuthUser | null;
  token: string | null;
  login: (payload: AuthPayload) => void;
  logout: () => void;
}

const Ctx = createContext<AuthCtx>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const s = localStorage.getItem("user");
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));

  function login(payload: AuthPayload) {
    localStorage.setItem("token", payload.token);
    localStorage.setItem("user", JSON.stringify(payload.user));
    setToken(payload.token);
    setUser(payload.user);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }

  return <Ctx.Provider value={{ user, token, login, logout }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  return useContext(Ctx);
}
