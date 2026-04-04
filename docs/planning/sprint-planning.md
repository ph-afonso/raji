# Raji Finance - Sprint Planning

> **Scrum Master:** Samuel Sprint  
> **Data:** 2026-04-04  
> **Versao:** 1.0.0  
> **Metodologia:** Scrum adaptado (sprints de 2 semanas)

---

## Visao Geral

| Sprint       | Foco                          | Entregaveis                                       | Duracao   |
| ------------ | ----------------------------- | ------------------------------------------------- | --------- |
| **Sprint 0** | Setup & Fundacao              | Monorepo, CI/CD, Prisma, Docker, Linting          | 1 semana  |
| **Sprint 1** | Auth + RBAC (Caminho Critico) | Login, Registro, RBAC 4 camadas, Tenant isolation | 2 semanas |
| **Sprint 2** | Core Financeiro               | Contas, Categorias, Transacoes (CRUD completo)    | 2 semanas |
| **Sprint 3** | Features Financeiras          | Recorrencias, Orcamentos, Metas de economia       | 2 semanas |
| **Sprint 4** | Monetizacao                   | Billing (Stripe/Pix), Convites, Paywall           | 2 semanas |
| **Sprint 5** | Dashboard & Notificacoes      | Graficos (ApexCharts), Push PWA, Resumos          | 2 semanas |
| **Sprint 6** | Importacao, Polish & Release  | CSV/OFX, Testes E2E, Security, Deploy prod        | 2 semanas |

**Total estimado:** 13 semanas (~3 meses)

### Definition of Done (DoD) Global

Toda task so e considerada "Done" quando:

- [ ] Codigo escrito com TypeScript strict (sem `any`)
- [ ] Testes unitarios passando (cobertura minima 80% por modulo)
- [ ] Testes de integracao para endpoints de API
- [ ] Lint + Prettier sem erros
- [ ] Build sem erros (`turbo build`)
- [ ] PR revisada por pelo menos 1 par
- [ ] Documentacao atualizada (JSDoc para services, Swagger para endpoints)
- [ ] Isolamento multi-tenant validado (testes com 2+ families)
- [ ] Sem segredos hardcoded no codigo

---

## Sprint 0 - Setup & Fundacao

**Objetivo:** Criar toda a infraestrutura de desenvolvimento para que o time possa comecar a codar no Sprint 1 sem fricao.

**Duracao:** 1 semana
**Status:** ✅ COMPLETA (04/04/2026)

### Tasks

| ID     | Titulo                          | Responsavel   | Prioridade | Status | Notas                                                |
| ------ | ------------------------------- | ------------- | ---------- | ------ | ---------------------------------------------------- |
| S0-I01 | Setup do monorepo Turborepo     | Igor Infra    | P0         | ✅     | package.json + turbo.json                            |
| S0-I02 | Setup NestJS (apps/api)         | Igor Infra    | P0         | ✅     | main.ts + Swagger + app.module                       |
| S0-I03 | Setup Vue/Quasar (apps/web)     | Igor Infra    | P0         | ✅     | PWA + Dark Mode configurados                         |
| S0-I04 | Setup pacote shared             | Igor Infra    | P0         | ✅     | @raji/shared com tsup build                          |
| S0-B01 | Setup Prisma + Schema           | Bruno Backend | P0         | ✅     | 20 models, SQLite (sem enums)                        |
| S0-B02 | Seed de dados iniciais          | Bruno Backend | P0         | ✅     | 54 permissoes + grupos + categorias                  |
| S0-B03 | Setup modulo Common             | Bruno Backend | P1         | ✅     | Filters, interceptors, pipes, decorators             |
| S0-I05 | Docker Compose                  | Igor Infra    | P0         | ✅     | PostgreSQL 16 + .env.example                         |
| S0-I06 | CI/CD GitHub Actions            | Igor Infra    | P0         | ✅     | lint, build, test (corrigido cache+lockfile)         |
| S0-I07 | Linting e formatacao            | Igor Infra    | P1         | ✅     | ESLint flat + Prettier + Husky + commitlint          |
| S0-I08 | Configuracao de branch strategy | Igor Infra    | P1         | ✅     | main + develop no GitHub                             |
| S0-D01 | Design System base              | Diana Design  | P1         | ✅     | variables.scss (274 linhas de tokens)                |
| S0-T01 | Template de documentacao        | Tatiana Texto | P2         | ✅     | Swagger configurado + docs/README.md com metodologia |

### Agentes Acionados — Sprint 0

| Agente           | Papel            | Status                                 |
| ---------------- | ---------------- | -------------------------------------- |
| Igor Infra 🚀    | DevOps           | ✅ 8 tasks                             |
| Bruno Backend ⚙️ | Backend Dev      | ✅ 3 tasks                             |
| Diana Design ✏️  | UX/UI            | ✅ 1 task (Design System)              |
| Tatiana Texto 📚 | Technical Writer | ✅ 1 task (Swagger + docs methodology) |

### Criterios de Aceite da Sprint 0

- [x] `npm install` na raiz instala tudo (workspaces)
- [x] `turbo dev` sobe API (porta 3000) e Web (porta 9000) simultaneamente
- [x] `turbo build` compila sem erros (3/3 green)
- [x] `turbo lint` passa limpo (0 errors)
- [x] `prisma migrate dev` cria o banco SQLite com todas as tabelas
- [x] `prisma db seed` popula permissoes e dados iniciais (54 permissoes)
- [x] CI roda lint + build no GitHub Actions
- [x] Commit com formato errado e bloqueado pelo commitlint

---

## Sprint 1 - Auth + RBAC (Caminho Critico)

**Objetivo:** Implementar o sistema de autenticacao, multi-tenancy e RBAC completo. Este e o caminho critico porque TODOS os modulos seguintes dependem de auth + tenant + rbac.

**Duracao:** 2 semanas
**Status:** ✅ COMPLETA (04/04/2026)

> **Nota de paralelismo:** Backend e Frontend trabalharam em paralelo. Diana nao foi acionada para wireframes — devs implementaram direto com base no briefing.

### UX Tasks (Diana)

| ID     | Titulo                         | Responsavel  | Prioridade | Status    | Notas                     |
| ------ | ------------------------------ | ------------ | ---------- | --------- | ------------------------- |
| S1-D01 | Wireframe tela de Login        | Diana Design | P0         | ⏭️ Pulada | Devs implementaram direto |
| S1-D02 | Wireframe tela de Registro     | Diana Design | P0         | ⏭️ Pulada | Devs implementaram direto |
| S1-D03 | Wireframe MainLayout + Sidebar | Diana Design | P0         | ⏭️ Pulada | Devs implementaram direto |
| S1-D04 | Wireframe Matriz de Permissoes | Diana Design | P1         | ⏭️ Pulada | Devs implementaram direto |

### Backend Tasks (Bruno)

| ID     | Titulo                            | Responsavel   | Prioridade | Status | Notas                                                   |
| ------ | --------------------------------- | ------------- | ---------- | ------ | ------------------------------------------------------- |
| S1-B01 | Modulo Tenant                     | Bruno Backend | P0         | ✅     | Interceptor + Service + Module global                   |
| S1-B02 | Decorators comuns                 | Bruno Backend | P0         | ✅     | @CurrentUser + @CurrentFamily                           |
| S1-B03 | Modulo Users                      | Bruno Backend | P0         | ✅     | GET/PATCH /users/me, GET /users/:id                     |
| S1-B04 | Modulo Families                   | Bruno Backend | P0         | ✅     | CRUD + seed grupos/categorias. IDOR corrigido (SEC-002) |
| S1-B05 | Modulo RBAC - Service             | Bruno Backend | P0         | ✅     | userHasPermission + seedDefaultGroups                   |
| S1-B06 | Modulo RBAC - Guard + Decorator   | Bruno Backend | P0         | ✅     | @CheckPermission em 5+ endpoints                        |
| S1-B07 | Modulo RBAC - Controller          | Bruno Backend | P1         | ✅     | CRUD grupos + permissoes                                |
| S1-B08 | Modulo Auth - JWT Strategy        | Bruno Backend | P0         | ✅     | JWT + Refresh + @Public()                               |
| S1-B09 | Modulo Auth - Service             | Bruno Backend | P0         | ✅     | register (10 steps), login, refresh, logout             |
| S1-B10 | Modulo Auth - Controller          | Bruno Backend | P0         | ✅     | 4 endpoints. Secrets hardcoded removidos (SEC-001)      |
| S1-B11 | Modulo Auth - Refresh Token (DB)  | Bruno Backend | P0         | ✅     | Hash bcrypt + rotacao + revogacao                       |
| S1-B12 | Testes unitarios - Auth           | Bruno Backend | P1         | ✅     | auth.service.spec.ts (env vars corrigidas)              |
| S1-B13 | Testes unitarios - RBAC           | Bruno Backend | P1         | ✅     | rbac.service.spec.ts                                    |
| S1-B14 | Testes integracao - Auth + Tenant | Bruno Backend | P1         | ✅     | auth.e2e-spec.ts (multi-tenant)                         |

### Frontend Tasks (Felipe)

| ID     | Titulo                        | Responsavel     | Prioridade | Status | Notas                                  |
| ------ | ----------------------------- | --------------- | ---------- | ------ | -------------------------------------- |
| S1-F01 | Service de API + Axios config | Felipe Frontend | P0         | ✅     | Interceptors JWT + refresh + paywall   |
| S1-F02 | Auth Store (Pinia)            | Felipe Frontend | P0         | ✅     | login, register, logout + localStorage |
| S1-F03 | Auth Service                  | Felipe Frontend | P0         | ✅     | 4 metodos REST                         |
| S1-F04 | Tela de Login                 | Felipe Frontend | P0         | ✅     | QForm + validacao + loading            |
| S1-F05 | Tela de Registro              | Felipe Frontend | P0         | ✅     | 5 campos + validacoes                  |
| S1-F06 | AuthLayout                    | Felipe Frontend | P0         | ✅     | Centralizado + dark mode               |
| S1-F07 | MainLayout + Sidebar          | Felipe Frontend | P0         | ✅     | 10 items filtrados por RBAC            |
| S1-F08 | Router + Auth Guard           | Felipe Frontend | P0         | ✅     | meta.permission + redirect             |
| S1-F09 | RBAC Store + Composable       | Felipe Frontend | P0         | ✅     | hasPermission + canAccess              |
| S1-F10 | Diretiva v-perm               | Felipe Frontend | P0         | ✅     | hide + disable modes                   |
| S1-F11 | Permission Guard (Router)     | Felipe Frontend | P0         | ✅     | + Subscription Guard placeholder       |
| S1-F12 | Tela Grupos RBAC              | Felipe Frontend | P1         | ✅     | QTable + QDialog CRUD                  |
| S1-F13 | Tela Matriz de Permissoes     | Felipe Frontend | P1         | ✅     | Checkbox matrix                        |
| S1-F14 | Boot de auth (inicializacao)  | Felipe Frontend | P0         | ✅     | Load tokens + auto-refresh             |
| S1-F15 | Pagina 404 + Forbidden        | Felipe Frontend | P2         | ✅     | 404, 403, Paywall                      |

