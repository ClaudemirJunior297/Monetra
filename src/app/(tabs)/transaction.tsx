// Importa o hook useState do React para controlar estados do componente
import { useState } from "react";

// Importa componentes nativos do React Native
import { ActivityIndicator, Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

// Hook do Expo Router que executa ações quando a tela ganha foco
import { useFocusEffect } from "expo-router";

// Importa o useCallback para memorizar funções
import { useCallback } from "react";

// Importa ícones da biblioteca Feather
import { Feather } from "@expo/vector-icons";

// Importa cores, espaçamentos e tipografia personalizados do tema
import { colors, spacing, typography } from "@/styles/theme";

// Importa tipos e categorias das transações
import { categories, Category, Transaction, TransactionType } from "@/types/transaction";

// Importa o contexto responsável pelas transações
import { useTransactions } from "@/contexts/TransactionContext";

// Função para formatar valores em moeda brasileira (R$)
const currency = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// Função para converter texto digitado em número
const parseAmount = (value: string) => Number(value.replace(/\./g, "").replace(",", "."));

// Componente principal da tela de transações
export default function Transactions() {

  // Dados e funções vindas do contexto
  const { transactions, loading, error, refresh, updateTransaction, deleteTransaction } = useTransactions();

  // Estado da transação que está sendo editada
  const [editing, setEditing] = useState<Transaction | null>(null);

  // Estado da descrição da transação
  const [description, setDescription] = useState("");

  // Estado do valor da transação
  const [amount, setAmount] = useState("");

  // Estado do tipo da transação (receita ou despesa)
  const [type, setType] = useState<TransactionType>("expense");

  // Estado da categoria da transação
  const [category, setCategory] = useState<Category>("Outros");

  // Estado que controla o carregamento ao salvar
  const [saving, setSaving] = useState(false);

  // Atualiza a lista de transações sempre que a tela recebe foco
  useFocusEffect(useCallback(() => {
    refresh();
  }, [refresh]));

  // Abre o modal de edição preenchendo os dados da transação
  const openEdit = (transaction: Transaction) => {
    setEditing(transaction);
    setDescription(transaction.description);
    setAmount(String(transaction.amount).replace(".", ","));
    setType(transaction.type);
    setCategory(transaction.category);
  };

  // Fecha o modal de edição
  const closeEdit = () => {
    setEditing(null);
    setSaving(false);
  };

  // Atualiza uma transação
  const handleUpdate = async () => {

    // Verifica se existe uma transação sendo editada
    if (!editing) return;

    // Converte o valor digitado em número
    const amountNumber = parseAmount(amount);

    // Validação dos campos
    if (!description.trim() || Number.isNaN(amountNumber) || amountNumber <= 0) {
      Alert.alert("Erro", "Preencha descrição e valor corretamente.");
      return;
    }

    try {

      // Ativa estado de salvamento
      setSaving(true);

      // Atualiza a transação
      await updateTransaction(editing.id, {
        description: description.trim(),
        amount: amountNumber,
        type,
        category,
        date: editing.date
      });

      // Fecha o modal após salvar
      closeEdit();

    } catch (err) {

      // Exibe mensagem de erro
      Alert.alert("Erro", err instanceof Error ? err.message : "Não foi possível atualizar a transação.");

      // Remove estado de loading
      setSaving(false);
    }
  };

  // Confirma exclusão de uma transação
  const confirmDelete = (transaction: Transaction) => {

    // Exibe alerta de confirmação
    Alert.alert("Excluir transação", "Esta ação remove o registro do banco de dados.", [

      // Botão cancelar
      { text: "Cancelar", style: "cancel" },

      // Botão excluir
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {

            // Exclui a transação
            await deleteTransaction(transaction.id);

          } catch (err) {

            // Exibe erro caso falhe
            Alert.alert("Erro", err instanceof Error ? err.message : "Não foi possível excluir a transação.");
          }
        },
      },
    ]);
  };

  // Renderiza cada item da lista
  const renderItem = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>

      {/* Informações da transação */}
      <View style={styles.transactionInfo}>

        {/* Descrição */}
        <Text style={styles.transactionDesc}>{item.description}</Text>

        {/* Categoria e data */}
        <Text style={styles.transactionMeta}>
          {item.category} - {item.date.toLocaleDateString("pt-BR")}
        </Text>
      </View>

      {/* Valor da transação */}
      <Text
        style={[
          styles.transactionAmount,
          { color: item.type === "income" ? colors.success : colors.expense }
        ]}
      >
        {item.type === "income" ? "+ " : "- "}
        {currency(item.amount)}
      </Text>

      {/* Botões de ação */}
      <View style={styles.actions}>

        {/* Botão editar */}
        <TouchableOpacity style={styles.iconButton} onPress={() => openEdit(item)}>
          <Feather name="edit-2" size={18} color={colors.text} />
        </TouchableOpacity>

        {/* Botão excluir */}
        <TouchableOpacity style={styles.iconButton} onPress={() => confirmDelete(item)}>
          <Feather name="trash-2" size={18} color={colors.expense} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>

      {/* Exibe mensagem de erro caso exista */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Exibe loading caso esteja carregando */}
      {loading && transactions.length === 0 ? (

        <View style={styles.stateBox}>
          <ActivityIndicator color={colors.primary} />
        </View>

      ) : (

        // Lista de transações
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={transactions.length ? styles.list : styles.emptyList}
          onRefresh={refresh}
          refreshing={loading}

          // Componente exibido quando não existem transações
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Nenhuma transação cadastrada.
            </Text>
          }
        />
      )}

      {/* Modal de edição */}
      <Modal visible={!!editing} transparent animationType="fade" onRequestClose={closeEdit}>

        <View style={styles.modalOverlay}>

          <View style={styles.modalContent}>

            {/* Título do modal */}
            <Text style={styles.modalTitle}>Editar transação</Text>

            {/* Campo descrição */}
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setDescription}
              placeholder="Descrição"
              placeholderTextColor={colors.textSecondary}
            />

            {/* Campo valor */}
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              placeholder="Valor"
              placeholderTextColor={colors.textSecondary}
            />

            {/* Seleção do tipo */}
            <View style={styles.typeRow}>

              {/* Botão despesa */}
              <TouchableOpacity
                style={[styles.typeButton, type === "expense" && styles.expenseActive]}
                onPress={() => setType("expense")}
              >
                <Text style={styles.typeText}>Despesa</Text>
              </TouchableOpacity>

              {/* Botão receita */}
              <TouchableOpacity
                style={[styles.typeButton, type === "income" && styles.incomeActive]}
                onPress={() => setType("income")}
              >
                <Text style={styles.typeText}>Receita</Text>
              </TouchableOpacity>
            </View>

            {/* Lista de categorias */}
            <View style={styles.categoriesGrid}>

              {categories.map((cat) => (

                <TouchableOpacity
                  key={cat}
                  style={[styles.categoryButton, category === cat && styles.categoryButtonActive]}
                  onPress={() => setCategory(cat)}
                >
                  <Text style={styles.categoryText}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Botões do modal */}
            <View style={styles.modalActions}>

              {/* Botão cancelar */}
              <TouchableOpacity style={styles.cancelButton} onPress={closeEdit}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>

              {/* Botão salvar */}
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleUpdate}
                disabled={saving}
              >
                <Text style={styles.saveText}>
                  {saving ? "Salvando..." : "Salvar"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Estilos do componente
const styles = StyleSheet.create({

  // Container principal
  container: {
    flex: 1,
    backgroundColor: colors.background
  },

  // Lista com itens
  list: {
    padding: spacing.md
  },

  // Estilo da lista vazia
  emptyList: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl
  },

  // Texto de erro
  error: {
    color: colors.alert,
    padding: spacing.md
  },

  // Texto quando não há transações
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center"
  },

  // Caixa de loading
  stateBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },

  // Item da transação
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm
  },

  // Área das informações
  transactionInfo: {
    flex: 1,
    minWidth: 0
  },

  // Texto da descrição
  transactionDesc: {
    ...typography.body,
    color: colors.white,
    fontWeight: "600",
    marginBottom: 4
  },

  // Texto da categoria/data
  transactionMeta: {
    ...typography.caption,
    color: colors.textSecondary
  },

  // Valor da transação
  transactionAmount: {
    ...typography.subtitle,
    fontSize: 15,
    fontWeight: "600"
  },

  // Área dos botões
  actions: {
    flexDirection: "row",
    gap: spacing.xs
  },

  // Botões de ícone
  iconButton: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: colors.background
  },

  // Fundo escuro do modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.72)",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg
  },

  // Conteúdo do modal
  modalContent: {
    width: "100%",
    maxWidth: 520,
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md
  },

  // Título do modal
  modalTitle: {
    ...typography.subtitle,
    color: colors.white
  },

  // Inputs
  input: {
    backgroundColor: colors.background,
    color: colors.white,
    padding: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border
  },

  // Linha dos tipos
  typeRow: {
    flexDirection: "row",
    gap: spacing.md
  },

  // Botões de tipo
  typeButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border
  },

  // Estilo ativo para despesa
  expenseActive: {
    backgroundColor: colors.expense,
    borderColor: colors.expense
  },

  // Estilo ativo para receita
  incomeActive: {
    backgroundColor: colors.success,
    borderColor: colors.success
  },

  // Texto dos botões de tipo
  typeText: {
    color: colors.white,
    fontWeight: "700"
  },

  // Grid de categorias
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },

  // Botão de categoria
  categoryButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border
  },

  // Categoria selecionada
  categoryButtonActive: {
    backgroundColor: colors.category,
    borderColor: colors.category
  },

  // Texto da categoria
  categoryText: {
    color: colors.white
  },

  // Área dos botões do modal
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: spacing.md
  },

  // Botão cancelar
  cancelButton: {
    padding: spacing.md
  },

  // Texto cancelar
  cancelText: {
    color: colors.textSecondary,
    fontWeight: "700"
  },

  // Botão salvar
  saveButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 8
  },

  // Texto salvar
  saveText: {
    color: colors.white,
    fontWeight: "700"
  },
});