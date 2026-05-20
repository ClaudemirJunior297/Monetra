// Função: Tela de cadastro de usuários

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

// Função principal da tela de cadastro
export default function Signup() {

    // Estado do nome
    const [nome, setNome] = useState("");

    // Estado do e-mail
    const [email, setEmail] = useState("");

    // Estado da senha
    const [senha, setSenha] = useState("");

    // Estado da confirmação da senha
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
    const [feedbackType, setFeedbackType] = useState<'error' | 'success' | null>(null);

    // Função de cadastro e loading
    const { signUp, loading } = useAuth();

    // Função: Validar e-mail
    const validateEmail = (email: string) => {

        // Regex para validar formato do e-mail
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return emailRegex.test(email);
    };

    // Função: Fazer cadastro
    const handleSignup = async () => {

        // Fecha o teclado
        Keyboard.dismiss();
        setFeedbackMessage(null);
        setFeedbackType(null);

        // Verifica campos vazios
        if (!nome.trim() || !email.trim() || !senha || !confirmarSenha) {
            Alert.alert("Erro", "Por favor, preencha todos os campos");
            return;
        }

        // Verifica tamanho do nome
        if (nome.trim().length < 3) {
            Alert.alert("Erro", "O nome deve ter pelo menos 3 caracteres");
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

        // Verifica se as senhas são iguais
        if (senha !== confirmarSenha) {
            Alert.alert("Erro", "As senhas não conferem");
            return;
        }

        try {

            // Faz cadastro
            await signUp(nome, email, senha);
            setFeedbackType('success');
            setFeedbackMessage('Conta criada com sucesso.');

        } catch (error) {

            const message = error instanceof Error ? error.message : String(error);
            setFeedbackType('error');
            setFeedbackMessage(message || 'Falha ao criar conta. Tente novamente.');
            Alert.alert("Erro", message || "Falha ao criar conta. Tente novamente.");
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
                        <Text style={styles.title}>Criar Conta</Text>

                        {/* Subtítulo */}
                        <Text style={styles.subtitle}>
                            Comece a controlar seus gastos hoje
                        </Text>

                        {/* Formulário */}
                        <View style={styles.form}>

                            {/* Campo nome */}
                            <Input
                                placeholder="Nome completo"
                                value={nome}
                                onChangeText={setNome}
                                autoCapitalize="words"
                            />

                            {/* Campo e-mail */}
                            <Input
                                placeholder="E-mail"
                                keyboardType="email-address"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                            />

                            {/* Campo senha */}
                            <Input
                                placeholder="Senha"
                                secureTextEntry
                                value={senha}
                                onChangeText={setSenha}
                            />

                            {/* Campo confirmar senha */}
                            <Input
                                placeholder="Confirme sua senha"
                                secureTextEntry
                                value={confirmarSenha}
                                onChangeText={setConfirmarSenha}
                            />

                            {/* Botão cadastrar */}
                            <Button
                                label={loading ? "Cadastrando..." : "Cadastrar"}
                                onPress={handleSignup}
                                disabled={loading}
                            />
                            {feedbackMessage ? (
                                <Text style={[styles.feedback, feedbackType === 'error' ? styles.errorText : styles.successText]}>
                                    {feedbackMessage}
                                </Text>
                            ) : null}
                        </View>

                        {/* Link para login */}
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
    )
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
        height: 180,
        resizeMode: "contain",
        marginBottom: spacing.lg,
    },

    // Título
    title: {
        fontSize: 32,
        fontWeight: "900",
        color: colors.white,
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

    // Link de login
    footerLink: {
        color: colors.primary,
        fontWeight: "700",
    },
})