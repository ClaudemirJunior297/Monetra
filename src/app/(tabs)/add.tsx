// Importação dos hooks e componentes necessários do React e React Native
import { useState } from "react";
import { Alert, Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
// Hook de navegação do Expo Router
import { router } from "expo-router";
// Tokens de design (cores, espaçamentos, tipografia)
import { colors, spacing, typography } from "@/styles/theme";
// Tipos e dados estáticos de categorias e tipo de transação
import { categories, Category, TransactionType } from "@/types/transaction";
// Hook customizado para acessar o contexto de transações
import { useTransactions } from "@/contexts/TransactionContext";

// Função auxiliar para converter string de moeda para número
// Exemplo: "1.234,56" -> 1234.56
const parseAmount = (value: string) => Number(value.replace(/\./g, "").replace(",", "."));

// Componente principal da tela de adicionar transação
export default function AddTransaction() {
  // Obtém a função addTransaction do contexto
  const { addTransaction } = useTransactions();
  
  // Estados do formulário
  const [description, setDescription] = useState("");      // Descrição da transação
  const [amount, setAmount] = useState("");                // Valor como string (formato BR)
  const [type, setType] = useState<TransactionType>("expense"); // Tipo: despesa ou receita
  const [category, setCategory] = useState<Category>("Outros"); // Categoria selecionada
  const [saving, setSaving] = useState(false);             // Estado de carregamento do salvamento

  // Função que salva a transação
  const handleSave = async () => {
    // Fecha o teclado virtual
    Keyboard.dismiss();
    // Converte o valor da string para número
    const amountNumber = parseAmount(amount);

    // Validação: descrição não pode estar vazia
    if (!description.trim()) {
      Alert.alert("Erro", "Informe a descrição da transação.");
      return;
    }
    // Validação: valor deve ser numérico e maior que zero
    if (Number.isNaN(amountNumber) || amountNumber <= 0) {
      Alert.alert("Erro", "Informe um valor maior que zero.");
      return;
    }

    try {
      setSaving(true); // Inicia estado de carregamento
      // Chama a função do contexto para adicionar a transação
      await addTransaction({ description: description.trim(), amount: amountNumber, type, category });
      
      // Reseta os campos do formulário após salvar com sucesso
      setDescription("");
      setAmount("");
      setType("expense");
      setCategory("Outros");
      
      // Alerta de sucesso e navega para a lista de transações
      Alert.alert("Transação registrada", "Os dados foram salvos no banco.", [
        { text: "OK", onPress: () => router.push("/(tabs)/transaction") },
      ]);
    } catch (error) {
      // Em caso de erro, exibe mensagem adequada
      Alert.alert("Erro", error instanceof Error ? error.message : "Não foi possível salvar a transação.");
    } finally {
      setSaving(false); // Finaliza estado de carregamento
    }
  };

  return (
    // ScrollView permite rolagem em telas pequenas
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.form}>
        {/* Campo Descrição */}
        <Text style={styles.label}>Descrição</Text>
        <TextInput style={styles.input} placeholder="Descrição da transação" placeholderTextColor={colors.textSecondary} value={description} onChangeText={setDescription} />

        {/* Campo Valor */}
        <Text style={styles.label}>Valor</Text>
        <TextInput style={styles.input} placeholder="0,00" placeholderTextColor={colors.textSecondary} keyboardType="decimal-pad" value={amount} onChangeText={setAmount} />

        {/* Seletor de Tipo (Despesa / Receita) */}
        <Text style={styles.label}>Tipo</Text>
        <View style={styles.typeRow}>
          <TouchableOpacity style={[styles.typeButton, type === "expense" && styles.expenseActive]} onPress={() => setType("expense")}>
            <Text style={[styles.typeText, type === "expense" && styles.activeText]}>Despesa</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.typeButton, type === "income" && styles.incomeActive]} onPress={() => setType("income")}>
            <Text style={[styles.typeText, type === "income" && styles.activeText]}>Receita</Text>
          </TouchableOpacity>
        </View>

        {/* Grade de Categorias (lista fixa importada de types/transaction) */}
        <Text style={styles.label}>Categoria</Text>
        <View style={styles.categoriesGrid}>
          {categories.map((cat) => (
            <TouchableOpacity key={cat} style={[styles.categoryButton, category === cat && styles.categoryButtonActive]} onPress={() => setCategory(cat)}>
              <Text style={[styles.categoryText, category === cat && styles.activeText]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Botão de Salvar (desabilitado durante o salvamento) */}
        <TouchableOpacity style={[styles.saveButton, saving && styles.disabledButton]} onPress={handleSave} disabled={saving}>
          <Text style={styles.saveButtonText}>{saving ? "Salvando..." : "Salvar transação"}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Estilos do componente (definidos com StyleSheet)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },                           // Fundo principal
  form: { padding: spacing.lg, paddingBottom: spacing.xxl },                           // Espaçamento interno do formulário
  label: { ...typography.body, color: colors.white, marginBottom: spacing.xs, marginTop: spacing.md }, // Estilo dos rótulos
  input: { backgroundColor: colors.card, color: colors.white, padding: spacing.md, borderRadius: 8, fontSize: 16, borderWidth: 1, borderColor: colors.border }, // Campo de texto
  typeRow: { flexDirection: "row", gap: spacing.md, marginTop: spacing.xs },           // Container dos botões de tipo (lado a lado)
  typeButton: { flex: 1, padding: spacing.md, backgroundColor: colors.card, borderRadius: 8, alignItems: "center", borderWidth: 1, borderColor: colors.border }, // Botão de tipo padrão
  expenseActive: { backgroundColor: colors.expense, borderColor: colors.expense },     // Botão "Despesa" ativo (fundo vermelho)
  incomeActive: { backgroundColor: colors.success, borderColor: colors.success },      // Botão "Receita" ativo (fundo verde)
  typeText: { color: colors.text, fontWeight: "600" },                                 // Texto do botão de tipo
  activeText: { color: colors.white },                                                 // Texto quando o botão está ativo
  categoriesGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.xs }, // Grade flexível de categorias
  categoryButton: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, backgroundColor: colors.card, borderRadius: 8, borderWidth: 1, borderColor: colors.border }, // Botão de categoria
  categoryButtonActive: { backgroundColor: colors.category, borderColor: colors.category }, // Categoria selecionada
  categoryText: { color: colors.text },                                               // Texto da categoria
  saveButton: { backgroundColor: colors.primary, padding: spacing.md, borderRadius: 8, alignItems: "center", marginTop: spacing.xl }, // Botão salvar
  disabledButton: { opacity: 0.65 },                                                  // Botão desabilitado (semitransparente)
  saveButtonText: { color: colors.white, fontSize: 18, fontWeight: "bold" },          // Texto do botão salvar
});