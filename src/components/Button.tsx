/**
 * ============================================================================
 * COMPONENTE BUTTON - Botão com loading
 * ============================================================================
 */

import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";

// ⭐ CORES ATUALIZADAS ⭐
const COLORS = {
  primary: "#c859ff",     // 👈 NOVA COR DO BOTÃO (lilás)
  white: "#FFFFFF",
  disabled: "#666666",
};

interface ButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary";
}

export function Button({
  label,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[styles.button, isDisabled && styles.disabled]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator size="small" color={COLORS.white} />
      ) : (
        <Text style={styles.text}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,  // 👈 Agora é #c859ff
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
  },
  text: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  disabled: {
    opacity: 0.55,
  },
});