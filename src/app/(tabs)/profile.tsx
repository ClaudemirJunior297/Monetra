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

// Importa autenticação
import { useAuth } from "@/contexts/AuthContext";

// Importa a API
import { api } from "@/services/api";

// Função principal da tela
export default function Profile() {

  // Pega os dados do usuário
  const { user, signOut } = useAuth();

  // Função: Fazer logout
  const handleLogout = () => {

    // Mostra alerta de confirmação
    Alert.alert(
      "Sair",
      "Deseja encerrar a sessão atual?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },

        {
          text: "Sair",
          onPress: signOut,
          style: "destructive"
        },
      ]
    );
  };

  return (

    // Container principal
    <View style={styles.container}>

      {/* Cabeçalho */}
      <View style={styles.header}>

        {/* Avatar */}
        <View style={styles.avatar}>

          <Feather
            name="user"
            size={40}
            color={colors.white}
          />

        </View>

        {/* Nome do usuário */}
        <Text style={styles.name}>
          {user?.name}
        </Text>

        {/* Email do usuário */}
        <Text style={styles.email}>
          {user?.email}
        </Text>

      </View>

      {/* Painel de informações */}
      <View style={styles.panel}>

        {/* Informação da API */}
        <View style={styles.infoRow}>

          <Text style={styles.infoLabel}>
            API conectada
          </Text>

          <Text style={styles.infoValue}>
            {api.baseUrl}
          </Text>

        </View>

        {/* Informação da sessão */}
        <View style={styles.infoRow}>

          <Text style={styles.infoLabel}>
            Sessão
          </Text>

          <Text style={styles.infoValue}>
            {user ? "Ativa" : "Não autenticada"}
          </Text>

        </View>

      </View>

      {/* Menu */}
      <View style={styles.menu}>

        {/* Botão sair */}
        <TouchableOpacity
          style={[styles.menuItem, styles.logout]}
          onPress={handleLogout}
        >

          <Feather
            name="log-out"
            size={24}
            color={colors.expense}
          />

          <Text
            style={[
              styles.menuText,
              { color: colors.expense }
            ]}
          >
            Sair
          </Text>

        </TouchableOpacity>

      </View>

    </View>
  );
}

// Estilos da tela
const styles = StyleSheet.create({

  // Container principal
  container: {
    flex: 1,
    backgroundColor: colors.background
  },

  // Cabeçalho
  header: {
    alignItems: "center",
    padding: spacing.xl,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },

  // Avatar
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md
  },

  // Nome do usuário
  name: {
    ...typography.title,
    fontSize: 24,
    color: colors.white,
    marginBottom: spacing.xs,
    textAlign: "center"
  },

  // Email do usuário
  email: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center"
  },

  // Painel de informações
  panel: {
    margin: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md
  },

  // Linha de informações
  infoRow: {
    gap: spacing.xs
  },

  // Texto do título
  infoLabel: {
    ...typography.caption,
    color: colors.textSecondary
  },

  // Valor da informação
  infoValue: {
    ...typography.body,
    color: colors.text
  },

  // Área do menu
  menu: {
    padding: spacing.lg
  },

  // Item do menu
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

  // Texto do menu
  menuText: {
    ...typography.body,
    color: colors.text,
    flex: 1
  },

  // Botão logout
  logout: {
    borderColor: colors.expense
  },
});