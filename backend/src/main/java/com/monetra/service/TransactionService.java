package com.monetra.service;

import com.monetra.model.Transaction;
import com.monetra.model.TransactionType;
import com.monetra.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class TransactionService {
    private final TransactionRepository transactionRepository;

    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public Transaction create(Transaction transaction) {
        validate(transaction);
        transaction.setDescription(transaction.getDescription().trim());
        transaction.setCategory(transaction.getCategory().trim());
        if (transaction.getDate() == null) {
            transaction.setDate(LocalDateTime.now());
        }
        return transactionRepository.save(transaction);
    }

    public List<Transaction> findAll() {
        return transactionRepository.findAllByOrderByDateDesc();
    }

    public Optional<Transaction> findById(Long id) {
        return transactionRepository.findById(id);
    }

    public Transaction update(Long id, Transaction transactionDetails) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Transação não encontrada com ID: " + id));

        if (transactionDetails.getDescription() != null)
            transaction.setDescription(transactionDetails.getDescription().trim());
        if (transactionDetails.getCategory() != null)
            transaction.setCategory(transactionDetails.getCategory().trim());
        if (transactionDetails.getAmount() != null)
            transaction.setAmount(transactionDetails.getAmount());
        if (transactionDetails.getType() != null)
            transaction.setType(transactionDetails.getType());
        if (transactionDetails.getDate() != null)
            transaction.setDate(transactionDetails.getDate());

        validate(transaction);
        return transactionRepository.save(transaction);
    }

    public void delete(Long id) {
        if (!transactionRepository.existsById(id)) {
            throw new IllegalArgumentException("Transação não encontrada com ID: " + id);
        }
        transactionRepository.deleteById(id);
    }

    public Map<String, Object> getSummary() {
        List<Transaction> transactions = findAll();
        double totalReceita = transactions.stream()
                .filter(t -> TransactionType.INCOME == t.getType())
                .mapToDouble(Transaction::getAmount)
                .sum();
        double totalDespesa = transactions.stream()
                .filter(t -> TransactionType.EXPENSE == t.getType())
                .mapToDouble(Transaction::getAmount)
                .sum();

        Map<String, Double> categorias = new HashMap<>();
        transactions.stream()
                .filter(t -> TransactionType.EXPENSE == t.getType())
                .forEach(t -> categorias.merge(t.getCategory(), t.getAmount(), Double::sum));

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalReceita", totalReceita);
        summary.put("totalDespesa", totalDespesa);
        summary.put("saldo", totalReceita - totalDespesa);
        summary.put("categorias", categorias);
        return summary;
    }

    public List<Transaction> findByCategory(String category) {
        return transactionRepository.findByCategoryIgnoreCaseOrderByDateDesc(category);
    }

    public List<Transaction> findByType(TransactionType type) {
        return transactionRepository.findByTypeOrderByDateDesc(type);
    }

    private void validate(Transaction transaction) {
        if (transaction.getDescription() == null || transaction.getDescription().trim().isEmpty())
            throw new IllegalArgumentException("Descrição não pode estar vazia");
        if (transaction.getCategory() == null || transaction.getCategory().trim().isEmpty())
            throw new IllegalArgumentException("Categoria não pode estar vazia");
        if (transaction.getAmount() == null || transaction.getAmount() <= 0)
            throw new IllegalArgumentException("Valor deve ser maior que zero");
        if (transaction.getType() == null)
            throw new IllegalArgumentException("Tipo deve ser INCOME ou EXPENSE");
    }
}
