# Changelog

Todas as mudancas notaveis deste projeto sao documentadas neste arquivo.

Baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e aderente ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [0.1.1] - 2026-04-04

### Corrigido

- **BaseURL do frontend** corrigida de `/api` para `/api/v1` — todos os endpoints estavam quebrando por prefixo incorreto
- **rbacService.listPermissions()** — path corrigido de `/permissions` para `/groups/permissions`
- **rbacService.updateGroupPermissions()** — payload corrigido de `{ permissions }` para `{ permissionIds }`
- **PermissionsMatrixPage** — agora carrega permissoes reais do grupo selecionado (antes zerava todas as checkboxes)

### Adicionado

- **ProfilePage** (`/profile`) — pagina para visualizar dados do usuario logado e editar nome
- **FamilySettingsPage** (`/family`) — informacoes da familia, edicao de nome (apenas owner), lista resumida de membros
- **MembersPage** (`/family/members`) — QTable com lista de membros, troca de grupo via QSelect
- **families.service.ts** — novo service frontend (getMyFamily, updateMyFamily, listMembers)
- **family.store.ts** — novo store Pinia para estado da familia e membros
- **Router atualizado** — rotas `/profile`, `/family` e `/family/members` apontam para paginas reais

---

## [0.1.0] - 2026-04-04

### Adicionado

#### Autenticacao e Seguranca

- Sistema completo de autenticacao com JWT (access token 15min + refresh token 7 dias)
- Rotacao automatica de refresh tokens com deteccao de reutilizacao
- Registro de usuario com criacao automatica de familia, grupos e categorias
- Login com retorno de permissoes do usuario
- Logout com revogacao de refresh token
- Hash de senhas com bcrypt (12 rounds)
- Decorator `@Public()` para endpoints abertos

#### Controle de Acesso (RBAC)

- Sistema RBAC em 4 camadas (Menu, Telas, CRUD, Backend Guards)
- 3 grupos padrao por familia: Administrador (54 perms), Membro (27), Dependente (8)
- Criacao de grupos customizaveis pelo administrador
- Decorator `@CheckPermission('module', 'action')` para protecao de endpoints
- Guard global de permissoes com Reflector
- 54 permissoes granulares cobrindo 12 modulos do sistema

#### Multi-Tenancy

- Isolamento completo por familia via `familyId` em todas as queries
- Tenant Interceptor global que injeta `familyId` no contexto
- Decorators `@CurrentUser()` e `@CurrentFamily()` para acesso ao contexto

#### Frontend (Vue 3 + Quasar)

- Tela de Login com validacao e tratamento de erros
- Tela de Registro com 5 campos e validacoes
- Layout de autenticacao (centralizado, dark mode)
- Layout principal com sidebar filtrada por RBAC
- Header com toggle dark mode, badge de notificacoes, avatar dropdown
- Breadcrumbs dinamicos via route meta
- Diretiva `v-perm` para esconder/desabilitar elementos sem permissao
- Auth Guard, Permission Guard e Subscription Guard (placeholder)
- Tela de gerenciamento de grupos RBAC
- Tela de matriz de permissoes (checkbox editavel)
- Paginas de erro: 404, 403 (Forbidden), Paywall
- Auth Store e RBAC Store com Pinia + localStorage
- Auto-refresh de token via Axios interceptor

#### Banco de Dados

- Schema Prisma com 20 models e indices otimizados
- Seed automatico de 54 permissoes do sistema
- Seed de grupos padrao e categorias por familia
- Migration inicial para SQLite (dev)

### Infraestrutura

- Monorepo com Turborepo + npm workspaces (apps/api, apps/web, packages/shared)
- NestJS API com Swagger em `/api/docs`
- Quasar/Vue 3 com suporte a PWA e Dark Mode
- Pacote `@raji/shared` com tipos, enums, constantes e validadores
- Docker Compose com PostgreSQL 16 (producao)
- GitHub Actions CI: lint, build, test
- ESLint flat config com suporte a TypeScript, Vue SFC e Jest
- Prettier + EditorConfig para consistencia
- Husky + lint-staged + commitlint (padrao de commits com emoji)
- Branches `main` e `develop`

### Seguranca

- Auditoria DevSecOps completa (OWASP Top 10)
- Remocao de segredos JWT hardcoded (agora exige env vars)
- Correcao de IDOR em `PATCH /families` (usa `@CurrentFamily()`)
- Design System com variaveis SCSS (274 linhas de tokens)

### Testes

- Backend: testes unitarios Auth e RBAC + teste E2E (multi-tenant)
- Frontend: 41 testes unitarios (Auth Store, RBAC Store, Guards, Services, Directives)
- Vitest configurado com happy-dom + Pinia testing

### Correcoes

- ESLint: Vue parser, browser globals, Jest globals
- tsconfig: tipos Quasar em monorepo (typeRoots)
- Prisma: remocao de enums para compatibilidade SQLite
- CI/CD: npm install sem lockfile, cache corrigido
- Build: erros TypeScript (parametros any implicitos)
- ApexCharts: peer dependency atualizada (^4 -> ^5.10)
- Quasar: downgrade @quasar/app-vite para compat Node 22.19

---

**25 commits** | **88+ arquivos fonte** | **Sprint 0 + Sprint 1 completas**
