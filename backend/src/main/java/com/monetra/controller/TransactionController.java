/**
 * TransactionController
 * 
 * Controlador REST que expõe todos os endpoints da API de transações.
 * Responsável por receber requisições HTTP e delegar a lógica para o TransactionService.
 * 
 * Endpoints Base: /api/transactions
 * 
 * Funcionalidades:
 * - CRUD completo (Create, Read, Update, Delete)
 * - Filtragem por categoria e tipo
 * - Resumo financeiro (receitas, despesas, saldo)
 * - Health check da API
 * 
 * Todas as respostas incluem documentação OpenAPI/Swagger automaticamente.
 * 
 * @author Monetra Team
 * @version 1.0.0
 */
package com.monetra.controller;

import com.monetra.model.Transaction;
import com.monetra.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Anotação @RestController marca esta classe como um controlador REST.
 * Combina @Controller + @ResponseBody, convertendo automaticamente retornos para JSON.
 * 
 * @RequestMapping define o caminho base para todos os endpoints: /api/transactions
 * @Tag fornece documentação para o Swagger/OpenAPI
 */
@RestController
@RequestMapping("/api/transactions")
@Tag(name = "Transactions", description = "API para gerenciamento de transações financeiras")
public class TransactionController {

    /**
     * Injeção de dependência do TransactionService.
     * @Autowired permite que o Spring Container injete automaticamente uma instância do serviço.
     */
    @Autowired
    private TransactionService transactionService;

    // =====================================================
    // ENDPOINTS CRUD
    // =====================================================

    /**
     * GET /api/transactions
     * Listar todas as transações
     * 
     * Resposta de sucesso:
     * - HTTP 200 OK
     * - Body: Lista JSON de todas as transações
     * 
     * Exemplo de resposta:
     * [
     *   {"id": 1, "description": "Salário", "category": "Renda", "amount": 5000.0, "type": "RECEITA", "date": "2026-05-12T10:30:00"},
     *   {"id": 2, "description": "Almoço", "category": "Alimentação", "amount": 45.5, "type": "DESPESA", "date": "2026-05-12T11:45:00"}
     * ]
     * 
     * @return ResponseEntity com lista de transações
     */
    @GetMapping
    @Operation(summary = "Listar todas as transações", description = "Retorna uma lista com todas as transações registradas")
    @ApiResponse(responseCode = "200", description = "Lista de transações retornada com sucesso")
    public ResponseEntity<List<Transaction>> getAll() {
        List<Transaction> transactions = transactionService.findAll();
        return ResponseEntity.ok(transactions);
    }

