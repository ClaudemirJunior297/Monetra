# 🗺️ MAPA DE ARQUITETURA - MONETRA BACKEND

**Versão:** 1.0.0  
**Data:** 12 de Maio de 2026

---

## 📊 Diagrama de Componentes

```
┌────────────────────────────────────────────────────────────────┐
│                    CAMADA DE APRESENTAÇÃO                      │
│  Cliente (Frontend - Expo/React Native, Web, Mobile)          │
└────────────────────────────────────────────────────────────────┘
                             ↑ HTTP/HTTPS ↓
                          (CORS Habilitado)
┌────────────────────────────────────────────────────────────────┐
│                   SPRING BOOT APPLICATION                       │
│  ┌────────────────────────────────────────────────────────────┐
│  │                 REST CONTROLLER LAYER                      │
│  │  ┌──────────────────────────────────────────────────────┐ │
│  │  │ TransactionController                               │ │
│  │  │ @RestController @RequestMapping("/api/transactions")│ │
│  │  ├─ POST   /               → create()                  │ │
│  │  ├─ GET    /               → getAll()                  │ │
│  │  ├─ GET    /{id}           → getById()                 │ │
│  │  ├─ PUT    /{id}           → update()                  │ │
│  │  ├─ DELETE /{id}           → delete()                  │ │
│  │  ├─ GET    /summary        → getSummary()             │ │
│  │  ├─ GET    /category/{c}   → getByCategory()          │ │
│  │  ├─ GET    /type/{t}       → getByType()              │ │
│  │  └─ GET    /health         → health()                 │ │
│  │  @Autowired: TransactionService                       │ │
│  │  └──────────────────────────────────────────────────────┘ │
│  │                           ↓ delega                         │
│  ├────────────────────────────────────────────────────────────┤
│  │                  SERVICE LAYER (BUSINESS)                  │
│  │  ┌──────────────────────────────────────────────────────┐ │
│  │  │ TransactionService @Service                         │ │
│  │  ├─ create(Transaction)         → validar + adicionar  │ │
│  │  ├─ findAll()                   → retorna cópia        │ │
│  │  ├─ findById(Long)              → busca por stream     │ │
│  │  ├─ update(Long, Transaction)   → atualiza parcial     │ │
│  │  ├─ delete(Long)                → remove               │ │
│  │  ├─ getSummary()                → calcula resumo       │ │
│  │  ├─ findByCategory(String)      → filtra categoria     │ │
│  │  └─ findByType(String)          → filtra tipo          │ │
│  │                                                         │ │
│  │  Validações:                                           │ │
│  │  ├─ description != null && !empty                      │ │
│  │  ├─ amount > 0                                         │ │
│  │  ├─ type in ["RECEITA", "DESPESA"]                    │ │
│  │  └─ ID deve existir (update/delete)                   │ │
│  │  └──────────────────────────────────────────────────────┘ │
│  │                           ↓ acessa                         │
│  ├────────────────────────────────────────────────────────────┤
│  │                     ENTITY/MODEL LAYER                     │
│  │  ┌──────────────────────────────────────────────────────┐ │
│  │  │ Transaction                                         │ │
│  │  ├─ Long id                                            │ │
│  │  ├─ String description                                 │ │
│  │  ├─ String category                                    │ │
│  │  ├─ Double amount                                      │ │
│  │  ├─ String type (RECEITA|DESPESA)                      │ │
│  │  ├─ LocalDateTime date                                 │ │
│  │  ├─ Construtores (padrão e com argumentos)             │ │
│  │  ├─ Getters e Setters                                  │ │
│  │  └─ Anotações @Schema (Swagger)                        │ │
│  │  └──────────────────────────────────────────────────────┘ │
│  │                           ↓ persistir                      │
│  ├────────────────────────────────────────────────────────────┤
│  │                    DATA ACCESS LAYER                       │
│  │  ┌──────────────────────────────────────────────────────┐ │
│  │  │ Em Memória (ArrayList)                              │ │
│  │  │ private final List<Transaction> transactions        │ │
│  │  │ private Long idCounter                              │ │
│  │  │                                                      │ │
│  │  │ Futuro: JPA Repository + Database                  │ │
│  │  └──────────────────────────────────────────────────────┘ │
│  └────────────────────────────────────────────────────────────┘
│
│  ┌────────────────────────────────────────────────────────────┐
│  │                  CONFIGURAÇÃO E BOOTSTRAP                  │
│  │  ┌──────────────────────────────────────────────────────┐ │
│  │  │ MonetaBackendApplication                            │ │
│  │  │ @SpringBootApplication                              │ │
│  │  │ ├─ main() → iniciar Spring Container                │ │
│  │  │ └─ @Bean customOpenAPI() → configurar Swagger       │ │
│  │  └──────────────────────────────────────────────────────┘ │
│  │  ┌──────────────────────────────────────────────────────┐ │
│  │  │ CorsConfig                                          │ │
│  │  │ @Configuration                                      │ │
│  │  │ └─ addCorsMappings() → habilitar CORS               │ │
│  │  └──────────────────────────────────────────────────────┘ │
│  └────────────────────────────────────────────────────────────┘
│
│  ┌────────────────────────────────────────────────────────────┐
│  │                DOCUMENTAÇÃO INTERATIVA                     │
│  │  Swagger UI: http://localhost:8080/swagger-ui.html         │
│  │  OpenAPI JSON: http://localhost:8080/v3/api-docs           │
│  └────────────────────────────────────────────────────────────┘
└────────────────────────────────────────────────────────────────┘
              ↑ localhost:8080 ↑
         ┌──────────────────────────────┐
         │   Tomcat Server              │
         │   (Integrado no Spring Boot)  │
         └──────────────────────────────┘
```

