/**
 * TELA DE LOGIN - Com logo e cores atualizadas
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
import { useColors } from "@/hooks/useColors";

// Cores fixas da tela
const COLORS = {
  background: "#121212",   // Fundo escuro
  primary: "#c859ff",      // Cor do botão e link (lilás)
  text: "#FFFFFF",         // Texto branco
  textSecondary: "#888888", // Texto secundário (cinza)
};

export default function Login() {
  const c = useColors();
  // Pega função de login e estado de loading do contexto
  const { signIn, loading } = useAuth();

  // Estados do formulário
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Estados de erro
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");
  
  // Estados para saber se o campo já foi tocado
  const [touchedEmail, setTouchedEmail] = useState(false);
  const [touchedPassword, setTouchedPassword] = useState(false);

  // Valida o e-mail em tempo real
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

  // Valida a senha em tempo real
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

  // Função executada ao clicar em Entrar
  const handleLogin = async () => {
    setTouchedEmail(true);
    setTouchedPassword(true);
    Keyboard.dismiss();  // Fecha o teclado

    // Verifica se os campos estão preenchidos e sem erros
    if (!email || !password) return;
    if (emailError || passwordError) return;

    setLoginError("");
    try {
      await signIn(email, password);
      router.replace("/(tabs)");
    } catch (err: any) {
      setLoginError("E-mail ou senha incorretos.");
    }
  };

  const styles = getStyles(c);

  return (
    // Fecha o teclado ao tocar fora dos inputs
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      
      {/* Evita que o teclado cubra os campos */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: "padding", android: "height" })}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>

            {/* Logo do aplicativo */}
            <Image 
              source={require("@/assets/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />

            {/* Título e subtítulo */}
            <Text style={styles.title}>Monetra</Text>
            <Text style={styles.subtitle}>Gerencie suas finanças de forma inteligente</Text>

            {/* Formulário */}
            <View style={styles.form}>
              
              {/* Campo e-mail */}
              <Input
                placeholder="E-mail"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setTouchedEmail(true)}
                autoCapitalize="none"
                error={emailError}
              />

              {/* Campo senha */}
              <Input
                placeholder="Senha"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                onFocus={() => setTouchedPassword(true)}
                error={passwordError}
              />

              {/* Erro de login */}
              {loginError ? <Text style={{ color: "#ff4d4d", textAlign: "center", marginTop: -8 }}>{loginError}</Text> : null}

              {/* Botão entrar */}
              <Button
                label={loading ? "Entrando..." : "Entrar"}
                onPress={handleLogin}
                loading={loading}
              />
            </View>

            {/* Link para tela de cadastro */}
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

// Estilos da tela
const getStyles = (c: any) =>
  StyleSheet.create({
    scrollContainer: {
      flexGrow: 1,
    },
    container: {
      flex: 1,
      backgroundColor: c.bg,
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
      color: "#FFFFFF",
      textAlign: "center",
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      color: c.sub,
      textAlign: "center",
      marginBottom: 32,
    },
    form: {
      gap: 16,
    },
    footerText: {
      textAlign: "center",
      marginTop: 24,
      color: c.sub,
    },
    footerLink: {
      color: c.primary,
      fontWeight: "700",
    },
  });