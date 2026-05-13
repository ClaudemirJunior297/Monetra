// Importações de componentes do React Native
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// Ícones da biblioteca Feather
import { Feather } from "@expo/vector-icons";
// Tokens de design (cores, espaçamentos, tipografia)
import { colors, spacing, typography } from "@/styles/theme";
// Hook de autenticação (contexto)
import { useAuth } from "@/contexts/AuthContext";
// Instância da API (para exibir a URL base)
import { api } from "@/services/api";

// Componente principal da tela de Perfil do usuário
export default function Profile() {
  // Obtém dados do usuário e função de logout do contexto de autenticação
  const { user, signOut } = useAuth();

  // Função que exibe alerta de confirmação antes de deslogar
  const handleLogout = () => {
    Alert.alert("Sair", "Deseja encerrar a sessão atual?", [
      { text: "Cancelar", style: "cancel" },           // Botão cancelar (fecha o alerta)
      { text: "Sair", onPress: signOut, style: "destructive" }, // Botão sair (chama signOut, estilo vermelho)
    ]);
  };

  return (
    <View style={styles.container}>
      {/* ========== CABEÇALHO COM AVATAR E DADOS DO USUÁRIO ========== */}
      <View style={styles.header}>
        {/* Avatar circular com ícone de usuário */}
        <View style={styles.avatar}>
          <Feather name="user" size={40} color={colors.white} />
        </View>
        {/* Nome do usuário (vindo do contexto de autenticação) */}
        <Text style={styles.name}>{user?.name}</Text>
        {/* E-mail do usuário */}
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      {/* ========== PAINEL DE INFORMAÇÕES TÉCNICAS ========== */}
      <View style={styles.panel}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>API conectada</Text>
          {/* Exibe a URL base da API configurada */}
          <Text style={styles.infoValue}>{api.baseUrl}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Sessão</Text>
          {/* Indica se o usuário está autenticado ou não */}
          <Text style={styles.infoValue}>{user ? "Ativa" : "Não autenticada"}</Text>
        </View>
      </View>

      {/* ========== MENU DE OPÇÕES ========== */}
      <View style={styles.menu}>
        {/* Botão de logout (com ícone de saída e texto vermelho) */}
        <TouchableOpacity style={[styles.menuItem, styles.logout]} onPress={handleLogout}>
          <Feather name="log-out" size={24} color={colors.expense} />
          <Text style={[styles.menuText, { color: colors.expense }]}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ========== ESTILOS DO COMPONENTE ==========
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },                                     // Fundo principal da tela
  header: { alignItems: "center", padding: spacing.xl, backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border }, // Cabeçalho com avatar e dados
  avatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", marginBottom: spacing.md }, // Avatar circular (fundo verde)
  name: { ...typography.title, fontSize: 24, color: colors.white, marginBottom: spacing.xs, textAlign: "center" }, // Nome do usuário (grande e branco)
  email: { ...typography.body, color: colors.textSecondary, textAlign: "center" },              // E-mail (cinza claro)
  panel: { margin: spacing.lg, padding: spacing.lg, backgroundColor: colors.card, borderRadius: 8, borderWidth: 1, borderColor: colors.border, gap: spacing.md }, // Cartão de informações técnicas
  infoRow: { gap: spacing.xs },                                                                  // Cada linha do painel (rótulo + valor)
  infoLabel: { ...typography.caption, color: colors.textSecondary },                            // Rótulo da informação (ex: "API conectada")
  infoValue: { ...typography.body, color: colors.text },                                        // Valor da informação (ex: URL da API)
  menu: { padding: spacing.lg },                                                                // Container do menu
  menuItem: { flexDirection: "row", alignItems: "center", padding: spacing.md, backgroundColor: colors.card, borderRadius: 8, gap: spacing.md, borderWidth: 1, borderColor: colors.border }, // Item do menu padrão
  menuText: { ...typography.body, color: colors.text, flex: 1 },                                // Texto do item do menu
  logout: { borderColor: colors.expense },                                                      // Estilo específico para o botão de logout (borda vermelha)
});