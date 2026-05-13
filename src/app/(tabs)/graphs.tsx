// Importações dos componentes e hooks do React Native
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
// Hook para executar ações quando a tela ganha foco
import { useFocusEffect } from "expo-router";
// Hook para evitar recriação desnecessária de funções
import { useCallback } from "react";
// Tokens de design (cores, espaçamentos, tipografia)
import { colors, spacing, typography } from "@/styles/theme";
// Hook customizado para acessar o contexto de transações
import { useTransactions } from "@/contexts/TransactionContext";

// Função auxiliar para formatar valores monetários no padrão brasileiro
// Exemplo: 1234.56 -> "R$ 1.234,56"
const currency = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// Componente principal da tela de Gráficos/Indicadores
export default function Graphs() {
  // Obtém dados e funções do contexto de transações
  const { summary, transactions, loading, error, refresh } = useTransactions();
  
  // Converte o objeto de categorias para array e ordena por valor (maior para menor)
  // Exemplo: { Alimentação: 150, Transporte: 80 } -> [["Alimentação", 150], ["Transporte", 80]]
  const entries = Object.entries(summary.categoryBreakdown).sort(([, a], [, b]) => (b || 0) - (a || 0));

  // useFocusEffect: atualiza os dados sempre que a tela recebe foco (quando o usuário navega até ela)
  useFocusEffect(useCallback(() => {
    refresh(); // Recarrega as transações do banco
  }, [refresh])); // dependência: refresh (estável, não causa recriação desnecessária)

  return (
    // ScrollView principal com suporte a "puxar para recarregar" (Pull to Refresh)
    <ScrollView 
      style={styles.container} 
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.primary} />}
    >
      {/* Cabeçalho da tela */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Indicadores</Text>
        <Text style={styles.headerSubtitle}>Baseados nas transações cadastradas</Text>
      </View>

      {/* Exibe mensagem de erro se houver */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Cartão de resumo: total de despesas */}
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Despesas registradas</Text>
        <Text style={styles.totalValue}>{currency(summary.totalExpense)}</Text>
        <Text style={styles.totalHint}>{transactions.length} transações no banco</Text>
      </View>

      {/* Estado de carregamento inicial (primeira carga, sem transações) */}
      {loading && transactions.length === 0 ? (
        <View style={styles.stateBox}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : null}

      {/* Estado vazio: nenhuma despesa cadastrada */}
      {!loading && entries.length === 0 ? (
        <View style={styles.stateBox}>
          <Text style={styles.emptyTitle}>Sem despesas para analisar</Text>
          <Text style={styles.emptyText}>Os gráficos aparecem automaticamente quando houver despesas salvas.</Text>
        </View>
      ) : null}

      {/* Gráficos de categorias (somente se houver dados) */}
      {entries.length > 0 ? (
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Distribuição por categoria</Text>
          {/* Mapeia cada categoria para uma barra de progresso */}
          {entries.map(([category, amount]) => {
            // Calcula o percentual da categoria em relação ao total de despesas
            const percentage = summary.totalExpense > 0 ? ((amount || 0) / summary.totalExpense) * 100 : 0;
            return (
              <View key={category} style={styles.categoryItem}>
                {/* Cabeçalho da categoria: bolinha colorida, nome e percentual */}
                <View style={styles.categoryHeader}>
                  <View style={styles.colorDot} />        {/* Indicador visual colorido */}
                  <Text style={styles.categoryName}>{category}</Text>
                  <Text style={styles.categoryPercentage}>{percentage.toFixed(0)}%</Text>
                </View>
                {/* Barra de progresso que representa visualmente o percentual */}
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${Math.min(percentage, 100)}%` }]} />
                </View>
                {/* Valor monetário da categoria */}
                <Text style={styles.categoryAmount}>{currency(amount || 0)}</Text>
              </View>
            );
          })}
        </View>
      ) : null}
    </ScrollView>
  );
}

// Estilos do componente (definidos com StyleSheet)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },                    // Fundo principal da tela
  header: { backgroundColor: colors.card, padding: spacing.lg, paddingTop: spacing.xxl, alignItems: "center", borderBottomWidth: 1, borderBottomColor: colors.border }, // Cabeçalho com borda inferior
  headerTitle: { ...typography.title, color: colors.white },                    // Título do cabeçalho
  headerSubtitle: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs, textAlign: "center" }, // Subtítulo do cabeçalho
  error: { color: colors.alert, padding: spacing.lg },                          // Mensagem de erro (cor vermelha)
  totalCard: { backgroundColor: colors.card, margin: spacing.lg, padding: spacing.lg, borderRadius: 8, alignItems: "center", borderWidth: 1, borderColor: colors.border }, // Cartão do total de despesas
  totalLabel: { ...typography.body, color: colors.textSecondary },              // Rótulo "Despesas registradas"
  totalValue: { ...typography.title, fontSize: 34, color: colors.expense, marginTop: spacing.sm }, // Valor total (vermelho/despesa)
  totalHint: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.sm }, // Dica com quantidade de transações
  chartContainer: { padding: spacing.lg },                                      // Container dos gráficos
  sectionTitle: { ...typography.subtitle, color: colors.white, marginBottom: spacing.md }, // Título da seção "Distribuição por categoria"
  categoryItem: { marginBottom: spacing.md },                                   // Cada item de categoria
  categoryHeader: { flexDirection: "row", alignItems: "center", marginBottom: spacing.xs }, // Linha com nome + percentual
  colorDot: { width: 12, height: 12, borderRadius: 6, marginRight: spacing.sm, backgroundColor: colors.category }, // Bolinha colorida representando a categoria
  categoryName: { ...typography.body, color: colors.text, flex: 1 },            // Nome da categoria
  categoryPercentage: { ...typography.body, color: colors.textSecondary },      // Percentual da categoria
  categoryAmount: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.xs }, // Valor formatado da categoria
  progressBar: { height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: "hidden" }, // Fundo da barra de progresso
  progressFill: { height: "100%", borderRadius: 4, backgroundColor: colors.category }, // Preenchimento colorido da barra
  stateBox: { padding: spacing.xl, alignItems: "center", gap: spacing.sm },     // Container para estados (carregando/vazio)
  emptyTitle: { ...typography.subtitle, color: colors.white, textAlign: "center" }, // Título do estado vazio
  emptyText: { ...typography.body, color: colors.textSecondary, textAlign: "center" }, // Texto explicativo do estado vazio
});