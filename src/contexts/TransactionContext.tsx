import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "@/services/api";
import { Category, MonthlySummary, Transaction, TransactionPayload } from "@/types/transaction";

interface TransactionContextData {
  transactions: Transaction[];
  summary: MonthlySummary;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addTransaction: (payload: TransactionPayload) => Promise<void>;
  updateTransaction: (id: string, payload: TransactionPayload) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
}

const TransactionContext = createContext<TransactionContextData>({} as TransactionContextData);

export function TransactionProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const data = await api.getTransactions();
      setTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar transações.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 10000);
    return () => clearInterval(interval);
  }, [refresh]);

  const addTransaction = useCallback(async (payload: TransactionPayload) => {
    const created = await api.createTransaction(payload);
    setTransactions((current) => [created, ...current]);
    await refresh();
  }, [refresh]);

  const updateTransaction = useCallback(async (id: string, payload: TransactionPayload) => {
    const updated = await api.updateTransaction(id, payload);
    setTransactions((current) => current.map((item) => (item.id === id ? updated : item)));
    await refresh();
  }, [refresh]);

  const deleteTransaction = useCallback(async (id: string) => {
    await api.deleteTransaction(id);
    setTransactions((current) => current.filter((item) => item.id !== id));
    await refresh();
  }, [refresh]);

  const summary = useMemo<MonthlySummary>(() => {
    const totalIncome = transactions
      .filter((transaction) => transaction.type === "income")
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    const totalExpense = transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    const categoryBreakdown = transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce<Partial<Record<Category, number>>>((acc, transaction) => {
        acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
        return acc;
      }, {});

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      categoryBreakdown,
    };
  }, [transactions]);

  return (
    <TransactionContext.Provider
      value={{ transactions, summary, loading, error, refresh, addTransaction, updateTransaction, deleteTransaction }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export const useTransactions = () => useContext(TransactionContext);
