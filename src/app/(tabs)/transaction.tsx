// Função: Mostrar e gerenciar as transações

import { useState } from "react";
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
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { Feather } from "@expo/vector-icons";
import { spacing, typography } from "@/styles/theme";
import { useColors } from "@/hooks/useColors";
import {
  categories,
  Category,
  Transaction,
  TransactionType
} from "@/types/transaction";
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
  const c = useColors();

  const {
    transactions,
    loading,
    error,
    refresh,
    updateTransaction,
    deleteTransaction
  } = useTransactions();

  const [editing, setEditing] = useState<Transaction | null>(null);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<TransactionType>("expense");
  const [category, setCategory] = useState<Category>("Outros");
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const openEdit = (transaction: Transaction) => {
    setEditing(transaction);
    setDescription(transaction.description);
    setAmount(String(transaction.amount).replace(".", ","));
    setType(transaction.type);
    setCategory(transaction.category);
  };

  const closeEdit = () => {
    setEditing(null);
    setSaving(false);
  };

  const handleUpdate = async () => {
    if (!editing) return;
    const amountNumber = parseAmount(amount);

    if (!description.trim() || Number.isNaN(amountNumber) || amountNumber <= 0) {
      Alert.alert("Erro", "Preencha descrição e valor corretamente.");
      return;
    }

    try {
      setSaving(true);
      await updateTransaction(editing.id, {
        description: description.trim(),
        amount: amountNumber,
        type,
        category,
        date: editing.date
      });
      closeEdit();
    } catch (err) {
      Alert.alert("Erro", err instanceof Error ? err.message : "Não foi possível atualizar a transação.");
      setSaving(false);
    }
  };

  const confirmDelete = (transaction: Transaction) => {
    Alert.alert(
      "Excluir transação",
      "Esta ação remove o registro do banco de dados.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteTransaction(transaction.id);
            } catch (err) {
              Alert.alert("Erro", err instanceof Error ? err.message : "Não foi possível excluir a transação.");
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionDesc}>{item.description}</Text>
        <Text style={styles.transactionMeta}>
          {item.category} - {item.date.toLocaleDateString("pt-BR")}
        </Text>
      </View>
      <Text style={[
        styles.transactionAmount,
        { color: item.type === "income" ? c.income : c.expense }
      ]}>
        {item.type === "income" ? "+ " : "- "}
        {currency(item.amount)}
      </Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.iconButton} onPress={() => openEdit(item)}>
          <Feather name="edit-2" size={18} color={c.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => confirmDelete(item)}>
          <Feather name="trash-2" size={18} color={c.expense} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: c.bg },
  list: { padding: spacing.md },
  emptyList: { flex: 1, alignItems: "center" as const, justifyContent: "center" as const, padding: 32 },
  error: { color: c.error, padding: 16 },
  emptyText: { color: c.sub, textAlign: "center" as const },
  stateBox: { flex: 1, alignItems: "center" as const, justifyContent: "center" as const },
  transactionItem: { flexDirection: "row" as const, alignItems: "center" as const, backgroundColor: c.card, padding: 16, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: c.border, gap: 8 },
  transactionInfo: { flex: 1, minWidth: 0 },
  transactionDesc: { color: c.text, fontWeight: "600" as const, marginBottom: 4, fontSize: 14 },
  transactionMeta: { color: c.sub, fontSize: 12 },
  transactionAmount: { fontSize: 15, fontWeight: "600" as const },
  actions: { flexDirection: "row" as const, gap: 4 },
  iconButton: { width: 34, height: 34, alignItems: "center" as const, justifyContent: "center" as const, borderRadius: 8, backgroundColor: c.bg },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.72)", alignItems: "center" as const, justifyContent: "center" as const, padding: 24 },
  modalContent: { width: "100%" as const, backgroundColor: c.card, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: c.border, gap: 12 },
  modalTitle: { color: c.text, fontSize: 18, fontWeight: "700" as const },
  input: { backgroundColor: c.bg, color: c.text, padding: 14, borderRadius: 10, borderWidth: 1, borderColor: c.border },
  typeRow: { flexDirection: "row" as const, gap: 12 },
  typeButton: { flex: 1, padding: 12, borderRadius: 10, alignItems: "center" as const, backgroundColor: c.bg, borderWidth: 1, borderColor: c.border },
  expenseActive: { backgroundColor: c.expense, borderColor: c.expense },
  incomeActive: { backgroundColor: c.income, borderColor: c.income },
  typeText: { color: c.text, fontWeight: "700" as const },
  categoriesGrid: { flexDirection: "row" as const, flexWrap: "wrap" as const, gap: 8 },
  categoryButton: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: c.bg, borderWidth: 1, borderColor: c.border },
  categoryButtonActive: { backgroundColor: c.primary, borderColor: c.primary },
  categoryText: { color: c.text, fontSize: 13 },
  modalActions: { flexDirection: "row" as const, justifyContent: "flex-end" as const, gap: 12 },
  cancelButton: { padding: 12 },
  cancelText: { color: c.sub, fontWeight: "700" as const },
  saveButton: { backgroundColor: c.primary, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10 },
  saveText: { color: "#fff", fontWeight: "700" as const },
});

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {loading && transactions.length === 0 ? (
        <View style={styles.stateBox}>
          <ActivityIndicator color={c.primary} />
        </View>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={transactions.length ? styles.list : styles.emptyList}
          onRefresh={refresh}
          refreshing={loading}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma transação cadastrada.</Text>}
        />
      )}

      <Modal
        visible={!!editing}
        transparent
        animationType="fade"
        onRequestClose={closeEdit}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar transação</Text>

            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setDescription}
              placeholder="Descrição"
              placeholderTextColor={c.sub}
            />

            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              placeholder="Valor"
              placeholderTextColor={c.sub}
            />

            <View style={styles.typeRow}>
              <TouchableOpacity
                style={[styles.typeButton, type === "expense" && styles.expenseActive]}
                onPress={() => setType("expense")}
              >
                <Text style={styles.typeText}>Despesa</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeButton, type === "income" && styles.incomeActive]}
                onPress={() => setType("income")}
              >
                <Text style={styles.typeText}>Receita</Text>
              </TouchableOpacity>
            </View>

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

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={closeEdit}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
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

