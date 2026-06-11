/**
 * ============================================================================
 * UTILITÁRIOS DE DATA - DateUtils
 * ============================================================================
 * 
 * Classe utilitária para operações comuns com datas e horários.
 * 
 * Funcionalidades:
 * - Formatação de datas para padrão brasileiro
 * - Parsing de strings para LocalDateTime
 * - Cálculo de períodos (início/fim do dia, mês, ano)
 * - Validação de datas
 * 
 * @author Monetra Team
 * @version 1.0.0
 * ============================================================================
 */

package com.monetra.utils;

// ===== IMPORTAÇÕES =====
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.temporal.TemporalAdjusters;

/**
 * UTILITÁRIOS DE DATA
 * 
 * Clase final com construtor privado (não pode ser instanciada)
 */
public final class DateUtils {
    
    // ===== CONSTANTES DE FORMATAÇÃO =====
    public static final String PATTERN_DATE = "dd/MM/yyyy";
    public static final String PATTERN_DATE_TIME = "dd/MM/yyyy HH:mm:ss";
    public static final String PATTERN_ISO = "yyyy-MM-dd'T'HH:mm:ss";
    public static final String PATTERN_API = "yyyy-MM-dd";
    
    // ===== FORMATADORES =====
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern(PATTERN_DATE);
    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern(PATTERN_DATE_TIME);
    private static final DateTimeFormatter ISO_FORMATTER = DateTimeFormatter.ofPattern(PATTERN_ISO);
    private static final DateTimeFormatter API_FORMATTER = DateTimeFormatter.ofPattern(PATTERN_API);
    
    // Construtor privado para evitar instanciação
    private DateUtils() {
        throw new IllegalStateException("Classe utilitária não pode ser instanciada");
    }
    
    // =====================================================
    // FORMATAÇÃO DE DATAS
    // =====================================================
    
    /**
     * Formata LocalDateTime para string no padrão brasileiro (dd/MM/yyyy HH:mm:ss)
     * @param dateTime Data e hora
     * @return String formatada
     */
    public static String formatDateTime(LocalDateTime dateTime) {
        if (dateTime == null) return "";
        return dateTime.format(DATE_TIME_FORMATTER);
    }
    
    /**
     * Formata LocalDateTime para string no padrão brasileiro de data (dd/MM/yyyy)
     * @param dateTime Data e hora
     * @return String com data formatada
     */
    public static String formatDate(LocalDateTime dateTime) {
        if (dateTime == null) return "";
        return dateTime.format(DATE_FORMATTER);
    }
    
    /**
     * Formata LocalDate para string no padrão brasileiro (dd/MM/yyyy)
     * @param date Data
     * @return String formatada
     */
    public static String formatDate(LocalDate date) {
        if (date == null) return "";
        return date.format(DATE_FORMATTER);
    }
    
    /**
     * Formata LocalDateTime para padrão ISO (yyyy-MM-dd'T'HH:mm:ss)
     * @param dateTime Data e hora
     * @return String no formato ISO
     */
    public static String formatISO(LocalDateTime dateTime) {
        if (dateTime == null) return "";
        return dateTime.format(ISO_FORMATTER);
    }
    
    /**
     * Formata LocalDateTime para padrão API (yyyy-MM-dd)
     * @param dateTime Data e hora
     * @return String com data no formato API
     */
    public static String formatForAPI(LocalDateTime dateTime) {
        if (dateTime == null) return "";
        return dateTime.format(API_FORMATTER);
    }
    
    // =====================================================
    // PARSING (CONVERSÃO DE STRING PARA DATA)
    // =====================================================
    
    /**
     * Converte string no padrão brasileiro para LocalDateTime
     * @param dateTimeStr String no formato dd/MM/yyyy HH:mm:ss
     * @return LocalDateTime ou null se inválido
     */
    public static LocalDateTime parseDateTime(String dateTimeStr) {
        if (dateTimeStr == null || dateTimeStr.trim().isEmpty()) return null;
        try {
            return LocalDateTime.parse(dateTimeStr, DATE_TIME_FORMATTER);
        } catch (DateTimeParseException e) {
            return null;
        }
    }
    
    /**
     * Converte string no padrão brasileiro para LocalDate
     * @param dateStr String no formato dd/MM/yyyy
     * @return LocalDate ou null se inválido
     */
    public static LocalDate parseDate(String dateStr) {
        if (dateStr == null || dateStr.trim().isEmpty()) return null;
        try {
            return LocalDate.parse(dateStr, DATE_FORMATTER);
        } catch (DateTimeParseException e) {
            return null;
        }
    }
    
    /**
     * Converte string no padrão ISO para LocalDateTime
     * @param isoStr String no formato yyyy-MM-dd'T'HH:mm:ss
     * @return LocalDateTime ou null se inválido
     */
    public static LocalDateTime parseISO(String isoStr) {
        if (isoStr == null || isoStr.trim().isEmpty()) return null;
        try {
            return LocalDateTime.parse(isoStr, ISO_FORMATTER);
        } catch (DateTimeParseException e) {
            return null;
        }
    }
    
    // =====================================================
    // PERÍODOS (INÍCIO E FIM)
    // =====================================================
    
    /**
     * Retorna o início do dia (00:00:00)
     * @param date Data
     * @return LocalDateTime com horário 00:00:00
     */
    public static LocalDateTime startOfDay(LocalDate date) {
        if (date == null) return null;
        return date.atStartOfDay();
    }
    
    /**
     * Retorna o fim do dia (23:59:59)
     * @param date Data
     * @return LocalDateTime com horário 23:59:59
     */
    public static LocalDateTime endOfDay(LocalDate date) {
        if (date == null) return null;
        return date.atTime(LocalTime.MAX);
    }
    
