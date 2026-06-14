/**
 * ESTILOS GLOBAIS MODERNOS - Compatível com React Native
 * 
 * ATENÇÃO: Propriedades CSS como backdropFilter e backgroundClip
 * NÃO funcionam no React Native.
 */

import { StyleSheet } from "react-native";
import { colors, spacing, typography } from "./theme";

export const globalStyles = StyleSheet.create({
  
  // ========== CONTAINERS ==========
  
  // Container padrão da tela
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  // Container para gradiente (usar com LinearGradient)
  gradientContainer: {
    flex: 1,
  },
  
  // ========== CARDS ==========
  
  // Card com efeito semi-transparente (alternativa ao vidro)
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
  
  // Card flutuante (mais sombra)
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
  
  // ========== BOTÕES ==========
  
  // Container para botão com gradiente
  gradientButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    overflow: 'hidden',
  },
  
  // ========== INPUTS ==========
  
  // Input com estilo moderno
  modernInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 16,
    padding: spacing.md,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  
  // ========== TEXTOS ==========
  
  // Texto com gradiente (fallback - use LinearGradient para efeito real)
  gradientText: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.primary,
  },
  
  // ========== DIVISORES ==========
  
  // Separador moderno (linha fina)
  modernDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginVertical: spacing.md,
  },
  
  // ========== BADGES ==========
  
  // Badge (etiqueta)
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
  
  // ========== LAYOUT ==========
  
  // Linha horizontal (itens lado a lado)
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  
  // Linha com espaço entre os itens
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  
  // Centraliza conteúdo (horizontal e vertical)
  centerContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  
  // Espaço vertical entre itens
  gapVertical: {
    gap: spacing.md,
  },
  
  // Espaço horizontal entre itens
  gapHorizontal: {
    gap: spacing.sm,
  },
  
  // ========== SOMBRAS ==========
  
  // Sombra padrão (leve)
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  
  // Sombra forte (mais destacada)
  shadowStrong: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  
  // ========== BORDAS ==========
  
  // Borda arredondada padrão (16px)
  rounded: {
    borderRadius: 16,
  },
  
  // Borda bem arredondada (24px)
  roundedLarge: {
    borderRadius: 24,
  },
  
  // Borda pouco arredondada (12px)
  roundedSmall: {
    borderRadius: 12,
  },
});