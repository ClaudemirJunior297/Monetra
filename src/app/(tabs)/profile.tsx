// Função: Mostrar informações do perfil do usuário

// Importa componentes do React Native
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

// Importa ícones
import { Feather } from "@expo/vector-icons";

// Importa cores e estilos
import { colors, spacing, typography } from "@/styles/theme";

// Importa autenticação (dados do usuário e função de logout)
import { useAuth } from "@/contexts/AuthContext";

// Importa a API (para mostrar a URL)
import { api } from "@/services/api";

// Função principal da tela de perfil
export default function Profile() {

  // Pega os dados do usuário e a função de logout do contexto
  const { user, signOut } = useAuth();

  // Função: Fazer logout com confirmação
  const handleLogout = () => {

    // Mostra alerta de confirmação antes de sair
    Alert.alert(
      "Sair",
      "Deseja encerrar a sessão atual?",
      [
        { text: "Cancelar", style: "cancel" },      // Botão cancelar
        { text: "Sair", onPress: signOut, style: "destructive" },  // Botão sair (vermelho)
      ]
    );
  };

  return (

    // Container principal da tela
    <View style={styles.container}>

      {/* ========== CABEÇALHO COM AVATAR ========== */}
      <View style={styles.header}>

        {/* Avatar circular com ícone de usuário */}
        <View style={styles.avatar}>
          <Feather name="user" size={40} color={colors.white} />
        </View>

        {/* Nome do usuário logado */}
        <Text style={styles.name}>{user?.name}</Text>

        {/* E-mail do usuário logado */}
        <Text style={styles.email}>{user?.email}</Text>

      </View>

      {/* ========== PAINEL DE INFORMAÇÕES TÉCNICAS ========== */}
      <View style={styles.panel}>

        {/* Informação da API */}
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>API conectada</Text>
          <Text style={styles.infoValue}>{api.baseUrl}</Text>
        </View>

        {/* Informação da sessão (ativa ou não) */}
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Sessão</Text>
          <Text style={styles.infoValue}>{user ? "Ativa" : "Não autenticada"}</Text>
        </View>

      </View>

      {/* ========== MENU DE OPÇÕES ========== */}
      <View style={styles.menu}>

        {/* Botão de logout (com ícone e texto vermelho) */}
        <TouchableOpacity
          style={[styles.menuItem, styles.logout]}
          onPress={handleLogout}
        >
          <Feather name="log-out" size={24} color={colors.expense} />
          <Text style={[styles.menuText, { color: colors.expense }]}>Sair</Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

// ========== ESTILOS DA TELA ==========
const styles = StyleSheet.create({

  // Container principal
  container: {
    flex: 1,
    backgroundColor: colors.background
  },

  // Cabeçalho (avatar + nome + email)
  header: {
    alignItems: "center",
    padding: spacing.xl,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },

  // Avatar circular (fundo colorido com ícone)
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md
  },

  // Nome do usuário (destaque)
  name: {
    ...typography.title,
    fontSize: 24,
    color: colors.white,
    marginBottom: spacing.xs,
    textAlign: "center"
  },

  // E-mail do usuário (texto secundário)
  email: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center"
  },

  // Painel de informações técnicas
  panel: {
    margin: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md
  },

  // Cada linha do painel (rótulo + valor)
  infoRow: {
    gap: spacing.xs
  },

  // Rótulo da informação
  infoLabel: {
    ...typography.caption,
    color: colors.textSecondary
  },

  // Valor da informação
  infoValue: {
    ...typography.body,
    color: colors.text
  },

  // Container do menu
  menu: {
    padding: spacing.lg
  },

  // Item do menu (genérico)
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    backgroundColor: colors.card,
    borderRadius: 8,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border
  },

  // Texto do item do menu
  menuText: {
    ...typography.body,
    color: colors.text,
    flex: 1
  },

  // Botão logout (borda vermelha)
  logout: {
    borderColor: colors.expense
  },
});