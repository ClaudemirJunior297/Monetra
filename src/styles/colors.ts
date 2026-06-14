/**
 * CONFIGURAÇÃO DE CORES - Tema Personalizado Monetra
 * 
 * PALETA PERSONALIZADA:
 * - #002ce8 - Azul vibrante (botões, destaques)
 * - #020235 - Azul muito escuro (fundo escuro)
 * - #c859ff - Lilás/roxo claro (destaques, ícones)
 * - #6a42fe - Roxo médio (hovers, botões secundários)
 * - #e8e8f0 - Cinza azulado (fundo claro)
 */

// ========== CORES DO TEMA CLARO ==========
export const lightColors = {
  // Cores principais do app
  primary: "#002ce8",        // Botões, abas ativas, links
  primaryDark: "#0020b3",    // Hover do botão
  
  // Cores secundárias (destaques)
  secondary: "#6a42fe",      // Roxo médio
  secondaryLight: "#c859ff", // Lilás claro
  
  // Cores para transações financeiras
  expense: "#e53935",        // Despesas (vermelho)
  expenseLight: "#4a2020",   // Fundo para despesas
  
  income: "#43a047",         // Receitas (verde)
  incomeLight: "#1a3a1a",    // Fundo para receitas
  
  // Cores de fundo
  background: "#f0f0f5",     // Fundo da tela (cinza azulado)
  card: "#ffffff",           // Fundo dos cards (branco)
  cardBorder: "#e0e0e8",     // Borda dos cards
  
  // Cores de texto
  text: "#020235",           // Texto principal (azul escuro)
  textSecondary: "#4a4a6a",  // Texto secundário
  textLight: "#8a8aaa",      // Texto desabilitado
  
  // Cores de feedback
  success: "#10b981",        // Mensagem de sucesso
  warning: "#f59e0b",        // Mensagem de alerta
  error: "#ef4444",          // Mensagem de erro
  
  // Cores utilitárias
  category: "#002ce8",       // Cor dos gráficos
  border: "#e0e0e8",         // Bordas em geral
  white: "#ffffff",
  black: "#020235",
};

// ========== CORES DO TEMA ESCURO ==========
export const darkColors = {
  // Cores principais do app (versão escura)
  primary: "#c859ff",        // Botões, abas ativas (lilás)
  primaryDark: "#6a42fe",    // Hover do botão (roxo)
  secondary: "#6a42fe",
  secondaryLight: "#c859ff",
  
  // Cores para transações financeiras
  expense: "#ef5350",        // Despesas (vermelho claro)
  expenseLight: "#3a1a1a",   // Fundo para despesas
  income: "#66bb6a",         // Receitas (verde claro)
  incomeLight: "#1a2e1a",    // Fundo para receitas
  
  // Cores de fundo (escuro)
  background: "#020235",     // Fundo da tela (azul muito escuro)
  card: "#0a0a4a",           // Fundo dos cards
  cardBorder: "#1a1a5a",     // Borda dos cards
  
  // Cores de texto (claras para contraste)
  text: "#ededef",           // Texto principal (cinza claro)
  textSecondary: "#b0b0c0",  // Texto secundário
  textLight: "#8080a0",      // Texto desabilitado
  
  // Cores de feedback
  success: "#34d399",
  warning: "#fbbf24",
  error: "#f87171",
  
  // Cores utilitárias
  category: "#c859ff",       // Cor dos gráficos
  border: "#1a1a5a",
  white: "#ededef",
  black: "#020235",
};

// Tema padrão (claro)
export const colors = lightColors;