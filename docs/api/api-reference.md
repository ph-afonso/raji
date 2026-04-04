# Raji Finance - Referencia da API REST

> **Versao:** 0.1.0 (Sprint 1)  
> **Base URL:** `http://localhost:3000/api/v1`  
> **Swagger UI:** `http://localhost:3000/api/docs`  
> **Autenticacao:** Bearer Token (JWT)

---

## Visao Geral

Todas as respostas seguem o padrao:

```json
// Sucesso
{
  "success": true,
  "data": { ... }
}

// Erro
{
  "success": false,
  "error": {
    "code": "CODIGO_ERRO",
    "message": "Descricao do erro",
    "details": { ... }
  }
}
```

### Cabecalhos Obrigatorios

| Cabecalho       | Valor                  | Obrigatorio                     |
| --------------- | ---------------------- | ------------------------------- |
| `Content-Type`  | `application/json`     | Sim (em POST/PATCH/PUT)         |
| `Authorization` | `Bearer <accessToken>` | Sim (exceto endpoints publicos) |

### Validacao Global

A API utiliza `ValidationPipe` com as seguintes regras:

- **whitelist:** Campos nao declarados no DTO sao removidos automaticamente
- **forbidNonWhitelisted:** Campos nao permitidos geram erro 400
- **transform:** Payloads sao transformados para os tipos do DTO automaticamente

---

## Auth — Autenticacao

Endpoints publicos de registro, login, refresh de token e logout.

### POST /api/v1/auth/register

**Descricao:** Registrar novo usuario e familia. Cria automaticamente a familia, grupos padrao (Master, Membro Full, Dependente), categorias padrao e uma subscription de trial (15 dias).

**Auth:** Publico

**Body:**

| Campo        | Tipo     | Obrigatorio | Validacao                 |
| ------------ | -------- | ----------- | ------------------------- |
| `name`       | `string` | Sim         | Min 2, max 100 caracteres |
| `email`      | `string` | Sim         | Email valido              |
| `password`   | `string` | Sim         | Min 8, max 100 caracteres |
| `familyName` | `string` | Sim         | Min 2, max 100 caracteres |

**Exemplo de Request:**

```json
{
  "name": "Maria Silva",
  "email": "maria@email.com",
  "password": "Senh@F0rte123",
  "familyName": "Familia Silva"
}
```

**Response 201:**

```json
{
  "accessToken": "eyJhbGciOi...",
  "refreshToken": "eyJhbGciOi...",
  "user": {
    "id": "uuid",
    "email": "maria@email.com",
    "name": "Maria Silva",
    "familyId": "uuid",
    "groupId": "uuid",
    "isFamilyOwner": true
  }
}
```

**Erros possiveis:**

| Status | Descricao                                                           |
| ------ | ------------------------------------------------------------------- |
| 400    | Dados de validacao invalidos (campos ausentes, formatos incorretos) |
| 409    | Email ja cadastrado                                                 |

---

### POST /api/v1/auth/login

**Descricao:** Login com email e senha. Retorna tokens JWT e lista de permissoes do usuario.

**Auth:** Publico

**Body:**

| Campo       | Tipo     | Obrigatorio | Validacao                                             |
| ----------- | -------- | ----------- | ----------------------------------------------------- |
| `email`     | `string` | Sim         | Email valido                                          |
| `password`  | `string` | Sim         | String nao vazia                                      |
| `userAgent` | `string` | Nao         | Preenchido automaticamente pelo controller se ausente |
| `ipAddress` | `string` | Nao         | Preenchido automaticamente pelo controller se ausente |

**Exemplo de Request:**

```json
{
  "email": "maria@email.com",
  "password": "Senh@F0rte123"
}
```

**Response 200:**

```json
{
  "accessToken": "eyJhbGciOi...",
  "refreshToken": "eyJhbGciOi...",
  "user": {
    "id": "uuid",
    "email": "maria@email.com",
    "name": "Maria Silva",
    "familyId": "uuid",
    "groupId": "uuid",
    "isFamilyOwner": true,
    "group": {
      "id": "uuid",
      "name": "Master",
      "slug": "master"
    }
  },
  "permissions": ["accounts:create", "accounts:read", "transactions:create", "groups:update"]
}
```

**Erros possiveis:**

| Status | Descricao                                         |
| ------ | ------------------------------------------------- |
| 400    | Dados de validacao invalidos                      |
| 401    | Credenciais invalidas (email ou senha incorretos) |
| 401    | Conta desativada (`isActive = false`)             |

---

### POST /api/v1/auth/refresh

