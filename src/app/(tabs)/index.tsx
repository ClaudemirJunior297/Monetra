// Importações de componentes do React Native
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// Hooks de navegação do Expo Router
import { router, useFocusEffect } from "expo-router";
// Hook para memoização de callbacks
import { useCallback } from "react";
// Tokens de design (cores, espaçamentos, tipografia)
import { colors, spacing, typography } from "@/styles/theme";
// Hook customizado para o contexto de transações
import { useTransactions } from "@/contexts/TransactionContext";

// Função auxiliar para formatar valores monetários no formato brasileiro
const currency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// Componente principal do Dashboard (painel principal / tela inicial)
export default function Dashboard() {
  // Obtém dados e funções do contexto de transações
  const { transactions, summary, loading, error, refresh } = useTransactions();
  
  // Prepara os dados de categorias ordenados por valor (da maior para a menor)
  const categoryEntries = Object.entries(summary.categoryBreakdown)
    .sort(([, a], [, b]) => (b || 0) - (a || 0));
  
  // Pega apenas as 5 transações mais recentes para exibir no resumo
  const recentTransactions = transactions.slice(0, 5);

  // useFocusEffect: atualiza os dados sempre que a tela recebe foco
  useFocusEffect(useCallback(() => {
    refresh(); // Recarrega as transações do banco de dados
  }, [refresh]));

  return (
    <ScrollView
      style={styles.container}
      // Suporte a "puxar para recarregar" (Pull to Refresh)
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.primary} />}
    >
      {/* ========== CABEÇALHO COM SALDO E RESUMO ========== */}
      <View style={styles.header}>
        <Text style={styles.appName}>Monetra</Text>                      {/* Nome do aplicativo */}
        <Text style={styles.balanceLabel}>Saldo disponível</Text>       {/* Rótulo do saldo */}
        <Text style={styles.balanceValue}>{currency(summary.balance)}</Text> {/* Valor do saldo formatado */}
        
        {/* Linha com duas colunas: Receitas e Despesas */}
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

      {/* Exibe mensagem de erro se houver */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Estado de CARREGAMENTO (primeira carga, sem transações ainda) */}
      {loading && transactions.length === 0 ? (
        <View style={styles.stateBox}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.stateText}>Carregando dados financeiros...</Text>
        </View>
      ) : null}

      {/* Estado VAZIO (nenhuma transação cadastrada) */}
      {!loading && transactions.length === 0 ? (
        <View style={styles.stateBox}>
          <Text style={styles.stateTitle}>Nenhuma transação registrada</Text>
          <Text style={styles.stateText}>Cadastre sua primeira receita ou despesa para iniciar o painel.</Text>
          {/* Botão que navega para a tela de adicionar transação */}
          <TouchableOpacity style={styles.primaryButton} onPress={() => router.push("/(tabs)/add")}>
            <Text style={styles.primaryButtonText}>Registrar transação</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* ========== SEÇÃO: GASTOS POR CATEGORIA (barras de progresso) ========== */}
      {categoryEntries.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gastos por categoria</Text>
          {categoryEntries.map(([category, amount]) => {
            // Calcula o percentual da categoria em relação ao total de despesas
            const percentage = summary.totalExpense > 0 ? ((amount || 0) / summary.totalExpense) * 100 : 0;
            return (
              <View key={category} style={styles.categoryItem}>
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryName}>{category}</Text>
                  <Text style={styles.categoryPercentage}>{percentage.toFixed(0)}%</Text>
                </View>
                {/* Barra de progresso visual */}
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${Math.min(percentage, 100)}%` }]} />
                </View>
                <Text style={styles.categoryAmount}>{currency(amount || 0)}</Text>
              </View>
            );
          })}
        </View>
      ) : null}

      {/* ========== SEÇÃO: TRANSAÇÕES RECENTES (últimas 5) ========== */}
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
              {/* Valor com sinal (+ para receita, - para despesa) e cor correspondente */}
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

// ========== ESTILOS DO COMPONENTE ==========
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },                                      // Fundo principal
  header: { backgroundColor: colors.card, padding: spacing.lg, paddingTop: spacing.xxl, borderBottomWidth: 1, borderBottomColor: colors.border }, // Cabeçalho
  appName: { ...typography.title, color: colors.primary, marginBottom: spacing.lg },              // Nome do app (verde)
  balanceLabel: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.xs }, // Rótulo "Saldo disponível"
  balanceValue: { ...typography.title, fontSize: 42, color: colors.white, marginBottom: spacing.lg }, // Valor grande do saldo
  summaryRow: { flexDirection: "row", gap: spacing.md, marginTop: spacing.md },                   // Linha com receitas/despesas lado a lado
  summaryItem: { flex: 1 },                                                                       // Cada item ocupa espaço igual
  summaryLabel: { ...typography.caption, color: colors.textSecondary },                           // Rótulo "Receitas" / "Despesas"
  summaryValue: { ...typography.subtitle, fontSize: 18 },                                         // Valor numérico
  error: { color: colors.alert, padding: spacing.lg },                                           // Mensagem de erro (vermelho)
  stateBox: { padding: spacing.xl, alignItems: "center", gap: spacing.md },                      // Container para estados (carregando/vazio)
  stateTitle: { ...typography.subtitle, color: colors.white, textAlign: "center" },              // Título do estado vazio
  stateText: { ...typography.body, color: colors.textSecondary, textAlign: "center" },           // Texto descritivo
  primaryButton: { backgroundColor: colors.primary, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: 8 }, // Botão principal
  primaryButtonText: { color: colors.white, fontWeight: "700" },                                  // Texto do botão
  section: { padding: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.border },      // Cada seção (categorias, transações)
  sectionTitle: { ...typography.subtitle, color: colors.white, marginBottom: spacing.md },       // Título da seção
  categoryItem: { marginBottom: spacing.md },                                                     // Item de categoria
  categoryHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.xs }, // Linha com nome e percentual
  categoryName: { ...typography.body, color: colors.text },                                      // Nome da categoria
  categoryPercentage: { ...typography.body, color: colors.textSecondary },                       // Percentual (ex: "45%")
  categoryAmount: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.xs }, // Valor da categoria
  progressBar: { height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: "hidden" }, // Fundo da barra de progresso
  progressFill: { height: "100%", borderRadius: 4, backgroundColor: colors.category },           // Preenchimento colorido da barra
  transactionItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border, gap: spacing.md }, // Item de transação
  transactionInfo: { flex: 1 },                                                                   // Container da descrição + categoria
  transactionDesc: { ...typography.body, color: colors.white },                                  // Descrição da transação
  transactionCategory: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },    // Categoria e data
  transactionAmount: { ...typography.body, fontWeight: "600" },                                  // Valor da transação (com sinal)
});