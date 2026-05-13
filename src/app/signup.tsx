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
    // Exemplo válido: usuario@dominio.com.br | Exemplo inválido: usuario@dominio (sem ponto)
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Função executada quando o usuário clica em Cadastrar
    const handleSignup = async () => {
        // Fecha o teclado automaticamente (melhora a experiência do usuário)
        Keyboard.dismiss();
        
        // VALIDAÇÃO 1: campos vazios (nenhum campo pode estar em branco)
        if (!nome.trim() || !email.trim() || !senha || !confirmarSenha) {
            Alert.alert("Erro", "Por favor, preencha todos os campos");
            return;
        }
        
        // VALIDAÇÃO 2: nome muito curto (evita nomes como "Jo" ou "A")
        if (nome.trim().length < 3) {
            Alert.alert("Erro", "O nome deve ter pelo menos 3 caracteres");
            return;
        }
        
        // VALIDAÇÃO 3: e-mail inválido (formato incorreto)
        if (!validateEmail(email)) {
            Alert.alert("Erro", "Por favor, insira um e-mail válido");
            return;
        }
        
        // VALIDAÇÃO 4: senha muito curta (mínimo de segurança recomendado)
        if (senha.length < 6) {
            Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres");
            return;
        }
        
        // VALIDAÇÃO 5: senhas não conferem (evita erro de digitação)
        if (senha !== confirmarSenha) {
            Alert.alert("Erro", "As senhas não conferem");
            return;
        }
        
        // Tenta criar a conta chamando a função do contexto de autenticação
        try {
            await signUp(nome, email, senha); // Se der certo, vai para a tela principal (automaticamente)
        } catch (error) {
            Alert.alert("Erro", "Falha ao criar conta. Tente novamente.");
        }
    };

    return (
        // TouchableWithoutFeedback: tocar em qualquer lugar fecha o teclado (boa prática em formulários)
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            
            {/* KeyboardAvoidingView: evita que o teclado cubra os campos */}
            {/* behavior ajusta o comportamento: "padding" no iOS, "height" no Android */}
            <KeyboardAvoidingView 
                style={{ flex: 1 }} 
                behavior={Platform.select({ ios: "padding", android: "height" })}
            >
                {/* ScrollView: permite rolar a tela (útil quando teclado aparece e os campos ficam escondidos) */}
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.container}>
                        
                        {/* LOGO (mesma imagem da tela de login para manter identidade visual) */}
                        <Image source={require("@/assets/logo.png")} style={styles.illustration} />

                        {/* TÍTULOS */}
                        <Text style={styles.title}>Criar Conta</Text>
                        <Text style={styles.subtitle}>Comece a controlar seus gastos hoje</Text>

                        {/* FORMULÁRIO DE CADASTRO */}
                        <View style={styles.form}>
                            {/* Campo: Nome completo */}
                            <Input 
                                placeholder="Nome completo"
                                value={nome}
                                onChangeText={setNome}
                                autoCapitalize="words" // Primeira letra de cada palavra maiúscula (ex: "João Silva")
                            />
                            
                            {/* Campo: E-mail */}
                            <Input 
                                placeholder="E-mail" 
                                keyboardType="email-address" // Teclado com @ e . (facilita digitação)
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none" // Não coloca letras maiúsculas automaticamente
                            />
                            
                            {/* Campo: Senha */}
                            <Input 
                                placeholder="Senha" 
                                secureTextEntry // Esconde os caracteres digitados (exibe •••)
                                value={senha}
                                onChangeText={setSenha}
                            />
                            
                            {/* Campo: Confirmar Senha (reforça que o usuário digitou corretamente) */}
                            <Input 
                                placeholder="Confirme sua senha" 
                                secureTextEntry // Esconde os caracteres digitados
                                value={confirmarSenha}
                                onChangeText={setConfirmarSenha}
                            />

                            {/* BOTÃO DE CADASTRAR */}
                            <Button 
                                label={loading ? "Cadastrando..." : "Cadastrar"} // Texto muda enquanto carrega
                                onPress={handleSignup}
                                disabled={loading} // Desabilita enquanto carrega (evita múltiplos envios)
                            />
                        </View>
                        
                        {/* LINK PARA VOLTAR AO LOGIN (quem já tem conta volta para tela inicial) */}
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

// ========== ESTILOS DA TELA ==========
const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1, // ScrollView ocupa a tela toda (permite rolagem mesmo com conteúdo pequeno)
    },
    container: {
        flex: 1, // Ocupa a tela toda
        backgroundColor: colors.background, // Fundo escuro (#121212) - consistente com o resto do app
        padding: spacing.xl, // Espaçamento interno de 32px
        justifyContent: "center", // Centraliza o conteúdo verticalmente
    },
    illustration: {
        width: "100%",
        height: 180, // Ligeiramente menor que na tela de login (180 vs 200) para dar mais espaço aos campos
        resizeMode: "contain", // Mantém a proporção da imagem sem distorcer
        marginBottom: spacing.lg, // Espaço abaixo de 24px
    },
    title: {
        fontSize: 32, // Título menor que o da tela de login (40 vs 32) pois "Criar Conta" é menor
        fontWeight: "900", // Negrito máximo (Black)
        color: colors.white, // Texto branco (diferente da tela de login que usa verde)
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
        gap: spacing.md, // Espaço entre os campos de 16px (funciona como margin bottom)
    },
    footerText: {
        textAlign: "center",
        marginTop: spacing.lg, // Espaço acima de 24px
        color: colors.textSecondary, // Cinza claro
    },
    footerLink: {
        color: colors.primary, // Link em verde (#00C853) - destaque visual
        fontWeight: "700", // Negrito (Bold)
    },
})