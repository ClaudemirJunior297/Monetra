/* COMPONENTE: Indicador de carregamento personalizado */

import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { colors, spacing, typography } from "@/styles/theme";

// Props do componente
interface LoadingSpinnerProps {
  visible: boolean;        // Controla se o spinner está visível
  text?: string;           // Texto opcional abaixo do spinner (padrão: "Carregando...")
  overlay?: boolean;       // Se true, adiciona fundo escuro semi-transparente
}

export function LoadingSpinner({
  visible,
  text = "Carregando...",
  overlay = false,
}: LoadingSpinnerProps) {
  // Se não estiver visível, não renderiza nada
  if (!visible) return null;

  return (
    // Container principal
    <View style={[styles.container, overlay && styles.overlay]}>
      
      {/* Centraliza o spinner e o texto */}
      <View style={styles.spinnerContainer}>
        
        {/* Spinner animado */}
        <ActivityIndicator size="large" color={colors.primary} />
        
        {/* Texto opcional */}
        {text && <Text style={styles.text}>{text}</Text>}
        
      </View>
    </View>
  );
}

// ========== ESTILOS DO COMPONENTE ==========
const styles = StyleSheet.create({
  container: {
    flex: 1,                    // Ocupa toda a tela
    alignItems: "center",       // Centraliza horizontalmente
    justifyContent: "center",   // Centraliza verticalmente
  },
  overlay: {
    position: "absolute",       // Fica sobreposto
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.65)",  // Fundo escuro semi-transparente
    zIndex: 999,                // Fica acima de todos os elementos
  },
  spinnerContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,            // Espaço entre o spinner e o texto
  },
  text: {
    ...typography.body,
    color: colors.white,
    textAlign: "center",
  },
});