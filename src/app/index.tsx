// FUNÇÃO: Tela de login do aplicativo

// Importações 
import { useState } from "react"; // Para criar variáveis que mudam na tela
import { Image, StyleSheet, View, Text, ScrollView, KeyboardAvoidingView, Platform, Alert, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Link } from "expo-router"; // Para navegação entre telas
import { Input } from "@/components/Input"; // Componente de campo de texto
import { Button } from "@/components/Button"; // Componente de botão
import { useAuth } from "@/contexts/AuthContext"; // Hook de autenticação
import { colors, spacing, typography } from "@/styles/theme"; // Cores e estilos

export default function Login() {
    // Estados: variáveis que o React monitora
    const [email, setEmail] = useState(""); // Armazena o e-mail digitado
    const [senha, setSenha] = useState(""); // Armazena a senha digitada
    const { signIn, loading } = useAuth(); // Pega a função de login e o estado de carregamento

    // Função que valida se o e-mail tem formato correto
    const validateEmail = (email: string) => {
        // Regex que verifica: algo@algo.algo
        // Explicação: ^[^\s@]+ (início sem espaços ou @) + @ + [^\s@]+ (domínio sem espaços ou @) + \. + [^\s@]+$ (extensão sem espaços ou @)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Função executada quando o usuário clica em Entrar
    const handleLogin = async () => {
        // Fecha o teclado automaticamente
        Keyboard.dismiss();
        
        // VALIDAÇÃO 1: campos vazios
        if (!email.trim() || !senha) {
            Alert.alert("Erro", "Por favor, preencha todos os campos");
            return;
        }
        
        // VALIDAÇÃO 2: e-mail inválido
        if (!validateEmail(email)) {
            Alert.alert("Erro", "Por favor, insira um e-mail válido");
            return;
        }
        
        // VALIDAÇÃO 3: senha muito curta
        if (senha.length < 6) {
            Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres");
            return;
        }
        
        // Tenta fazer o login chamando a função do contexto
        try {
            await signIn(email, senha); // Se der certo, vai para a tela principal (automaticamente pelo contexto)
        } catch (error) {
            Alert.alert("Erro", "Falha ao fazer login. Tente novamente.");
        }
    };

    return (
        // TouchableWithoutFeedback: tocar em qualquer lugar fecha o teclado
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            
            {/* KeyboardAvoidingView: evita que o teclado cubra os campos */}
            {/* behavior ajusta o comportamento: "padding" no iOS, "height" no Android */}
            <KeyboardAvoidingView 
                style={{ flex: 1 }} 
                behavior={Platform.select({ ios: "padding", android: "height" })}
            >
                {/* ScrollView: permite rolar se o conteúdo for grande */}
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.container}>
                        
                        {/* LOGO */}
                        <Image source={require("@/assets/logo.png")} style={styles.illustration} />

                        {/* TÍTULO */}
                        <Text style={styles.title}>Monetra</Text>
                        <Text style={styles.subtitle}>Gerencie suas finanças de forma inteligente</Text>

                        {/* FORMULÁRIO */}
                        <View style={styles.form}>
                            {/* Campo de E-mail */}
                            <Input 
                                placeholder="E-mail" 
                                keyboardType="email-address" // Teclado com @ e .
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none" // Não capitaliza automaticamente
                            />
                            
                            {/* Campo de Senha */}
                            <Input 
                                placeholder="Senha" 
                                secureTextEntry // Esconde os caracteres digitados (mostra •••)
                                value={senha}
                                onChangeText={setSenha}
                            />

                            {/* BOTÃO DE ENTRAR */}
                            <Button 
                                label={loading ? "Entrando..." : "Entrar"} // Muda texto enquanto carrega
                                onPress={handleLogin}
                                disabled={loading} // Desabilita enquanto carrega
                            />
                        </View>
                        
                        {/* LINK PARA CADASTRO */}
                        <Text style={styles.footerText}>
                            Não tem uma conta? {" "}
                            <Link href="/signup" style={styles.footerLink}>
                                Cadastre-se aqui.
                            </Link>
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}

// ========== ESTILOS DA TELA ==========
const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1, // ScrollView ocupa a tela toda (permite rolagem mesmo com conteúdo pequeno)
    },
    container: {
        flex: 1, // Ocupa a tela toda
        backgroundColor: colors.background, // Fundo escuro (#121212)
        padding: spacing.xl, // Espaçamento interno de 32px
        justifyContent: "center", // Centraliza o conteúdo verticalmente
    },
    illustration: {
        width: "100%",
        height: 200,
        resizeMode: "contain", // Mantém a proporção da imagem sem cortar
        marginBottom: spacing.lg, // Espaço abaixo de 24px
    },
    title: {
        fontSize: 40, // Título grande
        fontWeight: "900", // Negrito máximo (Black)
        color: colors.primary, // Verde (#00C853)
        textAlign: "center", // Centralizado
        marginBottom: spacing.sm, // Espaço abaixo de 8px
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary, // Cinza claro (#9E9E9E)
        textAlign: "center",
        marginBottom: spacing.xl, // Espaço abaixo de 32px
    },
    form: {
        gap: spacing.md, // Espaço entre os campos de 16px (funciona como margin bottom)
    },
    footerText: {
        textAlign: "center",
        marginTop: spacing.lg, // Espaço acima de 24px
        color: colors.textSecondary, // Cinza claro
    },
    footerLink: {
        color: colors.primary, // Link em verde
        fontWeight: "700", // Negrito (Bold)
    },
})