**Descricao:** Renovar access token usando refresh token. Implementa rotacao de refresh token (o token antigo e revogado e um novo par e gerado).

**Auth:** Publico (protegido pelo `JwtRefreshGuard`)

**Body:**

| Campo          | Tipo     | Obrigatorio | Validacao                     |
| -------------- | -------- | ----------- | ----------------------------- |
| `refreshToken` | `string` | Sim         | String nao vazia (JWT valido) |

**Exemplo de Request:**

```json
{
  "refreshToken": "eyJhbGciOi..."
}
```

**Response 200:**

```json
{
  "accessToken": "eyJhbGciOi...",
  "refreshToken": "eyJhbGciOi..."
}
```

**Erros possiveis:**

| Status | Descricao                                                                                   |
| ------ | ------------------------------------------------------------------------------------------- |
| 401    | Refresh token invalido (nao encontrado no banco)                                            |
| 401    | Refresh token expirado (TTL de 7 dias)                                                      |
| 401    | Refresh token revogado (possivel reutilizacao — todos os tokens do usuario sao invalidados) |
| 401    | Conta desativada                                                                            |

> **Nota de seguranca:** Se um refresh token revogado for reutilizado, o sistema interpreta como possivel roubo de token e revoga **todos** os tokens do usuario, forcando re-login em todos os dispositivos.

---

### POST /api/v1/auth/logout

**Descricao:** Logout do usuario — revoga o refresh token (ou todos os tokens se nenhum `tokenId` for fornecido).

**Auth:** Bearer Token (JWT)

**Body:** Nenhum

**Response 200:**

```json
{
  "message": "Logout realizado com sucesso"
}
```

**Erros possiveis:**

| Status | Descricao                           |
| ------ | ----------------------------------- |
| 401    | Token de acesso invalido ou ausente |

---

## Users — Usuarios

Endpoints para consulta e atualizacao de perfil. Todos requerem autenticacao.

### GET /api/v1/users/me

**Descricao:** Retorna os dados do usuario logado.

**Auth:** Bearer Token (JWT)

**Body:** Nenhum

**Response 200:**

```json
{
  "id": "uuid",
  "email": "maria@email.com",
  "name": "Maria Silva",
  "avatarUrl": null,
  "familyId": "uuid",
  "groupId": "uuid",
  "isFamilyOwner": true,
  "isActive": true,
  "createdAt": "2026-04-04T00:00:00.000Z",
  "updatedAt": "2026-04-04T00:00:00.000Z"
}
```

**Erros possiveis:**

| Status | Descricao                           |
| ------ | ----------------------------------- |
| 401    | Token de acesso invalido ou ausente |

---

### GET /api/v1/users/:id

**Descricao:** Retorna os dados de um usuario da mesma familia. O resultado e filtrado pelo `familyId` do usuario logado (isolamento multi-tenant).

**Auth:** Bearer Token (JWT)

**Parametros de URL:**

| Parametro | Tipo            | Descricao                 |
| --------- | --------------- | ------------------------- |
| `id`      | `string` (UUID) | ID do usuario a consultar |

**Response 200:**

```json
{
  "id": "uuid",
  "email": "joao@email.com",
  "name": "Joao Silva",
  "avatarUrl": null,
  "familyId": "uuid",
  "groupId": "uuid",
  "isFamilyOwner": false,
  "isActive": true
}
```

**Erros possiveis:**

| Status | Descricao                                    |
| ------ | -------------------------------------------- |
| 401    | Token de acesso invalido ou ausente          |
| 404    | Usuario nao encontrado (ou de outra familia) |

---

### PATCH /api/v1/users/me

**Descricao:** Atualizar perfil do usuario logado. Apenas os campos enviados serao atualizados.

**Auth:** Bearer Token (JWT)

**Body:**

| Campo       | Tipo     | Obrigatorio | Validacao        |
| ----------- | -------- | ----------- | ---------------- |
| `name`      | `string` | Nao         | Min 2 caracteres |
| `avatarUrl` | `string` | Nao         | URL valida       |

**Exemplo de Request:**

```json
{
  "name": "Maria Santos",
  "avatarUrl": "https://example.com/avatar.jpg"
}
```

**Response 200:**

```json
{
  "id": "uuid",
  "email": "maria@email.com",
  "name": "Maria Santos",
  "avatarUrl": "https://example.com/avatar.jpg",
  "updatedAt": "2026-04-04T12:00:00.000Z"
}
```

**Erros possiveis:**

