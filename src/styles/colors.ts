/**
 * ============================================================================
 * CONFIGURAÇÃO DE CORES - Tema Personalizado Monetra (VERSÃO MENOS BRANCA)
 * ============================================================================
 * 
 * PALETA PERSONALIZADA:
 * - #002ce8 - Azul vibrante (botões, destaques)
 * - #020235 - Azul muito escuro (fundo escuro)
 * - #c859ff - Lilás/roxo claro (destaques, ícones)
 * - #6a42fe - Roxo médio (hovers, botões secundários)
 * - #e8e8f0 - Cinza azulado (fundo claro, menos branco)
 * 
 * @author Monetra Team
 * @version 3.0.0
 * ============================================================================
 */

// ============================================================================
// CORES DO TEMA CLARO (Light Mode - MENOS BRANCO)
// ============================================================================
export const lightColors = {
  // Cores principais do app
  primary: "#002ce8",              // Azul vibrante
  primaryDark: "#0020b3",          // Azul mais escuro para hover
  
  // Cores secundárias (destaques)
  secondary: "#6a42fe",            // Roxo médio
  secondaryLight: "#c859ff",       // Lilás claro
  
  // Cores para transações financeiras
  expense: "#e53935",              // Vermelho suave - despesas
  expenseLight: "#4a2020",         // Vermelho escuro translúcido (menos branco)
  
  income: "#43a047",               // Verde menta - receitas
  incomeLight: "#1a3a1a",          // Verde escuro translúcido (menos branco)
  
  // ⭐ NOVAS CORES DE FUNDO (menos branco!)
  background: "#f0f0f5",           // 👈 Fundo azulado claro (em vez de branco puro)
  card: "#ffffff",                 // Cards continuam brancos para contraste
  cardBorder: "#e0e0e8",           // Borda sutil
  
  // Cores de texto
  text: "#020235",                 // Azul muito escuro
  textSecondary: "#4a4a6a",        // Azul acinzentado
  textLight: "#8a8aaa",            // Cinza azulado
  
  // Cores de feedback
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  
  // Cores utilitárias
  category: "#002ce8",
  border: "#e0e0e8",
  white: "#ffffff",
  black: "#020235",
};

// ============================================================================
// CORES DO TEMA ESCURO (Dark Mode - JÁ ESTÁ BOM)
// ============================================================================
export const darkColors = {
  primary: "#c859ff",
  primaryDark: "#6a42fe",
  secondary: "#6a42fe",
  secondaryLight: "#c859ff",
  
  expense: "#ef5350",
  expenseLight: "#3a1a1a",
  income: "#66bb6a",
  incomeLight: "#1a2e1a",
  
  background: "#020235",           // Azul muito escuro
  card: "#0a0a4a",                 // Azul escuro
  cardBorder: "#1a1a5a",
  
  text: "#ededef",
  textSecondary: "#b0b0c0",
  textLight: "#8080a0",
  
  success: "#34d399",
  warning: "#fbbf24",
  error: "#f87171",
  
  category: "#c859ff",
  border: "#1a1a5a",
  white: "#ededef",
  black: "#020235",
};

export const colors = lightColors;