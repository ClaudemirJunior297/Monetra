/**
 * COMPONENTE INPUT - Campo de texto com validação
 */

import { useState } from "react";
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
} from "react-native";
import { Feather } from "@expo/vector-icons";

// Cores fixas do componente
const COLORS = {
  background: "#1E1E2E",    // Fundo do input
  card: "#2A2A3A",
  primary: "#002ce8",       // Cor da borda quando tem texto
  text: "#FFFFFF",          // Cor do texto digitado
  textSecondary: "#888888", // Cor do ícone do olho
  textLight: "#666666",     // Cor do placeholder
  error: "#FF4444",         // Cor da borda quando tem erro
  border: "#3A3A4A",        // Cor da borda padrão
  white: "#FFFFFF",
};

// Props do componente
interface InputProps extends TextInputProps {
  label?: string;      // Rótulo opcional (ex: "E-mail")
  error?: string;      // Mensagem de erro
  touched?: boolean;   // Se o campo já foi tocado (reservado)
}

export function Input({
  label,
  error,
  touched,      // Reservado para uso futuro
  secureTextEntry,
  style,
  ...rest
}: InputProps) {
  // Estado para mostrar/ocultar senha
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Verifica se deve mostrar a mensagem de erro
  const showError = error && error.length > 0;

  // Define a cor da borda baseada no estado
  let borderColor = COLORS.border;           // Padrão: cinza
  if (showError) {
    borderColor = COLORS.error;              // Erro: vermelho
  } else if (rest.value && rest.value.toString().length > 0) {
    borderColor = COLORS.primary;            // Preenchido: azul
  }

  return (
    <View style={styles.container}>
      
      {/* RÓTULO (se existir) */}
      {label && (
        <Text style={[styles.label, showError && styles.labelError]}>
          {label}
        </Text>
      )}

      {/* CONTAINER DO INPUT (com borda colorida) */}
      <View style={[styles.inputContainer, { borderColor }]}>
        
        {/* Campo de texto */}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={COLORS.textLight}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          {...rest}
        />

        {/* Botão para mostrar/ocultar senha (só aparece se for campo de senha) */}
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.eyeButton}
          >
            <Feather
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={20}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* MENSAGEM DE ERRO (se houver) */}
      {showError && <Text style={styles.errorText}>{error}</Text>}
      
    </View>
  );
}

// ========== ESTILOS DO COMPONENTE ==========
const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 16,           // Espaço abaixo do input
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  labelError: {
    color: COLORS.error,        // Label fica vermelha se tiver erro
  },
  inputContainer: {
    flexDirection: "row",       // Ícone e texto na mesma linha
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderWidth: 1.5,
    borderRadius: 12,           // Cantos arredondados
    paddingHorizontal: 16,
    minHeight: 52,              // Altura mínima
  },
  input: {
    flex: 1,                    // Ocupa espaço disponível
    fontSize: 16,
    color: COLORS.text,
    paddingVertical: 8,
  },
  eyeButton: {
    padding: 8,                 // Área de toque do botão
  },
  errorText: {
    fontSize: 12,
    color: COLORS.error,
    marginTop: 4,
    marginLeft: 4,
  },
});