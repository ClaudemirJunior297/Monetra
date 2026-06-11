/**
 * ============================================================================
 * MANIPULADOR GLOBAL DE EXCEÇÕES - GlobalExceptionHandler
 * ============================================================================
 * 
 * Intercepta todas as exceções lançadas pela aplicação e as converte em
 * respostas HTTP padronizadas.
 * 
 * Funcionalidades:
 * - Tratamento de validações (@Valid)
 * - Tratamento de exceções de negócio (IllegalArgumentException)
 * - Tratamento de recursos não encontrados (ResourceNotFoundException)
 * - Tratamento de erros de segurança (acesso negado)
 * - Tratamento de erros internos do servidor
 * 
 * @author Monetra Team
 * @version 1.0.0
 * ============================================================================
 */

package com.monetra.exception;

// ===== IMPORTAÇÕES =====
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.NoHandlerFoundException;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * MANIPULADOR GLOBAL DE EXCEÇÕES
 * 
 * @RestControllerAdvice - Intercepta exceções de todos os controllers
 */
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    
    /**
     * ========================================================================
     * TRATAMENTO DE ERROS DE VALIDAÇÃO (@Valid)
     * ========================================================================
     * 
     * Captura erros quando os campos de um DTO não passam nas validações.
     * Exemplo: @NotBlank, @Email, @Size, etc.
     * 
     * @param ex Exceção de validação
     * @return ResponseEntity com lista de erros por campo
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        logger.warn("Erro de validação: {}", ex.getMessage());
        
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        ErrorResponse errorResponse = ErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .error("Erro de validação")
                .message("Os dados enviados são inválidos")
                .timestamp(LocalDateTime.now())
                .path(getPath())
                .validationErrors(errors)
                .build();
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }
    
    /**
     * ========================================================================
     * TRATAMENTO DE CONSTRAINTS DE VALIDAÇÃO
     * ========================================================================
     * 
     * Captura erros de validação em parâmetros de métodos.
     * 
     * @param ex Exceção de constraint violation
     * @return ResponseEntity com lista de erros
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleConstraintViolationException(ConstraintViolationException ex) {
        logger.warn("Erro de constraint: {}", ex.getMessage());
        
        Map<String, String> errors = ex.getConstraintViolations().stream()
                .collect(Collectors.toMap(
                    violation -> violation.getPropertyPath().toString(),
                    ConstraintViolation::getMessage,
                    (error1, error2) -> error1
                ));
        
        ErrorResponse errorResponse = ErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .error("Erro de validação")
                .message("Dados inválidos")
                .timestamp(LocalDateTime.now())
                .path(getPath())
                .validationErrors(errors)
                .build();
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }
    
    /**
     * ========================================================================
     * TRATAMENTO DE RECURSO NÃO ENCONTRADO (404)
     * ========================================================================
     * 
     * @param ex Exceção de recurso não encontrado
     * @return ResponseEntity com status 404
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(ResourceNotFoundException ex) {
        logger.warn("Recurso não encontrado: {}", ex.getMessage());
        
        ErrorResponse errorResponse = ErrorResponse.builder()
                .status(HttpStatus.NOT_FOUND.value())
                .error("Recurso não encontrado")
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .path(getPath())
                .build();
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }
    
    /**
     * ========================================================================
     * TRATAMENTO DE ERROS DE NEGÓCIO (IllegalArgumentException)
     * ========================================================================
     * 
     * Captura exceções lançadas manualmente na camada de serviço.
     * 
     * @param ex Exceção de argumento inválido
     * @return ResponseEntity com status 400
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgumentException(IllegalArgumentException ex) {
        logger.warn("Erro de negócio: {}", ex.getMessage());
        
        ErrorResponse errorResponse = ErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .error("Dados inválidos")
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .path(getPath())
                .build();
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }
    
    /**
     * ========================================================================
     * TRATAMENTO DE TIPO DE ARGUMENTO INVÁLIDO
     * ========================================================================
     * 
     * Captura erros quando um parâmetro de path ou query tem tipo incorreto.
     * Exemplo: GET /transactions/{id} onde id não é número
     * 
     * @param ex Exceção de tipo de argumento inválido
     * @return ResponseEntity com status 400
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponse> handleMethodArgumentTypeMismatch(MethodArgumentTypeMismatchException ex) {
        logger.warn("Tipo de argumento inválido: {}", ex.getMessage());
        
        String message = String.format("O parâmetro '%s' deve ser do tipo %s", 
                ex.getName(), ex.getRequiredType().getSimpleName());
        
        ErrorResponse errorResponse = ErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .error("Parâmetro inválido")
                .message(message)
                .timestamp(LocalDateTime.now())
                .path(getPath())
                .build();
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }
    
    /**
     * ========================================================================
     * TRATAMENTO DE CORPO DE REQUISIÇÃO INVÁLIDO
     * ========================================================================
     * 
     * Captura erros quando o JSON enviado está mal formatado.
     * 
     * @param ex Exceção de leitura de mensagem HTTP
     * @return ResponseEntity com status 400
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleHttpMessageNotReadable(HttpMessageNotReadableException ex) {
        logger.warn("JSON inválido: {}", ex.getMessage());
        
        ErrorResponse errorResponse = ErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .error("Requisição inválida")
                .message("O corpo da requisição está mal formatado. Verifique o JSON enviado.")
                .timestamp(LocalDateTime.now())
                .path(getPath())
                .build();
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }
    
    /**
     * ========================================================================
     * TRATAMENTO DE ROTA NÃO ENCONTRADA (404)
     * ========================================================================
     * 
     * @param ex Exceção de handler não encontrado
     * @return ResponseEntity com status 404
     */
    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<ErrorResponse> handleNoHandlerFoundException(NoHandlerFoundException ex) {
        logger.warn("Rota não encontrada: {}", ex.getRequestURL());
        
        ErrorResponse errorResponse = ErrorResponse.builder()
                .status(HttpStatus.NOT_FOUND.value())
                .error("Rota não encontrada")
                .message("A URL solicitada não existe: " + ex.getRequestURL())
                .timestamp(LocalDateTime.now())
                .path(ex.getRequestURL())
                .build();
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }
    
    /**
     * ========================================================================
     * TRATAMENTO DE ERROS INTERNOS DO SERVIDOR (500)
     * ========================================================================
     * 
     * Captura qualquer exceção não tratada pelos handlers específicos.
     * 
     * @param ex Exceção genérica
     * @return ResponseEntity com status 500
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        logger.error("Erro interno não tratado: {}", ex.getMessage(), ex);
        
        ErrorResponse errorResponse = ErrorResponse.builder()
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .error("Erro interno do servidor")
                .message("Ocorreu um erro inesperado. Tente novamente mais tarde.")
                .timestamp(LocalDateTime.now())
                .path(getPath())
                .build();
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
    
    /**
     * Obtém o caminho da requisição atual
     * @return String com o path
     */
    private String getPath() {
        // Em uma implementação completa, você pode injetar HttpServletRequest
        // e obter o path real: request.getRequestURI()
        return "Desconhecido";
    }
}