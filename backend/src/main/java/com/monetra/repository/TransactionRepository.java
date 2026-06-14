package com.monetra.repository;

import com.monetra.model.Transaction;
import com.monetra.model.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findAllByOrderByDateDesc();
    List<Transaction> findByUserIdOrderByDateDesc(Long userId);
    List<Transaction> findByCategoryIgnoreCaseOrderByDateDesc(String category);
    List<Transaction> findByTypeOrderByDateDesc(TransactionType type);
}
