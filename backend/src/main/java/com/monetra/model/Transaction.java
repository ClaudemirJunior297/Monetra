/**
 * Transaction
 * 
 * Modelo de domínio que representa uma transação financeira no sistema.
 * Cada transação pode ser uma receita ou despesa, com descrição, categoria, valor e data.
 * 
 * Características:
 * - Suporta dois tipos: RECEITA e DESPESA
 * - Armazena informações de categorização e descrição
 * - Registra automaticamente a data/hora da transação
 * - Validações básicas no construtor
 * 
 * @author Monetra Team
 * @version 1.0.0
 */
package com.monetra.model;

import javax.persistence.*;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

/**
 * Anotação Swagger para documentação automática da API.
 * Descreve este modelo na documentação OpenAPI.
 */
@Schema(description = "Modelo de Transação Financeira")
@Entity
@Table(name = "transactions")
public class Transaction {

    /**
     * ID único da transação.
     * Gerado automaticamente pelo serviço ao criar uma nova transação.
     */
    @Schema(description = "ID único da transação", example = "1")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Descrição textual da transação.
     */
    @Schema(description = "Descrição da transação", example = "Compra no supermercado")
    @Column(nullable = false)
    private String description;

    /**
     * Categoria de classificação da transação.
     * Ex: "Alimentação", "Renda", "Entretenimento", "Transporte"
     */
    @Schema(description = "Categoria da transação", example = "Alimentação")
    @Column(nullable = false)
    private String category;

    /**
     * Valor monetário da transação.
     * Sempre deve ser um valor positivo (validação no serviço).
     */
    @Schema(description = "Valor da transação", example = "150.50")
    @Column(nullable = false)
    private Double amount;

    /**
     * Tipo da transação: RECEITA ou DESPESA.
     * RECEITA: entrada de dinheiro (salário, bônus)
     * DESPESA: saída de dinheiro (compras, mensalidades)
     */
    @Schema(description = "Tipo de transação", example = "DESPESA", allowableValues = {"RECEITA", "DESPESA"})
    @Column(nullable = false)
    private String type;

    /**
     * Data e hora do registro da transação.
     * Definida automaticamente ao criar a transação (LocalDateTime.now())
     */
    @Schema(description = "Data e hora da transação")
    @Column(nullable = false)
    private LocalDateTime date;

    // =====================================================
    // CONSTRUTORES
    // =====================================================

    /**
     * Construtor padrão sem argumentos.
     * Utilizado pelo Spring Framework para desserializar JSON.
     */
    public Transaction() {
    }

    /**
     * Construtor com todos os campos obrigatórios.
     * Define automaticamente a data/hora atual.
     * 
     * @param description Descrição da transação
     * @param category Categoria da transação
     * @param amount Valor da transação
     * @param type Tipo (RECEITA ou DESPESA)
     */
    public Transaction(String description, String category, Double amount, String type) {
        this.description = description;
        this.category = category;
        this.amount = amount;
        this.type = type;
        this.date = LocalDateTime.now();
    }

    @PrePersist
    public void prePersist() {
        if (this.date == null) {
            this.date = LocalDateTime.now();
        }
    }

    // =====================================================
    // GETTERS E SETTERS
    // =====================================================

    /**
     * Obtém o ID da transação.
     * @return ID único da transação
     */
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }
}
