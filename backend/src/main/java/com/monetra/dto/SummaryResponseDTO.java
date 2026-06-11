/**
 * ============================================================================
 * DTO PARA RESUMO FINANCEIRO - SummaryResponseDTO
 * ============================================================================
 * 
 * Data Transfer Object para enviar resumo financeiro para o frontend.
 * 
 * @author Monetra Team
 * @version 1.0.0
 * ============================================================================
 */

package com.monetra.dto;

// ===== IMPORTAÇÕES =====
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.HashMap;
import java.util.Map;

/**
 * DTO para resposta de resumo financeiro
 */
@Schema(description = "Resumo financeiro do usuário")
public class SummaryResponseDTO {
    
    @Schema(description = "Total de receitas", example = "15000.00")
    private Double totalIncome;
    
    @Schema(description = "Total de despesas", example = "8500.00")
    private Double totalExpense;
    
    @Schema(description = "Saldo atual (receitas - despesas)", example = "6500.00")
    private Double balance;
    
    @Schema(description = "Total de transações", example = "45")
    private Long totalTransactions;
    
    @Schema(description = "Despesas agrupadas por categoria para gráficos")
    private Map<String, Double> categoryBreakdown = new HashMap<>();
    
    @Schema(description = "Total de receitas formatado", example = "R$ 15.000,00")
    private String formattedTotalIncome;
    
    @Schema(description = "Total de despesas formatado", example = "R$ 8.500,00")
    private String formattedTotalExpense;
    
    @Schema(description = "Saldo formatado", example = "R$ 6.500,00")
    private String formattedBalance;
    
    // Construtores
    public SummaryResponseDTO() {}
    
    public SummaryResponseDTO(Double totalIncome, Double totalExpense, Double balance, Long totalTransactions) {
        this.totalIncome = totalIncome != null ? totalIncome : 0;
        this.totalExpense = totalExpense != null ? totalExpense : 0;
        this.balance = balance != null ? balance : 0;
        this.totalTransactions = totalTransactions != null ? totalTransactions : 0;
        this.formattedTotalIncome = formatCurrency(this.totalIncome);
        this.formattedTotalExpense = formatCurrency(this.totalExpense);
        this.formattedBalance = formatCurrency(this.balance);
    }
    
    /**
     * Cria um SummaryResponseDTO a partir de um mapa de dados
     * @param summaryMap Mapa com os dados do resumo
     * @return SummaryResponseDTO
     */
    @SuppressWarnings("unchecked")
    public static SummaryResponseDTO fromMap(Map<String, Object> summaryMap) {
        Double totalIncome = (Double) summaryMap.getOrDefault("totalIncome", 0.0);
        Double totalExpense = (Double) summaryMap.getOrDefault("totalExpense", 0.0);
        Double balance = (Double) summaryMap.getOrDefault("balance", 0.0);
        Long totalTransactions = ((Number) summaryMap.getOrDefault("totalTransactions", 0L)).longValue();
        
        SummaryResponseDTO dto = new SummaryResponseDTO(totalIncome, totalExpense, balance, totalTransactions);
        
        // Adiciona breakdown por categoria
        Object breakdown = summaryMap.get("categoryBreakdown");
        if (breakdown instanceof Map) {
            dto.setCategoryBreakdown((Map<String, Double>) breakdown);
        }
        
        return dto;
    }
    
    /**
     * Formata um valor para o padrão brasileiro
     * @param amount Valor
     * @return String formatada
     */
    private String formatCurrency(Double amount) {
        if (amount == null) return "R$ 0,00";
        return String.format("R$ %.2f", amount).replace(".", ",");
    }
    
    // Getters e Setters
    public Double getTotalIncome() {
        return totalIncome;
    }
    
    public void setTotalIncome(Double totalIncome) {
        this.totalIncome = totalIncome;
        this.formattedTotalIncome = formatCurrency(totalIncome);
    }
    
    public Double getTotalExpense() {
        return totalExpense;
    }
    
    public void setTotalExpense(Double totalExpense) {
        this.totalExpense = totalExpense;
        this.formattedTotalExpense = formatCurrency(totalExpense);
    }
    
    public Double getBalance() {
        return balance;
    }
    
    public void setBalance(Double balance) {
        this.balance = balance;
        this.formattedBalance = formatCurrency(balance);
    }
    
    public Long getTotalTransactions() {
        return totalTransactions;
    }
    
    public void setTotalTransactions(Long totalTransactions) {
        this.totalTransactions = totalTransactions;
    }
    
    public Map<String, Double> getCategoryBreakdown() {
        return categoryBreakdown;
    }
    
    public void setCategoryBreakdown(Map<String, Double> categoryBreakdown) {
        this.categoryBreakdown = categoryBreakdown;
    }
    
    public String getFormattedTotalIncome() {
        return formattedTotalIncome;
    }
    
    public String getFormattedTotalExpense() {
        return formattedTotalExpense;
    }
    
    public String getFormattedBalance() {
        return formattedBalance;
    }
}