/**
 * ============================================================================
 * CONTEXTO DE AUTENTICAÇÃO - AuthContext (Versão corrigida)
 * ============================================================================
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const USER_STORAGE_KEY = "@Monetra:user";
const USERS_STORAGE_KEY = "@Monetra:users";

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  // Carrega usuário salvo ao iniciar
  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("Erro ao carregar usuário:", err);
    }
  };

  const saveUser = async (userData: User | null) => {
    if (userData) {
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    } else {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
    }
    setUser(userData);
  };

  const getUsers = async (): Promise<User[]> => {
    const stored = await AsyncStorage.getItem(USERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  };

  const saveUsers = async (users: User[]) => {
    await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  };

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      if (!email.trim()) throw new Error("E-mail é obrigatório");
      if (!password.trim()) throw new Error("Senha é obrigatória");

      const users = await getUsers();
      const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!foundUser) {
        throw new Error("E-mail não encontrado");
      }

      if (password.length < 3) {
        throw new Error("Senha incorreta");
      }

      await saveUser(foundUser);
      
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      if (!name.trim()) throw new Error("Nome é obrigatório");
      if (name.trim().length < 3) throw new Error("Nome deve ter pelo menos 3 caracteres");
      if (!email.trim()) throw new Error("E-mail é obrigatório");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("E-mail inválido");
      if (!password.trim()) throw new Error("Senha é obrigatória");
      if (password.length < 6) throw new Error("Senha deve ter pelo menos 6 caracteres");

      const users = await getUsers();
      
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error("Este e-mail já está cadastrado");
      }

      const newUser: User = {
        id: Date.now().toString(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
      };

      await saveUsers([...users, newUser]);
      await saveUser(newUser);
      
    } catch (err: any) {
      setError(err.message || "Erro ao criar conta");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      await saveUser(null);
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signIn,
        signUp,
        signOut,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}