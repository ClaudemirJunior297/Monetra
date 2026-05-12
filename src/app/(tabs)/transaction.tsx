import { useState } from "react";
import { ActivityIndicator, Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { Feather } from "@expo/vector-icons";
import { colors, spacing, typography } from "@/styles/theme";
import { categories, Category, Transaction, TransactionType } from "@/types/transaction";
import { useTransactions } from "@/contexts/TransactionContext";

const currency = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const parseAmount = (value: string) => Number(value.replace(/\./g, "").replace(",", "."));

export default function Transactions() {
  const { transactions, loading, error, refresh, updateTransaction, deleteTransaction } = useTransactions();
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<TransactionType>("expense");
  const [category, setCategory] = useState<Category>("Outros");
  const [saving, setSaving] = useState(false);

  useFocusEffect(useCallback(() => {
    refresh();
  }, [refresh]));

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
      await updateTransaction(editing.id, { description: description.trim(), amount: amountNumber, type, category, date: editing.date });
      closeEdit();
    } catch (err) {
      Alert.alert("Erro", err instanceof Error ? err.message : "Não foi possível atualizar a transação.");
      setSaving(false);
    }
  };

  const confirmDelete = (transaction: Transaction) => {
    Alert.alert("Excluir transação", "Esta ação remove o registro do banco de dados.", [
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
    ]);
  };

  const renderItem = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionDesc}>{item.description}</Text>
        <Text style={styles.transactionMeta}>{item.category} - {item.date.toLocaleDateString("pt-BR")}</Text>
      </View>
      <Text style={[styles.transactionAmount, { color: item.type === "income" ? colors.success : colors.expense }]}>
        {item.type === "income" ? "+ " : "- "}{currency(item.amount)}
      </Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.iconButton} onPress={() => openEdit(item)}>
          <Feather name="edit-2" size={18} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => confirmDelete(item)}>
          <Feather name="trash-2" size={18} color={colors.expense} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {loading && transactions.length === 0 ? (
        <View style={styles.stateBox}><ActivityIndicator color={colors.primary} /></View>
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

      <Modal visible={!!editing} transparent animationType="fade" onRequestClose={closeEdit}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar transação</Text>
            <TextInput style={styles.input} value={description} onChangeText={setDescription} placeholder="Descrição" placeholderTextColor={colors.textSecondary} />
            <TextInput style={styles.input} value={amount} onChangeText={setAmount} keyboardType="decimal-pad" placeholder="Valor" placeholderTextColor={colors.textSecondary} />
            <View style={styles.typeRow}>
              <TouchableOpacity style={[styles.typeButton, type === "expense" && styles.expenseActive]} onPress={() => setType("expense")}><Text style={styles.typeText}>Despesa</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.typeButton, type === "income" && styles.incomeActive]} onPress={() => setType("income")}><Text style={styles.typeText}>Receita</Text></TouchableOpacity>
            </View>
            <View style={styles.categoriesGrid}>
              {categories.map((cat) => (
                <TouchableOpacity key={cat} style={[styles.categoryButton, category === cat && styles.categoryButtonActive]} onPress={() => setCategory(cat)}>
                  <Text style={styles.categoryText}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={closeEdit}><Text style={styles.cancelText}>Cancelar</Text></TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleUpdate} disabled={saving}><Text style={styles.saveText}>{saving ? "Salvando..." : "Salvar"}</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.md },
  emptyList: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.xl },
  error: { color: colors.alert, padding: spacing.md },
  emptyText: { ...typography.body, color: colors.textSecondary, textAlign: "center" },
  stateBox: { flex: 1, alignItems: "center", justifyContent: "center" },
  transactionItem: { flexDirection: "row", alignItems: "center", backgroundColor: colors.card, padding: spacing.md, borderRadius: 8, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border, gap: spacing.sm },
  transactionInfo: { flex: 1, minWidth: 0 },
  transactionDesc: { ...typography.body, color: colors.white, fontWeight: "600", marginBottom: 4 },
  transactionMeta: { ...typography.caption, color: colors.textSecondary },
  transactionAmount: { ...typography.subtitle, fontSize: 15, fontWeight: "600" },
  actions: { flexDirection: "row", gap: spacing.xs },
  iconButton: { width: 34, height: 34, alignItems: "center", justifyContent: "center", borderRadius: 8, backgroundColor: colors.background },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.72)", alignItems: "center", justifyContent: "center", padding: spacing.lg },
  modalContent: { width: "100%", maxWidth: 520, backgroundColor: colors.card, borderRadius: 8, padding: spacing.lg, borderWidth: 1, borderColor: colors.border, gap: spacing.md },
  modalTitle: { ...typography.subtitle, color: colors.white },
  input: { backgroundColor: colors.background, color: colors.white, padding: spacing.md, borderRadius: 8, borderWidth: 1, borderColor: colors.border },
  typeRow: { flexDirection: "row", gap: spacing.md },
  typeButton: { flex: 1, padding: spacing.md, borderRadius: 8, alignItems: "center", backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border },
  expenseActive: { backgroundColor: colors.expense, borderColor: colors.expense },
  incomeActive: { backgroundColor: colors.success, borderColor: colors.success },
  typeText: { color: colors.white, fontWeight: "700" },
  categoriesGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  categoryButton: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: 8, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border },
  categoryButtonActive: { backgroundColor: colors.category, borderColor: colors.category },
  categoryText: { color: colors.white },
  modalActions: { flexDirection: "row", justifyContent: "flex-end", gap: spacing.md },
  cancelButton: { padding: spacing.md },
  cancelText: { color: colors.textSecondary, fontWeight: "700" },
  saveButton: { backgroundColor: colors.primary, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: 8 },
  saveText: { color: colors.white, fontWeight: "700" },
});