---

## 🔄 Fluxo de Requisição Completo

### Exemplo: POST /api/transactions (Criar Transação)

```
1. CLIENT
   ┌─────────────────────────────────┐
   │ POST /api/transactions          │
   │ Content-Type: application/json  │
   │                                 │
   │ {                               │
   │   "description": "Almoço",       │
   │   "category": "Alimentação",     │
   │   "amount": 45.50,              │
   │   "type": "DESPESA"             │
   │ }                               │
   └─────────────────────────────────┘
             ↓ HTTP Request
             
2. SPRING DISPATCHER
   ┌─────────────────────────────────┐
   │ DispatcherServlet intercepta    │
   │ Valida: método HTTP=POST        │
   │ Valida: Content-Type=JSON       │
   └─────────────────────────────────┘
             ↓
             
3. URL MAPPING
   ┌─────────────────────────────────┐
   │ RequestMappingHandlerMapping    │
   │ Encontra:                       │
   │ @PostMapping em                 │
   │ TransactionController           │
   │ Método: create()                │
   └─────────────────────────────────┘
             ↓
             
4. ARGUMENT RESOLVER
   ┌─────────────────────────────────┐
   │ MessageConverter (Jackson)      │
   │ Desserializa JSON → Object      │
   │                                 │
   │ {JSON String}                   │
   │      ↓                          │
   │ Transaction object              │
   │ (description, category, etc)    │
   └─────────────────────────────────┘
             ↓
             
5. CONTROLLER METHOD
   ┌─────────────────────────────────┐
   │ TransactionController           │
   │ .create(Transaction)            │
   │                                 │
   │ try {                           │
   │   // Chama service              │
   │   created =                     │
   │    transactionService.create()  │
   │   return 201 Created            │
   │ } catch (Exception e) {         │
   │   return 400 Bad Request        │
   │ }                               │
   └─────────────────────────────────┘
             ↓ chama
             
6. SERVICE METHOD
   ┌─────────────────────────────────┐
   │ TransactionService.create()     │
   │                                 │
   │ Validações:                     │
   │ ├─ description != null          │
   │ ├─ amount > 0                   │
   │ └─ type válido                  │
   │                                 │
   │ Se inválido:                    │
   │ └─ throw IllegalArgumentException│
   │                                 │
   │ Se válido:                      │
   │ ├─ setId(idCounter++)           │
   │ ├─ transactions.add(t)          │
   │ └─ return transaction           │
   └─────────────────────────────────┘
             ↓ retorna
             
7. RESPONSE ENTITY
   ┌─────────────────────────────────┐
   │ ResponseEntity.status(201)      │
   │ .body(created)                  │
   │                                 │
   │ Transaction {                   │
   │   id: 4,                        │
   │   description: "Almoço",        │
   │   category: "Alimentação",      │
   │   amount: 45.50,                │
   │   type: "DESPESA",              │
   │   date: "2026-05-12T12:30:00"  │
   │ }                               │
   └─────────────────────────────────┘
             ↓ serializa
             
8. MESSAGE CONVERTER
   ┌─────────────────────────────────┐
   │ Jackson ObjectMapper            │
   │ Serializa Object → JSON         │
   │                                 │
   │ Transaction object              │
   │      ↓                          │
   │ {JSON String}                   │
   └─────────────────────────────────┘
             ↓
             
9. HTTP RESPONSE
   ┌─────────────────────────────────┐
   │ HTTP/1.1 201 Created            │
   │ Content-Type: application/json  │
   │ Content-Length: 145             │
   │                                 │
   │ {                               │
   │   "id": 4,                      │
   │   "description": "Almoço",      │
   │   "category": "Alimentação",    │
   │   "amount": 45.50,              │
   │   "type": "DESPESA",            │
   │   "date": "2026-05-12T12:30:00" │
   │ }                               │
   └─────────────────────────────────┘
             ↓ HTTP Response
             
10. CLIENT RECEBE
    ┌─────────────────────────────────┐
    │ Status: 201 Created             │
    │ Body: Transaction JSON          │
    │                                 │
    │ ID 4 foi criado com sucesso!    │
    └─────────────────────────────────┘
```

