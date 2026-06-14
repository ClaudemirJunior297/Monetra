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

// Função: Formatar moeda brasileira (R$ 1.234,56)
const currency = (value: number) =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

// Função: Converter texto em número (ex: "1.234,56" => 1234.56)
const parseAmount = (value: string) =>
  Number(value.replace(/\./g, "").replace(",", "."));

// Função principal da tela de listagem de transações
export default function Transactions() {

  // Pega dados e funções do contexto de transações
  const {
    transactions,        // Lista de transações
    loading,            // Estado de carregamento
    error,              // Mensagem de erro
    refresh,            // Função para recarregar
    updateTransaction,  // Função para atualizar
    deleteTransaction   // Função para excluir
  } = useTransactions();

  // Estado da transação que está sendo editada (null = modal fechado)
  const [editing, setEditing] = useState<Transaction | null>(null);

  // Estado da descrição no formulário de edição
  const [description, setDescription] = useState("");

  // Estado do valor no formulário de edição
  const [amount, setAmount] = useState("");

  // Estado do tipo (despesa/receita) no formulário
  const [type, setType] = useState<TransactionType>("expense");

  // Estado da categoria no formulário
  const [category, setCategory] = useState<Category>("Outros");

  // Estado de carregamento durante o salvamento
  const [saving, setSaving] = useState(false);

  // Atualiza a lista ao entrar na tela (toda vez que ganha foco)
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  // Abre o modal de edição com os dados da transação selecionada
  const openEdit = (transaction: Transaction) => {
    setEditing(transaction);
    setDescription(transaction.description);
    setAmount(String(transaction.amount).replace(".", ",")); // ponto para vírgula
    setType(transaction.type);
    setCategory(transaction.category);
  };

  // Fecha o modal de edição e limpa os estados
  const closeEdit = () => {
    setEditing(null);
    setSaving(false);
  };

  // Salva as alterações da transação editada
  const handleUpdate = async () => {

    // Verifica se existe transação sendo editada
    if (!editing) return;

    // Converte o valor (string) para número
    const amountNumber = parseAmount(amount);

    // Validação: descrição não vazia e valor válido
    if (!description.trim() || Number.isNaN(amountNumber) || amountNumber <= 0) {
      Alert.alert("Erro", "Preencha descrição e valor corretamente.");
      return;
    }

    try {
      setSaving(true);  // Ativa loading

      // Chama a função de atualização do contexto
      await updateTransaction(editing.id, {
        description: description.trim(),
        amount: amountNumber,
        type,
        category,
        date: editing.date  // mantém a data original
      });

      closeEdit();  // Fecha o modal

    } catch (err) {
      // Mostra mensagem de erro
      Alert.alert("Erro", err instanceof Error ? err.message : "Não foi possível atualizar a transação.");
      setSaving(false);
    }
  };

  // Confirma exclusão com alerta
  const confirmDelete = (transaction: Transaction) => {
    Alert.alert(
      "Excluir transação",
      "Esta ação remove o registro do banco de dados.",
      [
        { text: "Cancelar", style: "cancel" },  // Cancela exclusão
        {
          text: "Excluir",
          style: "destructive",  // Botão vermelho
          onPress: async () => {
            try {
              await deleteTransaction(transaction.id);  // Exclui transação
            } catch (err) {
              Alert.alert("Erro", err instanceof Error ? err.message : "Não foi possível excluir a transação.");
            }
          },
        },
      ]
    );
  };

  // Renderiza cada item da lista de transações
  const renderItem = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>

      {/* Informações da transação */}
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionDesc}>{item.description}</Text>
        <Text style={styles.transactionMeta}>
          {item.category} - {item.date.toLocaleDateString("pt-BR")}
        </Text>
      </View>

      {/* Valor (com sinal + ou - e cor) */}
      <Text style={[
        styles.transactionAmount,
        { color: item.type === "income" ? colors.success : colors.expense }
      ]}>
        {item.type === "income" ? "+ " : "- "}
        {currency(item.amount)}
      </Text>

      {/* Botões de ação (editar e excluir) */}
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

    // Container principal
    <View style={styles.container}>

      {/* Mensagem de erro (se houver) */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Loading (primeira carga) */}
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
          onRefresh={refresh}        // Atualiza ao puxar para baixo
          refreshing={loading}       // Mostra loading durante atualização
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma transação cadastrada.</Text>}
        />
      )}

      {/* ========== MODAL DE EDIÇÃO ========== */}
      <Modal
        visible={!!editing}  // Mostra modal se editing não for null
        transparent
        animationType="fade"
        onRequestClose={closeEdit}
      >

        {/* Fundo escuro semi-transparente */}
        <View style={styles.modalOverlay}>

          {/* Conteúdo do modal */}
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

            {/* Seleção de tipo (despesa ou receita) */}
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

            {/* Grade de categorias */}
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

              {/* Cancelar */}
              <TouchableOpacity style={styles.cancelButton} onPress={closeEdit}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>

              {/* Salvar */}
              <TouchableOpacity style={styles.saveButton} onPress={handleUpdate} disabled={saving}>
                <Text style={styles.saveText}>{saving ? "Salvando..." : "Salvar"}</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

    </View>
  );
}

// ========== ESTILOS DA TELA ==========
const styles = StyleSheet.create({

  // Container principal
  container: {
    flex: 1,
    backgroundColor: colors.background
  },

  // Lista com padding
  list: {
    padding: spacing.md
  },

  // Lista vazia (centralizada)
  emptyList: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl
  },

  // Mensagem de erro
  error: {
    color: colors.error,
    padding: spacing.md
  },

  // Texto da lista vazia
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center"
  },

  // Container do loading
  stateBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },

  // Cada item da lista
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

  // Container das informações
  transactionInfo: {
    flex: 1,
    minWidth: 0
  },

  // Descrição da transação
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

  // Valor da transação
  transactionAmount: {
    ...typography.subtitle,
    fontSize: 15,
    fontWeight: "600"
  },

  // Botões de ação (editar/excluir)
  actions: {
    flexDirection: "row",
    gap: spacing.xs
  },

  // Botão de ícone
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

  // Campo de input
  input: {
    backgroundColor: colors.background,
    color: colors.white,
    padding: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border
  },

  // Linha dos botões de tipo
  typeRow: {
    flexDirection: "row",
    gap: spacing.md
  },

  // Botão de tipo (despesa/receita)
  typeButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border
  },

  // Despesa ativa (fundo vermelho)
  expenseActive: {
    backgroundColor: colors.expense,
    borderColor: colors.expense
  },

  // Receita ativa (fundo verde)
  incomeActive: {
    backgroundColor: colors.success,
    borderColor: colors.success
  },

  // Texto do botão de tipo
  typeText: {
    color: colors.white,
    fontWeight: "700"
  },

  // Grade de categorias
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

  // Categoria ativa
  categoryButtonActive: {
    backgroundColor: colors.category,
    borderColor: colors.category
  },

  // Texto da categoria
  categoryText: {
    color: colors.white
  },

  // Botões do modal (Cancelar/Salvar)
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: spacing.md
  },

  // Botão cancelar
  cancelButton: {
    padding: spacing.md
  },

  // Texto do botão cancelar
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

  // Texto do botão salvar
  saveText: {
    color: colors.white,
    fontWeight: "700"
  },
});