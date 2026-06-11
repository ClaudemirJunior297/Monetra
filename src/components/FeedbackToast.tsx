/*COMPONENTE FEEDBACK TOAST - Notificações temporárias estilo toast*/

import { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors, spacing, typography, animations } from "@/styles/theme";

// Interface para as props
interface FeedbackToastProps {
  visible: boolean;           // Controla se o toast está visível
  message: string;            // Mensagem a ser exibida
  type?: "success" | "error" | "warning" | "info"; // Tipo do toast
  duration?: number;          // Duração em ms (padrão: 3000)
  onHide: () => void;         // Função chamada ao esconder
  position?: "top" | "center" | "bottom"; // Posição na tela
}

export function FeedbackToast({
  visible,
  message,
  type = "success",
  duration = 3000,
  onHide,
  position = "top",
}: FeedbackToastProps) {
  // Animação de opacidade (fade in/out)
  const fadeAnim = new Animated.Value(0);

  // Configurações baseadas no tipo do toast
  const getToastConfig = () => {
    switch (type) {
      case "success":
        return {
          backgroundColor: colors.success,
          icon: "check-circle",
        };
      case "error":
        return {
          backgroundColor: colors.error,
          icon: "alert-circle",
        };
      case "warning":
        return {
          backgroundColor: colors.warning,
          icon: "alert-triangle",
        };
      default: // info
        return {
          backgroundColor: colors.primary,
          icon: "info",
        };
    }
  };

  const { backgroundColor, icon } = getToastConfig();

  // Efeito que controla a animação quando visible muda
  useEffect(() => {
    if (visible) {
      // Animação de entrada (fade in)
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Esconde automaticamente após a duração
      const timer = setTimeout(() => {
        // Animação de saída (fade out)
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => onHide());
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  // Define o estilo de posicionamento
  const getPositionStyle = () => {
    switch (position) {
      case "top":
        return { top: 60 };
      case "center":
        return { justifyContent: "center" };
      case "bottom":
        return { bottom: 100 };
      default:
        return { top: 60 };
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        getPositionStyle(),
        { opacity: fadeAnim, backgroundColor },
        position === "center" && styles.centerContainer,
      ]}
    >
      <View style={styles.content}>
        <Feather name={icon as any} size={20} color={colors.white} />
        <Text style={styles.message}>{message}</Text>
      </View>
      
      {/* Botão para fechar manualmente */}
      <TouchableOpacity onPress={onHide} style={styles.closeButton}>
        <Feather name="x" size={18} color={colors.white} />
      </TouchableOpacity>
    </Animated.View>
  );
}

// ========== ESTILOS DO COMPONENTE ==========
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: spacing.md,
    right: spacing.md,
    padding: spacing.md,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1000,
  },
  centerContainer: {
    top: "50%",
    transform: [{ translateY: -50 }],
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flex: 1,
  },
  message: {
    ...typography.body,
    color: colors.white,
    fontWeight: "600",
    flex: 1,
  },
  closeButton: {
    padding: spacing.xs,
  },
});