# Security Audit — Sprint 0 + Sprint 1

**Data:** 2026-04-04
**Auditor:** Leandro Lockdown (DevSecOps)
**Escopo:** Backend (`apps/api/src/`), Frontend (`apps/web/src/`), Configuracao, Dependencias

---

## Resumo Executivo

**Aprovado com condicoes.**

O projeto apresenta uma base de seguranca solida para o estagio atual (Sprint 0 + Sprint 1). As principais preocupacoes sao:

- **1 vulnerabilidade Media** — Fallback de JWT secrets hardcoded no codigo-fonte
- **1 vulnerabilidade Media** — IDOR no endpoint `PATCH /families/:id` (falta verificar se `:id` pertence ao tenant do usuario)
- **2 vulnerabilidades Baixas** — Ausencia de rate limiting e helmet (headers de seguranca)
- **2 itens Info** — Swagger exposto sem restricao e ausencia de `.env.example`

Nenhuma vulnerabilidade critica foi encontrada. O codigo segue boas praticas de seguranca na maior parte.

---

## Checklist OWASP Top 10

| #   | OWASP Top 10 (2021)                      | Status                                                        |
| --- | ---------------------------------------- | ------------------------------------------------------------- |
| A1  | Broken Access Control                    | ⚠️ Atencao — IDOR em `PATCH /families/:id`                    |
| A2  | Cryptographic Failures                   | ✅ OK — bcrypt 12 rounds, refresh tokens hashados             |
| A3  | Injection (SQL/NoSQL)                    | ✅ OK — Prisma ORM (prepared statements), zero raw queries    |
| A4  | Insecure Design                          | ✅ OK — Multi-tenancy, RBAC, refresh token rotation           |
| A5  | Security Misconfiguration                | ⚠️ Atencao — Sem helmet, sem rate limiting, Swagger exposto   |
| A6  | Vulnerable and Outdated Components       | ✅ OK — Dependencias atualizadas (verificar `npm audit`)      |
| A7  | Identification and Authentication Fail.  | ⚠️ Atencao — JWT fallback secrets hardcoded                   |
| A8  | Software and Data Integrity Failures     | ✅ OK — Husky + commitlint + lint-staged                      |
| A9  | Security Logging and Monitoring Failures | ✅ OK — LoggingInterceptor registra method/url/status/duracao |
| A10 | Server-Side Request Forgery (SSRF)       | ✅ OK — Nao ha chamadas HTTP server-side para URLs externas   |

---

## Vulnerabilidades Encontradas

### [MEDIA] SEC-001: JWT Secrets com Fallback Hardcoded

**Descricao:** Os secrets JWT possuem valores fallback hardcoded no codigo-fonte (`'raji-dev-secret-change-in-prod'` e `'raji-dev-refresh-secret-change-in-prod'`). Se as variaveis de ambiente nao forem configuradas em producao, o sistema usara esses valores previsiveis.

**Localizacao:**

- `apps/api/src/modules/auth/auth.module.ts` (linha 18)
- `apps/api/src/modules/auth/auth.service.ts` (linhas 330, 342)
- `apps/api/src/modules/auth/strategies/jwt.strategy.ts` (linha 23)
- `apps/api/src/modules/auth/strategies/jwt-refresh.strategy.ts` (linhas 25-26)

**Impacto:** Em producao, se a variavel de ambiente estiver ausente, qualquer atacante poderia forjar JWTs validos com o secret publico.

**Recomendacao:** Remover os fallbacks e lancar erro se `JWT_SECRET` / `JWT_REFRESH_SECRET` nao estiverem definidos. **CORRIGIDO NESTE AUDIT.**

---

### [MEDIA] SEC-002: IDOR em `PATCH /families/:id`

**Descricao:** O endpoint `PATCH /families/:id` aceita um `:id` como parametro da URL, mas nao verifica se esse ID corresponde ao `familyId` do usuario autenticado. Um usuario poderia alterar o nome de qualquer familia enviando o ID alheio.

