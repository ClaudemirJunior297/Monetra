/**
 * ============================================================================
 * EXCEÇÃO DE RECURSO NÃO ENCONTRADO - ResourceNotFoundException
 * ============================================================================
 * 
 * Exceção lançada quando um recurso solicitado não existe no banco de dados.
 * 
 * Uso:
 * - Transação não encontrada
 * - Usuário não encontrado
 * - Categoria não encontrada
 * 
 * @author Monetra Team
 * @version 1.0.0
 * ============================================================================
 */

package com.monetra.exception;

/**
 * EXCEÇÃO DE RECURSO NÃO ENCONTRADO
 * 
 * Retorna HTTP 404 Not Found quando lançada.
 */
public class ResourceNotFoundException extends RuntimeException {
    
    /**
     * Construtor com mensagem personalizada
     * @param message Mensagem de erro
     */
    public ResourceNotFoundException(String message) {
        super(message);
    }
    
    /**
     * Construtor com mensagem personalizada e causa
     * @param message Mensagem de erro
     * @param cause Causa da exceção
     */
    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
    
    /**
     * Construtor com entidade e ID
     * @param entityName Nome da entidade (ex: "Transação", "Usuário")
     * @param id ID do recurso não encontrado
     */
    public ResourceNotFoundException(String entityName, Long id) {
        super(String.format("%s com ID %d não foi encontrada", entityName, id));
    }
    
    /**
     * Construtor com entidade e campo personalizado
     * @param entityName Nome da entidade
     * @param fieldName Nome do campo
     * @param fieldValue Valor do campo
     */
    public ResourceNotFoundException(String entityName, String fieldName, String fieldValue) {
        super(String.format("%s com %s = '%s' não foi encontrada", entityName, fieldName, fieldValue));
    }
}