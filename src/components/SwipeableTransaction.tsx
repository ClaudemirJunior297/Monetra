/* COMPONENTE: Item de transação com gesto de deslizar (swipe) */

import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import { Transaction } from "@/types/transaction";

// Cores fixas
const COLORS = {
  card: "#2A2A3A",
  cardBorder: "#3A3A4A",
  primary: "#c859ff",
  expense: "#ef5350",
  income: "#66bb6a",
  text: "#FFFFFF",
  textSecondary: "#888888",
  white: "#FFFFFF",
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
};

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
        onPress={() => onEdit()}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <Feather name="edit-2" size={24} color={COLORS.white} />
          <Text style={styles.actionText}>Editar</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

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
        onPress={() => onDelete()}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <Feather name="trash-2" size={24} color={COLORS.white} />
          <Text style={styles.actionText}>Excluir</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <GestureHandlerRootView>
      <Swipeable
        renderRightActions={renderRightActions}
        renderLeftActions={renderLeftActions}
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
                color: transaction.type === "income" ? COLORS.income : COLORS.expense,
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

const styles = StyleSheet.create({
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDesc: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "600",
    marginBottom: 4,
  },
  transactionMeta: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  transactionAmount: {
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
    backgroundColor: COLORS.primary,
    marginLeft: spacing.xs,
  },
  deleteAction: {
    backgroundColor: COLORS.expense,
    marginRight: spacing.xs,
  },
  actionText: {
    fontSize: 12,
    color: COLORS.white,
    marginTop: 4,
    fontWeight: "600",
  },
});