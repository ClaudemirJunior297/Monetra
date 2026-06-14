/* COMPONENTE: Botão para alternar entre modo claro/escuro */

import { TouchableOpacity, StyleSheet, Animated } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { colors, spacing } from "@/styles/theme";

export function ThemeToggle() {
  // Pega o tema atual e a função para alternar
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { 
          backgroundColor: theme.colors.card,     // Fundo do botão
          borderColor: theme.colors.border        // Cor da borda
        },
      ]}
      onPress={toggleTheme}        // Alterna entre claro/escuro
      activeOpacity={0.8}          // Efeito de opacidade ao pressionar
    >
      {/* Ícone muda conforme o tema */}
      <Feather
        name={isDark ? "sun" : "moon"}   // Sol no escuro, Lua no claro
        size={22}
        color={theme.colors.primary}     // Cor do ícone (destaque)
      />
    </TouchableOpacity>
  );
}

// ========== ESTILOS DO COMPONENTE ==========
const styles = StyleSheet.create({
  container: {
    width: 44,               // Largura fixa
    height: 44,              // Altura fixa
    borderRadius: 22,        // Circular (metade da largura)
    alignItems: "center",    // Centraliza horizontalmente
    justifyContent: "center", // Centraliza verticalmente
    borderWidth: 1,          // Borda de 1px
  },
});