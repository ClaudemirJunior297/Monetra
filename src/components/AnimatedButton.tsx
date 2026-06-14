/* COMPONENTE: Botão com animação de escala e ícone */

import { TouchableOpacity, Text, StyleSheet, Animated } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors, spacing, typography } from "@/styles/theme";

// Props do componente
interface AnimatedButtonProps {
  label: string;                                    // Texto do botão
  icon?: keyof typeof Feather.glyphMap;             // Nome do ícone (ex: "plus", "check")
  iconPosition?: "left" | "right";                  // Posição do ícone (esquerda ou direita)
  onPress: () => void;                              // Função ao clicar
  variant?: "primary" | "secondary" | "outline";    // Estilo do botão
  disabled?: boolean;                               // Desabilitar botão
}

export function AnimatedButton({
  label,
  icon,
  iconPosition = "left",
  onPress,
  variant = "primary",
  disabled = false,
}: AnimatedButtonProps) {
  
  // Valor da animação (1 = tamanho normal)
  const scaleAnim = new Animated.Value(1);

  // Quando pressiona: diminui para 0.96 (efeito de clique)
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  // Quando solta: volta para 1 (tamanho normal)
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  // Define o estilo do botão baseado na variante
  const getButtonStyle = () => {
    switch (variant) {
      case "secondary":
        return {
          backgroundColor: colors.card,          // Fundo do card
          borderWidth: 1.5,
          borderColor: colors.primary,          // Borda lilás
        };
      case "outline":
        return {
          backgroundColor: "transparent",       // Fundo transparente
          borderWidth: 1.5,
          borderColor: colors.textSecondary,    // Borda cinza
        };
      default: // primary
        return {
          backgroundColor: colors.primary,      // Fundo lilás
        };
    }
  };

  // Define a cor do texto baseado na variante
  const getTextColor = () => {
    switch (variant) {
      case "secondary":
        return colors.primary;
      case "outline":
        return colors.text;
      default:
        return colors.white;
    }
  };

  return (
    // View com animação de escala
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.button, getButtonStyle(), disabled && styles.disabled]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        disabled={disabled}
      >
        {/* Ícone à esquerda (se existir) */}
        {icon && iconPosition === "left" && (
          <Feather name={icon} size={20} color={getTextColor()} style={styles.iconLeft} />
        )}
        
        {/* Texto do botão */}
        <Text style={[styles.text, { color: getTextColor() }]}>{label}</Text>
        
        {/* Ícone à direita (se existir) */}
        {icon && iconPosition === "right" && (
          <Feather name={icon} size={20} color={getTextColor()} style={styles.iconRight} />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

// ========== ESTILOS DO COMPONENTE ==========
const styles = StyleSheet.create({
  button: {
    flexDirection: "row",       // Ícone e texto na mesma linha
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    minHeight: 52,
  },
  text: {
    ...typography.button,
    fontWeight: "600",
  },
  iconLeft: {
    marginRight: spacing.sm,    // Espaço entre ícone e texto
  },
  iconRight: {
    marginLeft: spacing.sm,     // Espaço entre texto e ícone
  },
  disabled: {
    opacity: 0.55,              // Botão desabilitado fica mais transparente
  },
});