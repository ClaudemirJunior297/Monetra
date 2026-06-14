/* SERVIÇO DE API - VERSÃO MOCK (dados falsos para teste) */

import { Transaction, TransactionPayload } from "@/types/transaction";

// Interface do usuário
export interface User {
  id: string;
  name: string;
  email: string;
}

// ========== DADOS MOCK ==========

// Usuários cadastrados
const MOCK_USERS: User[] = [
  { id: "1", name: "João Silva", email: "joao@email.com" },
  { id: "2", name: "Maria Santos", email: "maria@email.com" },
  { id: "3", name: "Carlos Oliveira", email: "carlos@email.com" },
];

// Transações (começa vazio, vai preenchendo conforme o usuário adiciona)
let MOCK_TRANSACTIONS: any[] = [
  {
    id: 1,
    description: "Salário",
    category: "Renda",
    amount: 5000,
    type: "RECEITA",
    date: new Date().toISOString(),
  },
  {
    id: 2,
    description: "Supermercado",
    category: "Alimentação",
    amount: 350.50,
    type: "DESPESA",
    date: new Date().toISOString(),
  },
  {
    id: 3,
    description: "Cinema",
    category: "Lazer",
    amount: 45.00,
    type: "DESPESA",
    date: new Date().toISOString(),
  },
  {
    id: 4,
    description: "Uber",
    category: "Transporte",
    amount: 25.90,
    type: "DESPESA",
    date: new Date().toISOString(),
  },
  {
    id: 5,
    description: "Freelance",
    category: "Renda Extra",
    amount: 1200,
    type: "RECEITA",
    date: new Date().toISOString(),
  },
];

// Contador para IDs das transações
let nextTransactionId = MOCK_TRANSACTIONS.length + 1;

// ========== FUNÇÕES AUXILIARES ==========

// Delay para simular requisição de rede
const delay = (ms: number = 800) => new Promise(resolve => setTimeout(resolve, ms));

// Converte tipo do frontend para o backend
const toApiType = (type: string) => (type === "income" ? "RECEITA" : "DESPESA");

// Converte tipo do backend para o frontend
const fromApiType = (type: string) => (type === "RECEITA" ? "income" : "expense");

// Converte transação do backend para o frontend
const fromApiTransaction = (transaction: any): Transaction => ({
  id: String(transaction.id),
  description: transaction.description,
  category: transaction.category as any,
  amount: transaction.amount,
  type: fromApiType(transaction.type),
  date: new Date(transaction.date),
});

// Converte transação do frontend para o backend
const toApiTransaction = (payload: TransactionPayload) => ({
  description: payload.description,
  category: payload.category,
  amount: payload.amount,
  type: toApiType(payload.type),
  date: payload.date?.toISOString() || new Date().toISOString(),
});

// ========== API MOCK ==========

export const api = {
  baseUrl: "MOCK API (sem backend - dados locais)",

  // LOGIN
  async login(email: string, password: string): Promise<User> {
    console.log(`[MOCK] Tentativa de login: ${email}`);
    await delay();

    const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    // Qualquer senha com mais de 3 caracteres funciona (mock)
    if (!password || password.length < 3) {
      throw new Error("Senha incorreta");
    }

    console.log(`[MOCK] Login bem-sucedido: ${user.name}`);
    return user;
  },

  // CADASTRO
  async register(name: string, email: string, password: string): Promise<User> {
    console.log(`[MOCK] Tentativa de cadastro: ${email}`);
    await delay();

    const existingUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (existingUser) {
      throw new Error("E-mail já cadastrado");
    }

    if (!name || name.trim().length < 3) {
      throw new Error("Nome deve ter pelo menos 3 caracteres");
    }

    if (!email || !email.includes("@")) {
      throw new Error("E-mail inválido");
    }

    if (!password || password.length < 6) {
      throw new Error("Senha deve ter pelo menos 6 caracteres");
    }

    const newUser: User = {
      id: String(MOCK_USERS.length + 1),
      name: name.trim(),
      email: email.trim().toLowerCase(),
    };

    MOCK_USERS.push(newUser);
    console.log(`[MOCK] Cadastro bem-sucedido: ${newUser.name}`);
    return newUser;
  },

  // BUSCAR TRANSAÇÕES
  async getTransactions(): Promise<Transaction[]> {
    console.log(`[MOCK] Buscando transações...`);
    await delay(500);
    return MOCK_TRANSACTIONS.map(fromApiTransaction);
  },

  // CRIAR TRANSAÇÃO
  async createTransaction(payload: TransactionPayload): Promise<Transaction> {
    console.log(`[MOCK] Criando transação: ${payload.description}`);
    await delay();

    const newTransaction = {
      id: nextTransactionId++,
      ...toApiTransaction(payload),
    };

    MOCK_TRANSACTIONS.unshift(newTransaction);
    console.log(`[MOCK] Transação criada com ID: ${newTransaction.id}`);
    return fromApiTransaction(newTransaction);
  },

  // ATUALIZAR TRANSAÇÃO
  async updateTransaction(id: string, payload: TransactionPayload): Promise<Transaction> {
    console.log(`[MOCK] Atualizando transação ID: ${id}`);
    await delay();

    const index = MOCK_TRANSACTIONS.findIndex(t => String(t.id) === id);

    if (index === -1) {
      throw new Error("Transação não encontrada");
    }

    MOCK_TRANSACTIONS[index] = {
      ...MOCK_TRANSACTIONS[index],
      ...toApiTransaction(payload),
    };

    console.log(`[MOCK] Transação atualizada ID: ${id}`);
    return fromApiTransaction(MOCK_TRANSACTIONS[index]);
  },

  // DELETAR TRANSAÇÃO
  async deleteTransaction(id: string): Promise<void> {
    console.log(`[MOCK] Deletando transação ID: ${id}`);
    await delay();

    const index = MOCK_TRANSACTIONS.findIndex(t => String(t.id) === id);

    if (index === -1) {
      throw new Error("Transação não encontrada");
    }

    MOCK_TRANSACTIONS.splice(index, 1);
    console.log(`[MOCK] Transação deletada ID: ${id}`);
  },
};