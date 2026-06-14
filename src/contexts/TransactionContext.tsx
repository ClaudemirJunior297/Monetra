// CONTEXTO DE TRANSAÇÕES - Gerencia dados financeiros

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "@/services/api";
import { Category, MonthlySummary, Transaction, TransactionPayload } from "@/types/transaction";

// Tipagem do contexto
interface TransactionContextData {
  transactions: Transaction[];                           // Lista de transações
  summary: MonthlySummary;                               // Resumo financeiro
  loading: boolean;                                      // Estado de carregamento
  error: string | null;                                  // Mensagem de erro
  refresh: () => Promise<void>;                          // Recarrega os dados
  addTransaction: (payload: TransactionPayload) => Promise<void>;   // Adiciona
  updateTransaction: (id: string, payload: TransactionPayload) => Promise<void>; // Atualiza
  deleteTransaction: (id: string) => Promise<void>;      // Exclui
}

// Cria o contexto
const TransactionContext = createContext<TransactionContextData>({} as TransactionContextData);

// Provider do contexto
export function TransactionProvider({ children }: { children: React.ReactNode }) {
  // Estado da lista de transações
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // Estado de carregamento
  const [loading, setLoading] = useState(true);
  
  // Estado de erro
  const [error, setError] = useState<string | null>(null);

  // Função: Buscar transações da API
  const refresh = useCallback(async () => {
    try {
      setError(null);                         // Limpa erro anterior
      const data = await api.getTransactions();  // Chama API
      setTransactions(data);                  // Atualiza estado
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar transações.");
    } finally {
      setLoading(false);                      // Desativa loading
    }
  }, []);

  // Carrega transações ao iniciar e atualiza a cada 10 segundos
  useEffect(() => {
    refresh();                                 // Carrega inicial
    const interval = setInterval(refresh, 10000); // Atualiza automático
    return () => clearInterval(interval);      // Limpa ao desmontar
  }, [refresh]);

  // Função: Adicionar nova transação
  const addTransaction = useCallback(async (payload: TransactionPayload) => {
    const created = await api.createTransaction(payload);  // Cria na API
    setTransactions((current) => [created, ...current]);   // Adiciona no topo
    await refresh();                                        // Sincroniza
  }, [refresh]);

  // Função: Atualizar transação existente
  const updateTransaction = useCallback(async (id: string, payload: TransactionPayload) => {
    const updated = await api.updateTransaction(id, payload);  // Atualiza na API
    setTransactions((current) => 
      current.map((item) => (item.id === id ? updated : item)) // Atualiza na lista
    );
    await refresh();  // Sincroniza
  }, [refresh]);

  // Função: Excluir transação
  const deleteTransaction = useCallback(async (id: string) => {
    await api.deleteTransaction(id);                           // Exclui na API
    setTransactions((current) => current.filter((item) => item.id !== id)); // Remove da lista
    await refresh();  // Sincroniza
  }, [refresh]);

  // Calcula o resumo financeiro (receitas, despesas, saldo)
  const summary = useMemo<MonthlySummary>(() => {
    // Soma das receitas (income)
    const totalIncome = transactions
      .filter((transaction) => transaction.type === "income")
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    
    // Soma das despesas (expense)
    const totalExpense = transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    
    // Gastos por categoria (para gráficos)
    const categoryBreakdown = transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce<Partial<Record<Category, number>>>((acc, transaction) => {
        acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
        return acc;
      }, {});

    return {
      totalIncome,                     // Total de receitas
      totalExpense,                    // Total de despesas
      balance: totalIncome - totalExpense,  // Saldo
      categoryBreakdown,               // Gastos por categoria
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

// Hook personalizado para usar o contexto
export const useTransactions = () => useContext(TransactionContext);