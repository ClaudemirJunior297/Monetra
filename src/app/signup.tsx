/**
 * ============================================================================
 * TELA DE CADASTRO - Com logo personalizada
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
  primary: "#002ce8",
  text: "#FFFFFF",
  textSecondary: "#888888",
};

export default function Signup() {
  const { signUp, loading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  
  const [touchedName, setTouchedName] = useState(false);
  const [touchedEmail, setTouchedEmail] = useState(false);
  const [touchedPassword, setTouchedPassword] = useState(false);
  const [touchedConfirm, setTouchedConfirm] = useState(false);

  // Validações
  useEffect(() => {
    if (touchedName) {
      if (!name) {
        setNameError("Nome é obrigatório");
      } else if (name.trim().length < 3) {
        setNameError("Nome deve ter pelo menos 3 caracteres");
      } else {
        setNameError("");
      }
    } else {
      setNameError("");
    }
  }, [name, touchedName]);

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

  useEffect(() => {
    if (touchedConfirm) {
      if (!confirmPassword) {
        setConfirmError("Confirme sua senha");
      } else if (password !== confirmPassword) {
        setConfirmError("As senhas não conferem");
      } else {
        setConfirmError("");
      }
    } else {
      setConfirmError("");
    }
  }, [password, confirmPassword, touchedConfirm]);

  const handleSignup = async () => {
    setTouchedName(true);
    setTouchedEmail(true);
    setTouchedPassword(true);
    setTouchedConfirm(true);
    Keyboard.dismiss();

    if (!name || !email || !password || !confirmPassword) return;
    if (nameError || emailError || passwordError || confirmError) return;

    try {
      await signUp(name, email, password);
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
            {/* LOGO - IMAGEM PERSONALIZADA */}
            <Image 
              source={require("@/assets/logo.png")}  // 👈 CAMINHO DA SUA LOGO
              style={styles.logo}
              resizeMode="contain"
            />

            {/* TÍTULO (opcional) */}
            <Text style={styles.title}>Criar Conta</Text>
            <Text style={styles.subtitle}>Comece a controlar seus gastos hoje</Text>

            <View style={styles.form}>
              <Input
                placeholder="Nome completo"
                value={name}
                onChangeText={setName}
                onFocus={() => setTouchedName(true)}
                error={nameError}
                autoCapitalize="words"
              />

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

              <Input
                placeholder="Confirmar senha"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                onFocus={() => setTouchedConfirm(true)}
                error={confirmError}
              />

              <Button
                label={loading ? "Cadastrando..." : "Cadastrar"}
                onPress={handleSignup}
                loading={loading}
              />
            </View>

            <Text style={styles.footerText}>
              Já tem uma conta?{" "}
              <Link href="/" style={styles.footerLink}>
                Faça login.
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
      height: 120,        // 👈 AJUSTE A ALTURA
      marginBottom: 24,
    },
    title: {
      fontSize: 28,
      fontWeight: "900",
      color: COLORS.text,
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
      color: COLORS.primary,
      fontWeight: "700",
    },
  });