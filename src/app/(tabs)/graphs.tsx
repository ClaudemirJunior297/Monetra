// Função: Mostrar gráficos e indicadores das transações

// Importa componentes do React Native
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";

// Importa hook para atualizar ao abrir a tela
import { useFocusEffect } from "expo-router";

// Importa hook para otimizar funções
import { useCallback } from "react";

// Importa cores e estilos
import { colors, spacing, typography } from "@/styles/theme";

// Importa o contexto das transações
import { useTransactions } from "@/contexts/TransactionContext";

// Função: Formatar valor em moeda brasileira
const currency = (value: number) =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

// Função principal da tela
export default function Graphs() {

  // Pega dados e funções das transações
  const { summary, transactions, loading, error, refresh } = useTransactions();

  // Organiza categorias do maior valor para o menor
  const entries = Object.entries(summary.categoryBreakdown).sort(
    ([, a], [, b]) => (b || 0) - (a || 0)
  );

  // Atualiza os dados ao entrar na tela
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  return (

    // Tela com rolagem
    <ScrollView
      style={styles.container}

      // Atualização ao puxar a tela
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={refresh}
          tintColor={colors.primary}
        />
      }
    >

      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Indicadores</Text>
        <Text style={styles.headerSubtitle}>Baseados nas transações cadastradas</Text>
      </View>

      {/* Mensagem de erro */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Card do total de despesas */}
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Despesas registradas</Text>
        <Text style={styles.totalValue}>{currency(summary.totalExpense)}</Text>
        <Text style={styles.totalHint}>{transactions.length} transações no banco</Text>
      </View>

      {/* Loading */}
      {loading && transactions.length === 0 ? (
        <View style={styles.stateBox}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : null}

      {/* Mensagem quando não existem despesas */}
      {!loading && entries.length === 0 ? (
        <View style={styles.stateBox}>
          <Text style={styles.emptyTitle}>Sem despesas para analisar</Text>
          <Text style={styles.emptyText}>Os gráficos aparecem automaticamente quando houver despesas salvas.</Text>
        </View>
      ) : null}

      {/* Lista de categorias */}
      {entries.length > 0 ? (
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Distribuição por categoria</Text>

          {entries.map(([category, amount]) => {

            // Calcula porcentagem da categoria
            const percentage = summary.totalExpense > 0
              ? ((amount || 0) / summary.totalExpense) * 100
              : 0;

            return (
              <View key={category} style={styles.categoryItem}>

                {/* Cabeçalho da categoria */}
                <View style={styles.categoryHeader}>
                  <View style={styles.colorDot} />
                  <Text style={styles.categoryName}>{category}</Text>
                  <Text style={styles.categoryPercentage}>{percentage.toFixed(0)}%</Text>
                </View>

                {/* Barra de progresso */}
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${Math.min(percentage, 100)}%` }]} />
                </View>

                {/* Valor da categoria */}
                <Text style={styles.categoryAmount}>{currency(amount || 0)}</Text>
              </View>
            );
          })}
        </View>
      ) : null}

    </ScrollView>
  );
}

// Estilos da tela
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background
  },

  header: {
    backgroundColor: colors.card,
    padding: spacing.lg,
    paddingTop: spacing.xxl,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },

  headerTitle: {
    ...typography.title,
    color: colors.white
  },

  headerSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: "center"
  },

  // CORRIGIDO: alert -> error
  error: {
    color: colors.error,
    padding: spacing.lg
  },

  totalCard: {
    backgroundColor: colors.card,
    margin: spacing.lg,
    padding: spacing.lg,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border
  },

  totalLabel: {
    ...typography.body,
    color: colors.textSecondary
  },

  totalValue: {
    ...typography.title,
    fontSize: 34,
    color: colors.expense,
    marginTop: spacing.sm
  },

  totalHint: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.sm
  },

  chartContainer: {
    padding: spacing.lg
  },

  sectionTitle: {
    ...typography.subtitle,
    color: colors.white,
    marginBottom: spacing.md
  },

  categoryItem: {
    marginBottom: spacing.md
  },

  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs
  },

  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.sm,
    backgroundColor: colors.category
  },

  categoryName: {
    ...typography.body,
    color: colors.text,
    flex: 1
  },

  categoryPercentage: {
    ...typography.body,
    color: colors.textSecondary
  },

  categoryAmount: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs
  },

  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: "hidden"
  },

  progressFill: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: colors.category
  },

  stateBox: {
    padding: spacing.xl,
    alignItems: "center",
    gap: spacing.sm
  },

  emptyTitle: {
    ...typography.subtitle,
    color: colors.white,
    textAlign: "center"
  },

  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center"
  },
});