### QA Tasks (Quiteria)

| ID     | Titulo                                 | Responsavel | Prioridade | Status | Notas                                                             |
| ------ | -------------------------------------- | ----------- | ---------- | ------ | ----------------------------------------------------------------- |
| S1-Q01 | Testes unitarios Frontend - Auth Store | Quiteria QA | P1         | ✅     | 12 testes (Vitest + Pinia)                                        |
| S1-Q02 | Testes unitarios Frontend - RBAC       | Quiteria QA | P1         | ✅     | 16 testes (store + composable + v-perm + guards)                  |
| S1-Q03 | Testes E2E - Fluxo de Registro         | Quiteria QA | P1         | ⚠️     | Convertido em teste unitario do service (E2E Playwright pendente) |
| S1-Q04 | Testes E2E - Fluxo de Login/Logout     | Quiteria QA | P1         | ⚠️     | Convertido em teste unitario do service (E2E Playwright pendente) |
| S1-Q05 | Testes E2E - Isolamento Tenant         | Quiteria QA | P0         | ✅     | Testado manualmente via API (curl) + auth.e2e-spec.ts no backend  |

### Pipeline Pos-Dev (Steps 6-10 do squad.yaml)

| Step | Agente              | Papel            | Status | Entrega                                                   |
| ---- | ------------------- | ---------------- | ------ | --------------------------------------------------------- |
| 6    | Quiteria QA 🧪      | QA Engineer      | ✅     | 41 testes frontend (Vitest)                               |
| 7    | Leandro Lockdown 🔒 | DevSecOps        | ✅     | Auditoria OWASP + 3 correcoes (SEC-001, SEC-002, SEC-006) |
| 8    | Tatiana Texto 📚    | Technical Writer | ✅     | api-reference.md, getting-started.md, docs reorganizados  |
| 9    | Renato Release 🎁   | Release Manager  | ✅     | CHANGELOG.md, release-notes v0.1.0, tag v0.1.0            |
| 10   | Igor Infra 🚀       | DevOps           | ✅     | Branches sincronizadas, tag pushada, CI green             |

### Agentes Acionados — Sprint 1

| Agente              | Papel            | Tasks                                    | Status                                      |
| ------------------- | ---------------- | ---------------------------------------- | ------------------------------------------- |
| Diana Design ✏️     | UX/UI            | S1-D01 a D04                             | ⏭️ Puladas (devs implementaram direto)      |
| Bruno Backend ⚙️    | Backend Dev      | S1-B01 a B14                             | ✅ 14/14                                    |
| Felipe Frontend 🎨  | Frontend Dev     | S1-F01 a F15                             | ✅ 15/15                                    |
| Quiteria QA 🧪      | QA Engineer      | S1-Q01 a Q05                             | ✅ 3/5 completas, 2 parciais (E2E pendente) |
| Leandro Lockdown 🔒 | DevSecOps        | Auditoria seguranca                      | ✅ 6 vulns encontradas, 3 corrigidas        |
| Tatiana Texto 📚    | Technical Writer | API docs, Getting Started, reorganizacao | ✅ 3 entregas                               |
| Renato Release 🎁   | Release Manager  | CHANGELOG, Release Notes, Tag            | ✅ v0.1.0                                   |
| Igor Infra 🚀       | DevOps           | Sync branches, CI fixes                  | ✅ CI green                                 |

### Criterios de Aceite da Sprint 1

- [x] Usuario pode se registrar (cria familia + user master + subscription trial)
- [x] Usuario pode fazer login e receber JWT
- [x] Token refresh funciona automaticamente (sem logout involuntario)
- [x] Logout revoga refresh token
- [x] Tenant Interceptor injeta familyId em todas as requests
- [x] RBAC guard bloqueia acoes sem permissao (backend)
- [x] Sidebar filtra itens por permissao (frontend)
- [x] Diretiva v-perm esconde/desabilita botoes corretamente
- [x] Navigation guard bloqueia acesso a telas sem permissao
- [x] 3 grupos padrao criados no registro (Master, Membro Full, Dependente)
- [x] Testes unitarios implementados (auth + rbac backend + 41 frontend)
- [x] Nenhum vazamento de dados entre tenants (testado via API)

---

## Sprint 2 - Core Financeiro

**Objetivo:** Implementar o nucleo financeiro: Contas, Categorias e Transacoes. Ao final desta sprint o usuario pode registrar movimentacoes financeiras completas.

**Duracao:** 2 semanas

> **Nota de paralelismo:** Backend (Contas -> Categorias -> Transacoes) e Frontend (Contas e Categorias em paralelo, depois Transacoes). Diana entrega wireframes na primeira metade da sprint.

### UX Tasks (Diana)

| ID     | Titulo               | Descricao                                                                                                                                                                                | Responsavel  | Prioridade | Deps |
| ------ | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ---------- | ---- |
| S2-D01 | Wireframe Contas     | Wireframe/spec para `AccountsListPage.vue` (cards com saldo, icone, cor, tipo) e `AccountDetailPage.vue` (extrato da conta). Fluxo de criar/editar conta (modal ou pagina).              | Diana Design | P0         | -    |
| S2-D02 | Wireframe Categorias | Wireframe/spec para `CategoriesPage.vue`: arvore hierarquica (categorias + subcategorias), icones, cores. CRUD inline ou modal.                                                          | Diana Design | P0         | -    |
| S2-D03 | Wireframe Transacoes | Wireframe/spec para `TransactionsListPage.vue` (lista com filtros: periodo, conta, categoria, tipo), `TransactionFormPage.vue` (formulario de lancamento com campos dinamicos por tipo). | Diana Design | P0         | -    |

### Backend Tasks (Bruno)

| ID     | Titulo                                  | Descricao                                                                                                                                                                                                                                                                                                                                                           | Responsavel   | Prioridade | Deps           |
| ------ | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ---------- | -------------- |
| S2-B01 | Modulo Accounts - Service               | Criar `modules/accounts/accounts.service.ts`: CRUD de contas filtrado por `familyId`. Metodos: `create()`, `findAll()`, `findOne()`, `update()`, `remove()` (soft delete via `isActive`). Validar: nome unico por familia, saldo inicial. **US:** Como usuario, quero cadastrar minhas contas bancarias para organizar meu dinheiro.                                | Bruno Backend | P0         | S1-B01         |
| S2-B02 | Modulo Accounts - Controller + DTOs     | Criar `modules/accounts/accounts.controller.ts`: CRUD completo (POST/GET/GET:id/PATCH/DELETE /accounts). DTOs: `create-account.dto.ts` (name, type, initialBalance, currency, color, icon, creditLimit?, closingDay?, dueDay?), `update-account.dto.ts`. Decorar com `@CheckPermission('accounts', 'create/read/update/delete')`.                                   | Bruno Backend | P0         | S2-B01, S1-B06 |
| S2-B03 | Modulo Categories - Service             | Criar `modules/categories/categories.service.ts`: CRUD de categorias e subcategorias. Metodos: `createCategory()`, `createSubcategory()`, `findAll()` (com subcategorias aninhadas), `update()`, `remove()`. Proteger categorias de sistema (`isSystem`). **US:** Como usuario, quero organizar meus gastos em categorias para entender para onde vai meu dinheiro. | Bruno Backend | P0         | S1-B01         |
| S2-B04 | Modulo Categories - Controller + DTOs   | Criar `modules/categories/categories.controller.ts`: POST/GET/PATCH/DELETE /categories, POST/GET/PATCH/DELETE /categories/:id/subcategories. DTOs: `create-category.dto.ts` (name, type, icon?, color?), `create-subcategory.dto.ts` (name, icon?). Guards de permissao.                                                                                            | Bruno Backend | P0         | S2-B03, S1-B06 |
| S2-B05 | Modulo Transactions - Service           | Criar `modules/transactions/transactions.service.ts`: CRUD completo. Na criacao de transacao: atualizar saldo da conta (`account.balance`). Para TRANSFER: debitar origem, creditar destino. Filtros: periodo, conta, categoria, tipo, texto. Paginacao. **US:** Como usuario, quero registrar minhas receitas e despesas para ter controle financeiro.             | Bruno Backend | P0         | S2-B01, S2-B03 |
| S2-B06 | Modulo Transactions - Controller + DTOs | Criar `modules/transactions/transactions.controller.ts`: POST/GET/GET:id/PATCH/DELETE /transactions. DTOs: `create-transaction.dto.ts` (type, amount, description?, date, accountId, transferToAccountId?, categoryId?, subcategoryId?), `update-transaction.dto.ts`. Query params para filtros e paginacao. Guards de permissao.                                   | Bruno Backend | P0         | S2-B05, S1-B06 |
| S2-B07 | Logica de saldo de conta                | Implementar logica transacional de atualizacao de saldo em `transactions.service.ts`: ao criar transacao INCOME soma no saldo, EXPENSE subtrai, TRANSFER subtrai da origem e soma no destino. Ao editar/excluir: reverter e reaplicar. Usar `prisma.$transaction()` para atomicidade.                                                                               | Bruno Backend | P0         | S2-B05         |
| S2-B08 | Testes unitarios - Accounts             | Testes para `accounts.service.ts`: criar conta (happy path, nome duplicado), listar (apenas do tenant), atualizar, soft delete, validacao de tipo.                                                                                                                                                                                                                  | Bruno Backend | P1         | S2-B01         |
| S2-B09 | Testes unitarios - Categories           | Testes para `categories.service.ts`: criar categoria/subcategoria, listar com hierarquia, protecao de categorias sistema, deletar com subcategorias.                                                                                                                                                                                                                | Bruno Backend | P1         | S2-B03         |
| S2-B10 | Testes unitarios - Transactions         | Testes para `transactions.service.ts`: criar (INCOME/EXPENSE/TRANSFER), validar atualizacao de saldo, filtros, paginacao, edicao (reverter saldo), exclusao (reverter saldo). Isolamento de tenant.                                                                                                                                                                 | Bruno Backend | P1         | S2-B05         |
| S2-B11 | Testes integracao - Core financeiro     | Testes E2E de API: criar conta -> criar categoria -> criar transacao -> verificar saldo atualizado -> listar transacoes com filtros -> editar transacao -> verificar saldo corrigido.                                                                                                                                                                               | Bruno Backend | P1         | S2-B06         |