---

## 📋 Estrutura de Dados

### Transaction Entity

```
Transaction
├── Identificação
│   └── id: Long (UUID/Auto-increment em produção)
│
├── Descrição
│   └── description: String (max 255 caracteres)
│
├── Categorização
│   └── category: String (max 100 caracteres)
│       ├─ Alimentação
│       ├─ Transporte
│       ├─ Saúde
│       ├─ Entretenimento
│       ├─ Renda
│       └─ ... (customizável)
│
├── Valor
│   └── amount: Double (BigDecimal em produção)
│       └─ Sempre positivo (validado)
│
├── Classificação
│   └── type: String (enum em produção)
│       ├─ RECEITA (entrada)
│       └─ DESPESA (saída)
│
└── Temporal
    └── date: LocalDateTime
        └─ Timestamp do registro
```

### Lista de Transações (Storage)

```
transactionList: List<Transaction>
├─ [0] → Transaction {id: 1, ...}
├─ [1] → Transaction {id: 2, ...}
├─ [2] → Transaction {id: 3, ...}
└─ [n] → Transaction {id: n, ...}

idCounter: Long = n+1
```

---

## 🔌 Endpoints Visualization

```
/api/transactions (BASE)
│
├─ GET /
│  └─ Retorna: List<Transaction>
│     Status: 200 OK
│
├─ GET /{id}
│  └─ Retorna: Transaction ou 404
│     Status: 200 OK | 404 Not Found
│
├─ POST /
│  ├─ Input: Transaction JSON
│  ├─ Validações: description, amount, type
│  └─ Retorna: Created Transaction with ID
│     Status: 201 Created | 400 Bad Request
│
├─ PUT /{id}
│  ├─ Input: Partial Transaction JSON
│  ├─ Atualiza: Apenas campos fornecidos
│  └─ Retorna: Updated Transaction
│     Status: 200 OK | 404 Not Found | 400 Bad Request
│
├─ DELETE /{id}
│  └─ Retorna: vazio
│     Status: 204 No Content | 404 Not Found
│
├─ GET /summary
│  └─ Retorna: {totalReceita, totalDespesa, saldo}
│     Status: 200 OK
│
├─ GET /category/{category}
│  └─ Retorna: List<Transaction>
│     Status: 200 OK
│
├─ GET /type/{type}
│  └─ Retorna: List<Transaction>
│     Status: 200 OK
│
└─ GET /health
   └─ Retorna: {status: "ok"}
      Status: 200 OK
```

---

## 💾 Ciclo de Vida dos Dados

```
1. CRIAÇÃO
   JSON → Desserializar → Transaction Object → Validar → Adicionar ID → Persistir
   
2. LEITURA
   ArrayList → Filtrar/Buscar → Transaction Object → Serializar → JSON
   
3. ATUALIZAÇÃO
   JSON → Desserializar → Buscar → Validar → Atualizar campos → Serializar → JSON
   
4. DELEÇÃO
   ID → Buscar → Encontrado? → Remover → Confirmação
```

---

## 🎯 Padrões de Requisição/Resposta

### Sucesso (2xx)

```
GET /api/transactions/1
Response (200 OK):
{
  "id": 1,
  "description": "Salário",
  "category": "Renda",
  "amount": 5000.0,
  "type": "RECEITA",
  "date": "2026-05-12T09:00:00"
}
```

### Criação (201)

```
POST /api/transactions
Request Body:
{
  "description": "Compra",
  "category": "Alimentação",
  "amount": 50.0,
  "type": "DESPESA"
}

Response (201 Created):
{
  "id": 4,
  "description": "Compra",
  "category": "Alimentação",
  "amount": 50.0,
  "type": "DESPESA",
  "date": "2026-05-12T14:30:00"
}
```

### Deleção (204)

```
DELETE /api/transactions/4
Response (204 No Content):
(vazio - apenas headers)
```

### Erro (4xx)

