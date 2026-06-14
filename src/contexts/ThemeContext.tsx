/**
 * CONTEXTO DE TEMA - Gerencia modo claro/escuro
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { lightTheme, darkTheme, Theme } from "@/styles/theme";

// Tipagem do contexto
interface ThemeContextData {
  theme: Theme;                    // Objeto com todas as cores e estilos
  isDark: boolean;                 // true = escuro, false = claro
  toggleTheme: () => void;         // Alterna entre claro/escuro
  setTheme: (isDark: boolean) => void;  // Define um tema específico
}

// Cria o contexto
const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

// Provider do contexto (envolve a aplicação)
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Estado: começa com tema escuro (true)
  const [isDark, setIsDark] = useState(true);
  
  // Estado: controla se o tema já está carregado
  const [isReady, setIsReady] = useState(false);

  // Simula carregamento inicial (pode carregar preferência salva aqui)
  useEffect(() => {
    setIsReady(true);  // Tema pronto para usar
  }, []);

  // Alterna entre claro e escuro
  const toggleTheme = useCallback(() => {
    setIsDark(prev => !prev);
  }, []);

  // Define um tema específico (claro ou escuro)
  const setTheme = useCallback((darkMode: boolean) => {
    setIsDark(darkMode);
  }, []);

  // Seleciona o tema baseado no estado isDark
  const theme = isDark ? darkTheme : lightTheme;

  // Enquanto não estiver pronto, não renderiza nada (evita flash)
  if (!isReady) {
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

// Hook personalizado para usar o tema em qualquer componente
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}