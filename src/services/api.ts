import Constants from "expo-constants";
import { Platform } from "react-native";
import { Transaction, TransactionPayload } from "@/types/transaction";

export interface User {
  id: string;
  name: string;
  email: string;
}

type ApiTransaction = {
  id: number;
  description: string;
  category: string;
  amount: number;
  type: "RECEITA" | "DESPESA";
  date: string;
};

const getBaseUrl = () => {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl) {
    return envUrl.replace(/\/$/, "");
  }

  const hostUri = Constants.expoConfig?.hostUri || Constants.manifest2?.extra?.expoGo?.debuggerHost;
  const host = hostUri?.split(":")[0];
  if (host) {
    return `http://${host}:8080`;
  }

  return Platform.OS === "android" ? "http://10.0.2.2:8080" : "http://localhost:8080";
};

const API_URL = getBaseUrl();

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    let message = "Não foi possível concluir a operação.";
    try {
      const body = await response.json();
      message = body.erro || body.message || message;
    } catch {
      const text = await response.text();
      if (text) {
        message = text;
      }
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

const toApiType = (type: Transaction["type"]) => (type === "income" ? "RECEITA" : "DESPESA");

const fromApiTransaction = (transaction: ApiTransaction): Transaction => ({
  id: String(transaction.id),
  description: transaction.description,
  category: transaction.category as Transaction["category"],
  amount: transaction.amount,
  type: transaction.type === "RECEITA" ? "income" : "expense",
  date: transaction.date ? new Date(transaction.date) : new Date(),
});

const toApiTransaction = (payload: TransactionPayload) => ({
  description: payload.description,
  category: payload.category,
  amount: payload.amount,
  type: toApiType(payload.type),
  date: payload.date?.toISOString(),
});

export const api = {
  baseUrl: API_URL,
  async login(email: string, password: string) {
    const user = await request<{ id: number; name: string; email: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    return { ...user, id: String(user.id) } satisfies User;
  },
  async register(name: string, email: string, password: string) {
    const user = await request<{ id: number; name: string; email: string }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    return { ...user, id: String(user.id) } satisfies User;
  },
  async getTransactions() {
    const transactions = await request<ApiTransaction[]>("/api/transactions");
    return transactions.map(fromApiTransaction);
  },
  async createTransaction(payload: TransactionPayload) {
    const transaction = await request<ApiTransaction>("/api/transactions", {
      method: "POST",
      body: JSON.stringify(toApiTransaction(payload)),
    });
    return fromApiTransaction(transaction);
  },
  async updateTransaction(id: string, payload: TransactionPayload) {
    const transaction = await request<ApiTransaction>(`/api/transactions/${id}`, {
      method: "PUT",
      body: JSON.stringify(toApiTransaction(payload)),
    });
    return fromApiTransaction(transaction);
  },
  async deleteTransaction(id: string) {
    await request<void>(`/api/transactions/${id}`, { method: "DELETE" });
  },
};
