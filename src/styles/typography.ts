/* CONFIGURAÇÃO DE TIPOGRAFIA - Estilos de texto do app */

import { TextStyle } from "react-native";

// Interface para padronizar os tipos de texto
interface TypographyStyles {
  title: TextStyle;     // Título principal
  subtitle: TextStyle;  // Subtítulo
  body: TextStyle;      // Texto comum
  caption: TextStyle;   // Texto pequeno
  button: TextStyle;    // Texto de botão
}

export const typography: TypographyStyles = {
  
  // Título principal (ex: nome do app, saldo)
  title: {
    fontSize: 28,          // Tamanho grande
    fontWeight: "700",     // Negrito
    lineHeight: 34,        // Altura da linha
    letterSpacing: -0.5,   // Letras mais juntas
  },
  
  // Subtítulo (ex: "Gastos por categoria")
  subtitle: {
    fontSize: 20,          // Tamanho médio-grande
    fontWeight: "600",     // Semi-negrito
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  
  // Texto corpo (texto padrão)
  body: {
    fontSize: 16,          // Tamanho padrão
    fontWeight: "400",     // Normal
    lineHeight: 24,
  },
  
  // Texto pequeno (ex: datas, categorias)
  caption: {
    fontSize: 12,          // Tamanho pequeno
    fontWeight: "400",
    lineHeight: 16,
  },
  
  // Texto de botão
  button: {
    fontSize: 16,
    fontWeight: "600",     // Semi-negrito
    lineHeight: 24,
    textAlign: "center",
  },
};