### Frontend Tasks (Felipe)

| ID     | Titulo                        | Descricao                                                                                                                                                                                                                                                                                                                                                            | Responsavel     | Prioridade | Deps                   |
| ------ | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | ---------- | ---------------------- |
| S2-F01 | Accounts Store + Service      | Criar `stores/accounts.store.ts` (state: accounts[], actions: load, create, update, delete) e `services/accounts.service.ts` (chamadas REST).                                                                                                                                                                                                                        | Felipe Frontend | P0         | S1-F01                 |
| S2-F02 | Tela Lista de Contas          | Criar `pages/accounts/AccountsListPage.vue`: cards com nome, tipo, saldo formatado (BRL), icone, cor. Botao "Nova Conta" (v-perm). Resumo de saldo total no topo. **US:** Como usuario, quero ver todas as minhas contas e seus saldos de forma rapida.                                                                                                              | Felipe Frontend | P0         | S2-F01, S2-D01         |
| S2-F03 | Tela Detalhe de Conta         | Criar `pages/accounts/AccountDetailPage.vue`: info da conta no topo, lista de transacoes vinculadas (mini-extrato), botoes editar/excluir (v-perm).                                                                                                                                                                                                                  | Felipe Frontend | P1         | S2-F02                 |
| S2-F04 | Formulario Criar/Editar Conta | Dialog/modal Quasar (QDialog) para criar e editar conta. Campos: nome, tipo (select), saldo inicial (CurrencyInput), cor (QColor), icone. Campos extras para cartao de credito (limite, fechamento, vencimento).                                                                                                                                                     | Felipe Frontend | P0         | S2-F02                 |
| S2-F05 | Componente CurrencyInput      | Criar `components/common/CurrencyInput.vue`: input monetario com mascara BRL (R$ 1.234,56). v-model com valor numerico.                                                                                                                                                                                                                                              | Felipe Frontend | P0         | -                      |
| S2-F06 | Categories Store + Service    | Criar `stores/categories.store.ts` (state: categories[] com subcategories aninhadas) e `services/categories.service.ts`.                                                                                                                                                                                                                                             | Felipe Frontend | P0         | S1-F01                 |
| S2-F07 | Tela Categorias               | Criar `pages/categories/CategoriesPage.vue`: arvore expandivel (QTree ou lista com expand) mostrando categorias e subcategorias. Icone e cor de cada. Filtro por tipo (Receita/Despesa). Botoes CRUD (v-perm). **US:** Como usuario, quero organizar categorias de receita e despesa para classificar meus lancamentos.                                              | Felipe Frontend | P0         | S2-F06, S2-D02         |
| S2-F08 | Transactions Store + Service  | Criar `stores/transactions.store.ts` (state: transactions[], filters, pagination) e `services/transactions.service.ts`.                                                                                                                                                                                                                                              | Felipe Frontend | P0         | S1-F01                 |
| S2-F09 | Tela Lista de Transacoes      | Criar `pages/transactions/TransactionsListPage.vue`: tabela/lista com filtros (QSelect de periodo, conta, categoria, tipo), busca por texto, paginacao. Colunas: data, descricao, categoria, conta, valor (verde/vermelho), acoes. **US:** Como usuario, quero ver meus lancamentos filtrados para encontrar movimentacoes especificas.                              | Felipe Frontend | P0         | S2-F08, S2-D03         |
| S2-F10 | Formulario de Transacao       | Criar `pages/transactions/TransactionFormPage.vue` (ou QDialog): tipo (tabs: Receita/Despesa/Transferencia), valor (CurrencyInput), descricao, data (QDate), conta (select), conta destino (se transferencia), categoria (select), subcategoria (select dependente). Validacoes. **US:** Como usuario, quero lancar receitas e despesas de forma rapida e intuitiva. | Felipe Frontend | P0         | S2-F05, S2-F01, S2-F06 |
| S2-F11 | Componente TransactionFilters | Criar `components/transactions/TransactionFilters.vue`: filtros reutilizaveis (periodo, conta, categoria, tipo, busca). Emite eventos para a pagina pai.                                                                                                                                                                                                             | Felipe Frontend | P1         | S2-F09                 |
| S2-F12 | Composable useCurrency        | Criar `composables/useCurrency.ts`: `formatBRL(value)`, `parseBRL(string)`. Usar `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`.                                                                                                                                                                                                               | Felipe Frontend | P0         | -                      |
| S2-F13 | Composable usePagination      | Criar `composables/usePagination.ts`: logica reutilizavel de paginacao (page, perPage, total, totalPages, nextPage, prevPage).                                                                                                                                                                                                                                       | Felipe Frontend | P1         | -                      |

### QA Tasks (Quiteria)

| ID     | Titulo                                   | Descricao                                                                                                                                                                         | Responsavel | Prioridade | Deps           |
| ------ | ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ---------- | -------------- |
| S2-Q01 | Testes unitarios Frontend - Accounts     | Testar accounts store: CRUD operations, formatacao de saldo, loading states.                                                                                                      | Quiteria QA | P1         | S2-F01         |
| S2-Q02 | Testes unitarios Frontend - Transactions | Testar transactions store: criar transacao atualiza lista, filtros funcionam, paginacao.                                                                                          | Quiteria QA | P1         | S2-F08         |
| S2-Q03 | Testes E2E - Fluxo Financeiro            | Teste E2E completo: login -> criar conta -> criar categoria -> criar transacao -> verificar saldo atualizado na lista de contas -> editar transacao -> verificar saldo corrigido. | Quiteria QA | P0         | S2-B06, S2-F10 |
| S2-Q04 | Testes E2E - RBAC no financeiro          | Teste E2E: logar como Dependente -> verificar que botoes de criar/editar/excluir nao aparecem -> tentar acessar via URL direta -> verificar bloqueio.                             | Quiteria QA | P1         | S2-F09         |

### Criterios de Aceite da Sprint 2

- [ ] CRUD completo de Contas (6 tipos: checking, savings, wallet, credit_card, investment, other)
- [ ] CRUD completo de Categorias + Subcategorias (hierarquia funcional)
- [ ] Categorias padrao criadas automaticamente com a familia
- [ ] CRUD completo de Transacoes (receita, despesa, transferencia)
- [ ] Saldo da conta atualizado automaticamente ao criar/editar/excluir transacao
- [ ] Transferencia debita origem e credita destino atomicamente
- [ ] Filtros funcionais: periodo, conta, categoria, tipo, busca por texto
- [ ] Paginacao funcional nas listagens
- [ ] RBAC aplicado em todas as telas e endpoints
- [ ] CurrencyInput formata corretamente em BRL

---

## Sprint 3 - Features Financeiras

**Objetivo:** Implementar Recorrencias (lancamentos automaticos), Orcamentos por categoria e Metas de economia. Ao final desta sprint a familia tem ferramentas de planejamento financeiro.

**Duracao:** 2 semanas

> **Nota de paralelismo:** Os 3 modulos (Recurring, Budgets, Savings Goals) sao independentes entre si. Backend e Frontend podem trabalhar nos 3 em paralelo se houver capacidade.

### UX Tasks (Diana)

| ID     | Titulo                 | Descricao                                                                                                                                               | Responsavel  | Prioridade | Deps |
| ------ | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ---------- | ---- |
| S3-D01 | Wireframe Recorrencias | Wireframe/spec para `RecurringListPage.vue`: lista com status (ativa/pausada), proxima data, frequencia, valor. Modal de criar/editar.                  | Diana Design | P0         | -    |
| S3-D02 | Wireframe Orcamentos   | Wireframe/spec para `BudgetsListPage.vue` (cards com barra de progresso por categoria) e `BudgetDetailPage.vue` (detalhamento de gastos vs limite).     | Diana Design | P0         | -    |
| S3-D03 | Wireframe Metas        | Wireframe/spec para `GoalsListPage.vue` (cards com barra de progresso, valor atual/alvo) e `GoalDetailPage.vue` (historico de contribuicoes, projecao). | Diana Design | P0         | -    |

### Backend Tasks (Bruno)

