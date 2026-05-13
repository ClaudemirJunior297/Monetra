// Função: Mostrar e gerenciar as transações

// Importa o useState
import { useState } from "react";

// Importa componentes do React Native
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

// Importa atualização ao abrir a tela
import { useFocusEffect } from "expo-router";

// Importa hook para otimizar funções
import { useCallback } from "react";

// Importa ícones
import { Feather } from "@expo/vector-icons";

// Importa cores e estilos
import { colors, spacing, typography } from "@/styles/theme";

// Importa tipos e categorias
import {
  categories,
  Category,
  Transaction,
  TransactionType
} from "@/types/transaction";

// Importa contexto das transações
import { useTransactions } from "@/contexts/TransactionContext";

// Função: Formatar moeda brasileira
const currency = (value: number) =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

// Função: Converter texto em número
const parseAmount = (value: string) =>
  Number(value.replace(/\./g, "").replace(",", "."));

// Função principal da tela
export default function Transactions() {

  // Pega dados das transações
  const {
    transactions,
    loading,
    error,
    refresh,
    updateTransaction,
    deleteTransaction
  } = useTransactions();

  // Estado da transação editada
  const [editing, setEditing] =
    useState<Transaction | null>(null);

  // Estado da descrição
  const [description, setDescription] = useState("");

  // Estado do valor
  const [amount, setAmount] = useState("");

  // Estado do tipo
  const [type, setType] =
    useState<TransactionType>("expense");

  // Estado da categoria
  const [category, setCategory] =
    useState<Category>("Outros");

  // Estado de loading
  const [saving, setSaving] = useState(false);

  // Atualiza ao abrir a tela
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  // Função: Abrir edição
  const openEdit = (transaction: Transaction) => {

    setEditing(transaction);
    setDescription(transaction.description);
    setAmount(String(transaction.amount).replace(".", ","));
    setType(transaction.type);
    setCategory(transaction.category);
  };

  // Função: Fechar edição
  const closeEdit = () => {

    setEditing(null);
    setSaving(false);
  };

  // Função: Atualizar transação
  const handleUpdate = async () => {

    // Verifica se existe transação
    if (!editing) return;

    // Converte valor
    const amountNumber = parseAmount(amount);

    // Validação
    if (
      !description.trim() ||
      Number.isNaN(amountNumber) ||
      amountNumber <= 0
    ) {

      Alert.alert(
        "Erro",
        "Preencha descrição e valor corretamente."
      );

      return;
    }

    try {

      // Ativa loading
      setSaving(true);

      // Atualiza transação
      await updateTransaction(editing.id, {
        description: description.trim(),
        amount: amountNumber,
        type,
        category,
        date: editing.date
      });

      // Fecha modal
      closeEdit();

    } catch (err) {

      // Mostra erro
      Alert.alert(
        "Erro",
        err instanceof Error
          ? err.message
          : "Não foi possível atualizar a transação."
      );

      // Remove loading
      setSaving(false);
    }
  };

  // Função: Confirmar exclusão
  const confirmDelete = (transaction: Transaction) => {

    Alert.alert(
      "Excluir transação",
      "Esta ação remove o registro do banco de dados.",
      [

        // Botão cancelar
        {
          text: "Cancelar",
          style: "cancel"
        },

        // Botão excluir
        {
          text: "Excluir",
          style: "destructive",

          onPress: async () => {
            try {

              // Exclui transação
              await deleteTransaction(transaction.id);

            } catch (err) {

              // Mostra erro
              Alert.alert(
                "Erro",
                err instanceof Error
                  ? err.message
                  : "Não foi possível excluir a transação."
              );
            }
          },
        },
      ]
    );
  };

  // Função: Renderizar item
  const renderItem = ({ item }: { item: Transaction }) => (

    <View style={styles.transactionItem}>

      {/* Informações */}
      <View style={styles.transactionInfo}>

        {/* Descrição */}
        <Text style={styles.transactionDesc}>
          {item.description}
        </Text>

        {/* Categoria e data */}
        <Text style={styles.transactionMeta}>
          {item.category} - {item.date.toLocaleDateString("pt-BR")}
        </Text>

      </View>

      {/* Valor */}
      <Text
        style={[
          styles.transactionAmount,
          {
            color:
              item.type === "income"
                ? colors.success
                : colors.expense
          }
        ]}
      >
        {item.type === "income" ? "+ " : "- "}
        {currency(item.amount)}
      </Text>

      {/* Botões */}
      <View style={styles.actions}>

        {/* Botão editar */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => openEdit(item)}
        >

          <Feather
            name="edit-2"
            size={18}
            color={colors.text}
          />

        </TouchableOpacity>

        {/* Botão excluir */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => confirmDelete(item)}
        >

          <Feather
            name="trash-2"
            size={18}
            color={colors.expense}
          />

        </TouchableOpacity>

      </View>

    </View>
  );

  return (

    // Container principal
    <View style={styles.container}>

      {/* Mensagem erro */}
      {error ? (
        <Text style={styles.error}>
          {error}
        </Text>
      ) : null}

      {/* Loading */}
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
          contentContainerStyle={
            transactions.length
              ? styles.list
              : styles.emptyList
          }
          onRefresh={refresh}
          refreshing={loading}

          // Mensagem lista vazia
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Nenhuma transação cadastrada.
            </Text>
          }
        />
      )}

      {/* Modal */}
      <Modal
        visible={!!editing}
        transparent
        animationType="fade"
        onRequestClose={closeEdit}
      >

        {/* Fundo modal */}
        <View style={styles.modalOverlay}>

          {/* Conteúdo modal */}
          <View style={styles.modalContent}>

            {/* Título */}
            <Text style={styles.modalTitle}>
              Editar transação
            </Text>

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

            {/* Tipos */}
            <View style={styles.typeRow}>

              {/* Botão despesa */}
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === "expense" && styles.expenseActive
                ]}
                onPress={() => setType("expense")}
              >

                <Text style={styles.typeText}>
                  Despesa
                </Text>

              </TouchableOpacity>

              {/* Botão receita */}
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === "income" && styles.incomeActive
                ]}
                onPress={() => setType("income")}
              >

                <Text style={styles.typeText}>
                  Receita
                </Text>

              </TouchableOpacity>

            </View>

            {/* Categorias */}
            <View style={styles.categoriesGrid}>

              {categories.map((cat) => (

                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryButton,
                    category === cat &&
                    styles.categoryButtonActive
                  ]}
                  onPress={() => setCategory(cat)}
                >

                  <Text style={styles.categoryText}>
                    {cat}
                  </Text>

                </TouchableOpacity>
              ))}
            </View>

            {/* Botões modal */}
            <View style={styles.modalActions}>

              {/* Cancelar */}
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeEdit}
              >

                <Text style={styles.cancelText}>
                  Cancelar
                </Text>

              </TouchableOpacity>

              {/* Salvar */}
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

