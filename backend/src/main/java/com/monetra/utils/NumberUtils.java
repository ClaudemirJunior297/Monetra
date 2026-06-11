/**
 * ============================================================================
 * UTILITÁRIOS DE NÚMEROS - NumberUtils
 * ============================================================================
 * 
 * Classe utilitária para operações comuns com números e valores monetários.
 * 
 * Funcionalidades:
 * - Formatação de valores monetários (padrão brasileiro)
 * - Parsing de strings para números
 * - Arredondamento
 * - Validações
 * 
 * @author Monetra Team
 * @version 1.0.0
 * ============================================================================
 */

package com.monetra.utils;

// ===== IMPORTAÇÕES =====
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.text.NumberFormat;
import java.text.ParseException;
import java.util.Locale;

/**
 * UTILITÁRIOS DE NÚMEROS
 */
public final class NumberUtils {
    
    // ===== CONSTANTES =====
    private static final Locale BRAZIL_LOCALE = new Locale("pt", "BR");
    private static final DecimalFormat CURRENCY_FORMATTER;
    private static final DecimalFormat DECIMAL_FORMATTER;
    private static final DecimalFormat PERCENT_FORMATTER;
    
    static {
        // Formatação de moeda (R$)
        CURRENCY_FORMATTER = (DecimalFormat) NumberFormat.getCurrencyInstance(BRAZIL_LOCALE);
        CURRENCY_FORMATTER.setMinimumFractionDigits(2);
        CURRENCY_FORMATTER.setMaximumFractionDigits(2);
        
        // Formatação de decimal
        DECIMAL_FORMATTER = new DecimalFormat("#,##0.00");
        DecimalFormatSymbols symbols = DECIMAL_FORMATTER.getDecimalFormatSymbols();
        symbols.setDecimalSeparator(',');
        symbols.setGroupingSeparator('.');
        DECIMAL_FORMATTER.setDecimalFormatSymbols(symbols);
        
        // Formatação de porcentagem
        PERCENT_FORMATTER = (DecimalFormat) NumberFormat.getPercentInstance(BRAZIL_LOCALE);
        PERCENT_FORMATTER.setMinimumFractionDigits(0);
        PERCENT_FORMATTER.setMaximumFractionDigits(0);
    }
    
    private NumberUtils() {
        throw new IllegalStateException("Classe utilitária não pode ser instanciada");
    }
    
    // =====================================================
    // FORMATAÇÃO DE MOEDA
    // =====================================================
    
    /**
     * Formata um valor como moeda brasileira (R$)
     * @param value Valor
     * @return String formatada (ex: R$ 1.234,56)
     */
    public static String formatCurrency(Double value) {
        if (value == null) return "R$ 0,00";
        return CURRENCY_FORMATTER.format(value);
    }
    
    /**
     * Formata um valor como moeda brasileira (R$)
     * @param value Valor
     * @return String formatada
     */
    public static String formatCurrency(Long value) {
        if (value == null) return "R$ 0,00";
        return formatCurrency(value.doubleValue());
    }
    
    /**
     * Formata um valor como moeda brasileira (R$) sem símbolo
     * @param value Valor
     * @return String formatada (ex: 1.234,56)
     */
    public static String formatCurrencyWithoutSymbol(Double value) {
        if (value == null) return "0,00";
        return DECIMAL_FORMATTER.format(value);
    }
    
    // =====================================================
    // FORMATAÇÃO DE DECIMAL
    // =====================================================
    
    /**
     * Formata um valor decimal com 2 casas
     * @param value Valor
     * @return String formatada (ex: 1.234,56)
     */
    public static String formatDecimal(Double value) {
        if (value == null) return "0,00";
        return DECIMAL_FORMATTER.format(value);
    }
    
    /**
     * Formata um valor decimal com casas especificadas
     * @param value Valor
     * @param decimalPlaces Número de casas decimais
     * @return String formatada
     */
    public static String formatDecimal(Double value, int decimalPlaces) {
        if (value == null) value = 0.0;
        String pattern = "#,##0." + "0".repeat(decimalPlaces);
        DecimalFormat formatter = new DecimalFormat(pattern);
        DecimalFormatSymbols symbols = formatter.getDecimalFormatSymbols();
        symbols.setDecimalSeparator(',');
        symbols.setGroupingSeparator('.');
        formatter.setDecimalFormatSymbols(symbols);
        return formatter.format(value);
    }
    
