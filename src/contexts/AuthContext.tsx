// CONTEXTO DE AUTENTICAÇÃO - Gerencia login, cadastro e logout

import React, { createContext, useContext, useState, useEffect } from 'react';
import { router } from 'expo-router';
import { api, User } from '@/services/api';

// Tipagem do contexto
interface AuthContextData {
  user: User | null;                                    // Dados do usuário logado
  loading: boolean;                                     // Estado de carregamento
  signIn: (email: string, password: string) => Promise<void>;  // Login
  signUp: (name: string, email: string, password: string) => Promise<void>; // Cadastro
  signOut: () => void;                                  // Logout
}

// Cria o contexto
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Provider do contexto (envolve a aplicação)
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Estado do usuário (null = deslogado)
  const [user, setUser] = useState<User | null>(null);
  
  // Estado de carregamento (login, cadastro)
  const [loading, setLoading] = useState(true);

  // Inicialização (pode carregar usuário salvo aqui)
  useEffect(() => {
    setLoading(false);
  }, []);

  // Função de LOGIN
  const signIn = async (email: string, password: string) => {
    setLoading(true);  // Ativa loading
    try {
      const userData = await api.login(email, password);  // Chama API
      setUser(userData);                                  // Salva usuário
      router.replace('/(tabs)');                          // Vai para o dashboard
    } finally {
      setLoading(false);  // Desativa loading (mesmo se der erro)
    }
  };

  // Função de CADASTRO
  const signUp = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const userData = await api.register(name, email, password);
      setUser(userData);
      router.replace('/(tabs)');
    } finally {
      setLoading(false);
    }
  };

  // Função de LOGOUT
  const signOut = () => {
    setUser(null);            // Remove usuário
    router.replace('/');      // Volta para tela de login
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar o contexto em qualquer lugar
export const useAuth = () => useContext(AuthContext);