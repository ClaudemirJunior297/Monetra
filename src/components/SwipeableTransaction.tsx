/*COMPONENTE SWIPEABLE TRANSACTION - Item de transação com gesto de deslizar*/

import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { colors, spacing, typography } from "@/styles/theme";
import { Transaction } from "@/types/transaction";

// Função para formatar moeda (padrão brasileiro)
const currency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface SwipeableTransactionProps {
  transaction: Transaction;
  onEdit: () => void;
  onDelete: () => void;
}

export function SwipeableTransaction({
  transaction,
  onEdit,
  onDelete,
}: SwipeableTransactionProps) {
  // Renderiza o botão de EDITAR (aparece ao deslizar para DIREITA)
  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });

    return (
      <TouchableOpacity
        style={[styles.actionButton, styles.editAction]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onEdit();
        }}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <Feather name="edit-2" size={24} color={colors.white} />
          <Text style={styles.actionText}>Editar</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  // Renderiza o botão de EXCLUIR (aparece ao deslizar para ESQUERDA)
  const renderLeftActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: "clamp",
    });

    return (
      <TouchableOpacity
        style={[styles.actionButton, styles.deleteAction]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          onDelete();
        }}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <Feather name="trash-2" size={24} color={colors.white} />
          <Text style={styles.actionText}>Excluir</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <GestureHandlerRootView>
      <Swipeable
        renderRightActions={renderRightActions}    // Deslizar esquerda -> Editar
        renderLeftActions={renderLeftActions}      // Deslizar direita -> Excluir
        overshootRight={false}
        overshootLeft={false}
      >
        <View style={styles.transactionItem}>
          <View style={styles.transactionInfo}>
            <Text style={styles.transactionDesc}>{transaction.description}</Text>
            <Text style={styles.transactionMeta}>
              {transaction.category} - {transaction.date.toLocaleDateString("pt-BR")}
            </Text>
          </View>
          <Text
            style={[
              styles.transactionAmount,
              {
                color:
                  transaction.type === "income" ? colors.income : colors.expense,
              },
            ]}
          >
            {transaction.type === "income" ? "+ " : "- "}
            {currency(transaction.amount)}
          </Text>
        </View>
      </Swipeable>
    </GestureHandlerRootView>
  );
}

// ========== ESTILOS DO COMPONENTE ==========
const styles = StyleSheet.create({
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDesc: {
    ...typography.body,
    color: colors.text,
    fontWeight: "600",
    marginBottom: 4,
  },
  transactionMeta: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  transactionAmount: {
    ...typography.subtitle,
    fontSize: 16,
    fontWeight: "700",
  },
  actionButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    marginVertical: spacing.xs,
    borderRadius: 12,
  },
  editAction: {
    backgroundColor: colors.primary,
    marginLeft: spacing.xs,
  },
  deleteAction: {
    backgroundColor: colors.expense,
    marginRight: spacing.xs,
  },
  actionText: {
    ...typography.caption,
    color: colors.white,
    marginTop: 4,
    fontWeight: "600",
  },
});