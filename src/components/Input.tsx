/**
 * ============================================================================
 * COMPONENTE INPUT - Campo de texto com validação
 * ============================================================================
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

// Cores fixas
const COLORS = {
  background: "#1E1E2E",
  card: "#2A2A3A",
  primary: "#002ce8",
  text: "#FFFFFF",
  textSecondary: "#888888",
  textLight: "#666666",
  error: "#FF4444",
  border: "#3A3A4A",
  white: "#FFFFFF",
};

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  touched?: boolean;
}

export function Input({
  label,
  error,
  touched,
  secureTextEntry,
  style,
  ...rest
}: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Determina se deve mostrar a mensagem de erro
  const showError = error && error.length > 0;

  // Determina a cor da borda
  let borderColor = COLORS.border;
  if (showError) {
    borderColor = COLORS.error;
  } else if (rest.value && rest.value.toString().length > 0) {
    borderColor = COLORS.primary;
  }

  return (
    <View style={styles.container}>
      {/* RÓTULO */}
      {label && (
        <Text style={[styles.label, showError && styles.labelError]}>
          {label}
        </Text>
      )}

      {/* CONTAINER DO INPUT */}
      <View style={[styles.inputContainer, { borderColor }]}>
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={COLORS.textLight}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          {...rest}
        />

        {/* BOTÃO PARA MOSTRAL/OCULTAR SENHA */}
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

      {/* MENSAGEM DE ERRO */}
      {showError && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  labelError: {
    color: COLORS.error,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    minHeight: 52,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    paddingVertical: 8,
  },
  eyeButton: {
    padding: 8,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.error,
    marginTop: 4,
    marginLeft: 4,
  },
});