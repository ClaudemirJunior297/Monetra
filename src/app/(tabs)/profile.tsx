// Função: Mostrar informações do perfil do usuário

import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors, spacing, typography } from "@/styles/theme";
import { useAuth } from "@/contexts/AuthContext";

export default function Profile() {

  const { user, signOut } = useAuth();

  // Função: Fazer logout com confirmação
  const handleLogout = () => {
    Alert.alert(
      "Sair",
      "Deseja encerrar a sessão atual?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sair", 
          onPress: () => {
            console.log("Botão Sair pressionado");
            signOut();
          },
          style: "destructive" 
        },
      ]
    );
  };

  return (
    <View style={styles.container}>

      {/* CABEÇALHO COM AVATAR */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Feather name="user" size={40} color={colors.white} />
        </View>
        <Text style={styles.name}>{user?.name || "Usuário"}</Text>
        <Text style={styles.email}>{user?.email || "usuario@email.com"}</Text>
      </View>

      {/* PAINEL DE INFORMAÇÕES */}
      <View style={styles.panel}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Sessão</Text>
          <Text style={styles.infoValue}>{user ? "Ativa" : "Não autenticada"}</Text>
        </View>
      </View>

      {/* MENU DE OPÇÕES */}
      <View style={styles.menu}>
        <TouchableOpacity
          style={[styles.menuItem, styles.logout]}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Feather name="log-out" size={24} color={colors.expense} />
          <Text style={[styles.menuText, { color: colors.expense }]}>Sair</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  header: {
    alignItems: "center",
    padding: spacing.xl,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md
  },
  name: {
    ...typography.title,
    fontSize: 24,
    color: colors.white,
    marginBottom: spacing.xs,
    textAlign: "center"
  },
  email: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center"
  },
  panel: {
    margin: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md
  },
  infoRow: {
    gap: spacing.xs
  },
  infoLabel: {
    ...typography.caption,
    color: colors.textSecondary
  },
  infoValue: {
    ...typography.body,
    color: colors.text
  },
  menu: {
    padding: spacing.lg
  },
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
  menuText: {
    ...typography.body,
    color: colors.text,
    flex: 1
  },
  logout: {
    borderColor: colors.expense
  },
});