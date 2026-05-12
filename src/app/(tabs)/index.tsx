import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { colors, spacing, typography } from "@/styles/theme";
import { useTransactions } from "@/contexts/TransactionContext";

const currency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function Dashboard() {
  const { transactions, summary, loading, error, refresh } = useTransactions();
  const categoryEntries = Object.entries(summary.categoryBreakdown)
    .sort(([, a], [, b]) => (b || 0) - (a || 0));
  const recentTransactions = transactions.slice(0, 5);

  useFocusEffect(useCallback(() => {
    refresh();
  }, [refresh]));

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.primary} />}
    >
      <View style={styles.header}>
        <Text style={styles.appName}>Monetra</Text>
        <Text style={styles.balanceLabel}>Saldo disponível</Text>
        <Text style={styles.balanceValue}>{currency(summary.balance)}</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Receitas</Text>
            <Text style={[styles.summaryValue, { color: colors.success }]}>{currency(summary.totalIncome)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Despesas</Text>
            <Text style={[styles.summaryValue, { color: colors.expense }]}>{currency(summary.totalExpense)}</Text>
          </View>
        </View>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {loading && transactions.length === 0 ? (
        <View style={styles.stateBox}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.stateText}>Carregando dados financeiros...</Text>
        </View>
      ) : null}

      {!loading && transactions.length === 0 ? (
        <View style={styles.stateBox}>
          <Text style={styles.stateTitle}>Nenhuma transação registrada</Text>
          <Text style={styles.stateText}>Cadastre sua primeira receita ou despesa para iniciar o painel.</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => router.push("/(tabs)/add")}>
            <Text style={styles.primaryButtonText}>Registrar transação</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {categoryEntries.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gastos por categoria</Text>
          {categoryEntries.map(([category, amount]) => {
            const percentage = summary.totalExpense > 0 ? ((amount || 0) / summary.totalExpense) * 100 : 0;
            return (
              <View key={category} style={styles.categoryItem}>
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryName}>{category}</Text>
                  <Text style={styles.categoryPercentage}>{percentage.toFixed(0)}%</Text>
                </View>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${Math.min(percentage, 100)}%` }]} />
                </View>
                <Text style={styles.categoryAmount}>{currency(amount || 0)}</Text>
              </View>
            );
          })}
        </View>
      ) : null}

      {recentTransactions.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transações recentes</Text>
          {recentTransactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionDesc}>{transaction.description}</Text>
                <Text style={styles.transactionCategory}>
                  {transaction.category} - {transaction.date.toLocaleDateString("pt-BR")}
                </Text>
              </View>
              <Text style={[
                styles.transactionAmount,
                { color: transaction.type === "income" ? colors.success : colors.expense },
              ]}>
                {transaction.type === "income" ? "+ " : "- "}{currency(transaction.amount)}
              </Text>
            </View>
          ))}
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.card, padding: spacing.lg, paddingTop: spacing.xxl, borderBottomWidth: 1, borderBottomColor: colors.border },
  appName: { ...typography.title, color: colors.primary, marginBottom: spacing.lg },
  balanceLabel: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.xs },
  balanceValue: { ...typography.title, fontSize: 42, color: colors.white, marginBottom: spacing.lg },
  summaryRow: { flexDirection: "row", gap: spacing.md, marginTop: spacing.md },
  summaryItem: { flex: 1 },
  summaryLabel: { ...typography.caption, color: colors.textSecondary },
  summaryValue: { ...typography.subtitle, fontSize: 18 },
  error: { color: colors.alert, padding: spacing.lg },
  stateBox: { padding: spacing.xl, alignItems: "center", gap: spacing.md },
  stateTitle: { ...typography.subtitle, color: colors.white, textAlign: "center" },
  stateText: { ...typography.body, color: colors.textSecondary, textAlign: "center" },
  primaryButton: { backgroundColor: colors.primary, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: 8 },
  primaryButtonText: { color: colors.white, fontWeight: "700" },
  section: { padding: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.border },
  sectionTitle: { ...typography.subtitle, color: colors.white, marginBottom: spacing.md },
  categoryItem: { marginBottom: spacing.md },
  categoryHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.xs },
  categoryName: { ...typography.body, color: colors.text },
  categoryPercentage: { ...typography.body, color: colors.textSecondary },
  categoryAmount: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.xs },
  progressBar: { height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 4, backgroundColor: colors.category },
  transactionItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border, gap: spacing.md },
  transactionInfo: { flex: 1 },
  transactionDesc: { ...typography.body, color: colors.white },
  transactionCategory: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  transactionAmount: { ...typography.body, fontWeight: "600" },
});
