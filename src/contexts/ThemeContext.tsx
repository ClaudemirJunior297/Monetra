/* CONTEXTO DE TEMA - Gerencia modo claro/escuro */

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { lightColors, darkColors } from "@/styles/colors";
import { spacing } from "@/styles/spacing";
import { typography } from "@/styles/typography";

// Interface do tema
export interface Theme {
  colors: typeof lightColors;
  spacing: typeof spacing;
  typography: typeof typography;
}

// Cores para o tema (simplificado)
const lightTheme: Theme = {
  colors: lightColors,
  spacing,
  typography,
};

const darkTheme: Theme = {
  colors: darkColors,
  spacing,
  typography,
};

interface ThemeContextData {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true); // Começa com tema escuro
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark(prev => !prev);
  }, []);

  const theme = isDark ? darkTheme : lightTheme;

  if (!isReady) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
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