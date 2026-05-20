# Monetra Backend

Backend REST API simples para gerenciamento de transações financeiras, construído com **Java 21** e **Spring Boot 3.3.0**.

## 🚀 Características

- ✅ API REST CRUD completo
- ✅ Banco de dados H2 persistente com schema inicializado a partir do arquivo `monetra.sql`
- ✅ CORS habilitado globalmente
- ✅ Swagger/OpenAPI integrado
- ✅ Validações básicas
- ✅ Código limpo e organizado
- ✅ Pronto para integração com frontend

## 📋 Requisitos

- **Java 21+**
- **Maven 3.6+**

## ⚙️ Instalação e Execução

### 1. Clonar/Navegar para o projeto
```bash
cd monetra-backend
```

### 2. Compilar o projeto
```bash
mvn clean compile
```

### 3. Executar a aplicação
```bash
mvn spring-boot:run
```

Ou:
```bash
mvn package
java -jar target/monetra-backend-1.0.0.jar
```

A aplicação estará disponível em: **http://localhost:8080**

## 📚 Documentação da API

Acesse o Swagger UI em:
```
http://localhost:8080/swagger-ui.html
```

Ou a documentação em JSON:
```
http://localhost:8080/v3/api-docs
```

## 🔌 Endpoints da API

### Base URL: `/api/transactions`

#### 1. **Listar todas as transações**
```http
GET /api/transactions
```
**Resposta (200 OK):**
```json
[
  {
    "id": 1,
    "description": "Salário",
    "category": "Renda",
    "amount": 5000.0,
    "type": "RECEITA",
    "date": "2024-05-11T10:30:00"
  },
  {
    "id": 2,
    "description": "Almoço",
    "category": "Alimentação",
    "amount": 45.50,
    "type": "DESPESA",
    "date": "2024-05-11T12:00:00"
  }
]
```

#### 2. **Obter transação por ID**
```http
GET /api/transactions/{id}
```
**Exemplo:** `GET /api/transactions/1`

**Resposta (200 OK):**
```json
{
  "id": 1,
  "description": "Salário",
  "category": "Renda",
  "amount": 5000.0,
  "type": "RECEITA",
  "date": "2024-05-11T10:30:00"
}
```

#### 3. **Criar nova transação**
```http
POST /api/transactions
Content-Type: application/json
```
**Body:**
```json
{
  "description": "Compra no supermercado",
  "category": "Alimentação",
  "amount": 120.75,
  "type": "DESPESA"
}
```

**Resposta (201 Created):**
```json
{
  "id": 4,
  "description": "Compra no supermercado",
  "category": "Alimentação",
  "amount": 120.75,
  "type": "DESPESA",
  "date": "2024-05-11T14:25:00"
}
```

#### 4. **Atualizar transação**
```http
PUT /api/transactions/{id}
Content-Type: application/json
```
**Exemplo:** `PUT /api/transactions/2`

**Body:**
```json
{
  "amount": 50.00,
  "category": "Refeições"
}
```

**Resposta (200 OK):**
```json
{
  "id": 2,
  "description": "Almoço",
  "category": "Refeições",
  "amount": 50.00,
  "type": "DESPESA",
  "date": "2024-05-11T12:00:00"
}
```

#### 5. **Deletar transação**
```http
DELETE /api/transactions/{id}
```
**Exemplo:** `DELETE /api/transactions/3`

**Resposta (204 No Content):**
```
(sem corpo)
```

#### 6. **Obter resumo financeiro**
```http
GET /api/transactions/summary
```

**Resposta (200 OK):**
```json
{
  "totalReceita": 5000.0,
  "totalDespesa": 216.4,
  "saldo": 4783.6
}
```

#### 7. **Filtrar por categoria**
```http
GET /api/transactions/category/{category}
```
**Exemplo:** `GET /api/transactions/category/Alimentação`

**Resposta (200 OK):**
```json
[
  {
    "id": 2,
    "description": "Almoço",
    "category": "Alimentação",
    "amount": 45.50,
    "type": "DESPESA",
    "date": "2024-05-11T12:00:00"
  }
]
```

#### 8. **Filtrar por tipo**
```http
GET /api/transactions/type/{type}
```
**Exemplo:** `GET /api/transactions/type/RECEITA`

**Resposta (200 OK):**
```json
[
  {
    "id": 1,
    "description": "Salário",
    "category": "Renda",
    "amount": 5000.0,
    "type": "RECEITA",
    "date": "2024-05-11T10:30:00"
  }
]
```

#### 9. **Health Check**
```http
GET /api/transactions/health
```

**Resposta (200 OK):**
```json
{
  "status": "ok"
}
```

## 🧪 Testando com cURL

### Listar todas as transações
```bash
curl http://localhost:8080/api/transactions
```

### Criar transação
```bash
curl -X POST http://localhost:8080/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Pagamento de conta",
    "category": "Utilidades",
    "amount": 200.00,
    "type": "DESPESA"
  }'
```

### Obter resumo financeiro
```bash
curl http://localhost:8080/api/transactions/summary
```

### Atualizar transação
```bash
curl -X PUT http://localhost:8080/api/transactions/1 \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5500.00
  }'
```

### Deletar transação
```bash
curl -X DELETE http://localhost:8080/api/transactions/1
```

## 📁 Estrutura do Projeto

```
monetra-backend/
├── pom.xml                                    # Dependências Maven
├── README.md                                  # Este arquivo
└── src/
    └── main/
        ├── java/
        │   └── com/monetra/
        │       ├── MonetaBackendApplication.java    # Classe principal
        │       ├── controller/
        │       │   └── TransactionController.java    # Endpoints REST
        │       ├── service/
        │       │   └── TransactionService.java       # Lógica de negócio
        │       ├── model/
        │       │   └── Transaction.java              # Modelo de dados
        │       └── config/
        │           └── CorsConfig.java               # Configuração CORS
        └── resources/
            └── application.properties        # Configurações da aplicação
```

## 🔧 Configurações Importantes

### application.properties
- **Porta:** 8080
- **Swagger UI:** http://localhost:8080/swagger-ui.html
- **API Docs:** http://localhost:8080/v3/api-docs

### CORS
CORS está habilitado globalmente para `/api/**`, permitindo requisições de qualquer origem.

## 📝 Validações

- **Descrição:** Não pode ser vazia
- **Valor (Amount):** Deve ser maior que zero
- **Tipo:** Apenas "RECEITA" ou "DESPESA"
- **ID:** Retorna 404 se não encontrado

## 🚀 Próximos Passos

Para evoluir o projeto no futuro:

1. **Integrar com Banco de Dados:**
   - Adicionar JPA/Hibernate
   - Usar Spring Data JPA
   - Conectar com PostgreSQL, MySQL, etc.

2. **Adicionar Autenticação:**
   - Spring Security + JWT

3. **Melhorar Validações:**
   - Usar `@Valid` com `javax.validation`

4. **Adicionar Testes:**
   - JUnit 5
   - Mockito

5. **Deploy:**
   - Docker
   - Kubernetes
   - Cloud (AWS, GCP, Azure)

## 📄 Licença

Este projeto é livre para uso e modificação.

---

**Desenvolvido com ❤️ usando Spring Boot**
