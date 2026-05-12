# 📊 RELATÓRIO COMPLETO - BACKEND MONETRA

**Data:** 12 de Maio de 2026  
**Versão:** 1.0.0  
**Status:** ✅ Funcional

---

## 📋 ÍNDICE

1. [Visão Geral](#visão-geral)
2. [Arquitetura do Projeto](#arquitetura-do-projeto)
3. [Tecnologias e Dependências](#tecnologias-e-dependências)
4. [Estrutura de Arquivos](#estrutura-de-arquivos)
5. [Camadas da Aplicação](#camadas-da-aplicação)
6. [Endpoints da API](#endpoints-da-api)
7. [Fluxo de Dados](#fluxo-de-dados)
8. [Validações e Tratamento de Erros](#validações-e-tratamento-de-erros)
9. [Dados de Exemplo](#dados-de-exemplo)
10. [Como Executar](#como-executar)
11. [Documentação da API](#documentação-da-api)
12. [Melhorias Futuras](#melhorias-futuras)
13. [Sumário Técnico](#sumário-técnico)

---

## 🎯 Visão Geral

O **Monetra Backend** é uma API REST desenvolvida em **Spring Boot** que fornece funcionalidades completas de gerenciamento de transações financeiras. A aplicação foi projetada para ser integrada com o frontend mobile (Expo/React Native) e oferece todas as operações necessárias para um sistema de controle financeiro pessoal.

### Objetivos Principais:
- ✅ Gerenciar transações financeiras (receitas e despesas)
- ✅ Fornecer categorização de transações
- ✅ Calcular resumos financeiros automáticos
- ✅ Suportar filtros e buscas por múltiplos critérios
- ✅ Oferecer documentação interativa via Swagger
- ✅ Permitir integração com frontend via CORS

---

## 🏗️ Arquitetura do Projeto

A aplicação segue a **arquitetura em camadas** (Layered Architecture), que divide a responsabilidade em diferentes níveis:

```
┌─────────────────────────────────────┐
│   Client (Frontend Mobile/Web)      │
└──────────────┬──────────────────────┘
               │ HTTP/REST
┌──────────────▼──────────────────────┐
│   Controller Layer (TransactionController)
│   - Recebe requisições HTTP
│   - Mapeia URLs para métodos
│   - Retorna respostas JSON
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Service Layer (TransactionService)
│   - Lógica de negócio
│   - Validações
│   - Cálculos e processamentos
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Model/Entity Layer (Transaction)
│   - Representa dados
│   - Serialização/Desserialização JSON
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Data Layer (Em Memória)
│   - Armazenamento (atualmente RAM)
│   - Simulação de BD
└─────────────────────────────────────┘
```

### Padrões de Design Utilizados:

1. **Dependency Injection (DI)** - Gerenciado pelo Spring
2. **Service Pattern** - Separação de lógica e controle
3. **Repository Pattern** - Acesso a dados (simulado)
4. **DTO Pattern** - Transfer Objects (Transaction)
5. **REST Architecture** - Padrão RESTful para endpoints

---

## 🛠️ Tecnologias e Dependências

### Stack Técnico:
| Componente | Versão | Propósito |
|-----------|--------|----------|
| **Java** | 21 | Linguagem de programação |
| **Spring Boot** | 3.3.0 | Framework para aplicação web |
| **Spring Web** | 3.3.0 | REST e controladores web |
| **Spring DevTools** | 3.3.0 | Hot reload durante desenvolvimento |
| **OpenAPI 3 (Swagger)** | 2.5.0 | Documentação interativa da API |
| **Maven** | 3.x | Gerenciador de dependências |

### Dependências Maven (pom.xml):

```xml
<!-- Spring Boot Web (inclui Tomcat server) -->
spring-boot-starter-web

<!-- OpenAPI 3 / Swagger UI -->
springdoc-openapi-starter-webmvc-ui:2.5.0

<!-- Spring Boot DevTools (hot reload) -->
spring-boot-devtools (escopo: runtime, optional)
```

### Configurações JVM:
- **Java Version:** 21 (Long-Term Support)
- **Source Encoding:** UTF-8
- **Maven Compiler Source/Target:** 21

---

## 📁 Estrutura de Arquivos

```
backend/
├── src/main/java/com/monetra/
│   ├── MonetaBackendApplication.java    (Classe principal)
│   ├── config/
│   │   └── CorsConfig.java              (Configuração CORS)
│   ├── controller/
│   │   └── TransactionController.java   (REST Controller)
│   ├── model/
│   │   └── Transaction.java             (Entidade de domínio)
│   └── service/
│       └── TransactionService.java      (Lógica de negócio)
├── src/main/resources/
│   └── application.properties           (Configurações da aplicação)
├── pom.xml                              (Definição do projeto Maven)
├── run.sh                               (Script para executar)
├── QUICK_START.md                       (Guia rápido de início)
├── DESENVOLVIMENTO.md                   (Documentação de desenvolvimento)
├── EXEMPLOS_API.rest                    (Exemplos de requisições HTTP)
├── INTEGRACAO_FRONTEND.md              (Guia de integração frontend)
└── README.md                            (Documentação geral)
```

---

## 🔄 Camadas da Aplicação

### 1️⃣ **MonetaBackendApplication.java** (Camada de Configuração)

**Responsabilidade:** Inicializar a aplicação e configurar a documentação.

**Funcionalidades:**
- `main()` - Ponto de entrada da aplicação Spring Boot
- `customOpenAPI()` - Configura metadados do Swagger/OpenAPI
  - Título: "Monetra API"
  - Versão: "1.0.0"
  - Descrição: "Backend REST API para gerenciamento de transações financeiras"

**Acessos:**
- Aplicação: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

---

### 2️⃣ **CorsConfig.java** (Configuração CORS)

**Responsabilidade:** Habilitar requisições cross-origin para o frontend.

**Configurações:**
```
Mapping:            /api/**
Allowed Origins:    * (qualquer origem)
Allowed Methods:    GET, POST, PUT, DELETE, OPTIONS
Allowed Headers:    * (qualquer header)
Credentials:        Não aceita
Max Age Cache:      3600 segundos (1 hora)
```

**Importância:** Permite que o frontend (Expo/React Native) acesse a API sem bloqueios de segurança.

**⚠️ NOTA IMPORTANTE:** Em produção, restringir `allowedOrigins()` para domínios específicos.

---

### 3️⃣ **Transaction.java** (Modelo de Domínio)

**Responsabilidade:** Representar uma transação financeira.

**Atributos:**

| Atributo | Tipo | Descrição | Exemplo |
|----------|------|-----------|---------|
| `id` | Long | ID único gerado automaticamente | 1 |
| `description` | String | Descrição da transação | "Compra no supermercado" |
| `category` | String | Categoria de classificação | "Alimentação" |
| `amount` | Double | Valor em reais | 150.50 |
| `type` | String | RECEITA ou DESPESA | "DESPESA" |
| `date` | LocalDateTime | Data/hora do registro | 2026-05-12T10:30:00 |

**Construtores:**
- `Transaction()` - Padrão (sem argumentos)
- `Transaction(description, category, amount, type)` - Com argumentos

**Getters e Setters:** Completos para todos os atributos

**Anotações Swagger:** Todas as propriedades documentadas para OpenAPI

---

### 4️⃣ **TransactionService.java** (Lógica de Negócio)

**Responsabilidade:** Implementar CRUD e funcionalidades específicas.

**Características:**
- ✅ Armazenamento em memória (ArrayList)
- ✅ Geração automática de IDs (contador)
- ✅ Validações de dados
- ✅ Operações CRUD completas
- ✅ Filtros e resumos financeiros

**Métodos CRUD:**

#### **CREATE: `create(Transaction)`**
Cria nova transação com validações:
- Descrição não pode ser vazia
- Valor deve ser positivo (> 0)
- Tipo deve ser RECEITA ou DESPESA
- Atribui ID automaticamente

```java
public Transaction create(Transaction transaction)
```

#### **READ: `findAll()`**
Retorna lista de todas as transações (cópia segura)

```java
public List<Transaction> findAll()
```

#### **READ: `findById(Long id)`**
Busca transação específica por ID

```java
public Optional<Transaction> findById(Long id)
```

#### **UPDATE: `update(Long id, Transaction)`**
Atualiza transação existente (parcialmente)
- Valida cada campo antes de atualizar
- Não atualiza campos nulos

```java
public Transaction update(Long id, Transaction transactionDetails)
```

#### **DELETE: `delete(Long id)`**
Remove transação do sistema
- Lança exceção se ID não existe

```java
public void delete(Long id)
```

**Métodos de Negócio:**

#### **`getSummary()`**
Calcula resumo financeiro:

```json
{
  "totalReceita": 5000.00,
  "totalDespesa": 95.40,
  "saldo": 4904.60
}
```

#### **`findByCategory(String category)`**
Filtra transações por categoria (case-insensitive)

#### **`findByType(String type)`**
Filtra transações por tipo (RECEITA ou DESPESA)

**Dados Iniciais:**
- ID 1: Salário (Renda) - RECEITA - R$ 5.000,00
- ID 2: Almoço (Alimentação) - DESPESA - R$ 45,50
- ID 3: Netflix (Entretenimento) - DESPESA - R$ 49,90

---

### 5️⃣ **TransactionController.java** (REST Controller)

**Responsabilidade:** Expor endpoints HTTP para operações de transação.

**Base URL:** `/api/transactions`

**Total de Endpoints:** 9

---

## 🌐 Endpoints da API

### 📌 CRUD Completo

#### **1. GET /api/transactions**
**Listar todas as transações**

```
Método:      GET
URL:         /api/transactions
Autenticação: Não requerida
Cache:       Não
Resposta:    200 OK - Lista de transações
```

**Exemplo de Resposta:**
```json
[
  {
    "id": 1,
    "description": "Salário",
    "category": "Renda",
    "amount": 5000.0,
    "type": "RECEITA",
    "date": "2026-05-12T09:00:00"
  },
  {
    "id": 2,
    "description": "Almoço",
    "category": "Alimentação",
    "amount": 45.5,
    "type": "DESPESA",
    "date": "2026-05-12T12:30:00"
  }
]
```

---

#### **2. GET /api/transactions/{id}**
**Obter transação específica pelo ID**

```
Método:      GET
URL:         /api/transactions/{id}
Parâmetro:   id (Path) - ID da transação
Respostas:
  - 200 OK: Transação encontrada
  - 404 Not Found: ID não existe
```

**Exemplo de Requisição:**
```
GET http://localhost:8080/api/transactions/1
```

**Resposta (200):**
```json
{
  "id": 1,
  "description": "Salário",
  "category": "Renda",
  "amount": 5000.0,
  "type": "RECEITA",
  "date": "2026-05-12T09:00:00"
}
```

---

#### **3. POST /api/transactions**
**Criar nova transação**

```
Método:      POST
URL:         /api/transactions
Content-Type: application/json
Body:        Objeto Transaction
Respostas:
  - 201 Created: Transação criada com sucesso
  - 400 Bad Request: Dados inválidos
```

**Exemplo de Requisição:**
```json
{
  "description": "Compra na farmácia",
  "category": "Saúde",
  "amount": 87.50,
  "type": "DESPESA"
}
```

**Validações:**
- ❌ Description varia (erro: "Descrição não pode estar vazia")
- ❌ Amount ≤ 0 (erro: "Valor deve ser maior que zero")
- ❌ Type ∉ {RECEITA, DESPESA} (erro: "Tipo deve ser RECEITA ou DESPESA")

**Resposta (201):**
```json
{
  "id": 4,
  "description": "Compra na farmácia",
  "category": "Saúde",
  "amount": 87.50,
  "type": "DESPESA",
  "date": "2026-05-12T14:45:30"
}
```

---

#### **4. PUT /api/transactions/{id}**
**Atualizar transação existente**

```
Método:      PUT
URL:         /api/transactions/{id}
Parâmetro:   id (Path) - ID da transação
Body:        Campos a atualizar (parcial)
Respostas:
  - 200 OK: Atualizado com sucesso
  - 404 Not Found: ID não existe
  - 400 Bad Request: Dados inválidos
```

**Exemplo de Requisição:**
```json
{
  "description": "Compra na farmácia (urgente)",
  "amount": 95.00
}
```

**Nota:** Apenas campos fornecidos são atualizados. Campos nulos são ignorados.

**Resposta (200):**
```json
{
  "id": 4,
  "description": "Compra na farmácia (urgente)",
  "category": "Saúde",
  "amount": 95.00,
  "type": "DESPESA",
  "date": "2026-05-12T14:45:30"
}
```

---

#### **5. DELETE /api/transactions/{id}**
**Deletar transação**

```
Método:      DELETE
URL:         /api/transactions/{id}
Parâmetro:   id (Path) - ID da transação
Respostas:
  - 204 No Content: Deletado com sucesso
  - 404 Not Found: ID não existe
```

**Exemplo de Requisição:**
```
DELETE http://localhost:8080/api/transactions/4
```

**Resposta (204):** Sem corpo (apenas header)

---

### 📊 Funcionalidades Especiais

#### **6. GET /api/transactions/summary**
**Obter resumo financeiro**

```
Método:      GET
URL:         /api/transactions/summary
Resposta:    200 OK - Resumo financeiro
```

**Resposta:**
```json
{
  "totalReceita": 5000.0,
  "totalDespesa": 95.4,
  "saldo": 4904.6
}
```

**Cálculos:**
- totalReceita = Σ(amount | type = RECEITA)
- totalDespesa = Σ(amount | type = DESPESA)
- saldo = totalReceita - totalDespesa

---

#### **7. GET /api/transactions/category/{category}**
**Filtrar por categoria**

```
Método:      GET
URL:         /api/transactions/category/{category}
Parâmetro:   category (Path) - Nome da categoria
Exemplo:     /api/transactions/category/Alimentação
Resposta:    200 OK - Lista de transações
```

**Características:**
- Busca case-insensitive
- Retorna lista (vazia se nenhuma encontrada)

**Exemplo de Resposta:**
```json
[
  {
    "id": 2,
    "description": "Almoço",
    "category": "Alimentação",
    "amount": 45.5,
    "type": "DESPESA",
    "date": "2026-05-12T12:30:00"
  }
]
```

---

#### **8. GET /api/transactions/type/{type}**
**Filtrar por tipo**

```
Método:      GET
URL:         /api/transactions/type/{type}
Parâmetro:   type (Path) - RECEITA ou DESPESA
Exemplo:     /api/transactions/type/RECEITA
Resposta:    200 OK - Lista de transações
```

**Tipos Válidos:**
- `RECEITA` - Entradas de dinheiro
- `DESPESA` - Saídas de dinheiro

---

#### **9. GET /api/transactions/health**
**Health check**

```
Método:      GET
URL:         /api/transactions/health
Resposta:    200 OK - Status de saúde
```

**Resposta:**
```json
{
  "status": "ok"
}
```

**Uso:**
- Monitoramento da saúde da aplicação
- Load balancers
- Testes de conectividade

---

## 📈 Fluxo de Dados

### Fluxo de uma Requisição:

```
1. CLIENTE envia requisição HTTP
   ↓
2. SPRING DISPATCHER intercepta requisição
   ↓
3. SPRING ROUTER mapeia para método do Controller
   ↓
4. CONTROLLER valida headers e parseia JSON
   ↓
5. CONTROLLER chama método do SERVICE
   ↓
6. SERVICE realiza validações de negócio
   ↓
7. SERVICE executa operação (CRUD)
   ↓
8. SERVICE retorna resultado para CONTROLLER
   ↓
9. CONTROLLER formata resposta HTTP (JSON)
   ↓
10. SPRING serializa resposta com código HTTP
   ↓
11. CLIENTE recebe resposta HTTP + JSON
```

### Exemplo: Criar Transação

```
POST /api/transactions
Content-Type: application/json

{
  "description": "Compra",
  "category": "Alimentação",
  "amount": 50.0,
  "type": "DESPESA"
}
↓
Controller.create() valida Content-Type
↓
Spring desserializa JSON → Transaction object
↓
Controller chama transactionService.create(transaction)
↓
Service valida:
  ✓ description não vazia
  ✓ amount > 0
  ✓ type é válido
↓
Service atribui ID (idCounter++)
↓
Service adiciona à lista de transações
↓
Service retorna Transaction com ID
↓
Controller retorna 201 Created + Transaction JSON
↓
Cliente recebe:
{
  "id": 4,
  "description": "Compra",
  "category": "Alimentação",
  "amount": 50.0,
  "type": "DESPESA",
  "date": "2026-05-12T14:30:00"
}
```

---

## ✅ Validações e Tratamento de Erros

### Validações Implementadas:

#### **No Modelo (Transaction):**
- Tipos Swagger para documentação
- Constraints de exemplo nos atributos

#### **No Serviço (TransactionService):**
- Descrição não pode ser vazia/null
- Valor deve ser positivo (> 0)
- Tipo deve ser RECEITA ou DESPESA
- Categoria não pode ser vazia (na atualização)
- ID deve existir (na atualização e deleção)

#### **No Controlador (TransactionController):**
- Try-catch para capturar IllegalArgumentException
- Content-Type validation automático (JSON)
- PathVariable validation automática

### Tratamento de Erros:

#### **Erro 400 Bad Request:**
```json
{
  "erro": "Descrição não pode estar vazia"
}
```

Casos de ocorrência:
- Descrição vazia
- Valor inválido (≤ 0)
- Tipo inválido
- Dados malformados no JSON

#### **Erro 404 Not Found:**
```
Status: 404
Body: vazio
```

Casos de ocorrência:
- GET com ID inexistente
- PUT/DELETE com ID inexistente

#### **Erro 500 Internal Server Error:**
```json
{
  "timestamp": "2026-05-12T14:30:00",
  "status": 500,
  "error": "Internal Server Error",
  "message": "..."
}
```

Casos (raros):
- Exceções não tratadas
- Problemas de serialização

---

## 📦 Dados de Exemplo

### Transações Iniciais:

```json
[
  {
    "id": 1,
    "description": "Salário",
    "category": "Renda",
    "amount": 5000.0,
    "type": "RECEITA",
    "date": "2026-05-12T09:00:00"
  },
  {
    "id": 2,
    "description": "Almoço",
    "category": "Alimentação",
    "amount": 45.50,
    "type": "DESPESA",
    "date": "2026-05-12T12:30:00"
  },
  {
    "id": 3,
    "description": "Netflix",
    "category": "Entretenimento",
    "amount": 49.90,
    "type": "DESPESA",
    "date": "2026-05-12T20:00:00"
  }
]
```

### Resumo Inicial:
```json
{
  "totalReceita": 5000.00,
  "totalDespesa": 95.40,
  "saldo": 4904.60
}
```

---

## 🚀 Como Executar

### Pré-requisitos:
- ✅ Java 21 instalado (`java -version`)
- ✅ Maven 3.x instalado (`mvn -version`)
- ✅ Git instalado

### Passos para Iniciar:

**1. Clone o repositório:**
```bash
git clone https://github.com/ClaudemirJunior297/Monetra.git
cd Monetra/backend
```

**2. Compile o projeto:**
```bash
mvn clean compile
```

**3. Execute a aplicação:**

**Opção A - Via Maven:**
```bash
mvn spring-boot:run
```

**Opção B - Via script bash:**
```bash
chmod +x run.sh
./run.sh
```

**Opção C - Via JAR:**
```bash
mvn clean package
java -jar target/monetra-backend-1.0.0.jar
```

**4. Verifique se está rodando:**
```bash
curl http://localhost:8080/api/transactions/health
```

Resposta esperada:
```json
{
  "status": "ok"
}
```

### Parar a Aplicação:
- Pressione `Ctrl + C` no terminal

---

## 📖 Documentação da API

### Swagger UI Interativo:

**URL:** `http://localhost:8080/swagger-ui.html`

**Funcionalidades:**
- ✅ Documentação visual de todos os endpoints
- ✅ Teste interativo de requisições
- ✅ Esquemas de requisição/resposta
- ✅ Codesample em várias linguagens

### OpenAPI JSON:

**URL:** `http://localhost:8080/v3/api-docs`

**Uso:**
- Importar em ferramentas como Postman
- Gerar clientes automaticamente
- Integração com documentação automática

### Exemplos de Requisições (EXEMPLOS_API.rest):

Arquivo com exemplos prontos para executar:
```
### Listar todas as transações
GET http://localhost:8080/api/transactions

### Criar nova transação
POST http://localhost:8080/api/transactions
Content-Type: application/json

{
  "description": "Compra",
  "category": "Alimentação",
  "amount": 50.0,
  "type": "DESPESA"
}
```

---

## 🔮 Melhorias Futuras

### ❌ Limitações Atuais:

1. **Persistência em Memória**
   - ❌ Dados são perdidos ao reiniciar
   - ❌ Não escalável para produção
   - ✅ **Solução:** Integrar JPA + Hibernate + BD

2. **Sem Autenticação**
   - ❌ Qualquer cliente pode acessar
   - ✅ **Solução:** Implementar JWT/OAuth2

3. **Sem Banco de Dados**
   - ❌ Apenas simulação em memória
   - ✅ **Solução:** PostgreSQL/MySQL + JPA

4. **CORS Aberto**
   - ❌ Aceita qualquer origem
   - ✅ **Solução:** Restringir em produção

### 📋 Roadmap de Melhorias:

**Fase 2 (Próxima):**
- [ ] Integração com PostgreSQL
- [ ] Autenticação JWT
- [ ] Testes unitários (JUnit 5)
- [ ] Testes de integração

**Fase 3:**
- [ ] Relatórios avançados (por período, gráficos)
- [ ] Categorias personalizadas
- [ ] Orçamentos e metas
- [ ] Histórico de alterações (audit log)
- [ ] Backup automático

**Fase 4:**
- [ ] Cache (Redis)
- [ ] Rate limiting
- [ ] Paginação de resultados
- [ ] Busca full-text
- [ ] API GraphQL (alternativa)

---

## 📊 Sumário Técnico

### Estatísticas do Código:

| Métrica | Valor |
|---------|-------|
| **Arquivos Java** | 5 |
| **Linhas de Código** | ~500+ |
| **Métodos Públicos** | 16 |
| **Endpoints REST** | 9 |
| **Anotações Swagger** | 20+ |
| **Classes** | 4 |
| **Interfaces Implementadas** | 1 |

### Performance:

| Operação | Complexidade | Tempo Estimado |
|----------|-------------|----------------|
| GET /all | O(1) | < 1ms |
| GET /id | O(n) | < 5ms |
| POST (create) | O(1) | < 2ms |
| PUT (update) | O(n) | < 5ms |
| DELETE | O(n) | < 5ms |
| /summary | O(n) | < 10ms |
| /category | O(n) | < 10ms |
| /type | O(n) | < 10ms |

*n = número de transações*

### Escalabilidade Atual:

- ✅ Até 1.000 transações em memória
- ⚠️ Performance degrada com crescimento
- ❌ Sem suporte a múltiplos usuários
- ❌ Sem persistência

### Segurança Atual:

| Aspecto | Status | Nível |
|---------|--------|-------|
| CORS | ✅ Configurado | Aberto |
| Autenticação | ❌ Não implementada | Nenhum |
| Autorização | ❌ Não implementada | Nenhum |
| HTTPS | ❌ Não configurado | Nenhum |
| Rate Limiting | ❌ Não implementado | Nenhum |
| Input Validation | ✅ Implementada | Básico |

---

## 🎓 Conceitos-Chave Utilizados

### Spring Framework:
- `@SpringBootApplication` - Configuração automática
- `@RestController` - Expõe endpoints REST
- `@Autowired` - Dependency Injection
- `@GetMapping/@PostMapping/@PutMapping/@DeleteMapping` - Mapeamento HTTP
- `@PathVariable` - Parâmetros de URL
- `@RequestBody` - Desserialização JSON

### Padrões de Projeto:
- **Layered Architecture** - Separação de responsabilidades
- **Dependency Injection** - Inversão de controle
- **Service Pattern** - Lógica de negócio centralizada
- **REST Pattern** - Recursos e operações HTTP

### Tratamento de Exceções:
- `IllegalArgumentException` - Validações
- `try-catch` - Captura de erros
- `Optional<T>` - Valores opcionais

### Functional Programming (Java 8+):
- `Stream API` - Filtros e mapeamentos
- `map()` / `filter()` - Transformações
- `findFirst()` - Busca em coleções
- Lambda expressions

---

## 📞 Suporte e Contato

### Documentação Adicional:

- 📄 [QUICK_START.md](QUICK_START.md) - Guia rápido de início
- 📄 [DESENVOLVIMENTO.md](DESENVOLVIMENTO.md) - Guia de desenvolvimento
- 📄 [EXEMPLOS_API.rest](EXEMPLOS_API.rest) - Exemplos de requisições
- 📄 [INTEGRACAO_FRONTEND.md](INTEGRACAO_FRONTEND.md) - Integração frontend

### Recursos Úteis:

- 🌐 [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- 🌐 [OpenAPI Specification](https://www.openapis.org/)
- 🌐 [REST API Best Practices](https://restfulapi.net/)

---

## 📝 Licença e Informações

- **Projeto:** Monetra
- **Versão:** 1.0.0
- **Data:** Maio 2026
- **Status:** ✅ Produção (MVP)
- **Autor:** Monetra Team

---

**Fim do Relatório** ✨