| ID     | Titulo                                   | Descricao                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Responsavel   | Prioridade | Deps           |
| ------ | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ---------- | -------------- |
| S3-B01 | Modulo Recurring - Service               | Criar `modules/recurring/recurring.service.ts`: CRUD de transacoes recorrentes. Metodos: `create()`, `findAll()`, `update()`, `pause()`, `resume()`, `cancel()`. Validar: startDate, frequency, totalInstallments. **US:** Como usuario, quero cadastrar contas fixas (aluguel, assinatura) para que sejam lancadas automaticamente.                                                                                                                       | Bruno Backend | P0         | S2-B05         |
| S3-B02 | Modulo Recurring - Scheduler             | Criar `modules/recurring/recurring.scheduler.ts`: cron job (NestJS `@Cron()`) que roda diariamente. Busca recorrencias com `nextDueDate <= hoje` e `status = ACTIVE`. Para cada: cria Transaction, incrementa `completedInstallments`, calcula proximo `nextDueDate`. Se atingiu `totalInstallments`, marca como `FINISHED`. **US:** Como sistema, quero gerar lancamentos automaticamente para que o usuario nao precise lancar manualmente contas fixas. | Bruno Backend | P0         | S3-B01         |
| S3-B03 | Modulo Recurring - Controller + DTOs     | Criar `modules/recurring/recurring.controller.ts`: CRUD + PATCH /recurring/:id/pause, PATCH /recurring/:id/resume. DTO: `create-recurring.dto.ts` (type, amount, description, frequency, startDate, endDate?, totalInstallments?, accountId, categoryId?, subcategoryId?). Guards.                                                                                                                                                                         | Bruno Backend | P0         | S3-B01, S1-B06 |
| S3-B04 | Modulo Budgets - Service                 | Criar `modules/budgets/budgets.service.ts`: CRUD de orcamentos. Metodo `getProgress(budgetId)`: calcula total gasto na categoria naquele mes/ano vs limite. Retorna `{ spent, limit, percentage, isOverBudget }`. **US:** Como usuario, quero definir limites de gastos por categoria para nao estourar meu orcamento mensal.                                                                                                                              | Bruno Backend | P0         | S2-B05, S2-B03 |
| S3-B05 | Modulo Budgets - Controller + DTOs       | Criar `modules/budgets/budgets.controller.ts`: CRUD + GET /budgets/:id/progress. DTO: `create-budget.dto.ts` (categoryId, amount, month, year, alertAt?). Validar unicidade (familyId + categoryId + month + year). Guards.                                                                                                                                                                                                                                | Bruno Backend | P0         | S3-B04, S1-B06 |
| S3-B06 | Modulo Budgets - Alerta                  | Logica de alerta em `budgets.service.ts`: ao criar transacao de despesa, verificar se ha orcamento para a categoria naquele mes. Se `percentage >= alertAt`, criar Notification (tipo BUDGET_ALERT) para todos os usuarios da familia com permissao `budgets:read`.                                                                                                                                                                                        | Bruno Backend | P1         | S3-B04         |
| S3-B07 | Modulo Savings Goals - Service           | Criar `modules/savings-goals/savings-goals.service.ts`: CRUD de metas. Metodos: `create()`, `findAll()`, `update()`, `addContribution(goalId, amount, date, note?)`, `removeContribution(contributionId)`. Ao adicionar contribuicao: atualizar `currentAmount`. Se `currentAmount >= targetAmount`: marcar `isCompleted = true`. **US:** Como usuario, quero criar metas de economia e registrar contribuicoes para acompanhar meu progresso.             | Bruno Backend | P0         | S1-B01         |
| S3-B08 | Modulo Savings Goals - Controller + DTOs | Criar `modules/savings-goals/savings-goals.controller.ts`: CRUD + POST /savings-goals/:id/contributions, DELETE /savings-goals/:id/contributions/:cid, GET /savings-goals/:id (com contribuicoes). DTO: `create-savings-goal.dto.ts` (name, description?, targetAmount, targetDate?, icon?, color?). Guards.                                                                                                                                               | Bruno Backend | P0         | S3-B07, S1-B06 |
| S3-B09 | Testes unitarios - Recurring             | Testes: criar recorrencia, scheduler gera transacao corretamente, calculo de proxima data por frequencia, finalizacao por parcelas, pause/resume.                                                                                                                                                                                                                                                                                                          | Bruno Backend | P1         | S3-B02         |
| S3-B10 | Testes unitarios - Budgets               | Testes: criar orcamento, calculo de progresso, unicidade por categoria/mes, alerta quando percentual excede threshold.                                                                                                                                                                                                                                                                                                                                     | Bruno Backend | P1         | S3-B04         |
| S3-B11 | Testes unitarios - Savings Goals         | Testes: criar meta, adicionar contribuicao atualiza currentAmount, meta completa automaticamente, remover contribuicao recalcula.                                                                                                                                                                                                                                                                                                                          | Bruno Backend | P1         | S3-B07         |

### Frontend Tasks (Felipe)

| ID     | Titulo                         | Descricao                                                                                                                                                                                                                                                                                                                                                              | Responsavel     | Prioridade | Deps           |
| ------ | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | ---------- | -------------- |
| S3-F01 | Recurring Store + Service      | Criar `stores/recurring.store.ts` e `services/recurring.service.ts` (conforme padrao).                                                                                                                                                                                                                                                                                 | Felipe Frontend | P0         | S1-F01         |
| S3-F02 | Tela Recorrencias              | Criar `pages/recurring/RecurringListPage.vue`: lista com colunas (descricao, valor, frequencia, proxima data, status badge). Acoes: pausar/retomar/cancelar/editar. Modal de criacao: tipo, valor, descricao, frequencia (select), data inicio, parcelas (opcional), conta, categoria. **US:** Como usuario, quero ver e gerenciar minhas contas fixas em um lugar so. | Felipe Frontend | P0         | S3-F01, S3-D01 |
| S3-F03 | Budgets Store + Service        | Criar `stores/budgets.store.ts` e `services/budgets.service.ts`.                                                                                                                                                                                                                                                                                                       | Felipe Frontend | P0         | S1-F01         |
| S3-F04 | Tela Lista de Orcamentos       | Criar `pages/budgets/BudgetsListPage.vue`: cards por categoria com QLinearProgress mostrando percentual gasto. Cor muda: verde (< 60%), amarelo (60-80%), vermelho (> 80%). Seletor de mes/ano. Botao "Novo Orcamento". **US:** Como usuario, quero visualizar rapidamente como estou em relacao aos meus limites de gastos.                                           | Felipe Frontend | P0         | S3-F03, S3-D02 |
| S3-F05 | Tela Detalhe Orcamento         | Criar `pages/budgets/BudgetDetailPage.vue`: barra de progresso grande, lista de transacoes da categoria naquele mes, comparativo limite vs gasto.                                                                                                                                                                                                                      | Felipe Frontend | P1         | S3-F04         |
| S3-F06 | Savings Goals Store + Service  | Criar `stores/savings-goals.store.ts` e `services/savings-goals.service.ts`.                                                                                                                                                                                                                                                                                           | Felipe Frontend | P0         | S1-F01         |
| S3-F07 | Tela Lista de Metas            | Criar `pages/savings-goals/GoalsListPage.vue`: cards com nome, barra de progresso circular (QCircularProgress), valor atual/alvo, data alvo. Botao "Nova Meta". **US:** Como usuario, quero ver todas as minhas metas e quanto falta para cada uma.                                                                                                                    | Felipe Frontend | P0         | S3-F06, S3-D03 |
| S3-F08 | Tela Detalhe Meta              | Criar `pages/savings-goals/GoalDetailPage.vue`: progresso visual, lista de contribuicoes (data, valor, nota), botao "Adicionar Contribuicao" (modal com valor + nota). Projecao: "No ritmo atual, voce atinge a meta em X meses". **US:** Como usuario, quero acompanhar o progresso detalhado de uma meta e adicionar contribuicoes.                                  | Felipe Frontend | P0         | S3-F07         |
| S3-F09 | Componente BudgetProgressChart | Criar `components/charts/BudgetProgressChart.vue`: barra horizontal ApexCharts mostrando gasto vs limite por categoria. Reutilizavel no dashboard futuro.                                                                                                                                                                                                              | Felipe Frontend | P1         | S3-F04         |

### QA Tasks (Quiteria)

| ID     | Titulo                    | Descricao                                                                                                                                                            | Responsavel | Prioridade | Deps           |
| ------ | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ---------- | -------------- |
| S3-Q01 | Testes E2E - Recorrencias | Teste E2E: criar recorrencia mensal -> verificar na lista -> pausar -> verificar status -> retomar. Backend: verificar que scheduler gera transacao na data correta. | Quiteria QA | P1         | S3-B03, S3-F02 |
| S3-Q02 | Testes E2E - Orcamentos   | Teste E2E: criar orcamento para categoria -> criar transacoes na categoria -> verificar barra de progresso atualizada -> verificar alerta ao ultrapassar threshold.  | Quiteria QA | P1         | S3-B05, S3-F04 |
| S3-Q03 | Testes E2E - Metas        | Teste E2E: criar meta R$ 1000 -> adicionar contribuicao R$ 500 -> verificar progresso 50% -> adicionar mais R$ 500 -> verificar meta completada.                     | Quiteria QA | P1         | S3-B08, S3-F08 |

### Criterios de Aceite da Sprint 3

- [ ] CRUD completo de Recorrencias (7 frequencias suportadas)
- [ ] Scheduler gera transacoes automaticamente na data correta
- [ ] Recorrencia com parcelas finaliza ao atingir total
- [ ] Pause/resume funcional
- [ ] CRUD completo de Orcamentos (um por categoria/mes)
- [ ] Calculo de progresso em tempo real (gastos da categoria vs limite)
- [ ] Alerta automatico quando orcamento atinge threshold
- [ ] CRUD completo de Metas de economia
- [ ] Contribuicoes atualizam currentAmount corretamente
- [ ] Meta marcada como completa automaticamente
- [ ] RBAC aplicado em todos os novos endpoints e telas

---

## Sprint 4 - Monetizacao

**Objetivo:** Implementar o sistema de Billing (Stripe + Pix), Convites de membros e Paywall. Ao final desta sprint o modelo de negocio SaaS esta funcional.

**Duracao:** 2 semanas

> **Nota de paralelismo:** Billing (backend pesado) e Invites podem ser desenvolvidos em paralelo. Frontend do billing depende do backend estar funcional (Stripe Elements).

### UX Tasks (Diana)

| ID     | Titulo                       | Descricao                                                                                                                                                                                     | Responsavel  | Prioridade | Deps |
| ------ | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ---------- | ---- |
| S4-D01 | Wireframe Checkout           | Wireframe/spec para `CheckoutPage.vue`: etapas de checkout (selecao de plano, metodo de pagamento, confirmacao). Suporte Stripe Elements e QR Code Pix.                                       | Diana Design | P0         | -    |
| S4-D02 | Wireframe Subscription       | Wireframe/spec para `SubscriptionPage.vue`: card com plano atual, status (badge), proximo vencimento, historico de pagamentos, botao cancelar.                                                | Diana Design | P0         | -    |
| S4-D03 | Wireframe Convites + Paywall | Wireframe/spec para `InviteMemberPage.vue` (fluxo checkout + convite), `MembersPage.vue` (lista de membros + convites pendentes), `PaywallPage.vue` (tela de bloqueio com CTA para reativar). | Diana Design | P0         | -    |

### Backend Tasks (Bruno)

