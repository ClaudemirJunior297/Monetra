// Função: Adicionar uma nova transação

// Importa os hooks e componentes
import { useState } from "react";
import { Alert, Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

// Importa a navegação
import { router } from "expo-router";

// Importa cores e estilos
import { colors, spacing, typography } from "@/styles/theme";

// Importa categorias e tipos
import { categories, Category, TransactionType } from "@/types/transaction";

// Importa o contexto das transações
import { useTransactions } from "@/contexts/TransactionContext";

// Função: Converter valor string para número
const parseAmount = (value: string) =>
  Number(value.replace(/\./g, "").replace(",", "."));

// Função principal da tela
export default function AddTransaction() {

  // Pega a função de adicionar transação
  const { addTransaction } = useTransactions();

  // Estado da descrição
  const [description, setDescription] = useState("");

  // Estado do valor
  const [amount, setAmount] = useState("");

  // Estado do tipo da transação
  const [type, setType] = useState<TransactionType>("expense");

  // Estado da categoria
  const [category, setCategory] = useState<Category>("Outros");

  // Estado de carregamento
  const [saving, setSaving] = useState(false);

  // Função: Salvar transação
  const handleSave = async () => {

    // Fecha o teclado
    Keyboard.dismiss();

    // Converte o valor para número
    const amountNumber = parseAmount(amount);

    // Verifica se a descrição está vazia
    if (!description.trim()) {
      Alert.alert("Erro", "Informe a descrição da transação.");
      return;
    }

    // Verifica se o valor é válido
    if (Number.isNaN(amountNumber) || amountNumber <= 0) {
      Alert.alert("Erro", "Informe um valor maior que zero.");
      return;
    }

    try {

      // Ativa loading
      setSaving(true);

      // Salva a transação
      await addTransaction({
        description: description.trim(),
        amount: amountNumber,
        type,
        category
      });

      // Limpa os campos
      setDescription("");
      setAmount("");
      setType("expense");
      setCategory("Outros");

      // Mostra alerta de sucesso
      Alert.alert(
        "Transação registrada",
        "Os dados foram salvos no banco.",
        [
          {
            text: "OK",
            onPress: () => router.push("/(tabs)/transaction")
          },
        ]
      );

    } catch (error) {

      // Mostra erro
      Alert.alert(
        "Erro",
        error instanceof Error
          ? error.message
          : "Não foi possível salvar a transação."
      );

    } finally {

      // Desativa loading
      setSaving(false);
    }
  };

  return (

    // Tela com rolagem
    <ScrollView
      style={styles.container}
      keyboardShouldPersistTaps="handled"
    >

      <View style={styles.form}>

        {/* Campo descrição */}
        <Text style={styles.label}>Descrição</Text>

        <TextInput
          style={styles.input}
          placeholder="Descrição da transação"
          placeholderTextColor={colors.textSecondary}
          value={description}
          onChangeText={setDescription}
        />

        {/* Campo valor */}
        <Text style={styles.label}>Valor</Text>

        <TextInput
          style={styles.input}
          placeholder="0,00"
          placeholderTextColor={colors.textSecondary}
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
        />

        {/* Tipo da transação */}
        <Text style={styles.label}>Tipo</Text>

        <View style={styles.typeRow}>

          {/* Botão despesa */}
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === "expense" && styles.expenseActive
            ]}
            onPress={() => setType("expense")}
          >
            <Text
              style={[
                styles.typeText,
                type === "expense" && styles.activeText
              ]}
            >
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
            <Text
              style={[
                styles.typeText,
                type === "income" && styles.activeText
              ]}
            >
              Receita
            </Text>
          </TouchableOpacity>
        </View>

        {/* Lista de categorias */}
        <Text style={styles.label}>Categoria</Text>

        <View style={styles.categoriesGrid}>

          {categories.map((cat) => (

            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryButton,
                category === cat && styles.categoryButtonActive
              ]}
              onPress={() => setCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryText,
                  category === cat && styles.activeText
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Botão salvar */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            saving && styles.disabledButton
          ]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? "Salvando..." : "Salvar transação"}
          </Text>
        </TouchableOpacity>

      </View>
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

  // Área do formulário
  form: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl
  },

  // Texto dos labels
  label: {
    ...typography.body,
    color: colors.white,
    marginBottom: spacing.xs,
    marginTop: spacing.md
  },

  // Campo input
  input: {
    backgroundColor: colors.card,
    color: colors.white,
    padding: spacing.md,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border
  },

  // Linha dos botões
  typeRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.xs
  },

  // Botão de tipo
  typeButton: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.card,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border
  },

  // Botão despesa ativo
  expenseActive: {
    backgroundColor: colors.expense,
    borderColor: colors.expense
  },

  // Botão receita ativo
  incomeActive: {
    backgroundColor: colors.success,
    borderColor: colors.success
  },

  // Texto do botão
  typeText: {
    color: colors.text,
    fontWeight: "600"
  },

  // Texto ativo
  activeText: {
    color: colors.white
  },

  // Área das categorias
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.xs
  },

  // Botão categoria
  categoryButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: 8,
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
    color: colors.text
  },

  // Botão salvar
  saveButton: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: "center",
    marginTop: spacing.xl
  },

  // Botão desabilitado
  disabledButton: {
    opacity: 0.65
  },

  // Texto do botão salvar
  saveButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold"
  },
});