# Raji Finance - Guia de Setup para Desenvolvedores

> **Versao:** 0.1.0 (Sprint 1)  
> **Ultima atualizacao:** 2026-04-04

---

## 1. Pre-requisitos

Antes de comecar, certifique-se de ter instalado:

| Ferramenta            | Versao Minima | Como verificar     | Instalacao                            |
| --------------------- | ------------- | ------------------ | ------------------------------------- |
| **Node.js**           | 20.0.0+       | `node --version`   | [nodejs.org](https://nodejs.org/)     |
| **npm**               | 10.0.0+       | `npm --version`    | Vem com o Node.js                     |
| **Git**               | 2.30+         | `git --version`    | [git-scm.com](https://git-scm.com/)   |
| **Docker** (opcional) | 24.0+         | `docker --version` | [docker.com](https://www.docker.com/) |

> **Nota:** Docker e opcional. Em ambiente de desenvolvimento, o projeto usa **SQLite** como banco de dados, entao nao e necessario subir um PostgreSQL. Docker e necessario apenas se voce quiser usar PostgreSQL localmente.

---

## 2. Clone do Repositorio

```bash
git clone <url-do-repositorio> raji-finance
cd raji-finance
```

---

## 3. Instalacao de Dependencias

O projeto utiliza **npm workspaces** com **Turborepo**. Um unico `npm install` na raiz instala todas as dependencias dos workspaces (`apps/api`, `apps/web`, `packages/shared`).

```bash
npm install
```

Isso instalara:

- Dependencias do monorepo raiz (Turborepo, ESLint, Prettier, Husky, etc.)
- Dependencias do backend (`apps/api` - NestJS, Prisma, JWT, bcrypt, etc.)
- Dependencias do frontend (`apps/web` - Vue.js, Quasar, Pinia, Axios, etc.)
- Dependencias do pacote compartilhado (`packages/shared`)

---

## 4. Configuracao de Variaveis de Ambiente

Copie o arquivo de exemplo de variaveis de ambiente e ajuste conforme necessario:

```bash
cp .env.example .env
```

Variaveis essenciais para desenvolvimento:

```bash
# App
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:9000

# Database (SQLite para desenvolvimento)
DATABASE_URL="file:./dev.db"

# JWT (use valores aleatorios em dev — NUNCA compartilhe em producao)
JWT_SECRET=minha-chave-secreta-dev-12345
JWT_REFRESH_SECRET=outra-chave-secreta-dev-67890
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Stripe (modo teste - obtenha as chaves em https://dashboard.stripe.com/test)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

> **Importante:** Nunca commite o arquivo `.env`. Ele ja esta no `.gitignore`.

---

## 5. Configuracao do Banco de Dados (Prisma)

### 5.1. Rodar Migrations

Cria o banco de dados SQLite e aplica todas as tabelas do schema:

```bash
cd apps/api
npx prisma migrate dev
```

Na primeira execucao, isso criara o arquivo `apps/api/prisma/dev.db` com todas as 20+ tabelas do schema.

### 5.2. Rodar Seed (Dados Iniciais)

Popula o banco com dados essenciais:

```bash
npx prisma db seed
```

O seed cria:

- Todas as **permissoes** do sistema (tabela global `Permission`)
- Funcoes auxiliares para gerar grupos padrao e categorias padrao por familia

### 5.3. Visualizar o Banco (Opcional)

O Prisma Studio permite navegar visualmente pelas tabelas:

```bash
npx prisma studio
```

Acesse em `http://localhost:5555`.

> **Volte para a raiz do projeto** apos os comandos do Prisma:
>
> ```bash
> cd ../..
> ```

---

## 6. Subir o Backend (API)

### Opcao A: Via Turborepo (recomendado)

Na raiz do projeto:

```bash
npm run dev
```

Isso sobe **API e Frontend simultaneamente** via Turborepo.

### Opcao B: Apenas o Backend

```bash
cd apps/api
npm run start:dev
```

A API estara disponivel em `http://localhost:3000`.

Endpoints de verificacao:

- Health: `GET http://localhost:3000/api/v1`
- Swagger: `http://localhost:3000/api/docs`

---

## 7. Subir o Frontend (Web)

### Opcao A: Via Turborepo

Ja sobe junto com `npm run dev` na raiz (Passo 6, Opcao A).

### Opcao B: Apenas o Frontend

```bash
cd apps/web
npm run dev
```

O frontend estara disponivel em `http://localhost:9000`.

---

## 8. Acessar Swagger (Documentacao da API)

Com o backend rodando, acesse:

```
http://localhost:3000/api/docs
```

O Swagger UI permite:

- Visualizar todos os endpoints disponiveis
- Testar requests diretamente no navegador
- Ver schemas de request/response
- Autenticar-se com Bearer Token (clique em "Authorize")

---

## 9. Rodar Testes

### Todos os testes (via Turborepo)

```bash
npm run test
```

### Testes do backend apenas

```bash
cd apps/api
npm run test           # Testes unitarios
npm run test:e2e       # Testes de integracao (E2E)
npm run test:cov       # Cobertura de testes
```

### Testes do frontend apenas

```bash
cd apps/web
npm run test           # Testes unitarios (Vitest)
```

### Lint e Formatacao

```bash
# Lint de todo o projeto
npm run lint

# Formatacao de todo o projeto
npm run format

# Verificar formatacao sem corrigir
npm run format:check
```

---

## 10. Padrao de Commits

O projeto usa **commitlint** com padrao de commits com emoji. O Husky intercepta cada commit e valida a mensagem.

### Formato

```
<emoji> <Tipo>: <descricao>
```

### Exemplos

```bash
git commit -m "✨ Feat: adicionar endpoint de registro"
git commit -m "🐛 Fix: corrigir validacao de email no login"
git commit -m "♻️ Refactor: extrair logica de token para helper"
git commit -m "📝 Docs: atualizar referencia da API"
git commit -m "✅ Test: adicionar testes do auth.service"
git commit -m "🔧 Chore: atualizar dependencias do projeto"
```

### Emojis Comuns

| Emoji | Tipo     | Quando usar             |
| ----- | -------- | ----------------------- |
| ✨    | Feat     | Nova funcionalidade     |
| 🐛    | Fix      | Correcao de bug         |
| ♻️    | Refactor | Refatoracao de codigo   |
| 📝    | Docs     | Documentacao            |
| ✅    | Test     | Testes                  |
| 🔧    | Chore    | Tarefas de manutencao   |
| 🎨    | Style    | Formatacao, estilo      |
| ⚡    | Perf     | Melhoria de performance |
| 🔒    | Security | Correcao de seguranca   |

> **Nota:** O header maximo e de 120 caracteres.

---

## 11. Estrategia de Branches

O projeto segue o modelo **Git Flow** simplificado:

```mermaid
gitgraph
    commit id: "initial"
    branch develop
    checkout develop
    commit id: "setup"
    branch feature/auth
    checkout feature/auth
    commit id: "auth-module"
    commit id: "auth-tests"
    checkout develop
    merge feature/auth
    branch release/1.0.0
    checkout release/1.0.0
    commit id: "version-bump"
    checkout main
    merge release/1.0.0 tag: "v1.0.0"
```

### Branches

| Branch      | Proposito                 | Protegida            |
| ----------- | ------------------------- | -------------------- |
| `main`      | Codigo de producao        | Sim (PR obrigatorio) |
| `develop`   | Codigo de desenvolvimento | Sim (PR obrigatorio) |
| `feature/*` | Novas funcionalidades     | Nao                  |
| `fix/*`     | Correcoes de bug          | Nao                  |
| `release/*` | Preparacao de release     | Nao                  |

### Fluxo de Trabalho

1. Crie uma branch a partir de `develop`:

   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/minha-feature
   ```

2. Desenvolva e faca commits:

   ```bash
   git add .
   git commit -m "✨ Feat: descricao da feature"
   ```

3. Abra um Pull Request para `develop`:

   ```bash
   git push origin feature/minha-feature
   # Abra o PR no GitHub
   ```

4. Apos aprovacao, faca merge para `develop`.

---

## 12. Estrutura do Projeto

```
raji-finance/
├── apps/
│   ├── api/                  # Backend NestJS
│   │   ├── prisma/           # Schema, migrations, seed
│   │   ├── src/
│   │   │   ├── main.ts       # Bootstrap da aplicacao
│   │   │   ├── app.module.ts # Modulo raiz
│   │   │   └── modules/      # Modulos de dominio
│   │   │       ├── auth/     # Autenticacao (JWT)
│   │   │       ├── users/    # Gestao de usuarios
│   │   │       ├── families/ # Gestao de familias (tenant)
│   │   │       ├── rbac/     # Grupos e permissoes
│   │   │       ├── tenant/   # Isolamento multi-tenant
│   │   │       └── common/   # Utilidades (filters, interceptors, decorators)
│   │   └── test/             # Testes
│   │
│   └── web/                  # Frontend Vue.js + Quasar
│       └── src/
│           ├── pages/        # Paginas da aplicacao
│           ├── stores/       # Pinia stores
│           ├── services/     # Camada de API
│           ├── composables/  # Composition API hooks
│           ├── components/   # Componentes reutilizaveis
│           └── layouts/      # Layouts (MainLayout, AuthLayout)
│
├── packages/
│   └── shared/               # Tipos, enums, constantes compartilhados
│
├── docs/                     # Documentacao do projeto
├── turbo.json                # Configuracao do Turborepo
├── package.json              # Workspace root
└── commitlint.config.js      # Padrao de commits
```

---

## 13. Comandos Uteis (Referencia Rapida)

| Comando                                 | Descricao                           |
| --------------------------------------- | ----------------------------------- |
| `npm run dev`                           | Sobe API + Frontend simultaneamente |
| `npm run build`                         | Build de todos os workspaces        |
| `npm run lint`                          | Lint de todo o projeto              |
| `npm run test`                          | Roda todos os testes                |
| `npm run format`                        | Formata todo o codigo               |
| `cd apps/api && npx prisma migrate dev` | Rodar migrations                    |
| `cd apps/api && npx prisma db seed`     | Rodar seed                          |
| `cd apps/api && npx prisma studio`      | Abrir Prisma Studio                 |
| `cd apps/api && npx prisma generate`    | Regenerar Prisma Client             |

---

## 14. Troubleshooting

### `npm install` falha com erro de permissao

```bash
# No Windows, execute o terminal como Administrador
# No Linux/Mac:
sudo npm install
```

### Prisma `migrate dev` falha

```bash
# Deletar o banco e recriar:
cd apps/api
rm -f prisma/dev.db
npx prisma migrate dev
npx prisma db seed
```

### Porta 3000 ja esta em uso

```bash
# Altere a porta no .env:
PORT=3001
```

### Erro de CORS no frontend

Verifique se a variavel `CORS_ORIGIN` no `.env` aponta para a URL do frontend:

```bash
CORS_ORIGIN=http://localhost:9000
```

### Husky nao esta executando hooks

```bash
npx husky install
```

---

_Documentacao gerada por Tatiana Texto — Technical Writer da Raji_  
_Sprint 1 | 2026-04-04_
