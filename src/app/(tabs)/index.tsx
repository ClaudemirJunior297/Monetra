// Função: Mostrar o painel principal do aplicativo

// Importa componentes do React Native
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

// Importa navegação e atualização ao abrir a tela
import { router, useFocusEffect } from "expo-router";

// Importa hook para otimizar funções
import { useCallback } from "react";

// Importa cores e estilos
import { colors, spacing, typography } from "@/styles/theme";

// Importa o contexto das transações
import { useTransactions } from "@/contexts/TransactionContext";

// Função: Formatar valores em moeda brasileira
const currency = (value: number) =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

// Função principal da tela
export default function Dashboard() {

  // Pega os dados das transações
  const {
    transactions,
    summary,
    loading,
    error,
    refresh
  } = useTransactions();

  // Organiza categorias pelo maior valor
  const categoryEntries = Object.entries(summary.categoryBreakdown)
    .sort(([, a], [, b]) => (b || 0) - (a || 0));

  // Pega as últimas 5 transações
  const recentTransactions = transactions.slice(0, 5);

  // Atualiza os dados ao abrir a tela
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  return (

    // Tela com rolagem
    <ScrollView
      style={styles.container}

      // Atualizar ao puxar a tela
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

        {/* Nome do app */}
        <Text style={styles.appName}>
          Monetra
        </Text>

        {/* Texto saldo */}
        <Text style={styles.balanceLabel}>
          Saldo disponível
        </Text>

        {/* Valor do saldo */}
        <Text style={styles.balanceValue}>
          {currency(summary.balance)}
        </Text>

        {/* Área de receitas e despesas */}
        <View style={styles.summaryRow}>

          {/* Receitas */}
          <View style={styles.summaryItem}>

            <Text style={styles.summaryLabel}>
              Receitas
            </Text>

            <Text
              style={[
                styles.summaryValue,
                { color: colors.success }
              ]}
            >
              {currency(summary.totalIncome)}
            </Text>

          </View>

          {/* Despesas */}
          <View style={styles.summaryItem}>

            <Text style={styles.summaryLabel}>
              Despesas
            </Text>

            <Text
              style={[
                styles.summaryValue,
                { color: colors.expense }
              ]}
            >
              {currency(summary.totalExpense)}
            </Text>

          </View>

        </View>

      </View>

      {/* Mensagem de erro */}
      {error ? (
        <Text style={styles.error}>
          {error}
        </Text>
      ) : null}

      {/* Loading */}
      {loading && transactions.length === 0 ? (

        <View style={styles.stateBox}>

          <ActivityIndicator color={colors.primary} />

          <Text style={styles.stateText}>
            Carregando dados financeiros...
          </Text>

        </View>

      ) : null}

      {/* Mensagem sem transações */}
      {!loading && transactions.length === 0 ? (

        <View style={styles.stateBox}>

          <Text style={styles.stateTitle}>
            Nenhuma transação registrada
          </Text>

          <Text style={styles.stateText}>
            Cadastre sua primeira receita ou despesa para iniciar o painel.
          </Text>

          {/* Botão adicionar transação */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push("/(tabs)/add")}
          >

            <Text style={styles.primaryButtonText}>
              Registrar transação
            </Text>

          </TouchableOpacity>

        </View>

      ) : null}

      {/* Categorias */}
      {categoryEntries.length > 0 ? (

        <View style={styles.section}>

          <Text style={styles.sectionTitle}>
            Gastos por categoria
          </Text>

          {/* Percorre categorias */}
          {categoryEntries.map(([category, amount]) => {

            // Calcula porcentagem
            const percentage =
              summary.totalExpense > 0
                ? ((amount || 0) / summary.totalExpense) * 100
                : 0;

            return (

              <View key={category} style={styles.categoryItem}>

                {/* Nome e porcentagem */}
                <View style={styles.categoryHeader}>

                  <Text style={styles.categoryName}>
                    {category}
                  </Text>

                  <Text style={styles.categoryPercentage}>
                    {percentage.toFixed(0)}%
                  </Text>

                </View>

                {/* Barra de progresso */}
                <View style={styles.progressBar}>

                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.min(percentage, 100)}%`
                      }
                    ]}
                  />

                </View>

                {/* Valor da categoria */}
                <Text style={styles.categoryAmount}>
                  {currency(amount || 0)}
                </Text>

              </View>
            );
          })}
        </View>

      ) : null}

      {/* Transações recentes */}
      {recentTransactions.length > 0 ? (

        <View style={styles.section}>

          <Text style={styles.sectionTitle}>
            Transações recentes
          </Text>

          {/* Lista de transações */}
          {recentTransactions.map((transaction) => (

            <View
              key={transaction.id}
              style={styles.transactionItem}
            >

              {/* Informações da transação */}
              <View style={styles.transactionInfo}>

                <Text style={styles.transactionDesc}>
                  {transaction.description}
                </Text>

                <Text style={styles.transactionCategory}>
                  {transaction.category} - {transaction.date.toLocaleDateString("pt-BR")}
                </Text>

              </View>

              {/* Valor da transação */}
              <Text
                style={[
                  styles.transactionAmount,
                  {
                    color:
                      transaction.type === "income"
                        ? colors.success
                        : colors.expense
                  },
                ]}
              >
                {transaction.type === "income" ? "+ " : "- "}
                {currency(transaction.amount)}
              </Text>

            </View>
          ))}
        </View>

      ) : null}

    </ScrollView>
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
    backgroundColor: colors.card,
    padding: spacing.lg,
    paddingTop: spacing.xxl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },

  // Nome do app
  appName: {
    ...typography.title,
    color: colors.primary,
    marginBottom: spacing.lg
  },

  // Texto saldo
  balanceLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs
  },

  // Valor saldo
  balanceValue: {
    ...typography.title,
    fontSize: 42,
    color: colors.white,
    marginBottom: spacing.lg
  },

  // Linha resumo
  summaryRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.md
  },

  // Item resumo
  summaryItem: {
    flex: 1
  },

  // Texto resumo
  summaryLabel: {
    ...typography.caption,
    color: colors.textSecondary
  },

  // Valor resumo
  summaryValue: {
    ...typography.subtitle,
    fontSize: 18
  },

  // Mensagem erro
  error: {
    color: colors.alert,
    padding: spacing.lg
  },

  // Área estados
  stateBox: {
    padding: spacing.xl,
    alignItems: "center",
    gap: spacing.md
  },

  // Título vazio
  stateTitle: {
    ...typography.subtitle,
    color: colors.white,
    textAlign: "center"
  },

  // Texto vazio
  stateText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center"
  },

  // Botão principal
  primaryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 8
  },

  // Texto botão
  primaryButtonText: {
    color: colors.white,
    fontWeight: "700"
  },

  // Seção
  section: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },

  // Título seção
  sectionTitle: {
    ...typography.subtitle,
    color: colors.white,
    marginBottom: spacing.md
  },

  // Item categoria
  categoryItem: {
    marginBottom: spacing.md
  },

  // Cabeçalho categoria
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.xs
  },

  // Nome categoria
  categoryName: {
    ...typography.body,
    color: colors.text
  },

  // Porcentagem
  categoryPercentage: {
    ...typography.body,
    color: colors.textSecondary
  },

  // Valor categoria
  categoryAmount: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs
  },

  // Barra progresso
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: "hidden"
  },

  // Preenchimento barra
  progressFill: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: colors.category
  },

  // Item transação
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.md
  },

  // Área informações
  transactionInfo: {
    flex: 1
  },

  // Descrição
  transactionDesc: {
    ...typography.body,
    color: colors.white
  },

  // Categoria e data
  transactionCategory: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2
  },

  // Valor transação
  transactionAmount: {
    ...typography.body,
    fontWeight: "600"
  },
});