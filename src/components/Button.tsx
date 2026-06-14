/**
 * COMPONENTE BUTTON - Botão com loading e estado desabilitado
 */

import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";

// Cores do botão
const COLORS = {
  primary: "#c859ff",     // Cor do botão (lilás)
  white: "#FFFFFF",       // Cor do texto
  disabled: "#666666",    // Cor quando desabilitado (não usada diretamente)
};

// Props do componente
interface ButtonProps {
  label: string;           // Texto do botão
  onPress: () => void;     // Função ao clicar
  loading?: boolean;       // Mostrar loading
  disabled?: boolean;      // Desabilitar botão
  variant?: "primary" | "secondary";  // Estilo (reservado para futuro)
}

export function Button({
  label,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",  // Não usado ainda, mas mantido para compatibilidade
}: ButtonProps) {
  // Botão fica desabilitado se estiver carregando OU desabilitado
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[styles.button, isDisabled && styles.disabled]}
      onPress={onPress}
      activeOpacity={0.8}     // Efeito de opacidade ao pressionar
      disabled={isDisabled}
    >
      {/* Se estiver carregando: mostra spinner */}
      {loading ? (
        <ActivityIndicator size="small" color={COLORS.white} />
      ) : (
        // Senão: mostra o texto
        <Text style={styles.text}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

// Estilos do componente
const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,  // Fundo lilás
    paddingVertical: 14,              // Espaçamento vertical
    paddingHorizontal: 24,            // Espaçamento horizontal
    borderRadius: 12,                 // Cantos arredondados
    alignItems: "center",             // Centraliza horizontalmente
    justifyContent: "center",         // Centraliza verticalmente
    minHeight: 52,                    // Altura mínima
  },
  text: {
    color: COLORS.white,              // Texto branco
    fontSize: 16,
    fontWeight: "600",                // Semi-negrito
  },
  disabled: {
    opacity: 0.55,                    // Botão desabilitado fica mais transparente
  },
});