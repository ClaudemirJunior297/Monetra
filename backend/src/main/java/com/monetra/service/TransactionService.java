/**
 * TransactionService
 * 
 * Serviço de lógica de negócio para gerenciamento de transações financeiras.
 * Implementa as operações CRUD (Create, Read, Update, Delete) e funcionalidades específicas.
 * 
 * Atualmente utiliza armazenamento em memória (simula banco de dados).
 * Em produção, deve ser integrado com um banco de dados (JPA/Hibernate).
 * 
 * Características:
 * - Validação de dados antes de persistência
 * - Filtros por categoria e tipo de transação
 * - Cálculo automático de resumo financeiro
 * - Gerenciamento automático de IDs
 * 
 * @author Monetra Team
 * @version 1.0.0
 */
package com.monetra.service;

import com.monetra.model.Transaction;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Anotação @Service marca esta classe como um serviço no Spring Container.
 * Será automaticamente injetada em Controllers e outros componentes.
 */
@Service
public class TransactionService {

    /**
     * Lista em memória armazenando todas as transações.
     * NOTA: Dados são perdidos ao reiniciar a aplicação.
     * Para produção, integrar com banco de dados permanente.
     */
    private final List<Transaction> transactions = new ArrayList<>();
    
    /**
     * Contador para geração automática de IDs.
     * Incrementado a cada nova transação criada.
     */
    private Long idCounter = 1L;

    /**
     * Construtor que inicializa com dados de exemplo.
     * Popula a lista com 3 transações de exemplo para demonstração.
     * 
     * Dados iniciais:
     * 1. Salário (Renda) - RECEITA - 5000.00
     * 2. Almoço (Alimentação) - DESPESA - 45.50
     * 3. Netflix (Entretenimento) - DESPESA - 49.90
     */
    public TransactionService() {
        // Adiciona transações de exemplo
        transactions.add(new Transaction("Salário", "Renda", 5000.0, "RECEITA"));
        transactions.add(new Transaction("Almoço", "Alimentação", 45.50, "DESPESA"));
        transactions.add(new Transaction("Netflix", "Entretenimento", 49.90, "DESPESA"));
        // Ajusta o contador para o próximo ID
        idCounter = 4L;

        // Define os IDs nas transações iniciais
        for (long i = 0; i < transactions.size(); i++) {
            transactions.get((int)i).setId(i + 1);
        }
    }

    // =====================================================
    // OPERAÇÕES CRUD (Create, Read, Update, Delete)
    // =====================================================

    /**
     * CREATE - Cria uma nova transação.
     * 
     * Validações realizadas:
     * 1. Descrição não pode ser vazia
     * 2. Valor deve ser positivo (maior que zero)
     * 3. Tipo deve ser RECEITA ou DESPESA
     * 
     * @param transaction Objeto Transaction a ser criado
     * @return Transaction criada com ID gerado automaticamente
     * @throws IllegalArgumentException Se falhar em alguma validação
     */
    public Transaction create(Transaction transaction) {
        // Valida descrição
        if (transaction.getDescription() == null || transaction.getDescription().trim().isEmpty()) {
            throw new IllegalArgumentException("Descrição não pode estar vazia");
        }
        // Valida valor
        if (transaction.getAmount() == null || transaction.getAmount() <= 0) {
            throw new IllegalArgumentException("Valor deve ser maior que zero");
        }
        // Valida tipo
        if (!"RECEITA".equals(transaction.getType()) && !"DESPESA".equals(transaction.getType())) {
            throw new IllegalArgumentException("Tipo deve ser RECEITA ou DESPESA");
        }

        // Atribui ID e adiciona à lista
        transaction.setId(idCounter++);
        transactions.add(transaction);
        return transaction;
    }

    /**
     * READ - Obtém todas as transações.
     * Retorna uma cópia da lista para evitar modificações externas.
     * 
     * @return Lista de todas as transações
     */
    public List<Transaction> findAll() {
        // Retorna cópia para evitar manipulação externa
        return new ArrayList<>(transactions);
    }

    /**
     * READ - Obtém uma transação pelo ID.
     * Utiliza Streams para busca eficiente.
     * 
     * @param id ID da transação a buscar
     * @return Optional contendo a Transaction se encontrada, vazio caso contrário
     */
    public Optional<Transaction> findById(Long id) {
        // Utiliza Stream para busca funcional
        return transactions.stream()
                .filter(t -> t.getId().equals(id))
                .findFirst();
    }

