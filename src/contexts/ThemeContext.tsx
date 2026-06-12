/**
 * ============================================================================
 * CONTEXTO DE TEMA - ThemeContext (Versão funcional)
 * ============================================================================
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { lightTheme, darkTheme, Theme } from "@/styles/theme";

interface ThemeContextData {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Simula um pequeno delay para garantir que tudo está carregado
    setIsReady(true);
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark(prev => !prev);
  }, []);

  const setTheme = useCallback((darkMode: boolean) => {
    setIsDark(darkMode);
  }, []);

  const theme = isDark ? darkTheme : lightTheme;

  if (!isReady) {
    // Retorna um componente vazio enquanto carrega
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
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}