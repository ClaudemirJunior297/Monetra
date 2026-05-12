export type TransactionType = "income" | "expense";

export type Category = 
  | "Alimentação"
  | "Transporte"
  | "Moradia"
  | "Lazer"
  | "Saúde"
  | "Educação"
  | "Renda"
  | "Outros";

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

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: Category;
  date: Date;
}

export interface MonthlySummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  categoryBreakdown: Partial<Record<Category, number>>;
}

export type TransactionPayload = Omit<Transaction, "id" | "date"> & {
  date?: Date;
};
