import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Order } from '../lib/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  orders: Order[];
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    email: 'demo@elpatero.com',
    name: 'Usuario Demo',
    address: {
      street: 'Av. Libertador 1234',
      city: 'Buenos Aires',
      province: 'CABA',
      postalCode: '1425',
      phone: '+54 11 1234-5678'
    }
  }
];

// Mock orders
const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    userId: '1',
    items: [],
    total: 125980,
    status: 'delivered',
    shippingAddress: {
      street: 'Av. Libertador 1234',
      city: 'Buenos Aires',
      province: 'CABA',
      postalCode: '1425',
      phone: '+54 11 1234-5678'
    },
    paymentMethod: 'Mercado Pago',
    createdAt: '2024-10-15T10:30:00Z'
  },
  {
    id: 'ORD-002',
    userId: '1',
    items: [],
    total: 89990,
    status: 'shipped',
    shippingAddress: {
      street: 'Av. Libertador 1234',
      city: 'Buenos Aires',
      province: 'CABA',
      postalCode: '1425',
      phone: '+54 11 1234-5678'
    },
    paymentMethod: 'Tarjeta de Crédito',
    createdAt: '2024-10-25T14:20:00Z'
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      // Load orders for this user
      setOrders(mockOrders.filter(order => order.userId === userData.id));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login - in real app, this would call an API
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      setOrders(mockOrders.filter(order => order.userId === foundUser.id));
    } else {
      throw new Error('Usuario o contraseña incorrectos');
    }
  };

  const register = async (email: string, password: string, name: string) => {
    // Mock register
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name
    };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    mockUsers.push(newUser);
  };

  const logout = () => {
    setUser(null);
    setOrders([]);
    localStorage.removeItem('user');
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateProfile,
        orders,
        isAuthenticated: !!user,
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