// Estilos
const styles = StyleSheet.create({

  // Container principal
  container: {
    flex: 1,
    backgroundColor: colors.background
  },

  // Lista
  list: {
    padding: spacing.md
  },

  // Lista vazia
  emptyList: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl
  },

  // Texto erro
  error: {
    color: colors.alert,
    padding: spacing.md
  },

  // Texto vazio
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center"
  },

  // Loading
  stateBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },

  // Item transação
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

  // Informações
  transactionInfo: {
    flex: 1,
    minWidth: 0
  },

  // Descrição
  transactionDesc: {
    ...typography.body,
    color: colors.white,
    fontWeight: "600",
    marginBottom: 4
  },

  // Categoria e data
  transactionMeta: {
    ...typography.caption,
    color: colors.textSecondary
  },

  // Valor
  transactionAmount: {
    ...typography.subtitle,
    fontSize: 15,
    fontWeight: "600"
  },

  // Área botões
  actions: {
    flexDirection: "row",
    gap: spacing.xs
  },

  // Botão ícone
  iconButton: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: colors.background
  },

  // Fundo modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.72)",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg
  },

  // Conteúdo modal
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

  // Título modal
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

  // Linha tipos
  typeRow: {
    flexDirection: "row",
    gap: spacing.md
  },

  // Botão tipo
  typeButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border
  },

  // Despesa ativa
  expenseActive: {
    backgroundColor: colors.expense,
    borderColor: colors.expense
  },

  // Receita ativa
  incomeActive: {
    backgroundColor: colors.success,
    borderColor: colors.success
  },

  // Texto botão tipo
  typeText: {
    color: colors.white,
    fontWeight: "700"
  },

  // Área categorias
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },

  // Botão categoria
  categoryButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border
  },

  // Categoria ativa
  categoryButtonActive: {
    backgroundColor: colors.category,
    borderColor: colors.category
  },

  // Texto categoria
  categoryText: {
    color: colors.white
  },

  // Botões modal
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