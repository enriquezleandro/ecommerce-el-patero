import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Order } from '../lib/types';
import * as api from '../lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  orders: Order[];
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'authToken';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  // Arranca en true: hasta confirmar (o descartar) el token guardado, las
  // pantallas que dependen de isAuthenticated no deberían asumir "no logueado".
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    if (!savedToken) {
      setIsLoading(false);
      return;
    }

    api
      .getMe(savedToken)
      .then((me) => {
        setToken(savedToken);
        setUser(me);
        return api.getOrders(savedToken);
      })
      .then((userOrders) => setOrders(userOrders))
      .catch(() => {
        // Token vencido o inválido: se descarta silenciosamente, como un
        // logout implícito.
        localStorage.removeItem(TOKEN_KEY);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const { token: newToken, user: loggedInUser } = await api.login(email, password);
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    setUser(loggedInUser);
    setOrders(await api.getOrders(newToken));
  };

  const register = async (email: string, password: string, name: string) => {
    const { token: newToken, user: newUser } = await api.register(email, password, name);
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    setUser(newUser);
    setOrders([]);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setOrders([]);
    localStorage.removeItem(TOKEN_KEY);
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!token) return;
    const updatedUser = await api.updateProfile(token, data);
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        updateProfile,
        orders,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