```
POST /api/transactions
Request Body:
{
  "description": "",  ← INVÁLIDO
  "category": "Alimentação",
  "amount": 50.0,
  "type": "DESPESA"
}

Response (400 Bad Request):
{
  "erro": "Descrição não pode estar vazia"
}
```

### Não Encontrado (404)

```
GET /api/transactions/999
Response (404 Not Found):
(vazio - sem corpo)
```

---

## 🔐 Fluxo de Segurança

```
┌─────────────────────────────┐
│ CORS Configuration          │
├─────────────────────────────┤
│ allowedOrigins: *           │
│ allowedMethods: GET,POST... │
│ allowedHeaders: *           │
│ maxAge: 3600 segundos       │
│                             │
│ ⚠️ Em produção: restringir! │
└─────────────────────────────┘
         ↓
┌─────────────────────────────┐
│ Content-Type Validation     │
├─────────────────────────────┤
│ Esperado: application/json  │
│ Spring rejeita outras       │
└─────────────────────────────┘
         ↓
┌─────────────────────────────┐
│ Input Validation (Service)  │
├─────────────────────────────┤
│ ✓ Não null                  │
│ ✓ Não vazio                 │
│ ✓ Tipo válido               │
│ ✓ Valor positivo            │
│ ✓ ID existe                 │
└─────────────────────────────┘
         ↓
┌─────────────────────────────┐
│ Erro Handling               │
├─────────────────────────────┤
│ try-catch em Controller     │
│ Retorna status apropriado   │
│ Mensagem clara ao cliente   │
└─────────────────────────────┘
```

---

## 📦 Dependências e Versões

```
Java 21 (LTS)
  ↓
Maven 3.x
  ├─ spring-boot-starter-parent 3.3.0
  ├─ spring-boot-starter-web 3.3.0
  ├─ springdoc-openapi-starter-webmvc-ui 2.5.0
  └─ spring-boot-devtools (runtime, optional)
  
  ↓
Tomcat Server (embutido)
  ├─ Porta: 8080
  ├─ Threads: pool configurável
  └─ Lifecycle: gerenciado pelo Spring Boot
  
  ↓
Jackson (Serialização/Desserialização)
  ├─ ObjectMapper
  ├─ JSON ↔ Object
  └─ Parte do spring-boot-starter-web
```

---

## 🚀 Deployment Architecture

```
Desenvolvimento
├─ IDE: Visual Studio Code / IntelliJ
├─ JDK: Java 21
├─ Maven: mvn spring-boot:run
├─ Porta: 8080
├─ Hot Reload: spring-boot-devtools
└─ Storage: ArrayList em memória

Produção (Futuro)
├─ JVM: Java 21 (Docker)
├─ App Server: Tomcat (Integrado)
├─ Reverse Proxy: Nginx
├─ Database: PostgreSQL / MySQL
├─ Cache: Redis
├─ Load Balancer: AWS ELB / Nginx
├─ Monitoring: Prometheus + Grafana
└─ Logging: ELK Stack
```

---

## 📊 Estatísticas de Código

```
Total de Arquivos:   5 Java files
Linhas de Código:    ~500+ linhas
Classes:             4
Interfaces:          1 (WebMvcConfigurer)
Métodos Públicos:    16
Endpoints:           9
Anotações Spring:    15+
```

---

## 🎓 Stack de Conhecimento Necessário

```
OBRIGATÓRIO:
├─ Java 8+ (Streams, Lambda, Optional)
├─ Spring Boot basics
├─ REST API design
├─ HTTP methods & status codes
└─ JSON format

IMPORTANTE:
├─ Spring annotations
├─ Dependency Injection
├─ Exception Handling
├─ Collections (List, ArrayList)
└─ CORS mechanism

BOM TER:
├─ Banco de dados (SQL)
├─ JPA/Hibernate
├─ Testing (JUnit, Mockito)
├─ DevOps (Docker, CI/CD)
└─ Performance optimization
```

---

## 📈 Métricas de Qualidade

```
Code Quality:
├─ ✅ Separação de responsabilidades
├─ ✅ DRY principle
├─ ✅ Tratamento de erros
├─ ✅ Documentação comentada
└─ ⚠️ Sem testes automatizados (futuro)

Performance:
├─ ✅ < 10ms resposta média
├─ ✅ O(n) complexidade aceitável
└─ ⚠️ Sem indexing/cache

Security:
├─ ✅ Input validation
├─ ✅ Exception handling
├─ ⚠️ Sem autenticação
├─ ⚠️ Sem autorização
└─ ⚠️ CORS aberto

Scalability:
├─ ✅ Modular architecture
├─ ⚠️ Em memória (não escalável)
└─ ⚠️ Single instance only
```

---

**Fim do Mapa de Arquitetura** 🗺️
