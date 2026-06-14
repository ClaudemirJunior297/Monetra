/**
 * ============================================================================
 * TELA DE LOGIN - Com logo e cores atualizadas
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

// Cores fixas
const COLORS = {
  background: "#121212",
  primary: "#c859ff",      // 👈 COR DO BOTÃO (lilás)
  text: "#FFFFFF",
  textSecondary: "#888888",
};

export default function Login() {
  const { signIn, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [touchedEmail, setTouchedEmail] = useState(false);
  const [touchedPassword, setTouchedPassword] = useState(false);

  // Validações
  useEffect(() => {
    if (touchedEmail) {
      if (!email) {
        setEmailError("E-mail é obrigatório");
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setEmailError("E-mail inválido");
      } else {
        setEmailError("");
      }
    } else {
      setEmailError("");
    }
  }, [email, touchedEmail]);

  useEffect(() => {
    if (touchedPassword) {
      if (!password) {
        setPasswordError("Senha é obrigatória");
      } else if (password.length < 6) {
        setPasswordError("Senha deve ter pelo menos 6 caracteres");
      } else {
        setPasswordError("");
      }
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
      console.log(err);
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
            <Image 
              source={require("@/assets/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />

            {/* TÍTULO - AGORA BRANCO */}
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
                loading={loading}
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
    logo: {
      width: "100%",
      height: 120,
      marginBottom: 24,
    },
    title: {
      fontSize: 42,
      fontWeight: "900",
      color: "#FFFFFF",        // 👈 BRANCO
      textAlign: "center",
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
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
      color: COLORS.primary,    // 👈 COR DO LINK (lilás)
      fontWeight: "700",
    },
  });