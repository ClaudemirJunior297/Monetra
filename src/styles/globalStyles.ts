/*ESTILOS GLOBAIS (Global Styles)*/

import { StyleSheet } from "react-native";
import { colors, spacing, typography } from "./theme";

export const globalStyles = StyleSheet.create({
  /**
   * Container principal de tela
   * Usado como wrapper em todas as telas
   */
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  /**
   * Centraliza conteúdo vertical e horizontalmente
   * Usado para telas de carregamento, estado vazio, etc.
   */
  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  
  /**
   * Card padrão (com borda arredondada e sombra)
   */
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    // Sombra para iOS
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Sombra para Android
    elevation: 2,
  },
  
  /**
   * Linha divisória entre elementos
   */
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  
  /**
   * Container para formulários (agrupa inputs)
   */
  formGroup: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  
  /**
   * Label de campo de formulário
   */
  label: {
    ...typography.body,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  
  /**
   * Texto de erro para validações
   */
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
  
  /**
   * Container para linhas lado a lado (row)
   */
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  
  /**
   * Espaçamento entre elementos (gap vertical)
   */
  gapVertical: {
    gap: spacing.md,
  },
  
  /**
   * Espaçamento entre elementos (gap horizontal)
   */
  gapHorizontal: {
    gap: spacing.sm,
  },
});