// FUNÇÃO: Tela de cadastro de novos usuários

// Importações
import { useState } from "react"; // Para criar variáveis que mudam na tela
import { Image, StyleSheet, View, Text, ScrollView, KeyboardAvoidingView, Platform, Alert, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Link } from "expo-router"; // Para navegação entre telas
import { Input } from "@/components/Input"; // Componente de campo de texto
import { Button } from "@/components/Button"; // Componente de botão
import { useAuth } from "@/contexts/AuthContext"; // Hook de autenticação
import { colors, spacing, typography } from "@/styles/theme"; // Cores e estilos

export default function Signup() {
    // Estados: variáveis que o React monitora
    const [nome, setNome] = useState("");           // Nome do usuário
    const [email, setEmail] = useState("");         // E-mail
    const [senha, setSenha] = useState("");         // Senha
    const [confirmarSenha, setConfirmarSenha] = useState(""); // Confirmação da senha
    const { signUp, loading } = useAuth(); // Pega a função de cadastro e o estado de carregamento

    // Função que valida se o e-mail tem formato correto
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Função executada quando o usuário clica em Cadastrar
    const handleSignup = async () => {
        // Fecha o teclado automaticamente
        Keyboard.dismiss();
        
        // VALIDAÇÃO 1: campos vazios
        if (!nome.trim() || !email.trim() || !senha || !confirmarSenha) {
            Alert.alert("Erro", "Por favor, preencha todos os campos");
            return;
        }
        
        // VALIDAÇÃO 2: nome muito curto
        if (nome.trim().length < 3) {
            Alert.alert("Erro", "O nome deve ter pelo menos 3 caracteres");
            return;
        }
        
        // VALIDAÇÃO 3: e-mail inválido
        if (!validateEmail(email)) {
            Alert.alert("Erro", "Por favor, insira um e-mail válido");
            return;
        }
        
        // VALIDAÇÃO 4: senha muito curta
        if (senha.length < 6) {
            Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres");
            return;
        }
        
        // VALIDAÇÃO 5: senhas não conferem
        if (senha !== confirmarSenha) {
            Alert.alert("Erro", "As senhas não conferem");
            return;
        }
        
        // Tenta criar a conta
        try {
            await signUp(nome, email, senha); // Se der certo, vai para a tela principal
        } catch (error) {
            Alert.alert("Erro", "Falha ao criar conta. Tente novamente.");
        }
    };

    return (
        // TouchableWithoutFeedback: tocar em qualquer lugar fecha o teclado
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            
            {/* KeyboardAvoidingView: evita que o teclado cubra os campos */}
            <KeyboardAvoidingView 
                style={{ flex: 1 }} 
                behavior={Platform.select({ ios: "padding", android: "height" })}
            >
                {/* ScrollView: permite rolar a tela (útil quando teclado aparece) */}
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.container}>
                        
                        {/* LOGO */}
                        <Image source={require("@/assets/logo.png")} style={styles.illustration} />

                        {/* TÍTULOS */}
                        <Text style={styles.title}>Criar Conta</Text>
                        <Text style={styles.subtitle}>Comece a controlar seus gastos hoje</Text>

                        {/* FORMULÁRIO DE CADASTRO */}
                        <View style={styles.form}>
                            {/* Campo: Nome */}
                            <Input 
                                placeholder="Nome completo"
                                value={nome}
                                onChangeText={setNome}
                                autoCapitalize="words" // Primeira letra de cada palavra maiúscula
                            />
                            
                            {/* Campo: E-mail */}
                            <Input 
                                placeholder="E-mail" 
                                keyboardType="email-address" // Teclado com @ e .
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none" // Não coloca letras maiúsculas
                            />
                            
                            {/* Campo: Senha */}
                            <Input 
                                placeholder="Senha" 
                                secureTextEntry // Esconde os caracteres digitados
                                value={senha}
                                onChangeText={setSenha}
                            />
                            
                            {/* Campo: Confirmar Senha */}
                            <Input 
                                placeholder="Confirme sua senha" 
                                secureTextEntry // Esconde os caracteres digitados
                                value={confirmarSenha}
                                onChangeText={setConfirmarSenha}
                            />

                            {/* BOTÃO DE CADASTRAR */}
                            <Button 
                                label={loading ? "Cadastrando..." : "Cadastrar"} 
                                onPress={handleSignup}
                                disabled={loading} // Desabilita enquanto carrega
                            />
                        </View>
                        
                        {/* LINK PARA VOLTAR AO LOGIN */}
                        <Text style={styles.footerText}>
                            Já tem uma conta? {" "}
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

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1, // ScrollView ocupa a tela toda
    },
    container: {
        flex: 1, // Ocupa a tela toda
        backgroundColor: colors.background, // Fundo escuro (#121212)
        padding: spacing.xl, // Espaçamento interno de 32px
        justifyContent: "center", // Centraliza o conteúdo verticalmente
    },
    illustration: {
        width: "100%",
        height: 180,
        resizeMode: "contain", // Mantém a proporção da imagem
        marginBottom: spacing.lg, // Espaço abaixo de 24px
    },
    title: {
        fontSize: 32,
        fontWeight: "900", // Negrito máximo
        color: colors.white, // Texto branco
        textAlign: "center",
        marginBottom: spacing.sm, // Espaço abaixo de 8px
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary, // Cinza claro (#9E9E9E)
        textAlign: "center",
        marginBottom: spacing.xl, // Espaço abaixo de 32px
    },
    form: {
        gap: spacing.md, // Espaço entre os campos de 16px
    },
    footerText: {
        textAlign: "center",
        marginTop: spacing.lg, // Espaço acima de 24px
        color: colors.textSecondary, // Cinza claro
    },
    footerLink: {
        color: colors.primary, // Link em verde
        fontWeight: "700",
    },
})
