import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "../types";
import * as api from "../services/api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: object) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("ssn_token");
    if (token) {
      api.getMe()
        .then(r => setUser(r.data.data))
        .catch(() => { localStorage.removeItem("ssn_token"); })
        .finally(() => setLoading(false));
    } else setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const r = await api.login({ email, password });
    const { user, token } = r.data.data;
    localStorage.setItem("ssn_token", token);
    setUser(user);
  };

  const register = async (data: object) => {
    const r = await api.register(data);
    const { user, token } = r.data.data;
    localStorage.setItem("ssn_token", token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("ssn_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin: user?.role === "admin" }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