**Localizacao:**

- `apps/api/src/modules/families/families.controller.ts` (linha 29-37)

**Impacto:** Escalacao de privilegios entre tenants — um usuario master de uma familia poderia alterar dados de outra familia.

**Recomendacao:** Usar `@CurrentFamily()` ao inves do parametro `:id`, ou validar que `param.id === user.familyId`. **CORRIGIDO NESTE AUDIT.**

---

### [BAIXA] SEC-003: Ausencia de Rate Limiting

**Descricao:** Nao ha rate limiting em nenhum endpoint da API. Endpoints criticos como `POST /auth/login`, `POST /auth/register` e `POST /auth/refresh` estao vulneraveis a brute force.

**Localizacao:** `apps/api/src/main.ts`, `apps/api/src/app.module.ts`

**Impacto:** Possibilidade de brute force em senhas, abuso de registro, e DDoS na API.

**Recomendacao:** Instalar `@nestjs/throttler` e configurar limites:

- Global: 100 req/min
- Auth endpoints: 5 req/min por IP
- Prioridade para Sprint 2.

---

### [BAIXA] SEC-004: Ausencia de Helmet (Security Headers)

**Descricao:** A API nao usa `helmet` para definir headers de seguranca HTTP (X-Content-Type-Options, X-Frame-Options, Strict-Transport-Security, etc.).

**Localizacao:** `apps/api/src/main.ts`

**Impacto:** Exposicao a clickjacking, MIME sniffing e outros ataques baseados em headers.

**Recomendacao:** Instalar `helmet` e aplicar em `main.ts`. Prioridade para Sprint 2.

---

### [INFO] SEC-005: Swagger Exposto sem Restricao

**Descricao:** A documentacao Swagger esta acessivel em `/api/docs` sem autenticacao. Em producao, isso expoe a superficie de ataque da API.

**Localizacao:** `apps/api/src/main.ts` (linhas 28-36)

**Impacto:** Informacoes sobre endpoints, DTOs e modelos ficam publicas.

**Recomendacao:** Desabilitar Swagger em producao ou proteger com autenticacao:

```typescript
if (process.env.NODE_ENV !== 'production') {
  // setup swagger
}
```

---

### [INFO] SEC-006: Ausencia de `.env.example`

**Descricao:** Nao existe um arquivo `.env.example` para documentar as variaveis de ambiente necessarias. Isso pode levar a configuracoes incompletas.

**Localizacao:** Raiz do projeto e `apps/api/`

**Impacto:** Desenvolvedores podem esquecer de configurar variaveis criticas como `JWT_SECRET`.

**Recomendacao:** Criar `.env.example` com todas as variaveis necessarias (sem valores reais). **CRIADO NESTE AUDIT.**

---

## Boas Praticas Implementadas

### Autenticacao e JWT

- ✅ Access token com expiracao curta (15 minutos)
- ✅ Refresh token com expiracao de 7 dias
- ✅ Refresh token rotation (token antigo revogado ao usar)
- ✅ Deteccao de reutilizacao de refresh token (revoga todos os tokens do usuario)
- ✅ Refresh tokens armazenados como hash bcrypt no banco
- ✅ Token type validation (`access` vs `refresh`) previne confusao de tokens
- ✅ Verificacao de usuario ativo na validacao do JWT
- ✅ JWT guard aplicado globalmente com `@Public()` para excecoes

### Password Security

- ✅ bcrypt com 12 rounds (acima do minimo recomendado de 10)
- ✅ `passwordHash` nunca incluido em selects de resposta (DTOs controlam saida)
- ✅ Mensagem de erro generica em login ("Credenciais invalidas") — nao revela se email existe

### Multi-tenancy

- ✅ `familyId` em todos os modelos de dominio (schema Prisma)
- ✅ `TenantInterceptor` extrai familyId do JWT automaticamente
- ✅ `TenantService` com helpers para filtragem
- ✅ Queries em `users.service`, `families.service`, `rbac.service` filtram por `familyId`
- ✅ `@CurrentFamily()` decorator para acesso facil ao tenant