| Status | Descricao                                                          |
| ------ | ------------------------------------------------------------------ |
| 400    | Dados de validacao invalidos (URL mal formatada, nome muito curto) |
| 401    | Token de acesso invalido ou ausente                                |

---

## Families — Familias

Endpoints para consulta e gestao da familia (tenant). Todos requerem autenticacao.

### GET /api/v1/families/me

**Descricao:** Retorna os dados da familia do usuario logado.

**Auth:** Bearer Token (JWT)

**Body:** Nenhum

**Response 200:**

```json
{
  "id": "uuid",
  "name": "Familia Silva",
  "createdAt": "2026-04-04T00:00:00.000Z",
  "updatedAt": "2026-04-04T00:00:00.000Z"
}
```

**Erros possiveis:**

| Status | Descricao                           |
| ------ | ----------------------------------- |
| 401    | Token de acesso invalido ou ausente |

---

### PATCH /api/v1/families/me

**Descricao:** Atualizar o nome da familia do usuario logado. Restrito ao usuario Master (titular) da familia.

**Auth:** Bearer Token (JWT)

**Restricao:** Apenas o usuario com `isFamilyOwner = true` pode executar esta acao.

**Body:**

| Campo  | Tipo     | Obrigatorio | Validacao                 |
| ------ | -------- | ----------- | ------------------------- |
| `name` | `string` | Sim         | Min 2, max 100 caracteres |

**Exemplo de Request:**

```json
{
  "name": "Familia Santos"
}
```

**Response 200:**

```json
{
  "id": "uuid",
  "name": "Familia Santos",
  "updatedAt": "2026-04-04T12:00:00.000Z"
}
```

**Erros possiveis:**

| Status | Descricao                                   |
| ------ | ------------------------------------------- |
| 400    | Dados de validacao invalidos                |
| 401    | Token de acesso invalido ou ausente         |
| 403    | Usuario nao e o titular (Master) da familia |

---

### GET /api/v1/families/me/members

**Descricao:** Listar todos os membros da familia do usuario logado.

**Auth:** Bearer Token (JWT)

**Body:** Nenhum

**Response 200:**

```json
[
  {
    "id": "uuid",
    "name": "Maria Silva",
    "email": "maria@email.com",
    "avatarUrl": null,
    "groupId": "uuid",
    "isFamilyOwner": true,
    "isActive": true
  },
  {
    "id": "uuid",
    "name": "Joao Silva",
    "email": "joao@email.com",
    "avatarUrl": null,
    "groupId": "uuid",
    "isFamilyOwner": false,
    "isActive": true
  }
]
```

**Erros possiveis:**

| Status | Descricao                           |
| ------ | ----------------------------------- |
| 401    | Token de acesso invalido ou ausente |

---

## RBAC — Grupos e Permissoes

Endpoints para gerenciamento de grupos e permissoes. Todos requerem autenticacao e sao protegidos pelo `PermissionGuard`. O prefixo de rota e `/groups`.

### GET /api/v1/groups

**Descricao:** Listar todos os grupos da familia.

**Auth:** Bearer Token (JWT)

**Permissao:** `groups:read`

**Body:** Nenhum

**Response 200:**

```json
[
  {
    "id": "uuid",
    "name": "Master",
    "slug": "master",
    "description": "Titular da familia — acesso total",
    "isDefault": true,
    "familyId": "uuid"
  },
  {
    "id": "uuid",
    "name": "Membro Full",
    "slug": "member-full",
    "description": "Acesso completo a financas, sem billing/RBAC",
    "isDefault": true,
    "familyId": "uuid"
  },
  {
    "id": "uuid",
    "name": "Dependente",
    "slug": "dependent",
    "description": "Somente leitura",
    "isDefault": true,
    "familyId": "uuid"
  }
]
```

**Erros possiveis:**

| Status | Descricao                           |
| ------ | ----------------------------------- |
| 401    | Token de acesso invalido ou ausente |
| 403    | Sem permissao `groups:read`         |

---

### POST /api/v1/groups

**Descricao:** Criar um grupo customizado para a familia.

**Auth:** Bearer Token (JWT)

**Permissao:** `groups:create`

**Body:**

| Campo         | Tipo     | Obrigatorio | Validacao                                                                             |
| ------------- | -------- | ----------- | ------------------------------------------------------------------------------------- |
| `name`        | `string` | Sim         | Min 2, max 50 caracteres                                                              |
| `slug`        | `string` | Sim         | Min 2, max 50 caracteres. Apenas letras minusculas, numeros e hifens (`^[a-z0-9-]+$`) |
| `description` | `string` | Nao         | Max 200 caracteres                                                                    |

**Exemplo de Request:**

