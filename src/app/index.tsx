// Função: Tela de login do aplicativo

// Importações
import { useState } from "react";
import { Alert, Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";

// Navegação entre telas
import { Link } from "expo-router";

// Componentes personalizados
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";

// Contexto de autenticação
import { useAuth } from "@/contexts/AuthContext";

// Cores e estilos do projeto
import { colors, spacing } from "@/styles/theme";

// Função principal da tela de login
export default function Login() {
    // Estado do e-mail
    const [email, setEmail] = useState("");

    // Estado da senha
    const [senha, setSenha] = useState("");

    // Feedback visual
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
    const [feedbackType, setFeedbackType] = useState<'error' | 'success' | null>(null);

    // Função de login e loading
    const { signIn, loading } = useAuth();

    // Função: Validar e-mail
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Função: Fazer login
    const handleLogin = async () => {
        // Fecha o teclado
        Keyboard.dismiss();
        setFeedbackMessage(null);
        setFeedbackType(null);

        // Verifica campos vazios
        if (!email.trim() || !senha) {
            Alert.alert("Erro", "Por favor, preencha todos os campos");
            return;
        }

        // Verifica se o e-mail é válido
        if (!validateEmail(email)) {
            Alert.alert("Erro", "Por favor, insira um e-mail válido");
            return;
        }

        // Verifica tamanho mínimo da senha
        if (senha.length < 6) {
            Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres");
            return;
        }

        try {
            // Faz login
            await signIn(email, senha);
            setFeedbackType('success');
            setFeedbackMessage('Login realizado com sucesso.');
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            setFeedbackType('error');
            setFeedbackMessage(message || 'Falha ao fazer login. Tente novamente.');
            Alert.alert("Erro", message || "Falha ao fazer login. Tente novamente.");
        }
    };

    return (
        // Fecha teclado ao tocar fora
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            {/* Evita teclado cobrir os inputs */}
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.select({ ios: "padding", android: "height" })}
            >
                {/* Permite rolagem da tela */}
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {/* Container principal */}
                    <View style={styles.container}>
                        {/* Logo do app */}
                        <Image
                            source={require("@/assets/logo.png")}
                            style={styles.illustration}
                        />

                        {/* Título */}
                        <Text style={styles.title}>Monetra</Text>

                        {/* Subtítulo */}
                        <Text style={styles.subtitle}>
                            Gerencie suas finanças de forma inteligente
                        </Text>

                        {/* Formulário */}
                        <View style={styles.form}>
                            {/* Campo de e-mail */}
                            <Input
                                placeholder="E-mail"
                                keyboardType="email-address"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                            />

                            {/* Campo de senha */}
                            <Input
                                placeholder="Senha"
                                secureTextEntry
                                value={senha}
                                onChangeText={setSenha}
                            />

                            {/* Botão de login */}
                            <Button
                                label={loading ? "Entrando..." : "Entrar"}
                                onPress={handleLogin}
                                disabled={loading}
                            />

                            {feedbackMessage ? (
                                <Text style={[styles.feedback, feedbackType === 'error' ? styles.errorText : styles.successText]}>
                                    {feedbackMessage}
                                </Text>
                            ) : null}
                        </View>

                        {/* Link para cadastro */}
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
const styles = StyleSheet.create({

    // ScrollView
    scrollContainer: {
        flexGrow: 1,
    },

    // Container principal
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: spacing.xl,
        justifyContent: "center",
    },

    // Logo
    illustration: {
        width: "100%",
        height: 200,
        resizeMode: "contain",
        marginBottom: spacing.lg,
    },

    // Título
    title: {
        fontSize: 40,
        fontWeight: "900",
        color: colors.primary,
        textAlign: "center",
        marginBottom: spacing.sm,
    },

    // Subtítulo
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: "center",
        marginBottom: spacing.xl,
    },

    // Formulário
    form: {
        gap: spacing.md,
    },

    feedback: {
        marginTop: spacing.sm,
        fontSize: 14,
        textAlign: 'center',
    },

    errorText: {
        color: '#ff3860',
    },

    successText: {
        color: '#00c853',
    },

    // Texto inferior
    footerText: {
        textAlign: "center",
        marginTop: spacing.lg,
        color: colors.textSecondary,
    },

    // Link de cadastro
    footerLink: {
        color: colors.primary,
        fontWeight: "700",
    },
})