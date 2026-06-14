/* CONTEXTO DE TRANSAÇÕES - Gerencia dados financeiros */

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

  // Buscar transações
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

  // Carregar ao iniciar
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Adicionar transação - CORRIGIDO
  const addTransaction = useCallback(async (payload: TransactionPayload) => {
    setLoading(true);
    try {
      const created = await api.createTransaction(payload);
      // Adiciona a nova transação no início da lista
      setTransactions((current) => [created, ...current]);
      // Recarrega para garantir sincronia com o backend
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao adicionar transação");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refresh]);

  // Atualizar transação
  const updateTransaction = useCallback(async (id: string, payload: TransactionPayload) => {
    setLoading(true);
    try {
      const updated = await api.updateTransaction(id, payload);
      setTransactions((current) =>
        current.map((item) => (item.id === id ? updated : item))
      );
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar transação");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refresh]);

  // Deletar transação
  const deleteTransaction = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await api.deleteTransaction(id);
      setTransactions((current) => current.filter((item) => item.id !== id));
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir transação");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refresh]);

  // Calcular resumo
  const summary = useMemo<MonthlySummary>(() => {
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    
    const categoryBreakdown = transactions
      .filter((t) => t.type === "expense")
      .reduce<Partial<Record<Category, number>>>((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
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
      value={{
        transactions,
        summary,
        loading,
        error,
        refresh,
        addTransaction,
        updateTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export const useTransactions = () => useContext(TransactionContext);