```json
{
  "name": "Gerente Financeiro",
  "slug": "gerente-financeiro",
  "description": "Pode gerenciar contas e transacoes"
}
```

**Response 201:**

```json
{
  "id": "uuid",
  "name": "Gerente Financeiro",
  "slug": "gerente-financeiro",
  "description": "Pode gerenciar contas e transacoes",
  "isDefault": false,
  "familyId": "uuid",
  "createdAt": "2026-04-04T00:00:00.000Z"
}
```

**Erros possiveis:**

| Status | Descricao                                                                     |
| ------ | ----------------------------------------------------------------------------- |
| 400    | Dados de validacao invalidos (slug com caracteres invalidos, campos ausentes) |
| 401    | Token de acesso invalido ou ausente                                           |
| 403    | Sem permissao `groups:create`                                                 |
| 409    | Slug ja existe na familia                                                     |

---

### PATCH /api/v1/groups/:id

**Descricao:** Atualizar um grupo existente.

**Auth:** Bearer Token (JWT)

**Permissao:** `groups:update`

**Parametros de URL:**

| Parametro | Tipo            | Descricao   |
| --------- | --------------- | ----------- |
| `id`      | `string` (UUID) | ID do grupo |

**Body:**

| Campo         | Tipo     | Obrigatorio | Validacao                |
| ------------- | -------- | ----------- | ------------------------ |
| `name`        | `string` | Nao         | Min 2, max 50 caracteres |
| `description` | `string` | Nao         | Max 200 caracteres       |

**Exemplo de Request:**

```json
{
  "name": "Gerente Financeiro Senior",
  "description": "Acesso ampliado"
}
```

**Response 200:**

```json
{
  "id": "uuid",
  "name": "Gerente Financeiro Senior",
  "slug": "gerente-financeiro",
  "description": "Acesso ampliado",
  "updatedAt": "2026-04-04T12:00:00.000Z"
}
```

**Erros possiveis:**

| Status | Descricao                                  |
| ------ | ------------------------------------------ |
| 400    | Dados de validacao invalidos               |
| 401    | Token de acesso invalido ou ausente        |
| 403    | Sem permissao `groups:update`              |
| 404    | Grupo nao encontrado (ou de outra familia) |

---

### DELETE /api/v1/groups/:id

**Descricao:** Deletar um grupo. Nao e permitido deletar grupos padrao (`isDefault = true`).

**Auth:** Bearer Token (JWT)

**Permissao:** `groups:delete`

**Parametros de URL:**

| Parametro | Tipo            | Descricao   |
| --------- | --------------- | ----------- |
| `id`      | `string` (UUID) | ID do grupo |

**Response 200:**

```json
{
  "deleted": true
}
```

**Erros possiveis:**

| Status | Descricao                                  |
| ------ | ------------------------------------------ |
| 400    | Tentativa de deletar grupo padrao          |
| 401    | Token de acesso invalido ou ausente        |
| 403    | Sem permissao `groups:delete`              |
| 404    | Grupo nao encontrado (ou de outra familia) |

---

### GET /api/v1/groups/permissions

**Descricao:** Listar todas as permissoes disponiveis no sistema. Retorna a lista global de permissoes que podem ser atribuidas a grupos.

**Auth:** Bearer Token (JWT)

**Body:** Nenhum

**Response 200:**

```json
[
  {
    "id": "uuid",
    "module": "accounts",
    "action": "create",
    "description": "Criar contas"
  },
  {
    "id": "uuid",
    "module": "accounts",
    "action": "read",
    "description": "Visualizar contas"
  },
  {
    "id": "uuid",
    "module": "transactions",
    "action": "create",
    "description": "Criar transacoes"
  }
]
```

**Erros possiveis:**

| Status | Descricao                           |
| ------ | ----------------------------------- |
| 401    | Token de acesso invalido ou ausente |

---

### PUT /api/v1/groups/:id/permissions

**Descricao:** Atualizar (substituir) as permissoes de um grupo. A lista de `permissionIds` enviada substituira completamente as permissoes atuais do grupo.

**Auth:** Bearer Token (JWT)

**Permissao:** `groups:update`

**Parametros de URL:**

| Parametro | Tipo            | Descricao   |
| --------- | --------------- | ----------- |
| `id`      | `string` (UUID) | ID do grupo |

**Body:**

| Campo           | Tipo       | Obrigatorio | Validacao                    |
| --------------- | ---------- | ----------- | ---------------------------- |
| `permissionIds` | `string[]` | Sim         | Array de UUIDs de permissoes |

