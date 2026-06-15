Aqui está o README.md completo e bem formatado, com base nas informações fornecidas:

```markdown
# 🧾 Monetra

> Controle financeiro simples, inteligente e acessível.

Monetra é um aplicativo mobile desenvolvido por estudantes de **Análise e Desenvolvimento de Sistemas**, com o objetivo de democratizar o acesso ao controle financeiro pessoal.

---

## 📱 Telas

| Login | Dashboard | Transações |
|-------|-----------|------------|
| Autenticação segura | Saldo, receitas e despesas | Histórico completo |

| Gráficos | Perfil |
|----------|--------|
| Pizza e barras por categoria | Tema, cor e edição de nome |

---

## 🚀 Funcionalidades

- ✅ Cadastro e autenticação de usuários
- ✅ CRUD completo de transações financeiras
- ✅ Dashboard com resumo financeiro em tempo real
- ✅ Gráfico de pizza com distribuição por categoria
- ✅ Filtro de transações por tipo e categoria
- ✅ Tema claro/escuro
- ✅ Cor de destaque personalizável (5 opções)
- ✅ Edição de nome no perfil
- ✅ Recuperação de senha
- ✅ Tab bar animada customizada

---

## 🛠️ Tecnologias

### Frontend
- [React Native](https://reactnative.dev/) + [Expo](https://expo.dev/)
- [Expo Router](https://expo.github.io/router/) — navegação baseada em arquivos
- [React Native SVG](https://github.com/software-mansion/react-native-svg) — gráficos
- TypeScript

### Backend
- [Spring Boot 2.7](https://spring.io/projects/spring-boot) — API REST
- Spring Data JPA
- Spring Security
- SHA-256 para hash de senhas

### Banco de Dados
- MySQL 8.0 (via Docker)

---

## 🏗️ Arquitetura

```
Monetra/
├── src/                    # Frontend React Native
│   ├── app/                # Telas (Expo Router)
│   │   ├── (tabs)/         # Dashboard, Transações, Gráficos, Perfil
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   └── forgot-password.tsx
│   ├── contexts/           # AuthContext, TransactionContext, ThemeContext
│   ├── hooks/              # useColors
│   ├── services/           # api.ts (integração com backend)
│   └── styles/             # Cores, tipografia, espaçamento
│
└── backend/                # Spring Boot
    └── src/main/java/com/monetra/
        ├── controller/     # AuthController, TransactionController
        ├── service/        # AuthService, TransactionService
        ├── model/          # AppUser, Transaction, enums
        └── repository/     # JPA Repositories
```

---

## ⚙️ Como rodar o projeto

### Pré-requisitos
- Node.js 18+
- Java 17
- Docker
- Expo Go (no celular)

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/Monetra.git
cd Monetra
```

### 2. Suba o banco de dados
```bash
docker run -d \
  --name monetra-mysql \
  -e MYSQL_ROOT_PASSWORD=monetra123 \
  -e MYSQL_DATABASE=monetra \
  -p 3306:3306 \
  mysql:8.0
```

### 3. Inicie o backend
```bash
cd backend
mvn spring-boot:run
```

### 4. Instale as dependências do frontend
```bash
cd ..
npm install
```

### 5. Inicie o app
```bash
npx expo start --tunnel
```

Escaneie o QR code com o **Expo Go** no celular.

---

## 🔧 Variáveis de configuração

### Backend (`backend/src/main/resources/application.properties`)
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/monetra
spring.datasource.username=root
spring.datasource.password=monetra123
```

### Frontend (`src/services/api.ts`)
```ts
const BASE_URL = "http://localhost:8080"; // ou URL pública do Codespace
```

---

## 👥 Equipe

| Nome | Papel |
|------|-------|
| Matheus | BackEnd |
| Claudemir | FrontEnd |
| Everton | Banco de Dados |
| Renato | Banco de Dados |

---

## 📄 Licença

MIT License — sinta-se livre para usar, modificar e distribuir.

---

> Feito com 💜 por estudantes de ADS
```

Esse README está pronto para ser colocado na raiz do seu projeto. Você pode personalizar o link do repositório, as badges (por exemplo, adicionar shields.io) e incluir imagens das telas se desejar.
