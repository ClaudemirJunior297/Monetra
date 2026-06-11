/**
 * ============================================================================
 * DTO PARA REQUISIÇÕES DE TRANSAÇÃO - TransactionRequestDTO
 * ============================================================================
 * 
 * Data Transfer Object para receber dados de criação/atualização de transações.
 * 
 * @author Monetra Team
 * @version 1.0.0
 * ============================================================================
 */

package com.monetra.dto;

// ===== IMPORTAÇÕES =====
import com.monetra.model.Transaction;
import com.monetra.model.TransactionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

/**
 * DTO para criação/atualização de transações
 */
@Schema(description = "Dados para criar ou atualizar uma transação")
public class TransactionRequestDTO {
    
    @Schema(description = "Descrição da transação", example = "Compra no supermercado", required = true)
    @NotBlank(message = "Descrição é obrigatória")
    @Size(min = 3, max = 200, message = "Descrição deve ter entre 3 e 200 caracteres")
    private String description;
    
    @Schema(description = "Categoria da transação", example = "Alimentação", required = true)
    @NotBlank(message = "Categoria é obrigatória")
    private String category;
    
    @Schema(description = "Valor da transação", example = "150.50", required = true)
    @NotNull(message = "Valor é obrigatório")
    @Positive(message = "Valor deve ser maior que zero")
    private Double amount;
    
    @Schema(description = "Tipo da transação", example = "EXPENSE", allowableValues = {"INCOME", "EXPENSE"}, required = true)
    @NotNull(message = "Tipo é obrigatório")
    private TransactionType type;
    
    @Schema(description = "Data da transação (opcional)", example = "2026-05-21T10:30:00")
    private LocalDateTime date;
    
    // Construtores
    public TransactionRequestDTO() {}
    
    public TransactionRequestDTO(String description, String category, Double amount, TransactionType type) {
        this.description = description;
        this.category = category;
        this.amount = amount;
        this.type = type;
    }
    
    /**
     * Converte o DTO para uma entidade Transaction
     * @param userId ID do usuário
     * @return Transaction
     */
    public Transaction toEntity(Long userId) {
        Transaction transaction = new Transaction();
        transaction.setUserId(userId);
        transaction.setDescription(this.description);
        transaction.setCategory(this.category);
        transaction.setAmount(this.amount);
        transaction.setType(this.type);
        
        if (this.date != null) {
            transaction.setDate(this.date);
        }
        
        return transaction;
    }
    
    // Getters e Setters
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
    
    public Double getAmount() {
        return amount;
    }
    
    public void setAmount(Double amount) {
        this.amount = amount;
    }
    
    public TransactionType getType() {
        return type;
    }
    
    public void setType(TransactionType type) {
        this.type = type;
    }
    
    public LocalDateTime getDate() {
        return date;
    }
    
    public void setDate(LocalDateTime date) {
        this.date = date;
    }
}