| ID     | Titulo                             | Descricao                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Responsavel   | Prioridade | Deps   |
| ------ | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ---------- | ------ |
| S4-B01 | Modulo Billing - Stripe Service    | Criar `modules/billing/stripe/stripe.service.ts`: integracao com Stripe SDK. Metodos: `createCustomer()`, `createSubscription()`, `createPaymentIntent()` (one-time para membro), `cancelSubscription()`, `getSubscriptionStatus()`. Configurar com variaveis de ambiente. **US:** Como sistema, quero integrar com Stripe para processar pagamentos de forma segura.                                                                                                           | Bruno Backend | P0         | -      |
| S4-B02 | Modulo Billing - Stripe Webhook    | Criar `modules/billing/stripe/stripe-webhook.controller.ts`: POST /webhooks/stripe. Processar eventos: `invoice.payment_succeeded` (atualizar status ACTIVE), `invoice.payment_failed` (marcar PAST_DUE), `customer.subscription.deleted` (marcar CANCELED). Validar assinatura do webhook.                                                                                                                                                                                     | Bruno Backend | P0         | S4-B01 |
| S4-B03 | Modulo Billing - Pix Service       | Criar `modules/billing/pix/pix.service.ts`: integracao basica com PSP para gerar QR Code Pix. Metodos: `createPixCharge()`, `checkPixStatus()`. (Pode ser stub para MVP, com webhook de confirmacao manual ou polling).                                                                                                                                                                                                                                                         | Bruno Backend | P1         | -      |
| S4-B04 | Modulo Billing - Service principal | Criar `modules/billing/billing.service.ts`: orquestra Stripe + Pix. Metodos: `initiateCheckout(familyId, method)`, `getActiveSubscription(familyId)`, `initiateMemberCheckout(familyId)`, `confirmMemberPayment(familyId, paymentIntentId)`, `handleTrialExpiration()`, `cancelSubscription(familyId, reason?)`. Logica de trial: verifica `trialEndsAt` e muda status para EXPIRED se vencido. **US:** Como titular, quero assinar o plano para continuar usando apos o trial. | Bruno Backend | P0         | S4-B01 |
| S4-B05 | Modulo Billing - Controller + DTOs | Criar `modules/billing/billing.controller.ts`: POST /billing/checkout, GET /billing/subscription, POST /billing/member-checkout, POST /billing/confirm-member-payment, POST /billing/cancel. DTOs: `create-checkout.dto.ts` (method: 'CREDIT_CARD' or 'PIX'), `add-member.dto.ts`. Guards: apenas Master pode gerenciar billing.                                                                                                                                                | Bruno Backend | P0         | S4-B04 |
| S4-B06 | Subscription Guard                 | Criar `modules/billing/guards/subscription.guard.ts`: guard que verifica se a familia tem subscription ativa (TRIAL ou ACTIVE). Se EXPIRED ou PAST_DUE: retorna 403 com codigo `SUBSCRIPTION_INACTIVE`. Aplicar em todas as rotas de escrita (POST/PATCH/DELETE) dos modulos financeiros. Rotas de leitura (GET) continuam liberadas (modo read-only).                                                                                                                          | Bruno Backend | P0         | S4-B04 |
| S4-B07 | Cron de Trial Expiration           | Criar job (NestJS Scheduler) que roda diariamente: busca subscriptions com status TRIAL e `trialEndsAt < agora`. Muda status para EXPIRED. Envia notificacao ao titular.                                                                                                                                                                                                                                                                                                        | Bruno Backend | P1         | S4-B04 |
| S4-B08 | Modulo Invites - Service           | Criar `modules/invites/invites.service.ts`: metodos `createInvite(familyId, email, groupId, memberSlotId?)` (gera token unico, salva com expiracao 7 dias), `acceptInvite(token, userData)` (valida token, cria User vinculado a familia e grupo, marca slot como usado), `revokeInvite(inviteId)`, `listInvites(familyId)`. **US:** Como titular, quero convidar familiares para participar do controle financeiro.                                                            | Bruno Backend | P0         | S4-B04 |
| S4-B09 | Modulo Invites - Controller + DTOs | Criar `modules/invites/invites.controller.ts`: POST /invites (cria convite, requer slot pago), GET /invites (lista convites da familia), GET /invites/:token (info publica do convite para tela de aceite), POST /invites/:token/accept (aceite), DELETE /invites/:id (revogar). DTO: `create-invite.dto.ts` (email, groupId, memberSlotId).                                                                                                                                    | Bruno Backend | P0         | S4-B08 |
| S4-B10 | Testes unitarios - Billing         | Testes: criar subscription, trial expiration, checkout flow (mock Stripe), webhook processing, subscription guard (ativa/inativa/trial).                                                                                                                                                                                                                                                                                                                                        | Bruno Backend | P1         | S4-B04 |
| S4-B11 | Testes unitarios - Invites         | Testes: criar convite (com slot pago, sem slot), aceitar convite (token valido, expirado, ja aceito), revogar, listar convites por familia.                                                                                                                                                                                                                                                                                                                                     | Bruno Backend | P1         | S4-B08 |
| S4-B12 | Testes integracao - Fluxo Checkout | Teste E2E: registro (trial) -> trial expira -> tenta criar transacao -> 403 -> checkout -> pagamento -> cria transacao -> OK.                                                                                                                                                                                                                                                                                                                                                   | Bruno Backend | P1         | S4-B06 |

### Frontend Tasks (Felipe)

| ID     | Titulo                       | Descricao                                                                                                                                                                                                                                                                                                                                               | Responsavel     | Prioridade | Deps           |
| ------ | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | ---------- | -------------- |
| S4-F01 | Billing Store + Service      | Criar `stores/billing.store.ts` (state: subscription, isTrialActive, daysRemaining) e `services/billing.service.ts`.                                                                                                                                                                                                                                    | Felipe Frontend | P0         | S1-F01         |
| S4-F02 | Tela de Checkout             | Criar `pages/billing/CheckoutPage.vue`: selecao de metodo (cartao ou Pix). Para cartao: Stripe Elements (CardElement). Para Pix: exibir QR Code + copia-e-cola. Loading durante processamento. Confirmacao de sucesso. **US:** Como titular, quero pagar minha assinatura de forma rapida e segura.                                                     | Felipe Frontend | P0         | S4-F01, S4-D01 |
| S4-F03 | Tela de Subscription         | Criar `pages/billing/SubscriptionPage.vue`: card com status atual (badge colorido: verde=active, amarelo=trial, vermelho=expired), plano, proximo vencimento, membros (slots usados/total), historico de pagamentos (QTable). Botao cancelar (com confirmacao). **US:** Como titular, quero ver o status da minha assinatura e historico de pagamentos. | Felipe Frontend | P0         | S4-F01, S4-D02 |
| S4-F04 | Composable useSubscription   | Criar `composables/useSubscription.ts`: `isActive()`, `isTrial()`, `isExpired()`, `daysRemaining()`, `canWrite()` (true se ativa ou trial).                                                                                                                                                                                                             | Felipe Frontend | P0         | S4-F01         |
| S4-F05 | Subscription Guard (Router)  | Criar `router/guards/subscription.guard.ts`: verifica `billingStore.canWrite()`. Se nao pode escrever e a rota e de escrita: redireciona para `/paywall`.                                                                                                                                                                                               | Felipe Frontend | P0         | S4-F04         |
| S4-F06 | Tela Paywall                 | Criar `pages/errors/PaywallPage.vue`: mensagem clara ("Sua assinatura expirou"), CTA para checkout, opcao de ver dados em modo read-only. Trial expirado: "Seu periodo de teste acabou. Assine para continuar." **US:** Como usuario, quero entender claramente por que estou bloqueado e como resolver.                                                | Felipe Frontend | P0         | S4-F05, S4-D03 |
| S4-F07 | Invites Service + integracao | Criar `services/invites.service.ts`. Integrar com Family Store.                                                                                                                                                                                                                                                                                         | Felipe Frontend | P0         | S1-F01         |
| S4-F08 | Tela Membros                 | Criar `pages/family/MembersPage.vue`: lista de membros da familia (nome, email, grupo, status). Lista de convites pendentes (email, grupo, expiracao). Botao "Convidar Membro" (inicia fluxo checkout se nao tem slot pago). **US:** Como titular, quero ver todos os membros da minha familia e gerenciar convites.                                    | Felipe Frontend | P0         | S4-F07, S4-D03 |
| S4-F09 | Tela Convidar Membro         | Criar `pages/family/InviteMemberPage.vue`: fluxo em etapas: (1) Checkout do slot (se necessario) -> (2) Formulario de convite (email, grupo select) -> (3) Confirmacao. **US:** Como titular, quero convidar um membro e definir seu nivel de acesso.                                                                                                   | Felipe Frontend | P0         | S4-F08, S4-F02 |
| S4-F10 | Tela Aceitar Convite         | Criar `pages/auth/AcceptInvitePage.vue`: tela publica (sem auth). Mostra info do convite (familia, grupo). Se usuario ja tem conta: login. Se nao: formulario de registro simplificado (nome, senha). **US:** Como convidado, quero aceitar o convite e criar minha conta de forma simples.                                                             | Felipe Frontend | P0         | S4-F07         |
| S4-F11 | Tela Family Settings         | Criar `pages/family/FamilySettingsPage.vue`: editar nome da familia, ver info do plano, link para membros, link para RBAC.                                                                                                                                                                                                                              | Felipe Frontend | P1         | S4-F01         |
| S4-F12 | Banner de Trial              | Componente de banner no header: "Voce tem X dias restantes de trial. Assine agora!" com link para checkout. Exibido apenas durante trial.                                                                                                                                                                                                               | Felipe Frontend | P1         | S4-F04         |

### QA Tasks (Quiteria)

| ID     | Titulo                        | Descricao                                                                                                                                                                      | Responsavel | Prioridade | Deps           |
| ------ | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------- | ---------- | -------------- |
| S4-Q01 | Testes E2E - Fluxo de Billing | Teste E2E (com Stripe test mode): registro -> trial ativo -> expirar trial (mock) -> paywall -> checkout -> assinatura ativa -> acesso restaurado.                             | Quiteria QA | P0         | S4-B05, S4-F02 |
| S4-Q02 | Testes E2E - Fluxo de Convite | Teste E2E: titular paga slot -> cria convite -> convidado acessa link -> aceita -> logado na familia correta com grupo correto.                                                | Quiteria QA | P0         | S4-B09, S4-F10 |
| S4-Q03 | Testes E2E - Paywall          | Teste E2E: familia com subscription expirada -> tenta criar transacao (frontend) -> redirecionado para paywall -> tenta via API -> recebe 403 -> leitura funciona normalmente. | Quiteria QA | P0         | S4-B06, S4-F06 |