    // =====================================================
    // FORMATAÇÃO DE PORCENTAGEM
    // =====================================================
    
    /**
     * Formata um valor como porcentagem
     * @param value Valor (ex: 0.25 = 25%)
     * @return String formatada (ex: 25%)
     */
    public static String formatPercentage(Double value) {
        if (value == null) return "0%";
        return PERCENT_FORMATTER.format(value);
    }
    
    /**
     * Calcula e formata porcentagem
     * @param part Parte
     * @param total Total
     * @return String formatada (ex: 25%)
     */
    public static String calculatePercentage(Double part, Double total) {
        if (total == null || total == 0) return "0%";
        double percentage = part / total;
        return formatPercentage(percentage);
    }
    
    // =====================================================
    // PARSING (CONVERSÃO DE STRING PARA NÚMERO)
    // =====================================================
    
    /**
     * Converte string no padrão brasileiro para Double
     * @param value String com formato brasileiro (ex: "1.234,56")
     * @return Double ou null se inválido
     */
    public static Double parseBrazilianNumber(String value) {
        if (value == null || value.trim().isEmpty()) return null;
        
        try {
            // Remove caracteres não numéricos (exceto vírgula)
            String clean = value.replaceAll("[^0-9,]", "");
            // Troca ponto por vazio (separador de milhar) e vírgula por ponto (decimal)
            clean = clean.replace(".", "").replace(",", ".");
            return Double.parseDouble(clean);
        } catch (NumberFormatException e) {
            return null;
        }
    }
    
    /**
     * Converte string no padrão brasileiro para Long
     * @param value String com formato brasileiro
     * @return Long ou null se inválido
     */
    public static Long parseBrazilianLong(String value) {
        if (value == null || value.trim().isEmpty()) return null;
        
        try {
            String clean = value.replaceAll("[^0-9]", "");
            return Long.parseLong(clean);
        } catch (NumberFormatException e) {
            return null;
        }
    }
    
    // =====================================================
    // ARREDONDAMENTO
    // =====================================================
    
    /**
     * Arredonda um valor para 2 casas decimais
     * @param value Valor
     * @return Double arredondado
     */
    public static Double round(Double value) {
        if (value == null) return 0.0;
        return Math.round(value * 100.0) / 100.0;
    }
    
    /**
     * Arredonda um valor para N casas decimais
     * @param value Valor
     * @param places Número de casas decimais
     * @return Double arredondado
     */
    public static Double round(Double value, int places) {
        if (value == null) return 0.0;
        double factor = Math.pow(10, places);
        return Math.round(value * factor) / factor;
    }
    
    // =====================================================
    // VALIDAÇÕES
    // =====================================================
    
    /**
     * Verifica se o valor é positivo
     * @param value Valor
     * @return true se > 0
     */
    public static boolean isPositive(Double value) {
        return value != null && value > 0;
    }
    
    /**
     * Verifica se o valor é negativo
     * @param value Valor
     * @return true se < 0
     */
    public static boolean isNegative(Double value) {
        return value != null && value < 0;
    }
    
    /**
     * Verifica se o valor é zero
     * @param value Valor
     * @return true se == 0
     */
    public static boolean isZero(Double value) {
        return value != null && value == 0;
    }
    
    /**
     * Retorna o valor absoluto (ignora sinal negativo)
     * @param value Valor
     * @return Valor absoluto
     */
    public static Double absolute(Double value) {
        if (value == null) return 0.0;
        return Math.abs(value);
    }
    
    // =====================================================
    // EXEMPLOS DE USO
    // =====================================================
    
    /*
    Exemplos:
    
    // Formatar moeda
    String valor = NumberUtils.formatCurrency(1234.56);   // "R$ 1.234,56"
    
    // Parse de string brasileira
    Double numero = NumberUtils.parseBrazilianNumber("1.234,56");  // 1234.56
    
    // Arredondamento
    Double arredondado = NumberUtils.round(1234.567);  // 1234.57
    
    // Porcentagem
    String percent = NumberUtils.formatPercentage(0.25);  // "25%"
    */
}