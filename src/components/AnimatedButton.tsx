/*COMPONENTE ANIMATED BUTTON - Botão com animação de escala e efeitos*/

import { TouchableOpacity, Text, StyleSheet, Animated } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors, spacing, typography } from "@/styles/theme";

interface AnimatedButtonProps {
  label: string;
  icon?: keyof typeof Feather.glyphMap; // Nome do ícone (ex: "plus", "check")
  iconPosition?: "left" | "right";
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  disabled?: boolean;
}

export function AnimatedButton({
  label,
  icon,
  iconPosition = "left",
  onPress,
  variant = "primary",
  disabled = false,
}: AnimatedButtonProps) {
  // Animação de escala
  const scaleAnim = new Animated.Value(1);

  // Animação ao pressionar
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  // Animação ao soltar
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  // Estilos baseados na variante
  const getButtonStyle = () => {
    switch (variant) {
      case "secondary":
        return {
          backgroundColor: colors.card,
          borderWidth: 1.5,
          borderColor: colors.primary,
        };
      case "outline":
        return {
          backgroundColor: "transparent",
          borderWidth: 1.5,
          borderColor: colors.textSecondary,
        };
      default:
        return {
          backgroundColor: colors.primary,
        };
    }
  };

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
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.button, getButtonStyle(), disabled && styles.disabled]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        disabled={disabled}
      >
        {icon && iconPosition === "left" && (
          <Feather name={icon} size={20} color={getTextColor()} style={styles.iconLeft} />
        )}
        <Text style={[styles.text, { color: getTextColor() }]}>{label}</Text>
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
    flexDirection: "row",
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
    marginRight: spacing.sm,
  },
  iconRight: {
    marginLeft: spacing.sm,
  },
  disabled: {
    opacity: 0.55,
  },
});