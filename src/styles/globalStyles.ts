/**
 * ============================================================================
 * ESTILOS GLOBAIS MODERNOS - Versão compatível com React Native
 * ============================================================================
 * 
 * ATENÇÃO: React Native não suporta algumas propriedades CSS como:
 * - backdropFilter (efeito vidro)
 * - backgroundClip (gradiente em texto)
 * 
 * Alternativas:
 * - Para efeito vidro: usar opacidade e bordas
 * - Para gradiente em texto: usar LinearGradient como fundo
 * 
 * @author Monetra Team
 * @version 2.0.0
 * ============================================================================
 */

import { StyleSheet } from "react-native";
import { colors, spacing, typography } from "./theme";

export const globalStyles = StyleSheet.create({
  // Container principal
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  // Container com gradiente (fundo moderno)
  gradientContainer: {
    flex: 1,
  },
  
  // Card com efeito semi-transparente (alternativa ao glassmorphism)
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  
  // Card moderno com sombra suave
  modernCard: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: spacing.lg,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  
  // Card flutuante
  floatingCard: {
    backgroundColor: colors.card,
    borderRadius: 28,
    padding: spacing.lg,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 6,
  },
  
  // Botão moderno com gradiente (container)
  gradientButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    overflow: 'hidden',
  },
  
  // Input moderno
  modernInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 16,
    padding: spacing.md,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  
  // Título com cor especial (gradiente não é suportado nativamente)
  // Para gradiente em texto, use o componente LinearGradient
  gradientText: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.primary, // Fallback
  },
  
  // Separador moderno
  modernDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginVertical: spacing.md,
  },
  
  // Badge moderno
  modernBadge: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    alignItems: "center",
    justifyContent: "center",
  },
  
  // Texto do badge
  badgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "600",
  },
  
  // Row flexível
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  
  // Row com espaço entre
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  
  // Centralizar conteúdo
  centerContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  
  // Espaçamento vertical
  gapVertical: {
    gap: spacing.md,
  },
  
  // Espaçamento horizontal
  gapHorizontal: {
    gap: spacing.sm,
  },
  
  // Sombra padrão
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  
  // Sombra mais forte
  shadowStrong: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  
  // Borda arredondada padrão
  rounded: {
    borderRadius: 16,
  },
  
  // Borda arredondada grande
  roundedLarge: {
    borderRadius: 24,
  },
  
  // Borda arredondada pequena
  roundedSmall: {
    borderRadius: 12,
  },
});