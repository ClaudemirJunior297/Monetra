# 🔧 GUIA TÉCNICO DETALHADO - BACKEND MONETRA

**Público-alvo:** Desenvolvedores  
**Data:** 12 de Maio de 2026

---

## 📚 Índice

1. [Arquitetura Detalhada](#arquitetura-detalhada)
2. [Fluxo de Dados](#fluxo-de-dados)
3. [Implementação CRUD](#implementação-crud)
4. [Tratamento de Erros](#tratamento-de-erros)
5. [Validações](#validações)
6. [Patterns e Best Practices](#patterns-e-best-practices)
7. [Performance e Otimizações](#performance-e-otimizações)
8. [Testes e Debugging](#testes-e-debugging)

---

## 🏗️ Arquitetura Detalhada

### Stack de Tecnologias

```
┌─────────────────────────────────────────────────┐
│          Spring Boot 3.3.0 Application         │
├─────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────┐ │
│ │      REST Controller Layer                 │ │
│ │  @RestController, @RequestMapping, etc.   │ │
│ │  Responsabilidade: Mapear URLs → Métodos  │ │
│ └────────────────────────────────────────────┘ │
│                      ↓                          │
│ ┌────────────────────────────────────────────┐ │
│ │      Service Layer (Business Logic)       │ │
│ │  @Service, validações, cálculos           │ │
│ │  Responsabilidade: Lógica de negócio     │ │
│ └────────────────────────────────────────────┘ │
│                      ↓                          │
│ ┌────────────────────────────────────────────┐ │
│ │      Model/Entity Layer                   │ │
│ │  @Schema, POJO classes                    │ │
│ │  Responsabilidade: Representação de dados │ │
│ └────────────────────────────────────────────┘ │
│                      ↓                          │
│ ┌────────────────────────────────────────────┐ │
│ │      Data Layer (Em Memória)              │ │
│ │  ArrayList<Transaction> (futuro: JPA)     │ │
│ │  Responsabilidade: Persistência           │ │
│ └────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
         ↓ HTTP/JSON ↑
   ┌──────────────────────┐
   │   Cliente REST       │
   │   (Frontend)         │
   └──────────────────────┘
```

### Componentes e Responsabilidades

#### **MonetaBackendApplication.java**
```java
@SpringBootApplication
public class MonetaBackendApplication {
    
    // Responsabilidades:
    // 1. Iniciar aplicação Spring Boot
    // 2. Habilitar auto-configuração
    // 3. Configurar Swagger/OpenAPI
    
    public static void main(String[] args) {
        SpringApplication.run(MonetaBackendApplication.class, args);
    }
    
    @Bean
    public OpenAPI customOpenAPI() {
        // Metadados da API para Swagger
    }
}
```

**Ciclo de Vida:**
1. `main()` é executado
2. `SpringApplication.run()` inicializa Spring Container
3. Spring realiza component scanning
4. Beans são criados (@Bean, @Service, @Controller)
5. Aplicação inicia em `localhost:8080`

---

#### **CorsConfig.java**
```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    
    // Responsabilidades:
    // 1. Configurar CORS para endpoints
    // 2. Permitir requisições cross-origin
    // 3. Definir políticas de segurança
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*")
                .maxAge(3600);
    }
}
```

**CORS Explicado:**
- **Cross-Origin Resource Sharing** - Mecanismo de segurança do navegador
- **Problema:** Navegador bloqueia requisições cross-domain
- **Solução:** Servidor retorna headers CORS permitindo acesso
- **Produção:** Restringir `allowedOrigins()` a domínios conhecidos

---

#### **Transaction.java (Model)**
```java
@Schema(description = "Modelo de Transação Financeira")
public class Transaction {
    
    // Responsabilidades:
    // 1. Representar estrutura de dado
    // 2. Facilitar serialização/desserialização JSON
    // 3. Prover documentação Swagger
    
    private Long id;
    private String description;
    private String category;
    private Double amount;
    private String type;  // "RECEITA" ou "DESPESA"
    private LocalDateTime date;
}
```

**Ciclo de Vida de um Object:**
```
JSON String (requisição)
    ↓
Spring Deserializer (ObjectMapper)
    ↓
Transaction Java Object
    ↓
Service Method (processamento)
    ↓
Modified Transaction Object
    ↓
Spring Serializer
    ↓
JSON String (resposta)
```

---

#### **TransactionService.java (Business Logic)**
```java
@Service
public class TransactionService {
    
    // Responsabilidades:
    // 1. Validar dados de entrada
    // 2. Executar operações CRUD
    // 3. Implementar lógica de negócio
    // 4. Retornar dados processados
    
    private final List<Transaction> transactions = new ArrayList<>();
    private Long idCounter = 1L;
}
```

**Padrão de Método:**
```
public TipoRetorno nomeMetodo(Parametros) {
    // 1. Validações
    if (condicao) {
        throw new IllegalArgumentException("mensagem");
    }
    
    // 2. Processamento
    // ... lógica ...
    
    // 3. Retorno
    return resultado;
}
```

---

#### **TransactionController.java (REST Endpoints)**
```java
@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
    
    // Responsabilidades:
    // 1. Receber requisições HTTP
    // 2. Validar formato/headers
    // 3. Delegar ao Service
    // 4. Formatar resposta HTTP
    
    @Autowired
    private TransactionService transactionService;
}
```

---

## 📊 Fluxo de Dados

### Fluxo GET (Leitura)

```
1. CLIENT REQUEST
   GET /api/transactions

2. SPRING SERVLET DISPATCHER
   Recebe requisição
   Verifica método HTTP
   Valida URL path

3. REQUEST MAPPING
   Encontra método @GetMapping em TransactionController

4. METHOD PARAMETER RESOLUTION
   Resolve @PathVariable/@RequestParam se existir

5. CONTROLLER METHOD EXECUTION
   transactionService.findAll()

6. SERVICE METHOD EXECUTION
   return new ArrayList<>(transactions)

7. RESPONSE ENTITY
   ResponseEntity.ok(transactions)

8. CONTENT NEGOTIATION
   Detecta Accept header (application/json)

9. MESSAGE CONVERTER
   Jackson ObjectMapper serializa Transaction → JSON

10. HTTP RESPONSE
    Status: 200 OK
    Headers: Content-Type: application/json
    Body: [{"id": 1, "description": "..."}]

11. CLIENT RECEIVES
    JSON array no cliente
```

### Fluxo POST (Criação)

```
1. CLIENT REQUEST
   POST /api/transactions
   Content-Type: application/json
   Body: {"description": "Compra", ...}

2. CONTENT NEGOTIATION
   Spring detecta Content-Type: application/json

3. MESSAGE CONVERTER
   Jackson ObjectMapper desserializa JSON → Transaction object

4. REQUEST BODY RESOLUTION
   @RequestBody transaction binding

5. CONTROLLER METHOD EXECUTION
   transactionService.create(transaction)

6. SERVICE VALIDATION
   ✓ description != null && !empty
   ✓ amount > 0
   ✓ type in ["RECEITA", "DESPESA"]
   
   Se falhar:
   throw new IllegalArgumentException("mensagem")

7. SERVICE PROCESSING
   transaction.setId(idCounter++)
   transactions.add(transaction)

8. SERVICE RETURN
   return transaction (com ID atribuído)

9. CONTROLLER RESPONSE
   ResponseEntity.status(HttpStatus.CREATED).body(created)

10. MESSAGE CONVERTER
    Transaction → JSON

11. HTTP RESPONSE
    Status: 201 Created
    Headers: Content-Type: application/json, Location: /api/transactions/4
    Body: {"id": 4, "description": "Compra", ...}

12. CLIENT RECEIVES
    201 status + JSON com novo ID
```

### Fluxo PUT (Atualização)

```
1. CLIENT REQUEST
   PUT /api/transactions/1
   Body: {"description": "Compra (urgente)"}

2. PATH VARIABLE RESOLUTION
   @PathVariable Long id → 1

3. CONTROLLER METHOD EXECUTION
   transactionService.update(1, updatedTransaction)

4. SERVICE VALIDATION
   ✓ ID existe
   ✓ Campos não vazios
   
5. SERVICE UPDATE (partial)
   if (updatedTransaction.getDescription() != null) {
       transaction.setDescription(...)
   }
   // Não atualiza campos null

6. SERVICE RETURN
   return transaction (atualizada)

7. HTTP RESPONSE
    Status: 200 OK
    Body: {"id": 1, "description": "Compra (urgente)", ...}
```

### Fluxo DELETE (Deleção)

```
1. CLIENT REQUEST
   DELETE /api/transactions/1

2. PATH VARIABLE RESOLUTION
   @PathVariable Long id → 1

3. CONTROLLER METHOD EXECUTION
   transactionService.delete(1)

4. SERVICE VALIDATION
   ✓ ID existe (se não: throw exception)

5. SERVICE DELETE
   transactions.removeIf(t -> t.getId().equals(1))

6. SERVICE RETURN
   void (sem retorno)

7. HTTP RESPONSE
    Status: 204 No Content
    Body: (vazio)
```

---

## 🔨 Implementação CRUD

### CREATE
```java
@PostMapping
public ResponseEntity<?> create(@RequestBody Transaction transaction) {
    try {
        // Service realiza validações e adiciona ID
        Transaction created = transactionService.create(transaction);
        
        // Retorna 201 Created com a transação criada
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
        
    } catch (IllegalArgumentException e) {
        // Valida e retorna erro
        return ResponseEntity.badRequest()
                .body(Map.of("erro", e.getMessage()));
    }
}
```

**Validações (Service):**
```java
public Transaction create(Transaction transaction) {
    // 1. Validar descrição
    if (transaction.getDescription() == null || 
        transaction.getDescription().trim().isEmpty()) {
        throw new IllegalArgumentException("Descrição não pode estar vazia");
    }
    
    // 2. Validar valor
    if (transaction.getAmount() == null || 
        transaction.getAmount() <= 0) {
        throw new IllegalArgumentException("Valor deve ser maior que zero");
    }
    
    // 3. Validar tipo
    if (!"RECEITA".equals(transaction.getType()) && 
        !"DESPESA".equals(transaction.getType())) {
        throw new IllegalArgumentException("Tipo deve ser RECEITA ou DESPESA");
    }
    
    // 4. Processar
    transaction.setId(idCounter++);
    transactions.add(transaction);
    
    return transaction;
}
```

---

### READ (Todos)
```java
@GetMapping
public ResponseEntity<List<Transaction>> getAll() {
    List<Transaction> transactions = transactionService.findAll();
    return ResponseEntity.ok(transactions);
}
```

**Service:**
```java
public List<Transaction> findAll() {
    // Retorna cópia para evitar manipulação externa
    return new ArrayList<>(transactions);
}
```

---

### READ (Por ID)
```java
@GetMapping("/{id}")
public ResponseEntity<Transaction> getById(@PathVariable Long id) {
    Optional<Transaction> transaction = transactionService.findById(id);
    
    // Se encontrado, retorna 200 + objeto
    // Se não encontrado, retorna 404
    return transaction.map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
}
```

**Service:**
```java
public Optional<Transaction> findById(Long id) {
    return transactions.stream()
            .filter(t -> t.getId().equals(id))
            .findFirst();
}
```

**Pattern `Optional`:**
```
findFirst() retorna Optional<T>
┌──────────────────┐
│  Optional<T>     │
├──────────────────┤
│ Valor presente   │
│ ou            → 200 OK
│ Vazio            │ ou 404 Not Found
└──────────────────┘
```

---

### UPDATE
```java
@PutMapping("/{id}")
public ResponseEntity<?> update(
        @PathVariable Long id, 
        @RequestBody Transaction transactionDetails) {
    try {
        Transaction updated = transactionService.update(id, transactionDetails);
        return ResponseEntity.ok(updated);
    } catch (IllegalArgumentException e) {
        return ResponseEntity.badRequest()
                .body(Map.of("erro", e.getMessage()));
    }
}
```

**Service (Partial Update):**
```java
public Transaction update(Long id, Transaction transactionDetails) {
    Optional<Transaction> optionalTransaction = findById(id);
    
    if (optionalTransaction.isPresent()) {
        Transaction transaction = optionalTransaction.get();
        
        // Só atualiza se o campo foi fornecido (não null/vazio)
        if (transactionDetails.getDescription() != null && 
            !transactionDetails.getDescription().trim().isEmpty()) {
            transaction.setDescription(transactionDetails.getDescription());
        }
        
        if (transactionDetails.getCategory() != null && 
            !transactionDetails.getCategory().trim().isEmpty()) {
            transaction.setCategory(transactionDetails.getCategory());
        }
        
        if (transactionDetails.getAmount() != null && 
            transactionDetails.getAmount() > 0) {
            transaction.setAmount(transactionDetails.getAmount());
        }
        
        if (transactionDetails.getType() != null && 
            ("RECEITA".equals(transactionDetails.getType()) || 
             "DESPESA".equals(transactionDetails.getType()))) {
            transaction.setType(transactionDetails.getType());
        }
        
        return transaction;
    }
    
    throw new IllegalArgumentException("Transação não encontrada com ID: " + id);
}
```

---

### DELETE
```java
@DeleteMapping("/{id}")
public ResponseEntity<?> delete(@PathVariable Long id) {
    try {
        transactionService.delete(id);
        // 204 No Content (sem corpo)
        return ResponseEntity.noContent().build();
    } catch (IllegalArgumentException e) {
        return ResponseEntity.badRequest()
                .body(Map.of("erro", e.getMessage()));
    }
}
```

**Service:**
```java
public void delete(Long id) {
    boolean removed = transactions.removeIf(t -> t.getId().equals(id));
    
    if (!removed) {
        throw new IllegalArgumentException("Transação não encontrada com ID: " + id);
    }
}
```

---

## ⚠️ Tratamento de Erros

### Estratégia de Tratamento

```
1. VALIDAÇÃO NA SERVICE
   - Verificar condições
   - Lançar IllegalArgumentException com mensagem descritiva

2. CAPTURA NO CONTROLLER
   - Try-catch para capturar exceções
   - Mapear para HTTP status apropriado

3. RESPOSTA AO CLIENTE
   - Status HTTP correto
   - Mensagem de erro clara em JSON
```

### Códigos HTTP Utilizados

```
200 OK
├─ GET bem-sucedido
├─ PUT bem-sucedido
└─ Geralmente sem erro

201 Created
└─ POST bem-sucedido com novo recurso criado

204 No Content
└─ DELETE bem-sucedido

400 Bad Request
├─ Validação falhou
├─ Descrição vazia
├─ Valor inválido
└─ Tipo inválido

404 Not Found
├─ GET /api/transactions/{id} - ID não existe
├─ PUT /api/transactions/{id} - ID não existe
└─ DELETE /api/transactions/{id} - ID não existe

500 Internal Server Error
└─ Exceções não tratadas
```

### Exemplo de Erro 400

```java
// Service valida
if (transaction.getAmount() <= 0) {
    throw new IllegalArgumentException("Valor deve ser maior que zero");
}

// Controller captura
catch (IllegalArgumentException e) {
    return ResponseEntity.badRequest()
            .body(Map.of("erro", e.getMessage()));
}

// Resposta ao cliente
{
    "status": 400,
    "error": "Bad Request",
    "erro": "Valor deve ser maior que zero"
}
```

---

## ✅ Validações Detalhadas

### Validação de Descrição
```java
if (transaction.getDescription() == null || 
    transaction.getDescription().trim().isEmpty()) {
    throw new IllegalArgumentException("Descrição não pode estar vazia");
}
```

**Casos tratados:**
- ❌ `null` → Erro
- ❌ `""` (vazia) → Erro
- ❌ `"   "` (só espaços) → Erro (trim())
- ✅ `"Compra"` → Ok

---

### Validação de Valor
```java
if (transaction.getAmount() == null || 
    transaction.getAmount() <= 0) {
    throw new IllegalArgumentException("Valor deve ser maior que zero");
}
```

**Casos tratados:**
- ❌ `null` → Erro
- ❌ `0` → Erro (≤ 0)
- ❌ `-50.0` → Erro (negativo)
- ✅ `0.01` → Ok (mínimo)
- ✅ `99999.99` → Ok

---

### Validação de Tipo
```java
if (!"RECEITA".equals(transaction.getType()) && 
    !"DESPESA".equals(transaction.getType())) {
    throw new IllegalArgumentException("Tipo deve ser RECEITA ou DESPESA");
}
```

**Casos tratados:**
- ❌ `null` → Erro
- ❌ `"RENDIMENTO"` → Erro
- ❌ `"receita"` (minúscula) → Erro
- ✅ `"RECEITA"` → Ok
- ✅ `"DESPESA"` → Ok

---

## 🎯 Patterns e Best Practices

### Padrão Service Layer

```
Controller → Service → Data Layer
```

**Benefícios:**
- ✅ Separação de responsabilidades
- ✅ Reutilização de lógica
- ✅ Testes mais fáceis
- ✅ Manutenção facilitada

**Exemplo:**
```java
// ❌ ERRADO - Lógica no Controller
@GetMapping("/summary")
public Map<String, Object> getSummary() {
    double receita = transactionsArray.stream()
            .filter(t -> "RECEITA".equals(t.getType()))
            .mapToDouble(Transaction::getAmount)
            .sum();
    // ... mais lógica ...
}

// ✅ CORRETO - Delegado ao Service
@GetMapping("/summary")
public ResponseEntity<Map<String, Object>> getSummary() {
    return ResponseEntity.ok(transactionService.getSummary());
}
```

---

### Padrão Optional

```java
// ❌ ERRADO - Pode lançar NullPointerException
Transaction t = transactionService.findById(1);
if (t != null) { ... }

// ✅ CORRETO - Seguro com Optional
Optional<Transaction> optional = transactionService.findById(1);
if (optional.isPresent()) {
    Transaction t = optional.get();
}

// ✅ MELHOR - Usando map
return optional.map(ResponseEntity::ok)
              .orElseGet(() -> ResponseEntity.notFound().build());
```

---

### Padrão Stream API

```java
// ❌ ERRADO - Loop imperativo
double total = 0;
for (Transaction t : transactions) {
    if ("RECEITA".equals(t.getType())) {
        total += t.getAmount();
    }
}

// ✅ CORRETO - Stream API (declarativo)
double total = transactions.stream()
        .filter(t -> "RECEITA".equals(t.getType()))
        .mapToDouble(Transaction::getAmount)
        .sum();
```

---

### Injeção de Dependência

```java
// Spring Container gerencia instâncias
@Service
public class TransactionService {
    // Service é singleton
}

// Controller recebe via @Autowired
@RestController
public class TransactionController {
    
    @Autowired
    private TransactionService transactionService;
    
    // Spring injeta automaticamente
}
```

**Benefícios:**
- ✅ Desacoplamento
- ✅ Facilita testes (mock)
- ✅ Lifecycle gerenciado

---

## 📈 Performance e Otimizações

### Complexidade Temporal (Big O)

| Operação | Implementação | Complexidade | Tempo |
|----------|---------------|-------------|-------|
| findAll() | new ArrayList<>(transactions) | O(n) | < 1ms |
| findById() | Stream + filter | O(n) | < 5ms |
| create() | transactions.add() | O(1) | < 2ms |
| update() | Stream + filter + update | O(n) | < 5ms |
| delete() | removeIf() + stream | O(n) | < 5ms |
| getSummary() | Stream + filter + sum | O(2n) = O(n) | < 10ms |
| findByCategory() | Stream + filter | O(n) | < 10ms |

*n = número de transações*

### Otimizações Possíveis (Futuro)

#### 1. Database Indexing
```sql
-- Criar índices em banco de dados
CREATE INDEX idx_transaction_type ON transactions(type);
CREATE INDEX idx_transaction_category ON transactions(category);
CREATE INDEX idx_transaction_date ON transactions(date);
```

#### 2. Caching
```java
@Cacheable("transactions")
public List<Transaction> findAll() {
    return transactionRepository.findAll();
}

@CacheEvict(value = "transactions", allEntries = true)
public Transaction create(Transaction transaction) {
    return transactionRepository.save(transaction);
}
```

#### 3. Paginação
```java
@GetMapping
public ResponseEntity<Page<Transaction>> getAll(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {
    Page<Transaction> transactions = 
        transactionService.findAll(PageRequest.of(page, size));
    return ResponseEntity.ok(transactions);
}
```

---

## 🧪 Testes e Debugging

### Testar com cURL

```bash
# GET Todos
curl -X GET http://localhost:8080/api/transactions

# GET Por ID
curl -X GET http://localhost:8080/api/transactions/1

# POST Criar
curl -X POST http://localhost:8080/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Test",
    "category": "Test",
    "amount": 100.0,
    "type": "RECEITA"
  }'

# PUT Atualizar
curl -X PUT http://localhost:8080/api/transactions/1 \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 200.0
  }'

# DELETE
curl -X DELETE http://localhost:8080/api/transactions/1
```

---

### Testar com Postman

1. Importar OpenAPI: `http://localhost:8080/v3/api-docs`
2. Coleção de requisições criada automaticamente
3. Testar cada endpoint interativamente

---

### Debugging

**Ativar logs:**
```properties
# application.properties
logging.level.com.monetra=DEBUG
logging.level.org.springframework.web=DEBUG
```

**Breakpoints no IDE:**
```java
@GetMapping("/{id}")
public ResponseEntity<Transaction> getById(@PathVariable Long id) {
    // Adicionar breakpoint aqui
    Optional<Transaction> transaction = transactionService.findById(id);
    return ...;
}
```

---

## 📊 Monitoramento

### Health Check
```bash
curl http://localhost:8080/api/transactions/health
```

### Swagger Metrics
- Quantidade de requisições por endpoint
- Tempos de resposta
- Taxa de erro

### Logs para Produção
```properties
logging.level.root=WARN
logging.level.com.monetra=INFO
logging.pattern.console=%d{yyyy-MM-dd HH:mm:ss} - %msg%n
```

---

**Fim do Guia Técnico** 🎓
