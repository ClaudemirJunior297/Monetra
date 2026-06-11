/*COMPONENTE THEME TOGGLE - Botão para alternar entre modo claro/escuro*/

import { TouchableOpacity, StyleSheet, Animated } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { colors, spacing } from "@/styles/theme";

export function ThemeToggle() {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
      ]}
      onPress={toggleTheme}
      activeOpacity={0.8}
    >
      <Feather
        name={isDark ? "sun" : "moon"}
        size={22}
        color={theme.colors.primary}
      />
    </TouchableOpacity>
  );
}

// ========== ESTILOS DO COMPONENTE ==========
const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
});