/*CONFIGURAÇÃO DE TIPOGRAFIA (Typography)*/

import { TextStyle } from "react-native";

// Interface para garantir consistência nos tipos
interface TypographyStyles {
  title: TextStyle;
  subtitle: TextStyle;
  body: TextStyle;
  caption: TextStyle;
  button: TextStyle;
}

export const typography: TypographyStyles = {
  /**
   * Título principal
   * Uso: Nome do app, valor do saldo, cabeçalhos importantes
   */
  title: {
    fontSize: 28,          // Tamanho grande
    fontWeight: "700",     // Negrito (Bold)
    lineHeight: 34,        // Altura da linha para melhor legibilidade
    letterSpacing: -0.5,   // Espaçamento negativo para títulos mais compactos
  },
  
  /**
   * Subtítulo
   * Uso: Títulos de seções (ex: "Gastos por categoria", "Transações recentes")
   */
  subtitle: {
    fontSize: 20,          // Tamanho médio-grande
    fontWeight: "600",     // Semi-negrito (SemiBold)
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  
  /**
   * Texto corpo (padrão)
   * Uso: Descrições, labels, textos comuns
   */
  body: {
    fontSize: 16,          // Tamanho padrão de leitura
    fontWeight: "400",     // Peso normal (Regular)
    lineHeight: 24,
  },
  
  /**
   * Texto pequeno (legenda)
   * Uso: Datas, categorias, textos auxiliares, placeholders
   */
  caption: {
    fontSize: 12,          // Tamanho pequeno
    fontWeight: "400",
    lineHeight: 16,
  },
  
  /**
   * Texto de botão
   * Uso: Texto dentro de botões
   */
  button: {
    fontSize: 16,
    fontWeight: "600",     // Semi-negrito para destacar no botão
    lineHeight: 24,
    textAlign: "center",
  },
};