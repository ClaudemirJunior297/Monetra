/* CONTEXTO DE AUTENTICAÇÃO - Gerencia login, cadastro e logout */

import React, { createContext, useContext, useState } from 'react';
import { router } from 'expo-router';
import { api, User } from '@/services/api';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Login
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userData = await api.login(email, password);
      setUser(userData);
      router.replace('/(tabs)');
    } catch (error: any) {
      console.log('Erro no login:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Cadastro
  const signUp = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const userData = await api.register(name, email, password);
      setUser(userData);
      router.replace('/(tabs)');
    } catch (error: any) {
      console.log('Erro no cadastro:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout - CORRIGIDO
  const signOut = () => {
    console.log('Executando logout...');
    setUser(null);
    // Usar replace em vez de push para não permitir voltar
    router.replace('/');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);