### Input Validation

- ✅ `ValidationPipe` global com `whitelist: true` e `forbidNonWhitelisted: true`
- ✅ DTOs com `class-validator` em todos os endpoints que recebem body
- ✅ Sanitizacao de slug com regex no `CreateGroupDto`
- ✅ Limites de tamanho (`MinLength`, `MaxLength`) em todos os campos string
- ✅ `@IsEmail()`, `@IsUrl()` para campos especificos

### SQL Injection

- ✅ Zero raw queries — 100% Prisma ORM (prepared statements)
- ✅ Nenhum uso de `$queryRaw` ou `$executeRaw`

### XSS

- ✅ Frontend Vue.js com template binding (auto-escape por padrao)
- ✅ Nenhum uso de `v-html`, `innerHTML` ou `dangerouslySetInnerHTML`
- ✅ API retorna JSON (Content-Type: application/json)

### CORS

- ✅ CORS configurado com `origin` restrito e `credentials: true`
- ✅ Origin lido de variavel de ambiente

### RBAC

- ✅ Sistema completo de grupos e permissoes (module:action)
- ✅ `PermissionGuard` com decorator `@CheckPermission()`
- ✅ Grupos padrao nao-deletaveis e grupo master nao-editavel
- ✅ Verificacao de grupo com usuarios antes de deletar

### Resposta de Erros

- ✅ `HttpExceptionFilter` padroniza respostas de erro (nao vaza stack traces)
- ✅ Erros internos logados no servidor, mensagem generica para o cliente

### Infraestrutura

- ✅ `.gitignore` abrangente (cobre `.env`, `*.db`, `node_modules`, `coverage/`)
- ✅ Husky + commitlint + lint-staged para qualidade de codigo
- ✅ docker-compose com postgres (sem secrets hardcoded em producao)

---

## Recomendacoes para Sprints Futuras

### Sprint 2 (Prioridade Alta)

1. **Rate Limiting** — Instalar `@nestjs/throttler`:
   - Global: 100 req/60s
   - Auth (`/login`, `/register`, `/refresh`): 5 req/60s por IP
   - Senhas: considerar exponential backoff apos N falhas
2. **Helmet** — Instalar e configurar `helmet` em `main.ts`
3. **Swagger em producao** — Desabilitar ou proteger com autenticacao

### Sprint 3+

4. **CSRF Protection** — Nao e critico enquanto a API usa Bearer tokens (SPA), mas considerar `SameSite` cookies se migrar para cookies de sessao
5. **Account Lockout** — Bloquear conta apos N tentativas de login falhas (ex: 5 falhas = lock de 15 min)
6. **Password Complexity** — Adicionar validacao de complexidade no `RegisterDto` (ex: `@Matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%])/)`)
7. **Audit Log** — Registrar acoes criticas (login, mudanca de permissoes, convites)
8. **Security Headers CSP** — Content Security Policy para o frontend
9. **Dependency Scanning** — Integrar `npm audit` no CI/CD pipeline
10. **Secrets Management** — Considerar vault (ex: AWS Secrets Manager, Doppler) para producao
11. **HTTPS Only** — Garantir que producao force HTTPS (HSTS header via helmet)
12. **Token Cleanup Cron** — Agendar `cleanupExpiredTokens()` para rodar periodicamente

---

## Correcoes Aplicadas Neste Audit

| ID      | Descricao                                     | Arquivo(s)                                                                        |
| ------- | --------------------------------------------- | --------------------------------------------------------------------------------- |
| SEC-001 | Remover fallback de JWT secrets (lancar erro) | `jwt.strategy.ts`, `jwt-refresh.strategy.ts`, `auth.module.ts`, `auth.service.ts` |
| SEC-002 | Corrigir IDOR em `PATCH /families/:id`        | `families.controller.ts`                                                          |
| SEC-006 | Criar `.env.example`                          | `apps/api/.env.example`                                                           |
