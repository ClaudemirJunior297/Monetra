// Função: Adicionar uma nova transação

import { useState } from "react";
import {
  Alert,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator
} from "react-native";
import { router } from "expo-router";
import { colors, spacing, typography } from "@/styles/theme";
import { categories, Category, TransactionType } from "@/types/transaction";
import { useColors } from "@/hooks/useColors";
import { useTransactions } from "@/contexts/TransactionContext";

// Converte valor string para número (ex: "1.234,56" => 1234.56)
const parseAmount = (value: string) =>
  Number(value.replace(/\./g, "").replace(",", "."));

export default function AddTransaction() {
  const c = useColors();
  const { addTransaction } = useTransactions();

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<TransactionType>("expense");
  const [category, setCategory] = useState<Category>("Outros");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    Keyboard.dismiss();
    const amountNumber = parseAmount(amount);

    if (!description.trim()) {
      Alert.alert("Erro", "Informe a descrição da transação.");
      return;
    }

    if (isNaN(amountNumber) || amountNumber <= 0) {
      Alert.alert("Erro", "Informe um valor maior que zero.");
      return;
    }

    try {
      setSaving(true);

      await addTransaction({
        description: description.trim(),
        amount: amountNumber,
        type,
        category
      });

      setDescription("");
      setAmount("");
      setType("expense");
      setCategory("Outros");

      Alert.alert(
        "Sucesso!",
        "Transação adicionada com sucesso!",
        [{ text: "OK", onPress: () => router.push("/(tabs)/transaction") }]
      );

    } catch (error) {
      Alert.alert(
        "Erro",
        error instanceof Error ? error.message : "Não foi possível salvar a transação."
      );
    } finally {
      setSaving(false);
    }
  };

  const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: c.bg
  },
  form: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl
  },
  label: {
    ...typography.body,
    color: c.text,
    marginBottom: spacing.xs,
    marginTop: spacing.md
  },
  input: {
    backgroundColor: c.card,
    color: c.text,
    padding: spacing.md,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: c.border
  },
  typeRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.xs
  },
  typeButton: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: c.card,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: c.border
  },
  expenseActive: {
    backgroundColor: c.expense,
    borderColor: c.expense
  },
  incomeActive: {
    backgroundColor: c.income,
    borderColor: c.income
  },
  typeText: {
    color: c.text,
    fontWeight: "600"
  },
  activeText: {
    color: c.text
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.xs
  },
  categoryButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: c.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: c.border
  },
  categoryButtonActive: {
    backgroundColor: c.primary,
    borderColor: c.primary
  },
  categoryText: {
    color: c.text
  },
  saveButton: {
    backgroundColor: c.primary,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: "center",
    marginTop: spacing.xl,
    minHeight: 52,
    justifyContent: "center"
  },
  disabledButton: {
    opacity: 0.65
  },
  saveButtonText: {
    color: c.text,
    fontSize: 18,
    fontWeight: "bold"
  },
})
  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.form}>

        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={styles.input}
          placeholder="Descrição da transação"
          placeholderTextColor={c.sub}
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>Valor</Text>
        <TextInput
          style={styles.input}
          placeholder="0,00"
          placeholderTextColor={c.sub}
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
        />

        <Text style={styles.label}>Tipo</Text>
        <View style={styles.typeRow}>
          <TouchableOpacity
            style={[styles.typeButton, type === "expense" && styles.expenseActive]}
            onPress={() => setType("expense")}
          >
            <Text style={[styles.typeText, type === "expense" && styles.activeText]}>
              Despesa
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, type === "income" && styles.incomeActive]}
            onPress={() => setType("income")}
          >
            <Text style={[styles.typeText, type === "income" && styles.activeText]}>
              Receita
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Categoria</Text>
        <View style={styles.categoriesGrid}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryButton, category === cat && styles.categoryButtonActive]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[styles.categoryText, category === cat && styles.activeText]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.disabledButton]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color={c.text} />
          ) : (
            <Text style={styles.saveButtonText}>Salvar transação</Text>
          )}
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}
;