    /**
     * Retorna o início do mês (primeiro dia às 00:00:00)
     * @param date Referência
     * @return LocalDateTime início do mês
     */
    public static LocalDateTime startOfMonth(LocalDate date) {
        if (date == null) return null;
        LocalDate firstDay = date.with(TemporalAdjusters.firstDayOfMonth());
        return firstDay.atStartOfDay();
    }
    
    /**
     * Retorna o fim do mês (último dia às 23:59:59)
     * @param date Referência
     * @return LocalDateTime fim do mês
     */
    public static LocalDateTime endOfMonth(LocalDate date) {
        if (date == null) return null;
        LocalDate lastDay = date.with(TemporalAdjusters.lastDayOfMonth());
        return lastDay.atTime(LocalTime.MAX);
    }
    
    /**
     * Retorna o início do ano (primeiro dia às 00:00:00)
     * @param date Referência
     * @return LocalDateTime início do ano
     */
    public static LocalDateTime startOfYear(LocalDate date) {
        if (date == null) return null;
        LocalDate firstDay = date.with(TemporalAdjusters.firstDayOfYear());
        return firstDay.atStartOfDay();
    }
    
    /**
     * Retorna o fim do ano (último dia às 23:59:59)
     * @param date Referência
     * @return LocalDateTime fim do ano
     */
    public static LocalDateTime endOfYear(LocalDate date) {
        if (date == null) return null;
        LocalDate lastDay = date.with(TemporalAdjusters.lastDayOfYear());
        return lastDay.atTime(LocalTime.MAX);
    }
    
    // =====================================================
    // VALIDAÇÃO DE DATAS
    // =====================================================
    
    /**
     * Verifica se uma data é válida
     * @param dateTime Data a verificar
     * @return true se não for nula
     */
    public static boolean isValid(LocalDateTime dateTime) {
        return dateTime != null;
    }
    
    /**
     * Verifica se a data é no passado
     * @param dateTime Data a verificar
     * @return true se for anterior a agora
     */
    public static boolean isPast(LocalDateTime dateTime) {
        if (dateTime == null) return false;
        return dateTime.isBefore(LocalDateTime.now());
    }
    
    /**
     * Verifica se a data é no futuro
     * @param dateTime Data a verificar
     * @return true se for posterior a agora
     */
    public static boolean isFuture(LocalDateTime dateTime) {
        if (dateTime == null) return false;
        return dateTime.isAfter(LocalDateTime.now());
    }
    
    /**
     * Verifica se uma string de data é válida
     * @param dateStr String no formato dd/MM/yyyy
     * @return true se for válida
     */
    public static boolean isValidDateString(String dateStr) {
        return parseDate(dateStr) != null;
    }
    
    // =====================================================
    // CÁLCULOS COM DATAS
    // =====================================================
    
    /**
     * Calcula diferença em dias entre duas datas
     * @param start Data inicial
     * @param end Data final
     * @return Número de dias
     */
    public static long daysBetween(LocalDateTime start, LocalDateTime end) {
        if (start == null || end == null) return 0;
        return java.time.Duration.between(start, end).toDays();
    }
    
    /**
     * Retorna data atual no início do dia
     * @return LocalDateTime com hoje às 00:00:00
     */
    public static LocalDateTime todayStart() {
        return LocalDate.now().atStartOfDay();
    }
    
    /**
     * Retorna data atual no fim do dia
     * @return LocalDateTime com hoje às 23:59:59
     */
    public static LocalDateTime todayEnd() {
        return LocalDate.now().atTime(LocalTime.MAX);
    }
    
    /**
     * Retorna o primeiro dia do mês atual
     * @return LocalDateTime início do mês atual
     */
    public static LocalDateTime currentMonthStart() {
        return startOfMonth(LocalDate.now());
    }
    
    /**
     * Retorna o último dia do mês atual
     * @return LocalDateTime fim do mês atual
     */
    public static LocalDateTime currentMonthEnd() {
        return endOfMonth(LocalDate.now());
    }
    
    /**
     * Retorna a data atual no formato ISO
     * @return String com data atual no formato ISO
     */
    public static String currentDateTimeISO() {
        return formatISO(LocalDateTime.now());
    }
    
    /**
     * Retorna a data atual formatada
     * @return String com data atual formatada (dd/MM/yyyy HH:mm:ss)
     */
    public static String currentDateTimeFormatted() {
        return formatDateTime(LocalDateTime.now());
    }
    
    // =====================================================
    // EXTRAÇÃO DE COMPONENTES DA DATA
    // =====================================================
    
    /**
     * Extrai o ano de uma data
     * @param dateTime Data
     * @return Ano ou null
     */
    public static Integer getYear(LocalDateTime dateTime) {
        if (dateTime == null) return null;
        return dateTime.getYear();
    }
    
    /**
     * Extrai o mês de uma data (1-12)
     * @param dateTime Data
     * @return Mês ou null
     */
    public static Integer getMonth(LocalDateTime dateTime) {
        if (dateTime == null) return null;
        return dateTime.getMonthValue();
    }
    
    /**
     * Extrai o dia do mês de uma data
     * @param dateTime Data
     * @return Dia ou null
     */
    public static Integer getDay(LocalDateTime dateTime) {
        if (dateTime == null) return null;
        return dateTime.getDayOfMonth();
    }
    
    /**
     * Retorna o nome do mês por extenso
     * @param dateTime Data
     * @return Nome do mês em português
     */
    public static String getMonthName(LocalDateTime dateTime) {
        if (dateTime == null) return "";
        String[] months = {
            "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
        };
        return months[dateTime.getMonthValue() - 1];
    }
}