### Criterios de Aceite da Sprint 4

- [ ] Checkout funcional com Stripe (test mode): cartao de credito
- [ ] Checkout funcional com Pix (QR Code gerado, mesmo que confirmacao manual)
- [ ] Trial de 15 dias funcional (criado no registro, expira automaticamente)
- [ ] Paywall bloqueia escrita quando subscription inativa
- [ ] Modo read-only funcional (GET endpoints liberados)
- [ ] Webhook Stripe processa eventos (payment_succeeded, payment_failed, subscription_deleted)
- [ ] Convite de membro: pagar slot -> enviar convite -> convidado aceita
- [ ] Convite com token unico, expiracao 7 dias, revogavel
- [ ] Convidado vinculado a familia com grupo correto
- [ ] Apenas Master pode gerenciar billing e convites

---

## Sprint 5 - Dashboard & Notificacoes

**Objetivo:** Implementar o Dashboard com graficos interativos e o sistema de Notificacoes (in-app + push PWA). Ao final desta sprint a experiencia do usuario esta completa.

**Duracao:** 2 semanas

> **Nota de paralelismo:** Dashboard e Notifications sao modulos independentes. Podem ser desenvolvidos em paralelo por backend e frontend.

### UX Tasks (Diana)

| ID     | Titulo                 | Descricao                                                                                                                                                                                                                                        | Responsavel  | Prioridade | Deps |
| ------ | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------ | ---------- | ---- |
| S5-D01 | Wireframe Dashboard    | Wireframe/spec para `DashboardPage.vue`: layout de cards/widgets. Resumo: saldo total, receitas do mes, despesas do mes, economia. Graficos: fluxo de caixa (linha), despesas por categoria (donut), tendencia mensal (area). Filtro de periodo. | Diana Design | P0         | -    |
| S5-D02 | Wireframe Notificacoes | Wireframe/spec para `NotificationsPage.vue`: lista cronologica, badges de tipo (orcamento, meta, sistema), marcar como lida. Dropdown no header com ultimas notificacoes.                                                                        | Diana Design | P0         | -    |

### Backend Tasks (Bruno)

| ID     | Titulo                               | Descricao                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Responsavel   | Prioridade | Deps                                   |
| ------ | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ---------- | -------------------------------------- |
| S5-B01 | Modulo Dashboard - Service           | Criar `modules/dashboard/dashboard.service.ts`: agregacoes SQL/Prisma. Metodos: `getSummary(familyId, period)` (saldo total, receitas, despesas, economia do mes), `getCashflow(familyId, startDate, endDate)` (receitas vs despesas dia a dia), `getExpensesByCategory(familyId, period)` (agrupado por categoria), `getMonthlyTrend(familyId, months)` (ultimos N meses). Queries otimizadas com indices. **US:** Como usuario, quero visualizar um resumo das minhas financas em um painel intuitivo. | Bruno Backend | P0         | S2-B05                                 |
| S5-B02 | Modulo Dashboard - Controller        | Criar `modules/dashboard/dashboard.controller.ts`: GET /dashboard/summary, GET /dashboard/cashflow, GET /dashboard/expenses-by-category, GET /dashboard/monthly-trend. Query params: period (month/year), startDate, endDate. `@CheckPermission('reports', 'read')`.                                                                                                                                                                                                                                     | Bruno Backend | P0         | S5-B01                                 |
| S5-B03 | Modulo Notifications - Service       | Criar `modules/notifications/notifications.service.ts`: metodos `create(userId, type, title, message, data?)`, `findAll(userId, filters)`, `markAsRead(notificationId)`, `markAllAsRead(userId)`, `getUnreadCount(userId)`. **US:** Como usuario, quero receber notificacoes sobre eventos importantes para ficar informado sem precisar verificar manualmente.                                                                                                                                          | Bruno Backend | P0         | S1-B01                                 |
| S5-B04 | Modulo Notifications - Controller    | Criar `modules/notifications/notifications.controller.ts`: GET /notifications (paginado, filtro isRead), GET /notifications/unread-count, PATCH /notifications/:id/read, PATCH /notifications/read-all, POST /notifications/push-subscription (registrar device para push).                                                                                                                                                                                                                              | Bruno Backend | P0         | S5-B03                                 |
| S5-B05 | Push Notifications (Web Push)        | Criar `modules/notifications/push/push.service.ts`: integracao com `web-push` library. Metodos: `sendPush(userId, payload)`, `registerSubscription(userId, subscription)`, `removeSubscription(subscriptionId)`. Usar VAPID keys. **US:** Como usuario, quero receber notificacoes push no navegador/celular mesmo quando o app esta fechado.                                                                                                                                                            | Bruno Backend | P1         | S5-B03                                 |
| S5-B06 | Integracao: Notificacoes automaticas | Integrar notificacoes automaticas nos modulos existentes: (1) Orcamento ultrapassou threshold -> BUDGET_ALERT, (2) Meta atingiu 50%/75%/100% -> GOAL_MILESTONE, (3) Recorrencia vencendo amanha -> RECURRING_DUE, (4) Trial expirando em 3 dias -> SUBSCRIPTION_WARN. Adicionar chamadas ao `notifications.service` nos services relevantes.                                                                                                                                                             | Bruno Backend | P1         | S5-B03, S3-B04, S3-B07, S3-B02, S4-B07 |
| S5-B07 | Testes unitarios - Dashboard         | Testes: agregacoes de summary (com e sem transacoes), cashflow (periodos com dados e vazios), expenses by category (agrupa corretamente), tenant isolation nos aggregates.                                                                                                                                                                                                                                                                                                                               | Bruno Backend | P1         | S5-B01                                 |
| S5-B08 | Testes unitarios - Notifications     | Testes: criar notificacao, listar (paginacao, filtro read/unread), marcar como lida, contagem de nao lidas, push subscription CRUD.                                                                                                                                                                                                                                                                                                                                                                      | Bruno Backend | P1         | S5-B03                                 |

### Frontend Tasks (Felipe)

| ID     | Titulo                             | Descricao                                                                                                                                                                                                                                                                                                                                                              | Responsavel     | Prioridade | Deps           |
| ------ | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | ---------- | -------------- |
| S5-F01 | Dashboard Store + Service          | Criar `stores/dashboard.store.ts` (state: summary, cashflow, expensesByCategory, monthlyTrend) e `services/dashboard.service.ts`.                                                                                                                                                                                                                                      | Felipe Frontend | P0         | S1-F01         |
| S5-F02 | Tela Dashboard                     | Criar `pages/dashboard/DashboardPage.vue`: layout responsivo com cards de resumo no topo (saldo, receita, despesa, economia), graficos abaixo. Seletor de periodo (mes/ano). Loading skeleton enquanto carrega. **US:** Como usuario, quero ver de relance como estao minhas financas neste mes.                                                                       | Felipe Frontend | P0         | S5-F01, S5-D01 |
| S5-F03 | Componente CashFlowChart           | Criar `components/charts/CashFlowChart.vue`: grafico de linha/area (ApexCharts) com receitas (verde) e despesas (vermelho) ao longo do mes. Tooltip com valores. Responsivo.                                                                                                                                                                                           | Felipe Frontend | P0         | S5-F02         |
| S5-F04 | Componente ExpensesByCategoryChart | Criar `components/charts/ExpensesByCategoryChart.vue`: grafico donut (ApexCharts) com fatias por categoria, cores matching categorias, legenda com percentuais.                                                                                                                                                                                                        | Felipe Frontend | P0         | S5-F02         |
| S5-F05 | Componente MonthlyTrendChart       | Criar `components/charts/MonthlyTrendChart.vue`: grafico de barras/area (ApexCharts) comparando receitas vs despesas dos ultimos 6-12 meses.                                                                                                                                                                                                                           | Felipe Frontend | P0         | S5-F02         |
| S5-F06 | Boot ApexCharts                    | Criar `boot/apexcharts.ts`: registrar VueApexCharts globalmente. Configurar tema padrao (cores do design system, dark mode support).                                                                                                                                                                                                                                   | Felipe Frontend | P0         | S0-D01         |
| S5-F07 | Notifications Store + Service      | Criar `stores/notifications.store.ts` (state: notifications[], unreadCount) e `services/notifications.service.ts`.                                                                                                                                                                                                                                                     | Felipe Frontend | P0         | S1-F01         |
| S5-F08 | Tela Notificacoes                  | Criar `pages/notifications/NotificationsPage.vue`: lista cronologica com icone por tipo, titulo, mensagem, timestamp ("ha 2 horas"). Filtro: todas/nao lidas. Botao "Marcar todas como lidas". Click navega para contexto (ex: click em alerta de orcamento -> abre orcamento). **US:** Como usuario, quero ver todas as minhas notificacoes em um lugar centralizado. | Felipe Frontend | P0         | S5-F07, S5-D02 |
| S5-F09 | Dropdown de Notificacoes (Header)  | Atualizar `TheHeader.vue`: adicionar icone de sino com badge de contagem de nao lidas. Dropdown (QMenu) com ultimas 5 notificacoes. Link "Ver todas" para a pagina completa.                                                                                                                                                                                           | Felipe Frontend | P0         | S5-F07         |
| S5-F10 | Push Notification (Service Worker) | Configurar service worker PWA para receber push notifications. Criar `composables/useNotification.ts`: `requestPermission()`, `registerPushSubscription()`. Enviar subscription para backend.                                                                                                                                                                          | Felipe Frontend | P1         | S5-F07         |
| S5-F11 | Composable useDate                 | Criar `composables/useDate.ts`: `formatDate()`, `formatRelative()` ("ha 2 horas", "ontem"), `formatPeriod()`. Usar date-fns com locale pt-BR.                                                                                                                                                                                                                          | Felipe Frontend | P1         | -              |

### QA Tasks (Quiteria)

| ID     | Titulo                     | Descricao                                                                                                                                                                 | Responsavel | Prioridade | Deps           |
| ------ | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ---------- | -------------- |
| S5-Q01 | Testes E2E - Dashboard     | Teste E2E: criar varias transacoes (receitas + despesas em categorias diferentes) -> acessar dashboard -> verificar que resumo e graficos refletem os dados corretamente. | Quiteria QA | P1         | S5-B02, S5-F02 |
| S5-Q02 | Testes E2E - Notificacoes  | Teste E2E: criar orcamento -> criar transacoes que ultrapassam threshold -> verificar notificacao criada -> marcar como lida -> verificar badge atualizado.               | Quiteria QA | P1         | S5-B06, S5-F08 |
| S5-Q03 | Teste de RBAC no Dashboard | Teste E2E: usuario Dependente acessa dashboard -> verifica que ve apenas dados permitidos -> reports:read negado -> dashboard bloqueado.                                  | Quiteria QA | P1         | S5-F02         |

