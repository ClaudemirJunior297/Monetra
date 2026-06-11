/*COMPONENTE LOADING SPINNER - Indicador de carregamento personalizado*/

import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { colors, spacing, typography } from "@/styles/theme";

interface LoadingSpinnerProps {
  visible: boolean;           // Controla se o spinner está visível
  text?: string;              // Texto opcional abaixo do spinner
  overlay?: boolean;          // Se true, adiciona fundo escuro semi-transparente
}

export function LoadingSpinner({
  visible,
  text = "Carregando...",
  overlay = false,
}: LoadingSpinnerProps) {
  if (!visible) return null;

  return (
    <View style={[styles.container, overlay && styles.overlay]}>
      <View style={styles.spinnerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        {text && <Text style={styles.text}>{text}</Text>}
      </View>
    </View>
  );
}

// ========== ESTILOS DO COMPONENTE ==========
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    zIndex: 999,
  },
  spinnerContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
  },
  text: {
    ...typography.body,
    color: colors.white,
    textAlign: "center",
  },
});