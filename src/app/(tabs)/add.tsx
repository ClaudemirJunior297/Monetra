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

// Função: Converter valor string para número (ex: "1.234,56" => 1234.56)
const parseAmount = (value: string) =>
  Number(value.replace(/\./g, "").replace(",", "."));

// Função principal da tela
export default function AddTransaction() {

  // Pega a função de adicionar transação do contexto
  const { addTransaction } = useTransactions();

  // Estado da descrição
  const [description, setDescription] = useState("");

  // Estado do valor
  const [amount, setAmount] = useState("");

  // Estado do tipo da transação (despesa ou receita)
  const [type, setType] = useState<TransactionType>("expense");

  // Estado da categoria selecionada
  const [category, setCategory] = useState<Category>("Outros");

  // Estado de carregamento (desabilita botão enquanto salva)
  const [saving, setSaving] = useState(false);

  // Função: Salvar transação
  const handleSave = async () => {

    // Fecha o teclado
    Keyboard.dismiss();

    // Converte o valor para número
    const amountNumber = parseAmount(amount);

    // Validação: descrição não pode ser vazia
    if (!description.trim()) {
      Alert.alert("Erro", "Informe a descrição da transação.");
      return;
    }

    // Validação: valor deve ser maior que zero
    if (Number.isNaN(amountNumber) || amountNumber <= 0) {
      Alert.alert("Erro", "Informe um valor maior que zero.");
      return;
    }

    try {

      // Ativa loading
      setSaving(true);

      // Salva a transação no contexto/banco
      await addTransaction({
        description: description.trim(),
        amount: amountNumber,
        type,
        category
      });

      // Limpa os campos do formulário
      setDescription("");
      setAmount("");
      setType("expense");
      setCategory("Outros");

      // Alerta de sucesso e navega para lista de transações
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

      // Em caso de erro, mostra mensagem
      Alert.alert(
        "Erro",
        error instanceof Error
          ? error.message
          : "Não foi possível salvar a transação."
      );

    } finally {

      // Desativa loading (sempre executa, mesmo se der erro)
      setSaving(false);
    }
  };

  return (

    // Tela com rolagem, fecha teclado ao tocar fora
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

        {/* Campo valor (teclado numérico) */}
        <Text style={styles.label}>Valor</Text>
        <TextInput
          style={styles.input}
          placeholder="0,00"
          placeholderTextColor={colors.textSecondary}
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
        />

        {/* Tipo da transação: Despesa ou Receita */}
        <Text style={styles.label}>Tipo</Text>
        <View style={styles.typeRow}>

          {/* Botão despesa (vermelho quando ativo) */}
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

          {/* Botão receita (verde quando ativo) */}
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

        {/* Lista de categorias (grid de botões) */}
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

        {/* Botão salvar (desabilitado durante salvamento) */}
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

// ========== ESTILOS DA TELA ==========
const styles = StyleSheet.create({

  // Container principal
  container: {
    flex: 1,
    backgroundColor: colors.background
  },

  // Área do formulário (padding)
  form: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl
  },

  // Texto dos labels (descrição, valor, tipo, categoria)
  label: {
    ...typography.body,
    color: colors.white,
    marginBottom: spacing.xs,
    marginTop: spacing.md
  },

  // Campo de input
  input: {
    backgroundColor: colors.card,
    color: colors.white,
    padding: spacing.md,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border
  },

  // Linha horizontal dos botões (despesa/receita)
  typeRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.xs
  },

  // Botão de tipo (despesa ou receita)
  typeButton: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.card,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border
  },

  // Botão despesa quando ativo (fundo vermelho)
  expenseActive: {
    backgroundColor: colors.expense,
    borderColor: colors.expense
  },

  // Botão receita quando ativo (fundo verde)
  incomeActive: {
    backgroundColor: colors.success,
    borderColor: colors.success
  },

  // Texto do botão de tipo
  typeText: {
    color: colors.text,
    fontWeight: "600"
  },

  // Texto quando o botão está ativo (branco)
  activeText: {
    color: colors.white
  },

  // Grid de categorias (vários botões lado a lado)
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.xs
  },

  // Botão de categoria (padrão)
  categoryButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border
  },

  // Botão de categoria quando selecionado
  categoryButtonActive: {
    backgroundColor: colors.category,
    borderColor: colors.category
  },

  // Texto da categoria
  categoryText: {
    color: colors.text
  },

  // Botão salvar (verde/primário)
  saveButton: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: "center",
    marginTop: spacing.xl
  },

  // Botão salvar desabilitado (opaco)
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