### Criterios de Aceite da Sprint 5

- [ ] Dashboard exibe resumo financeiro correto (saldo, receitas, despesas, economia)
- [ ] Grafico de fluxo de caixa funcional e interativo
- [ ] Grafico de despesas por categoria (donut) com cores corretas
- [ ] Grafico de tendencia mensal (ultimos 6+ meses)
- [ ] Filtro de periodo funcional no dashboard
- [ ] Notificacoes in-app funcionais (listar, marcar como lida)
- [ ] Badge de notificacoes no header atualiza em tempo real
- [ ] Notificacoes automaticas disparadas (orcamento, meta, recorrencia, trial)
- [ ] Push notification funcional (PWA, solicita permissao)
- [ ] Dashboard responsivo (mobile + desktop)
- [ ] Graficos suportam dark mode

---

## Sprint 6 - Importacao, Polish & Release

**Objetivo:** Implementar importacao CSV/OFX com categorizacao automatica, realizar testes E2E completos, security audit, deploy em staging/producao e documentacao final. Ao final desta sprint, o MVP v1.0.0 esta pronto para producao.

**Duracao:** 2 semanas

> **Nota:** Esta sprint envolve todos os agentes. E a sprint de hardening e release.

### Backend Tasks (Bruno)

| ID     | Titulo                   | Descricao                                                                                                                                                                                                                                                                                                                                                                       | Responsavel   | Prioridade | Deps                   |
| ------ | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ---------- | ---------------------- |
| S6-B01 | Parser CSV               | Criar `modules/transactions/import/csv-parser.ts`: parser de CSV generico. Aceita upload de arquivo, detecta encoding, parseia colunas (data, descricao, valor, tipo). Retorna array de transacoes candidatas. Tratar formatos de data e numero brasileiros.                                                                                                                    | Bruno Backend | P0         | -                      |
| S6-B02 | Parser OFX               | Criar `modules/transactions/import/ofx-parser.ts`: parser de OFX (Open Financial Exchange). Usar biblioteca `ofx-js` ou parser custom. Extrair transacoes (STMTTRN). Mapear campos para modelo Transaction.                                                                                                                                                                     | Bruno Backend | P0         | -                      |
| S6-B03 | Service de Importacao    | Criar `modules/transactions/import/import.service.ts`: orquestra CSV/OFX parsers. Metodos: `parseFile(file, format)` (retorna preview), `importTransactions(familyId, accountId, transactions[])` (persiste). Deduplicacao via `importHash` (hash de data+valor+descricao). **US:** Como usuario, quero importar extratos bancarios para nao precisar digitar tudo manualmente. | Bruno Backend | P0         | S6-B01, S6-B02, S2-B05 |
| S6-B04 | Categorizacao automatica | Implementar em `import.service.ts`: logica de categorizacao baseada em keywords na descricao. Ex: "MERCADO" -> Alimentacao, "UBER" -> Transporte, "NETFLIX" -> Lazer. Tabela de regras configuravel por familia (futuro). Para MVP: regras hardcoded. **US:** Como usuario, quero que minhas transacoes importadas sejam categorizadas automaticamente para economizar tempo.   | Bruno Backend | P1         | S6-B03                 |
| S6-B05 | Endpoint de Importacao   | Atualizar `transactions.controller.ts`: POST /transactions/import (multipart/form-data). Aceita arquivo + accountId + format ('csv' ou 'ofx'). Retorna preview para confirmacao. POST /transactions/import/confirm para persistir. DTO: `import-transactions.dto.ts`.                                                                                                           | Bruno Backend | P0         | S6-B03                 |
| S6-B06 | Refinamentos de API      | Revisar todos os endpoints: (1) Validacoes completas em todos os DTOs, (2) Mensagens de erro em pt-BR, (3) Rate limiting nos endpoints publicos (auth), (4) Swagger docs completas em todos os controllers.                                                                                                                                                                     | Bruno Backend | P1         | -                      |

### Frontend Tasks (Felipe)

| ID     | Titulo                        | Descricao                                                                                                                                                                                                                                                                                                                                                                                      | Responsavel     | Prioridade | Deps   |
| ------ | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | ---------- | ------ |
| S6-F01 | Tela de Importacao            | Criar `pages/transactions/ImportPage.vue`: (1) Upload de arquivo (drag-and-drop, QFile), (2) Selecao de formato (CSV/OFX) e conta destino, (3) Preview em tabela (QTable) com transacoes detectadas + categoria sugerida, (4) Checkbox para selecionar quais importar, (5) Botao confirmar. **US:** Como usuario, quero revisar as transacoes antes de importar para corrigir possiveis erros. | Felipe Frontend | P0         | S6-B05 |
| S6-F02 | Componente ImportPreviewTable | Criar `components/transactions/ImportPreviewTable.vue`: tabela com colunas (data, descricao, valor, categoria sugerida, acao). Permite editar categoria antes de importar. Destaque para possiveis duplicatas.                                                                                                                                                                                 | Felipe Frontend | P0         | S6-F01 |
| S6-F03 | Refinamentos UX globais       | (1) Loading skeletons em todas as listagens, (2) Empty states com ilustracao em listas vazias, (3) Toast de sucesso/erro padronizados (QNotify), (4) Confirmacao antes de excluir (ConfirmDialog), (5) Transicoes de pagina suaves.                                                                                                                                                            | Felipe Frontend | P1         | -      |
| S6-F04 | Componente EmptyState         | Criar `components/common/EmptyState.vue`: ilustracao + titulo + descricao + botao de acao. Reutilizavel em todas as listagens.                                                                                                                                                                                                                                                                 | Felipe Frontend | P1         | -      |
| S6-F05 | Componente ConfirmDialog      | Criar `components/common/ConfirmDialog.vue`: dialog de confirmacao reutilizavel (titulo, mensagem, botoes confirmar/cancelar).                                                                                                                                                                                                                                                                 | Felipe Frontend | P1         | -      |
| S6-F06 | Componente LoadingOverlay     | Criar `components/common/LoadingOverlay.vue`: overlay com spinner para operacoes longas (importacao, checkout).                                                                                                                                                                                                                                                                                | Felipe Frontend | P2         | -      |
| S6-F07 | Responsividade final          | Revisar todas as telas para mobile (< 600px): sidebar como drawer, tabelas com scroll horizontal ou layout de cards, formularios full-width. Testar em dispositivos reais.                                                                                                                                                                                                                     | Felipe Frontend | P1         | -      |
| S6-F08 | Dark mode refinamento         | Revisar todas as telas em dark mode: cores de graficos, bordas, sombras, contraste. Garantir acessibilidade (WCAG AA).                                                                                                                                                                                                                                                                         | Felipe Frontend | P2         | -      |

### QA Tasks (Quiteria)

| ID     | Titulo                            | Descricao                                                                                                                                                                                                                                           | Responsavel | Prioridade | Deps   |
| ------ | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ---------- | ------ |
| S6-Q01 | Testes E2E completos - Happy path | Suite E2E completa do fluxo principal: registro -> criar contas -> criar categorias -> lancar transacoes -> importar CSV -> criar orcamento -> criar meta -> dashboard -> convite de membro -> membro aceita -> membro ve dados.                    | Quiteria QA | P0         | Tudo   |
| S6-Q02 | Testes E2E - Edge cases           | Testes de edge cases: (1) Registro com email duplicado, (2) Login com senha errada, (3) Token expirado e refresh, (4) Transacao em conta inativa, (5) Orcamento para categoria sem transacoes, (6) Importacao com duplicatas, (7) Convite expirado. | Quiteria QA | P0         | Tudo   |
| S6-Q03 | Testes de carga                   | Teste de carga basico: (1) 100 usuarios simultaneos, (2) Familia com 1000+ transacoes, (3) Dashboard com grande volume de dados, (4) Import de arquivo com 500+ transacoes. Usar k6 ou Artillery.                                                   | Quiteria QA | P1         | S6-B06 |
| S6-Q04 | Testes de responsividade          | Verificar todas as telas em: Desktop (1920x1080), Tablet (768x1024), Mobile (375x812). Screenshots automatizados com Playwright.                                                                                                                    | Quiteria QA | P1         | S6-F07 |
| S6-Q05 | Testes de acessibilidade          | Rodar axe-core/Lighthouse em todas as paginas. Verificar: contraste de cores, labels em inputs, navegacao por teclado, screen reader. Corrigir issues criticas.                                                                                     | Quiteria QA | P1         | S6-F08 |

### DevSecOps Tasks (Leandro)

| ID     | Titulo                        | Descricao                                                                                                                                                                                                                                                                                                                                                                               | Responsavel      | Prioridade | Deps |
| ------ | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | ---------- | ---- |
| S6-L01 | Security audit - Dependencias | Rodar `npm audit`, `snyk test` em todos os workspaces. Corrigir vulnerabilidades criticas e altas. Configurar `npm audit` no CI.                                                                                                                                                                                                                                                        | Leandro Lockdown | P0         | -    |
| S6-L02 | Security audit - OWASP Top 10 | Verificar contra OWASP Top 10: (1) Injection (SQL/NoSQL - Prisma parametriza), (2) Broken Auth (JWT config, refresh rotation), (3) Sensitive Data Exposure (senhas hash, tokens hash), (4) Broken Access Control (RBAC, tenant isolation), (5) Security Misconfiguration (CORS, headers), (6) XSS (sanitizacao), (7) CSRF (SameSite cookies), (8) Mass Assignment (DTOs com whitelist). | Leandro Lockdown | P0         | -    |
| S6-L03 | Headers de seguranca          | Configurar helmet no NestJS: Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, Strict-Transport-Security. Configurar CORS restritivo para producao.                                                                                                                                                                                                                     | Leandro Lockdown | P0         | -    |
| S6-L04 | Rate limiting                 | Implementar rate limiting com `@nestjs/throttler`: (1) Login: 5 tentativas/minuto, (2) Registro: 3/minuto, (3) API geral: 100/minuto, (4) Webhook Stripe: sem limite (verificar assinatura).                                                                                                                                                                                            | Leandro Lockdown | P0         | -    |
| S6-L05 | Revisao de .env e secrets     | Verificar que nenhum secret esta hardcoded ou commitado. Revisar `.gitignore`. Configurar variaveis de ambiente em staging/prod (secrets manager). Validar `.env.example` esta completo.                                                                                                                                                                                                | Leandro Lockdown | P0         | -    |
| S6-L06 | Penetration testing basico    | Testes manuais: (1) Tentar acessar dados de outro tenant, (2) Tentar escalar privilegios (mudar groupId no token), (3) Tentar SQL injection via filtros, (4) Tentar XSS em campos de texto, (5) Tentar acessar endpoints sem auth.                                                                                                                                                      | Leandro Lockdown | P1         | -    |