**Exemplo de Request:**

```json
{
  "permissionIds": [
    "uuid-perm-accounts-read",
    "uuid-perm-accounts-create",
    "uuid-perm-transactions-read",
    "uuid-perm-transactions-create"
  ]
}
```

**Response 200:**

```json
{
  "groupId": "uuid",
  "permissions": [
    { "id": "uuid", "module": "accounts", "action": "read" },
    { "id": "uuid", "module": "accounts", "action": "create" },
    { "id": "uuid", "module": "transactions", "action": "read" },
    { "id": "uuid", "module": "transactions", "action": "create" }
  ]
}
```

**Erros possiveis:**

| Status | Descricao                                               |
| ------ | ------------------------------------------------------- |
| 400    | IDs de permissao invalidos ou grupo padrao nao editavel |
| 401    | Token de acesso invalido ou ausente                     |
| 403    | Sem permissao `groups:update`                           |
| 404    | Grupo nao encontrado (ou de outra familia)              |

---

## Resumo de Endpoints

| Metodo | Endpoint                         | Auth      | Permissao       | Descricao                     |
| ------ | -------------------------------- | --------- | --------------- | ----------------------------- |
| POST   | `/api/v1/auth/register`          | Publico   | -               | Registrar usuario e familia   |
| POST   | `/api/v1/auth/login`             | Publico   | -               | Login                         |
| POST   | `/api/v1/auth/refresh`           | Publico\* | -               | Renovar tokens                |
| POST   | `/api/v1/auth/logout`            | Bearer    | -               | Logout                        |
| GET    | `/api/v1/users/me`               | Bearer    | -               | Dados do usuario logado       |
| GET    | `/api/v1/users/:id`              | Bearer    | -               | Dados de usuario da familia   |
| PATCH  | `/api/v1/users/me`               | Bearer    | -               | Atualizar perfil              |
| GET    | `/api/v1/families/me`            | Bearer    | -               | Dados da familia              |
| PATCH  | `/api/v1/families/me`            | Bearer    | Master only     | Atualizar familia             |
| GET    | `/api/v1/families/me/members`    | Bearer    | -               | Listar membros                |
| GET    | `/api/v1/groups`                 | Bearer    | `groups:read`   | Listar grupos                 |
| POST   | `/api/v1/groups`                 | Bearer    | `groups:create` | Criar grupo                   |
| PATCH  | `/api/v1/groups/:id`             | Bearer    | `groups:update` | Atualizar grupo               |
| DELETE | `/api/v1/groups/:id`             | Bearer    | `groups:delete` | Deletar grupo                 |
| GET    | `/api/v1/groups/permissions`     | Bearer    | -               | Listar permissoes             |
| PUT    | `/api/v1/groups/:id/permissions` | Bearer    | `groups:update` | Atualizar permissoes do grupo |

> \*O endpoint `/auth/refresh` e publico mas protegido pelo `JwtRefreshGuard`, que valida o refresh token JWT.

---

## Codigos de Erro Comuns

| Codigo HTTP | Descricao                                                      |
| ----------- | -------------------------------------------------------------- |
| 400         | Bad Request — dados de validacao invalidos                     |
| 401         | Unauthorized — token ausente, invalido ou expirado             |
| 403         | Forbidden — sem permissao para a acao (RBAC)                   |
| 404         | Not Found — recurso nao encontrado                             |
| 409         | Conflict — recurso ja existe (email duplicado, slug duplicado) |
| 500         | Internal Server Error — erro inesperado no servidor            |

## Modelo de Permissoes

As permissoes sao definidas no formato `modulo:acao`. Os modulos e acoes disponiveis no sistema:

| Modulo          | Acoes                                          |
| --------------- | ---------------------------------------------- |
| `accounts`      | `create`, `read`, `update`, `delete`           |
| `transactions`  | `create`, `read`, `update`, `delete`, `import` |
| `categories`    | `create`, `read`, `update`, `delete`           |
| `budgets`       | `create`, `read`, `update`, `delete`           |
| `savings_goals` | `create`, `read`, `update`, `delete`           |
| `recurring`     | `create`, `read`, `update`, `delete`           |
| `family`        | `read`, `update`                               |
| `members`       | `read`, `invite`, `remove`, `change_group`     |
| `groups`        | `create`, `read`, `update`, `delete`           |
| `billing`       | `read`, `manage`                               |
| `reports`       | `read`                                         |
| `notifications` | `read`, `manage`                               |

---

_Documentacao gerada por Tatiana Texto — Technical Writer da Raji_  
_Sprint 1 | 2026-04-04_
