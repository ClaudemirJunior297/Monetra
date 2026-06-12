/**
 * ============================================================================
 * TELA DE LOGIN - Versão sem dependência de tema (cores fixas)
 * ============================================================================
 */

import { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Link, router } from "expo-router";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { useAuth } from "@/contexts/AuthContext";

// Cores fixas (não dependem do tema)
const COLORS = {
  background: "#121212",
  card: "#1E1E2E",
  primary: "#002ce8",
  text: "#FFFFFF",
  textSecondary: "#888888",
  border: "#2A2A3A",
};

export default function Login() {
  const { signIn, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [touchedEmail, setTouchedEmail] = useState(false);
  const [touchedPassword, setTouchedPassword] = useState(false);

  // Validações em tempo real
  useEffect(() => {
    if (touchedEmail && email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailError(emailRegex.test(email) ? "" : "E-mail inválido");
    } else if (touchedEmail && !email) {
      setEmailError("E-mail é obrigatório");
    } else {
      setEmailError("");
    }
  }, [email, touchedEmail]);

  useEffect(() => {
    if (touchedPassword && password) {
      setPasswordError(password.length < 6 ? "Senha deve ter pelo menos 6 caracteres" : "");
    } else if (touchedPassword && !password) {
      setPasswordError("Senha é obrigatória");
    } else {
      setPasswordError("");
    }
  }, [password, touchedPassword]);

  const handleLogin = async () => {
    setTouchedEmail(true);
    setTouchedPassword(true);
    Keyboard.dismiss();

    if (!email || !password) return;
    if (emailError || passwordError) return;

    try {
      await signIn(email, password);
      router.replace("/(tabs)");
    } catch (err) {
      // Erro já tratado no contexto
    }
  };

  const styles = getStyles();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: "padding", android: "height" })}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            {/* LOGO */}
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoText}>M</Text>
              </View>
            </View>

            {/* TÍTULO */}
            <Text style={styles.title}>Monetra</Text>
            <Text style={styles.subtitle}>Gerencie suas finanças de forma inteligente</Text>

            {/* FORMULÁRIO */}
            <View style={styles.form}>
              <Input
                placeholder="E-mail"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setTouchedEmail(true)}
                autoCapitalize="none"
                error={emailError}
              />

              <Input
                placeholder="Senha"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                onFocus={() => setTouchedPassword(true)}
                error={passwordError}
              />

              <Button
                label={loading ? "Entrando..." : "Entrar"}
                onPress={handleLogin}
                disabled={loading}
              />
            </View>

            {/* LINK PARA CADASTRO */}
            <Text style={styles.footerText}>
              Não tem uma conta?{" "}
              <Link href="/signup" style={styles.footerLink}>
                Cadastre-se aqui.
              </Link>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const getStyles = () =>
  StyleSheet.create({
    scrollContainer: {
      flexGrow: 1,
    },
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
      padding: 32,
      justifyContent: "center",
    },
    logoContainer: {
      alignItems: "center",
      marginBottom: 24,
    },
    logoCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: COLORS.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    logoText: {
      fontSize: 48,
      fontWeight: "bold",
      color: COLORS.text,
    },
    title: {
      fontSize: 42,
      fontWeight: "900",
      color: COLORS.primary,
      textAlign: "center",
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: COLORS.textSecondary,
      textAlign: "center",
      marginBottom: 32,
    },
    form: {
      gap: 16,
    },
    footerText: {
      textAlign: "center",
      marginTop: 24,
      color: COLORS.textSecondary,
    },
    footerLink: {
      color: COLORS.primary,
      fontWeight: "700",
    },
  });