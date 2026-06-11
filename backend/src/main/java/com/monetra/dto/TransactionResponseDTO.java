/**
 * ============================================================================
 * DTO PARA RESPOSTAS DE TRANSAÇÃO - TransactionResponseDTO
 * ============================================================================
 * 
 * Data Transfer Object para enviar dados de transações para o frontend.
 * 
 * @author Monetra Team
 * @version 1.0.0
 * ============================================================================
 */

package com.monetra.dto;

// ===== IMPORTAÇÕES =====
import com.monetra.model.Transaction;
import com.monetra.model.TransactionType;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * DTO para resposta de transações
 */
@Schema(description = "Resposta com dados da transação")
public class TransactionResponseDTO {
    
    @Schema(description = "ID da transação", example = "1")
    private Long id;
    
    @Schema(description = "ID do usuário", example = "10")
    private Long userId;
    
    @Schema(description = "Descrição da transação", example = "Compra no supermercado")
    private String description;
    
    @Schema(description = "Categoria da transação", example = "Alimentação")
    private String category;
    
    @Schema(description = "Valor da transação", example = "150.50")
    private Double amount;
    
    @Schema(description = "Valor com sinal (+ para receitas, - para despesas)", example = "-150.50")
    private Double signedAmount;
    
    @Schema(description = "Tipo da transação", example = "EXPENSE")
    private TransactionType type;
    
    @Schema(description = "Data da transação", example = "2026-05-21T10:30:00")
    private LocalDateTime date;
    
    @Schema(description = "Data formatada", example = "21/05/2026")
    private String formattedDate;
    
    @Schema(description = "Valor formatado", example = "R$ 150,50")
    private String formattedAmount;
    
    @Schema(description = "Data de criação do registro")
    private LocalDateTime createdAt;
    
    // Construtores
    public TransactionResponseDTO() {}
    
    public TransactionResponseDTO(Long id, Long userId, String description, String category, 
                                   Double amount, TransactionType type, LocalDateTime date, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.description = description;
        this.category = category;
        this.amount = amount;
        this.type = type;
        this.date = date;
        this.createdAt = createdAt;
        this.signedAmount = type == TransactionType.INCOME ? amount : -amount;
        this.formattedDate = formatDate(date);
        this.formattedAmount = formatCurrency(amount);
    }
    
    /**
     * Cria um TransactionResponseDTO a partir de uma entidade Transaction
     * @param transaction Entidade Transaction
     * @return TransactionResponseDTO
     */
    public static TransactionResponseDTO fromEntity(Transaction transaction) {
        return new TransactionResponseDTO(
            transaction.getId(),
            transaction.getUserId(),
            transaction.getDescription(),
            transaction.getCategory(),
            transaction.getAmount(),
            transaction.getType(),
            transaction.getDate(),
            transaction.getCreatedAt()
        );
    }
    
    /**
     * Formata uma data para o padrão brasileiro
     * @param date Data
     * @return String formatada
     */
    private static String formatDate(LocalDateTime date) {
        if (date == null) return "";
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        return date.format(formatter);
    }
    
    /**
     * Formata um valor para o padrão brasileiro
     * @param amount Valor
     * @return String formatada
     */
    private static String formatCurrency(Double amount) {
        if (amount == null) return "R$ 0,00";
        return String.format("R$ %.2f", amount).replace(".", ",");
    }
    
    // Getters e Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
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
    
    public Double getSignedAmount() {
        return signedAmount;
    }
    
    public void setSignedAmount(Double signedAmount) {
        this.signedAmount = signedAmount;
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
    
    public String getFormattedDate() {
        return formattedDate;
    }
    
    public void setFormattedDate(String formattedDate) {
        this.formattedDate = formattedDate;
    }
    
    public String getFormattedAmount() {
        return formattedAmount;
    }
    
    public void setFormattedAmount(String formattedAmount) {
        this.formattedAmount = formattedAmount;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}