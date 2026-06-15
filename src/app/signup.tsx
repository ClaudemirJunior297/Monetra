/**
 * TELA DE CADASTRO - Com logo personalizada
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
  primary: "#c859ff",      // Cor do link (azul)
  text: "#FFFFFF",         // Texto branco
  textSecondary: "#888888", // Texto secundário (cinza)
};

export default function Signup() {
  const c = useColors();
  // Pega função de cadastro e estado de loading do contexto
  const { signUp, loading } = useAuth();

  // Estados do formulário
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Estados de erro
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  
  // Estados para saber se o campo já foi tocado
  const [touchedName, setTouchedName] = useState(false);
  const [touchedEmail, setTouchedEmail] = useState(false);
  const [touchedPassword, setTouchedPassword] = useState(false);
  const [touchedConfirm, setTouchedConfirm] = useState(false);

  // Valida nome em tempo real
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

  // Valida e-mail em tempo real
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

  // Valida senha em tempo real
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

  // Valida confirmação de senha em tempo real
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

  // Função executada ao clicar em Cadastrar
  const handleSignup = async () => {
    setTouchedName(true);
    setTouchedEmail(true);
    setTouchedPassword(true);
    setTouchedConfirm(true);
    Keyboard.dismiss();  // Fecha o teclado

    // Verifica se os campos estão preenchidos e sem erros
    if (!name || !email || !password || !confirmPassword) return;
    if (nameError || emailError || passwordError || confirmError) return;

    try {
      await signUp(name, email, password);
      router.replace("/(tabs)");
    } catch (err) {
      console.log(err);
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
            <Text style={styles.title}>Criar Conta</Text>
            <Text style={styles.subtitle}>Comece a controlar seus gastos hoje</Text>

            {/* Formulário */}
            <View style={styles.form}>

              {/* Campo nome completo */}
              <Input
                placeholder="Nome completo"
                value={name}
                onChangeText={setName}
                onFocus={() => setTouchedName(true)}
                error={nameError}
                autoCapitalize="words"
              />

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

              {/* Campo confirmar senha */}
              <Input
                placeholder="Confirmar senha"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                onFocus={() => setTouchedConfirm(true)}
                error={confirmError}
              />

              {/* Botão cadastrar */}
              <Button
                label={loading ? "Cadastrando..." : "Cadastrar"}
                onPress={handleSignup}
                loading={loading}
              />
            </View>

            {/* Link para tela de login */}
            <Text style={styles.footerText}>
              Já tem uma conta?{" "}
              <Link href="/login" style={styles.footerLink}>
                Faça login.
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
      fontSize: 28,
      fontWeight: "900",
      color: c.text,
      textAlign: "center",
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      color: "#FFFFFF",
      textAlign: "center",
      marginBottom: 32,
    },
    form: {
      gap: 16,
    },
    footerText: {
      textAlign: "center",
      marginTop: 24,
      color: "#FFFFFF",
    },
    footerLink: {
      color: c.primary,
      fontWeight: "700",
    },
  });