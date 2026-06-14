import { Transaction, TransactionPayload } from "@/types/transaction";

export interface User {
  id: string;
  name: string;
  email: string;
}

const BASE_URL = "http://localhost:8080";

const toApiType = (type: string) => (type === "income" ? "INCOME" : "EXPENSE");
const fromApiType = (type: string) => (type === "INCOME" ? "income" : "expense");

const fromApiTransaction = (t: any): Transaction => ({
  id: String(t.id),
  description: t.description,
  category: t.category as any,
  amount: t.amount,
  type: fromApiType(t.type),
  date: new Date(t.date),
});

const toApiTransaction = (payload: TransactionPayload) => ({
  description: payload.description,
  category: payload.category,
  amount: payload.amount,
  type: toApiType(payload.type),
  date: payload.date?.toISOString() || new Date().toISOString(),
  userId: 1,
});

export const api = {
  baseUrl: BASE_URL,

  async login(email: string, password: string): Promise<User> {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Usuário ou senha inválidos");
    return res.json();
  },

  async register(name: string, email: string, password: string): Promise<User> {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) throw new Error("Erro ao cadastrar usuário");
    return res.json();
  },

  async getTransactions(): Promise<Transaction[]> {
    const res = await fetch(`${BASE_URL}/api/transactions`);
    if (!res.ok) throw new Error("Erro ao buscar transações");
    const data = await res.json();
    return data.map(fromApiTransaction);
  },

  async createTransaction(payload: TransactionPayload): Promise<Transaction> {
    const res = await fetch(`${BASE_URL}/api/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toApiTransaction(payload)),
    });
    if (!res.ok) throw new Error("Erro ao criar transação");
    const data = await res.json();
    return fromApiTransaction(data);
  },

  async updateTransaction(id: string, payload: TransactionPayload): Promise<Transaction> {
    const res = await fetch(`${BASE_URL}/api/transactions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toApiTransaction(payload)),
    });
    if (!res.ok) throw new Error("Erro ao atualizar transação");
    const data = await res.json();
    return fromApiTransaction(data);
  },

  async deleteTransaction(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/transactions/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Erro ao deletar transação");
  },
};
