/*CONTEXTO DE TEMA (ThemeContext) - Gerenciamento de modo claro/escuro*/

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { lightTheme, darkTheme, Theme } from "@/styles/theme";
import { StatusBar } from "expo-status-bar";

// Chave para salvar a preferência no AsyncStorage
const THEME_STORAGE_KEY = "@Monetra:theme";

// Interface do contexto
interface ThemeContextData {
  theme: Theme;              // Objeto com todas as configurações do tema atual
  isDark: boolean;           // Boolean indicando se é modo escuro
  toggleTheme: () => void;   // Função para alternar entre claro/escuro
  setTheme: (isDark: boolean) => void; // Função para definir um tema específico
}

// Criação do contexto
const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

// Provider do tema (envolve a aplicação)
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Estado para armazenar se é modo escuro (começa com true - dark mode)
  const [isDark, setIsDark] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega a preferência salva ao iniciar o app
  useEffect(() => {
    loadThemePreference();
  }, []);

  // Função para carregar o tema salvo no AsyncStorage
  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme !== null) {
        setIsDark(savedTheme === "dark");
      }
    } catch (error) {
      console.error("Erro ao carregar preferência de tema:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para salvar a preferência no AsyncStorage
  const saveThemePreference = async (isDarkMode: boolean) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, isDarkMode ? "dark" : "light");
    } catch (error) {
      console.error("Erro ao salvar preferência de tema:", error);
    }
  };

  // Função para alternar entre claro e escuro
  const toggleTheme = useCallback(() => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    saveThemePreference(newIsDark);
  }, [isDark]);

  // Função para definir um tema específico
  const setTheme = useCallback((isDarkMode: boolean) => {
    setIsDark(isDarkMode);
    saveThemePreference(isDarkMode);
  }, []);

  // Seleciona o tema baseado no estado
  const theme = isDark ? darkTheme : lightTheme;

  // Se ainda está carregando, não renderiza nada (evita flash de tema errado)
  if (isLoading) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark,
        toggleTheme,
        setTheme,
      }}
    >
      {/* StatusBar acompanha o tema */}
      <StatusBar style={isDark ? "light" : "dark"} />
      {children}
    </ThemeContext.Provider>
  );
}

// Hook personalizado para usar o tema em qualquer componente
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}