    /**
     * GET /api/transactions/{id}
     * Obter uma transação específica pelo ID
     * 
     * Parâmetros:
     * - id: ID da transação a buscar (path variable)
     * 
     * Respostas:
     * - HTTP 200 OK: Transação encontrada
     * - HTTP 404 Not Found: Transação não existe
     * 
     * @param id ID da transação
     * @return ResponseEntity com a transação ou 404
     */
    @GetMapping("/{id}")
    @Operation(summary = "Obter transação por ID", description = "Retorna os detalhes de uma transação específica")
    @ApiResponse(responseCode = "200", description = "Transação encontrada")
    @ApiResponse(responseCode = "404", description = "Transação não encontrada")
    public ResponseEntity<Transaction> getById(@PathVariable Long id) {
        Optional<Transaction> transaction = transactionService.findById(id);
        return transaction.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * POST /api/transactions
     * Criar uma nova transação
     * 
     * Body esperado (JSON):
     * {
     *   "description": "Compra na farmácia",
     *   "category": "Saúde",
     *   "amount": 87.50,
     *   "type": "DESPESA"
     * }
     * 
     * Respostas:
     * - HTTP 201 Created: Transação criada com sucesso
     * - HTTP 400 Bad Request: Dados inválidos
     * 
     * Validações:
     * - Description: não vazio
     * - Amount: maior que zero
     * - Type: RECEITA ou DESPESA
     * 
     * @param transaction Objeto Transaction do corpo da requisição
     * @return ResponseEntity com a transação criada ou erro
     */
    @PostMapping
    @Operation(summary = "Criar nova transação", description = "Cria uma nova transação financeira")
    @ApiResponse(responseCode = "201", description = "Transação criada com sucesso")
    @ApiResponse(responseCode = "400", description = "Dados inválidos")
    public ResponseEntity<?> create(@RequestBody Transaction transaction) {
        try {
            // Delega a criação para o serviço
            Transaction created = transactionService.create(transaction);
            // Retorna 201 Created com a transação criada
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException e) {
            // Em caso de erro, retorna 400 Bad Request com mensagem de erro
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    /**
     * PUT /api/transactions/{id}
     * Atualizar uma transação existente
     * 
     * Parâmetros:
     * - id: ID da transação a atualizar (path variable)
     * 
     * Body esperado (JSON) - apenas campos a atualizar:
     * {
     *   "description": "Compra no supermercado (atualizado)",
     *   "amount": 120.00
     * }
     * 
     * Respostas:
     * - HTTP 200 OK: Transação atualizada com sucesso
     * - HTTP 404 Not Found: Transação não existe
     * - HTTP 400 Bad Request: Dados inválidos
     * 
     * @param id ID da transação a atualizar
     * @param transactionDetails Novos dados da transação
     * @return ResponseEntity com a transação atualizada ou erro
     */
    @PutMapping("/{id}")
    @Operation(summary = "Atualizar transação", description = "Atualiza os dados de uma transação existente")
    @ApiResponse(responseCode = "200", description = "Transação atualizada com sucesso")
    @ApiResponse(responseCode = "404", description = "Transação não encontrada")
    @ApiResponse(responseCode = "400", description = "Dados inválidos")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Transaction transactionDetails) {
        try {
            // Delega a atualização para o serviço
            Transaction updated = transactionService.update(id, transactionDetails);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            // Em caso de erro, retorna mensagem de erro
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    /**
     * DELETE /api/transactions/{id}
     * Deletar uma transação
     * 
     * Parâmetros:
     * - id: ID da transação a deletar (path variable)
     * 
     * Respostas:
     * - HTTP 204 No Content: Transação deletada com sucesso
     * - HTTP 404 Not Found: Transação não existe
     * 
     * @param id ID da transação a deletar
     * @return ResponseEntity com status 204 ou erro
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar transação", description = "Remove uma transação do sistema")
    @ApiResponse(responseCode = "204", description = "Transação deletada com sucesso")
    @ApiResponse(responseCode = "404", description = "Transação não encontrada")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            // Delega a deleção para o serviço
            transactionService.delete(id);
            // Retorna 204 No Content (sem corpo na resposta)
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            // Em caso de erro, retorna mensagem de erro
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    // =====================================================
    // ENDPOINTS DE FUNCIONALIDADES ESPECÍFICAS
    // =====================================================

    /**
     * GET /api/transactions/summary
     * Obter resumo financeiro completo
     * 
     * Calcula e retorna:
     * - totalReceita: Soma de todas as transações do tipo RECEITA
     * - totalDespesa: Soma de todas as transações do tipo DESPESA
     * - saldo: totalReceita - totalDespesa
     * 
     * Resposta de sucesso:
     * - HTTP 200 OK
     * - Body: {
     *     "totalReceita": 5000.0,
     *     "totalDespesa": 95.4,
     *     "saldo": 4904.6
     *   }
     * 
     * @return ResponseEntity com o resumo financeiro
     */
    @GetMapping("/summary")
    @Operation(summary = "Obter resumo financeiro", description = "Retorna o total de receitas, despesas e saldo atual")
    @ApiResponse(responseCode = "200", description = "Resumo financeiro retornado com sucesso")
    public ResponseEntity<Map<String, Object>> getSummary() {
        return ResponseEntity.ok(transactionService.getSummary());
    }

    /**
     * GET /api/transactions/category/{category}
     * Filtrar transações por categoria
     * 
     * Parâmetros:
     * - category: Nome da categoria a filtrar (case-insensitive)
     *   Ex: "Alimentação", "Renda", "Transporte"
     * 
     * Resposta de sucesso:
     * - HTTP 200 OK
     * - Body: Lista JSON com todas as transações da categoria
     * 
     * Exemplo:
     * GET /api/transactions/category/Alimentação
     * Retorna todas as transações da categoria "Alimentação"
     * 
     * @param category Categoria a filtrar
     * @return ResponseEntity com lista de transações
     */
    @GetMapping("/category/{category}")
    @Operation(summary = "Filtrar por categoria", description = "Retorna transações de uma categoria específica")
    @ApiResponse(responseCode = "200", description = "Transações encontradas")
    public ResponseEntity<List<Transaction>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(transactionService.findByCategory(category));
    }

    /**
     * GET /api/transactions/type/{type}
     * Filtrar transações por tipo
     * 
     * Parâmetros:
     * - type: Tipo de transação (RECEITA ou DESPESA)
     * 
     * Resposta de sucesso:
     * - HTTP 200 OK
     * - Body: Lista JSON com todas as transações do tipo
     * 
     * Exemplos de uso:
     * - GET /api/transactions/type/RECEITA -> Todas as receitas
     * - GET /api/transactions/type/DESPESA -> Todas as despesas
     * 
     * @param type Tipo a filtrar (RECEITA ou DESPESA)
     * @return ResponseEntity com lista de transações
     */
    @GetMapping("/type/{type}")
    @Operation(summary = "Filtrar por tipo", description = "Retorna transações de tipo RECEITA ou DESPESA")
    @ApiResponse(responseCode = "200", description = "Transações encontradas")
    public ResponseEntity<List<Transaction>> getByType(@PathVariable String type) {
        return ResponseEntity.ok(transactionService.findByType(type));
    }

    /**
     * GET /api/transactions/health
     * Health check da API
     * 
     * Endpoint simples para verificar se a API está operacional.
     * Útel para:
     * - Monitoramento da saúde da aplicação
     * - Verificação de conectividade
     * - Load balancers e health checks
     * 
     * Resposta de sucesso:
     * - HTTP 200 OK
     * - Body: {"status": "ok"}
     * 
     * @return ResponseEntity com status de saúde
     */
    @GetMapping("/health")
    @Operation(summary = "Health check", description = "Verifica se a API está funcionando")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "ok"));
    }
}