    /**
     * UPDATE - Atualiza uma transação existente.
     * Só atualiza os campos fornecidos (parcial update).
     * 
     * Validações:
     * - Descrição: não vazia
     * - Categoria: não vazia
     * - Valor: deve ser positivo
     * - Tipo: deve ser RECEITA ou DESPESA
     * 
     * @param id ID da transação a atualizar
     * @param transactionDetails Nova variação dos dados
     * @return Transaction atualizada
     * @throws IllegalArgumentException Se transação não encontrada
     */
    public Transaction update(Long id, Transaction transactionDetails) {
        // Busca a transação existente
        Optional<Transaction> optionalTransaction = findById(id);
        if (optionalTransaction.isPresent()) {
            Transaction transaction = optionalTransaction.get();
            
            // Atualiza apenas os campos fornecidos (se não nulos/vazios)
            if (transactionDetails.getDescription() != null && !transactionDetails.getDescription().trim().isEmpty()) {
                transaction.setDescription(transactionDetails.getDescription());
            }
            if (transactionDetails.getCategory() != null && !transactionDetails.getCategory().trim().isEmpty()) {
                transaction.setCategory(transactionDetails.getCategory());
            }
            if (transactionDetails.getAmount() != null && transactionDetails.getAmount() > 0) {
                transaction.setAmount(transactionDetails.getAmount());
            }
            if (transactionDetails.getType() != null && 
                ("RECEITA".equals(transactionDetails.getType()) || "DESPESA".equals(transactionDetails.getType()))) {
                transaction.setType(transactionDetails.getType());
            }
            return transaction;
        }
        throw new IllegalArgumentException("Transação não encontrada com ID: " + id);
    }

    /**
     * DELETE - Deleta uma transação pelo ID.
     * 
     * @param id ID da transação a deletar
     * @throws IllegalArgumentException Se transação não encontrada
     */
    public void delete(Long id) {
        // Remove a transação da lista
        boolean removed = transactions.removeIf(t -> t.getId().equals(id));
        if (!removed) {
            throw new IllegalArgumentException("Transação não encontrada com ID: " + id);
        }
    }

    // =====================================================
    // FUNCIONALIDADES ESPECÍFICAS DE NEGÓCIO
    // =====================================================

    /**
     * Calcula e retorna um resumo financeiro completo.
     * 
     * Cálculos realizados:
     * - Total de Receitas: soma de todas as transações RECEITA
     * - Total de Despesas: soma de todas as transações DESPESA
     * - Saldo: Receitas - Despesas
     * 
     * @return Map contendo: {"totalReceita": double, "totalDespesa": double, "saldo": double}
     */
    public Map<String, Object> getSummary() {
        // Cálcula total de receitas filtrando por tipo RECEITA
        double totalReceita = transactions.stream()
                .filter(t -> "RECEITA".equals(t.getType()))
                .mapToDouble(Transaction::getAmount)
                .sum();

        // Cálcula total de despesas filtrando por tipo DESPESA
        double totalDespesa = transactions.stream()
                .filter(t -> "DESPESA".equals(t.getType()))
                .mapToDouble(Transaction::getAmount)
                .sum();

        // Monta o resumo
        java.util.Map<String, Object> summary = new java.util.HashMap<>();
        summary.put("totalReceita", totalReceita);
        summary.put("totalDespesa", totalDespesa);
        summary.put("saldo", totalReceita - totalDespesa);
        return summary;
    }

    /**
     * Busca todas as transações de uma categoria específica.
     * A busca é case-insensitive (ALIMENTAÇÃO = alimentação).
     * 
     * @param category Categoria a filtrar
     * @return Lista de transações da categoria
     */
    public List<Transaction> findByCategory(String category) {
        // Filtra por categoria (case-insensitive) e converte para List
        return transactions.stream()
                .filter(t -> t.getCategory().equalsIgnoreCase(category))
                .toList();
    }

    /**
     * Busca todas as transações de um tipo específico.
     * 
     * @param type Tipo a filtrar ("RECEITA" ou "DESPESA")
     * @return Lista de transações do tipo especificado
     */
    public List<Transaction> findByType(String type) {
        // Filtra por tipo e converte para List
        return transactions.stream()
                .filter(t -> t.getType().equals(type))
                .toList();
    }
}
