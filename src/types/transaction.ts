// ========== TIPOS E INTERFACES DAS TRANSAÇÕES ==========

// Tipo da transação: receita ou despesa
export type TransactionType = "income" | "expense";

// Categorias disponíveis
export type Category = 
  | "Alimentação"
  | "Transporte"
  | "Moradia"
  | "Lazer"
  | "Saúde"
  | "Educação"
  | "Renda"
  | "Outros";

// Lista de categorias (para usar em selects e grids)
export const categories: Category[] = [
  "Alimentação",
  "Transporte",
  "Moradia",
  "Lazer",
  "Saúde",
  "Educação",
  "Renda",
  "Outros",
];

// ========== INTERFACES PRINCIPAIS ==========

// Estrutura de uma transação
export interface Transaction {
  id: string;               // ID único
  description: string;      // Descrição (ex: "Compra no mercado")
  amount: number;           // Valor (sempre positivo)
  type: TransactionType;    // income (receita) ou expense (despesa)
  category: Category;       // Categoria
  date: Date;               // Data da transação
}

// Resumo financeiro (dashboard)
export interface MonthlySummary {
  totalIncome: number;                           // Total de receitas
  totalExpense: number;                          // Total de despesas
  balance: number;                               // Saldo (receitas - despesas)
  categoryBreakdown: Partial<Record<Category, number>>; // Gastos por categoria
}

// Payload para criar/atualizar transação (id e date são opcionais)
export type TransactionPayload = Omit<Transaction, "id" | "date"> & {
  date?: Date;  // Se não informar, usa a data atual
};