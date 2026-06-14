import { Transaction, TransactionPayload } from "@/types/transaction";

export interface User {
  id: string;
  name: string;
  email: string;
}

const BASE_URL = "https://vigilant-rotary-phone-jj94x6pr49qgfpwxj-8080.app.github.dev";

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

const toApiTransaction = (payload: TransactionPayload, userId: number) => ({
  description: payload.description,
  category: payload.category,
  amount: payload.amount,
  type: toApiType(payload.type),
  date: payload.date?.toISOString() || new Date().toISOString(),
  userId,
});

export const api = {
  baseUrl: BASE_URL,

  async login(email: string, password: string): Promise<User> {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Usuario ou senha invalidos");
    return res.json();
  },

  async register(name: string, email: string, password: string): Promise<User> {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) throw new Error("Erro ao cadastrar usuario");
    return res.json();
  },

  async getTransactions(userId: number): Promise<Transaction[]> {
    const res = await fetch(`${BASE_URL}/api/transactions?userId=${userId}`);
    if (!res.ok) throw new Error("Erro ao buscar transacoes");
    const data = await res.json();
    return data.map(fromApiTransaction);
  },

  async createTransaction(payload: TransactionPayload, userId: number): Promise<Transaction> {
    const res = await fetch(`${BASE_URL}/api/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toApiTransaction(payload, userId)),
    });
    if (!res.ok) throw new Error("Erro ao criar transacao");
    const data = await res.json();
    return fromApiTransaction(data);
  },

  async updateTransaction(id: string, payload: TransactionPayload, userId: number): Promise<Transaction> {
    const res = await fetch(`${BASE_URL}/api/transactions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toApiTransaction(payload, userId)),
    });
    if (!res.ok) throw new Error("Erro ao atualizar transacao");
    const data = await res.json();
    return fromApiTransaction(data);
  },

  async deleteTransaction(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/transactions/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Erro ao deletar transacao");
  },
};