### DevOps Tasks (Igor)

| ID     | Titulo                    | Descricao                                                                                                                                                                                             | Responsavel | Prioridade | Deps   |
| ------ | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ---------- | ------ |
| S6-G01 | Setup staging environment | Provisionar ambiente staging: (1) PostgreSQL managed (Neon/Supabase/Railway), (2) Backend deploy (Railway/Fly.io/Render), (3) Frontend deploy (Vercel/Netlify). Configurar variaveis de ambiente.     | Igor Infra  | P0         | -      |
| S6-G02 | Setup producao            | Provisionar ambiente producao: mesmo stack de staging mas com recursos de producao. Configurar dominio customizado, SSL, CDN (Cloudflare).                                                            | Igor Infra  | P0         | S6-G01 |
| S6-G03 | Pipeline CD               | Atualizar GitHub Actions: (1) Deploy automatico para staging em push para `main`, (2) Deploy para producao em push para `release/*` (com aprovacao manual), (3) Prisma migrate automatico em deploys. | Igor Infra  | P0         | S6-G01 |
| S6-G04 | Monitoramento             | Configurar: (1) Health check endpoint (GET /health), (2) Logging estruturado (JSON), (3) Error tracking (Sentry ou similar), (4) Uptime monitoring.                                                   | Igor Infra  | P1         | S6-G01 |
| S6-G05 | Backup e recovery         | Configurar backup automatico diario do PostgreSQL. Documentar procedimento de recovery. Testar restore de backup.                                                                                     | Igor Infra  | P1         | S6-G02 |

### Docs Tasks (Tatiana)

| ID     | Titulo                         | Descricao                                                                                                                                                                                                           | Responsavel   | Prioridade | Deps   |
| ------ | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ---------- | ------ |
| S6-T01 | API Docs (Swagger)             | Revisar e completar todas as anotacoes Swagger em todos os controllers. Verificar que cada endpoint tem: summary, description, request body schema, response schema, error codes. Publicar Swagger UI em /api/docs. | Tatiana Texto | P0         | S6-B06 |
| S6-T02 | Guia de setup local            | Documentar: (1) Pre-requisitos (Node 20+, npm 9+, Docker), (2) Clonar repo, (3) npm install, (4) docker-compose up, (5) prisma migrate, (6) prisma db seed, (7) turbo dev. Troubleshooting comum.                   | Tatiana Texto | P0         | -      |
| S6-T03 | Guia de uso para usuario final | Documentar fluxos principais com screenshots: (1) Primeiro acesso e registro, (2) Configurar contas e categorias, (3) Lancar transacoes, (4) Importar extrato, (5) Criar orcamento, (6) Convidar membro.            | Tatiana Texto | P1         | -      |
| S6-T04 | Documentacao tecnica           | Documentar: (1) Arquitetura do sistema, (2) Fluxo de autenticacao, (3) Modelo de RBAC, (4) Multi-tenancy, (5) Modelo de billing. Atualizar os docs existentes (`architecture.md`, `prisma-schema.md`).              | Tatiana Texto | P1         | -      |

### Release Tasks (Renato)

| ID     | Titulo              | Descricao                                                                                                                             | Responsavel    | Prioridade | Deps           |
| ------ | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | -------------- | ---------- | -------------- |
| S6-R01 | Release plan v1.0.0 | Definir criterios de go/no-go. Checklist pre-release: testes passando, security OK, staging validado, docs completos, performance OK. | Renato Release | P0         | -              |
| S6-R02 | Changelog v1.0.0    | Compilar changelog completo: features, melhorias, correcoes. Formato keep-a-changelog. Gerar a partir dos commits (convencional).     | Renato Release | P0         | -              |
| S6-R03 | Tag e release       | Criar tag `v1.0.0`, branch `release/1.0.0`. Publicar release no GitHub com changelog. Trigger de deploy para producao.                | Renato Release | P0         | S6-R01, S6-R02 |
| S6-R04 | Smoke test producao | Apos deploy: executar smoke tests em producao: registro, login, criar conta, criar transacao, dashboard carrega, checkout funciona.   | Renato Release | P0         | S6-R03         |
| S6-R05 | Rollback plan       | Documentar procedimento de rollback: como reverter deploy, como reverter migration, contatos de emergencia.                           | Renato Release | P1         | -              |

### Criterios de Aceite da Sprint 6

- [ ] Importacao CSV funcional (upload, preview, confirmacao, persistencia)
- [ ] Importacao OFX funcional
- [ ] Deduplicacao de transacoes importadas (via importHash)
- [ ] Categorizacao automatica funcional (pelo menos 10 regras basicas)
- [ ] Suite E2E completa passando (>= 95% dos cenarios)
- [ ] Zero vulnerabilidades criticas/altas em `npm audit`
- [ ] OWASP Top 10 revisado e mitigado
- [ ] Rate limiting configurado em endpoints publicos
- [ ] Staging funcional e validado
- [ ] Producao funcional e acessivel
- [ ] Deploy automatizado (CI/CD completo)
- [ ] Swagger docs completas e publicadas
- [ ] Guia de setup local documentado
- [ ] Changelog v1.0.0 publicado
- [ ] Tag v1.0.0 criada
- [ ] Smoke test producao passando

---

## Backlog Futuro (pos-MVP)

### v1.1 - Melhorias de UX

- [ ] Forgot Password (email de reset)
- [ ] Profile picture upload (avatar)
- [ ] Tema customizavel por familia (cor primaria)
- [ ] Tutorial interativo de primeiro acesso (onboarding wizard)
- [ ] Atalhos de teclado para power users

### v1.2 - Relatorios Avancados

- [ ] Relatorio mensal por email (resumo financeiro)
- [ ] Exportacao PDF de relatorios
- [ ] Comparativo mes a mes detalhado
- [ ] Relatorio por membro (quem gastou quanto)
- [ ] Fluxo de caixa projetado (baseado em recorrencias)

### v1.3 - Notificacoes Avancadas (Premium)

- [ ] Notificacao por email (SES/SendGrid)
- [ ] Notificacao por WhatsApp (API oficial)
- [ ] Resumo semanal automatico
- [ ] Alerta de meta proxima da data limite

### v1.4 - Inteligencia Financeira

- [ ] Categorizacao automatica por ML (aprender com historico do usuario)
- [ ] Deteccao de anomalias (gastos fora do padrao)
- [ ] Sugestoes de economia baseadas em padroes
- [ ] Score de saude financeira da familia

### v1.5 - Integracoes

- [ ] Open Finance (conexao direta com bancos)
- [ ] Integracao com Nubank, Inter, etc. via Open Banking
- [ ] Importacao automatica via API de bancos
- [ ] Google Calendar sync para recorrencias

### v2.0 - Plataforma

- [ ] App nativo (Capacitor ou React Native)
- [ ] Multi-familia (usuario pertence a mais de uma familia)
- [ ] API publica para terceiros
- [ ] Marketplace de plugins/extensoes
- [ ] White-label para consultorias financeiras

---

## Resumo de Alocacao por Sprint

| Sprint | Bruno Backend                        | Felipe Frontend                           | Diana Design           | Quiteria QA                | Leandro        | Igor                    | Tatiana         | Renato         |
| ------ | ------------------------------------ | ----------------------------------------- | ---------------------- | -------------------------- | -------------- | ----------------------- | --------------- | -------------- |
| **S0** | Schema, Seed, Common                 | -                                         | Design System          | -                          | -              | Monorepo, CI/CD, Docker | Swagger config  | -              |
| **S1** | Auth, Users, Families, RBAC, Tenant  | Login, Registro, Layout, RBAC, Router     | Wireframes Auth/Layout | Testes Auth/RBAC           | -              | -                       | -               | -              |
| **S2** | Accounts, Categories, Transactions   | Contas, Categorias, Transacoes            | Wireframes Financeiro  | Testes Core Financeiro     | -              | -                       | -               | -              |
| **S3** | Recurring, Budgets, Savings Goals    | Recorrencias, Orcamentos, Metas           | Wireframes Features    | Testes Features            | -              | -                       | -               | -              |
| **S4** | Billing, Stripe, Pix, Invites        | Checkout, Subscription, Convites, Paywall | Wireframes Billing     | Testes Billing/Invites     | -              | -                       | -               | -              |
| **S5** | Dashboard, Notifications, Push       | Dashboard, Graficos, Notificacoes         | Wireframes Dashboard   | Testes Dashboard/Notif     | -              | -                       | -               | -              |
| **S6** | CSV/OFX, Categorizacao, Refinamentos | Importacao, Polish, Responsividade        | -                      | E2E, Carga, Acessibilidade | Security Audit | Staging, Prod, CD       | API Docs, Guias | Release v1.0.0 |

---

## Metricas de Acompanhamento

| Metrica                        | Meta                               | Ferramenta        |
| ------------------------------ | ---------------------------------- | ----------------- |
| Velocity                       | Medir a partir do Sprint 1         | GitHub Projects   |
| Cobertura de testes (backend)  | >= 80%                             | Jest + Istanbul   |
| Cobertura de testes (frontend) | >= 70%                             | Vitest + Istanbul |
| Bugs em producao               | 0 criticos, < 5 medios             | GitHub Issues     |
| Tempo de build (CI)            | < 5 minutos                        | GitHub Actions    |
| Lighthouse score               | >= 90 (Performance, Accessibility) | Lighthouse CI     |
| Uptime                         | >= 99.5%                           | Uptime monitor    |

---

_Documento gerado por Samuel Sprint - Scrum Master da Raji_  
_Versao 1.0.0 | 2026-04-04_
