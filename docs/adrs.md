# Raji Finance - Architecture Decision Records (ADRs)

---

## ADR-001: Monorepo com Turborepo e npm Workspaces

**Status:** Aceita  
**Data:** 2026-04-04  
**Autores:** Arthur Arquitetura (Raji Dev Team)

### Contexto

O Raji Finance possui dois aplicativos principais (API NestJS e Frontend Vue/Quasar) que compartilham tipos TypeScript, enums, constantes e schemas de validacao. Precisamos decidir entre manter tudo em um unico repositorio (monorepo) ou separar em repos individuais.

### Decisao

Adotar **monorepo** com a seguinte estrutura:
- **npm Workspaces** para gerenciar dependencias e links entre pacotes
- **Turborepo** para orquestrar builds, testes e lint com cache inteligente
- Tres workspaces: `apps/api`, `apps/web`, `packages/shared`

### Consequencias

**Positivas:**
- Tipos compartilhados (`@raji/shared`) usados por ambos os apps sem publicar no npm
- Um unico PR pode alterar frontend + backend + tipos de forma atomica
- CI/CD unificado: uma pipeline para tudo
- Turborepo oferece cache de build remoto, acelerando CI em 50-70%
- Refatoracoes que afetam o contrato API sao detectadas no build
- Experiencia de desenvolvimento simplificada: um `git clone`, um `npm install`

**Negativas:**
- Repositorio maior (mais tempo no clone inicial)
- Precisa de disciplina na organizacao de pastas
- Deploy precisa considerar que nem tudo mudou (Turborepo resolve com `--filter`)
- Curva de aprendizado inicial com Turborepo

### Alternativas Consideradas

| Alternativa | Por que descartada |
|-------------|-------------------|
| **Repos separados** | Compartilhamento de tipos exigiria publicar pacote npm privado, sincronizacao de versoes complexa, PRs fragmentados |
| **Monorepo com Nx** | Nx e mais completo mas mais complexo; Turborepo e suficiente para nosso escopo e mais leve |
| **Monorepo com Lerna** | Lerna esta em manutencao (adquirido pela Nx), comunidade migrando para Turborepo |

---

## ADR-002: Multi-Tenancy com `family_id` Compartilhado

**Status:** Aceita  
**Data:** 2026-04-04  
**Autores:** Arthur Arquitetura (Raji Dev Team)

### Contexto

O Raji Finance e um SaaS multi-tenant onde cada "familia" representa um tenant isolado. Os dados financeiros de uma familia nao devem ser acessiveis por outra. Precisamos escolher a estrategia de isolamento.

### Decisao

Adotar **banco de dados compartilhado com coluna discriminadora** (`family_id`):
- Todas as tabelas de dados de negocio possuem `family_id` como FK para `Family`
- Um **Tenant Interceptor** global no NestJS injeta o `family_id` (extraido do JWT) no contexto de cada request
- Todas as queries sao filtradas por `family_id` na camada de service
- Indices compostos `(family_id, ...)` em todas as tabelas para performance

### Consequencias

**Positivas:**
- Custo baixo: um unico banco de dados para todos os tenants
- Simples de implementar com Prisma (where clause)
- Migrações aplicadas uma unica vez para todos os tenants
- Facil de fazer backup e restaurar (banco unico)
- Escalavel para dezenas de milhares de familias em um unico banco PostgreSQL

**Negativas:**
- Risco de "vazamento" de dados se uma query esquecer o filtro `family_id` — mitigado pelo Tenant Interceptor e testes automatizados
- Noisy neighbor: uma familia com muitos dados pode impactar outras — mitigado por rate limiting e indices adequados
- Nao permite customizacao de schema por tenant (nao necessario neste produto)

### Alternativas Consideradas

| Alternativa | Por que descartada |
|-------------|-------------------|
| **Banco por tenant** | Custo alto (uma instancia PostgreSQL por familia), migrações complexas, nao escalavel para SaaS B2C |
| **Schema por tenant** | Complexidade de gerenciar schemas dinamicamente, migrações multiplicadas, PostgreSQL nao escala bem com milhares de schemas |
| **Row-Level Security (RLS)** | Boa opcao tecnica, mas adiciona complexidade no Prisma (que nao tem suporte nativo a RLS). Podemos migrar para RLS no futuro se necessario |

### Notas de Seguranca

- **Nunca** expor o `family_id` em URLs publicas de forma previsivel (usar UUID)
- **Sempre** validar que o `family_id` do JWT corresponde ao recurso acessado
- Testes E2E devem incluir cenario de "tentativa de acesso cross-tenant"
- Code review deve verificar presenca de filtro `family_id` em toda query nova

---

## ADR-003: RBAC com Grupos Hibridos (Padrao + Customizaveis)

**Status:** Aceita  
**Data:** 2026-04-04  
**Autores:** Arthur Arquitetura (Raji Dev Team)

### Contexto

O sistema precisa de controle de acesso granular para diferentes perfis de usuario dentro de uma familia: o titular (pai/mae), membros adultos com acesso total, e dependentes com acesso limitado. Alem disso, familias podem querer criar perfis customizados.

### Decisao

Adotar **RBAC baseado em grupos com permissoes granulares**, operando em 4 camadas:

**Grupos padrao (seedados na criacao da familia):**
- `master` — Todas as permissoes. Nao editavel. Atribuido ao criador da familia.
- `member-full` — CRUD completo em modulos financeiros. Sem acesso a billing e RBAC.
- `dependent` — Somente leitura em tudo.

**Grupos customizaveis:**
- O Master pode criar grupos com qualquer combinacao de permissoes
- Permissoes sao definidas como `modulo:acao` (ex: `transactions:create`)

**4 camadas de enforcement:**
1. **Menu/Navegacao** — Sidebar filtra items por permissao do usuario
2. **Acesso a Telas** — Navigation Guard no Vue Router verifica `meta.permission`
3. **Acoes CRUD** — Diretiva `v-perm` esconde/desabilita botoes
4. **Backend Guards** — Decorator `@CheckPermission('modulo', 'acao')` no NestJS

### Consequencias

**Positivas:**
- Flexibilidade: grupos padrao cobrem 90% dos casos, customizaveis cobrem o resto
- Granularidade: permissoes por modulo + acao permitem controle fino
- 4 camadas: defesa em profundidade (frontend nao confia, backend valida)
- Escalavel: adicionar novos modulos/acoes e trivial (nova row na tabela Permission)
- UX: Master pode criar grupo "Adolescente" que ve tudo mas so cria despesas

**Negativas:**
- Complexidade maior que um RBAC simples de 3 roles fixas
- Matriz de permissoes pode ser confusa para usuarios menos tecnicos — mitigado com UI intuitiva (matriz checkbox)
- Cache de permissoes necessario no frontend para evitar requests a cada verificacao

### Alternativas Consideradas

| Alternativa | Por que descartada |
|-------------|-------------------|
| **Roles fixas (admin/member/viewer)** | Insuficiente para o caso de uso; familias tem necessidades variadas |
| **ABAC (Attribute-Based)** | Overkill para o escopo; regras baseadas em atributos adicionam complexidade desnecessaria |
| **ACL por recurso** | Granularidade excessiva (permissao por transacao individual); nao se aplica ao dominio |
| **CASL.js** | Biblioteca robusta, mas adiciona dependencia pesada; nosso RBAC e simples o suficiente para implementar do zero |

---

## ADR-004: JWT + Refresh Token para Autenticacao

**Status:** Aceita  
**Data:** 2026-04-04  
**Autores:** Arthur Arquitetura (Raji Dev Team)

### Contexto

A aplicacao e uma PWA que precisa de autenticacao stateless para escalar horizontalmente. Usuarios precisam permanecer logados por periodos razoaveis sem comprometer a seguranca.

### Decisao

Adotar **JWT (Access Token) + Refresh Token com rotacao**:

- **Access Token:** JWT assinado, TTL de 15 minutos, contendo `userId`, `familyId`, `groupId`
- **Refresh Token:** UUID opaco, TTL de 7 dias, armazenado como hash bcrypt no banco
- **Rotacao:** cada uso do refresh token gera um novo par (access + refresh) e revoga o anterior
- **Passport.js** com strategy JWT no NestJS
- **Algoritmo:** HS256 em dev, RS256 em producao

### Consequencias

**Positivas:**
- Stateless: API nao precisa consultar sessao a cada request (JWT auto-contido)
- Seguro: access token curto (15min) limita janela de ataque; refresh token rotacionado previne replay
- Escalavel: nenhum estado de sessao no servidor (exceto refresh tokens no DB)
- `familyId` e `groupId` no payload do JWT evitam queries extras de RBAC/tenant
- Compativel com multiplos dispositivos (cada dispositivo tem seu refresh token)

**Negativas:**
- Access token nao pode ser revogado antes da expiracao (15min de janela) — aceitavel para o caso de uso
- Refresh tokens no DB adicionam uma query por renovacao — custo baixo
- Payload do JWT deve ser mantido pequeno (nao incluir permissoes detalhadas, apenas groupId)

### Alternativas Consideradas

| Alternativa | Por que descartada |
|-------------|-------------------|
| **Sessoes server-side (cookie)** | Stateful, nao escala horizontalmente sem Redis; incompativel com modelo PWA/SPA |
| **JWT sem refresh token** | Exigiria TTL longo (dias), aumentando janela de ataque drasticamente |
| **OAuth 2.0 completo (Authorization Server)** | Overkill; nao temos provedores externos no MVP. Podemos adicionar depois (Google, Apple login) |
| **Paseto (Platform-Agnostic Security Tokens)** | Mais seguro que JWT por design, mas ecossistema menor; NestJS/Passport nao tem suporte nativo |

### Fluxo de Seguranca

1. Login retorna `accessToken` + `refreshToken`
2. Frontend armazena access token em memoria (Pinia store) e refresh token em `httpOnly cookie` ou `localStorage`
3. Axios interceptor adiciona `Authorization: Bearer <accessToken>` em cada request
4. Ao receber 401, interceptor tenta refresh automatico (uma unica vez)
5. Se refresh falhar, redireciona para login
6. Logout revoga refresh token no backend

---

## ADR-005: Prisma como ORM

**Status:** Aceita  
**Data:** 2026-04-04  
**Autores:** Arthur Arquitetura (Raji Dev Team)

### Contexto

Precisamos de um ORM para interagir com o banco de dados (PostgreSQL em producao, SQLite em dev). O ORM deve oferecer type-safety, migrações automaticas e boa experiencia de desenvolvimento.

### Decisao

Adotar **Prisma ORM** como unica camada de acesso ao banco de dados:
- Schema declarativo em `schema.prisma`
- Migrações gerenciadas pelo `prisma migrate`
- Client type-safe gerado automaticamente (`@prisma/client`)
- Prisma Studio para debug visual

### Consequencias

**Positivas:**
- Type-safety completo: queries tipadas, autocomplete no VS Code
- Schema como fonte de verdade: modelo de dados documentado e versionado
- Migrações automaticas e deterministicas
- Prisma Studio acelera debug e exploracao de dados
- Suporta PostgreSQL e SQLite com o mesmo schema (troca via `DATABASE_URL`)
- Comunidade ativa e boa documentacao
- Integracao nativa com NestJS (`@nestjs/prisma` ou wrapper simples)

**Negativas:**
- Queries complexas (subqueries, CTEs, window functions) exigem `$queryRaw`
- Nao suporta RLS nativamente (relevante para multi-tenancy avancado)
- Prisma Client e gerado, aumentando tamanho do bundle (mitigado com tree-shaking)
- Overhead minimo vs query builder puro (aceitavel para o escopo)

### Alternativas Consideradas

| Alternativa | Por que descartada |
|-------------|-------------------|
| **TypeORM** | Type-safety inferior ao Prisma; API menos ergonomica; bugs historicos com migrações |
| **Drizzle ORM** | Mais leve e flexivel, mas ecossistema menor; menos integracao pronta com NestJS |
| **Knex.js (Query Builder)** | Sem type-safety nativo; exige escrever tipos manualmente; migrações manuais |
| **MikroORM** | Bom ORM, mas comunidade menor que Prisma; curva de aprendizado maior |
| **SQL puro** | Maximo controle, mas sem type-safety, sem migrações automaticas, alto risco de erros |

### Padroes de Uso

```typescript
// Injecao no NestJS via PrismaService
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}

// Uso nos services com tenant isolation
async findAll(familyId: string) {
  return this.prisma.transaction.findMany({
    where: { familyId },
    include: { category: true, account: true },
    orderBy: { date: 'desc' },
  });
}
```

---

## ADR-006: Stripe + Pix para Billing

**Status:** Aceita  
**Data:** 2026-04-04  
**Autores:** Arthur Arquitetura (Raji Dev Team)

### Contexto

O modelo de monetizacao do Raji Finance e freemium com:
- Assinatura mensal recorrente (titular)
- Cobranca unica por membro adicional
- Trial de 15 dias
- Paywall em caso de inadimplencia

Precisamos de um gateway de pagamento que suporte assinaturas recorrentes e pagamentos unicos, com suporte a cartao de credito e Pix (essencial para o mercado brasileiro).

### Decisao

Adotar **Stripe como gateway principal** + **Pix via PSP dedicado ou Stripe Brazil**:

- **Stripe Subscriptions** para assinatura mensal recorrente
- **Stripe Payment Intents** para cobranca unica de membro adicional
- **Stripe Checkout** (hosted) para a pagina de pagamento — reduz escopo PCI-DSS
- **Stripe Webhooks** para sincronizar status de pagamento
- **Pix:** usar Stripe Brazil (se disponivel) ou PSP dedicado (ex: Mercado Pago, PagSeguro, Asaas) para QR Code Pix

### Consequencias

**Positivas:**
- Stripe e o padrao da industria para SaaS: API robusta, documentacao excelente
- Stripe Checkout reduz escopo de seguranca (PCI-DSS nivel 1 delegado ao Stripe)
- Webhooks confiáveis com retry automatico
- Suporte nativo a assinaturas, trial, grace period, cancelamento
- Stripe Dashboard para acompanhar metricas (MRR, churn, etc.)
- Pix cobre o publico que nao usa cartao de credito (relevante no Brasil)

**Negativas:**
- Taxas do Stripe (~3.99% + R$0.39 por transacao no Brasil)
- Complexidade de manter dois provedores se Pix for via PSP separado
- Webhooks exigem tratamento de idempotencia e ordem de eventos
- Stripe Brazil pode ter limitacoes vs Stripe US

### Alternativas Consideradas

| Alternativa | Por que descartada |
|-------------|-------------------|
| **Apenas Mercado Pago** | API menos robusta para SaaS recorrente; menos features de subscription |
| **PagSeguro** | API defasada; suporte a subscription limitado |
| **Asaas** | Bom para boleto/pix brasileiros, mas menos robusto que Stripe para subscription management |
| **Implementacao propria de billing** | Risco altissimo; billing e dominio complexo (proration, dunning, receipts); nao reinventar a roda |

### Arquitetura de Webhooks

```
Stripe → POST /webhooks/stripe → Verificar assinatura → Processar evento

Eventos tratados:
- customer.subscription.created → Atualizar status para ACTIVE
- customer.subscription.updated → Atualizar periodo/status
- customer.subscription.deleted → Marcar como CANCELED
- invoice.payment_succeeded → Registrar Payment, manter ACTIVE
- invoice.payment_failed → Marcar como PAST_DUE, iniciar grace period
- payment_intent.succeeded → Confirmar MemberSlot (one-time)
- checkout.session.completed → Processar checkout
```

---

## ADR-007: PWA-First para Mobile

**Status:** Aceita  
**Data:** 2026-04-04  
**Autores:** Arthur Arquitetura (Raji Dev Team)

### Contexto

O Raji Finance precisa funcionar bem em dispositivos moveis. A maioria dos usuarios consultara suas financas pelo celular. Precisamos decidir entre: app nativo, hibrido (Capacitor/Cordova), React Native/Flutter, ou PWA.

### Decisao

Adotar **PWA (Progressive Web App)** como estrategia mobile-first:

- **Quasar Framework** ja tem suporte nativo a PWA (service worker, manifest, etc.)
- **Web Push Notifications** para alertas (fase 1)
- **Responsividade completa** usando breakpoints Quasar (`$q.screen`)
- **Instalavel** via "Add to Home Screen" no Android e iOS
- Avaliar app nativo (Capacitor) apenas se houver necessidade de features nativas (NFC, biometria avancada)

### Consequencias

**Positivas:**
- Uma unica codebase para web + mobile
- Deploy instantaneo (sem aprovacao de App Store)
- Quasar tem componentes mobile-first prontos (pull-to-refresh, swipe, bottom sheet)
- Service Worker permite cache offline basico (leitura de dados)
- Custo de desenvolvimento drasticamente menor que app nativo
- Web Push funciona no Android (Chrome, Edge, Firefox) e iOS 16.4+
- Sem taxa de 15-30% da App Store/Play Store

**Negativas:**
- iOS tem limitacoes com PWA: push notifications so a partir do iOS 16.4, sem background sync confiavel
- Nao aparece nas App Stores (menor discoverability) — mitigado: publico-alvo e organico/referral
- Offline limitado: caching de dados financeiros offline e complexo (conflitos de sync)
- Sem acesso a recursos nativos avancados (NFC, Bluetooth, biometria facial)

### Alternativas Consideradas

| Alternativa | Por que descartada |
|-------------|-------------------|
| **App nativo (Swift + Kotlin)** | Custo 3-4x maior; duas codebases; time pequeno |
| **React Native / Flutter** | Exigiria reescrever frontend; nao aproveita Quasar/Vue |
| **Capacitor (hibrido)** | Boa opcao futura, mas adiciona complexidade; PWA cobre o MVP. Pode ser adicionado depois se necessario |
| **Electron (desktop)** | Desktop nao e prioridade; web responsiva cobre esse caso |

### Estrategia de PWA

```javascript
// quasar.config.js
pwa: {
  workboxMode: 'InjectManifest', // Controle total do service worker
  manifest: {
    name: 'Raji Finance',
    short_name: 'Raji',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#ffffff',
    theme_color: '#1976D2',
    icons: [/* ... */],
  },
},
```

### Roadmap de Evolucao

1. **MVP (PWA):** Responsiva, instalavel, push notifications
2. **V1.1:** Offline read (cache de dashboard e transacoes recentes via Service Worker)
3. **V2.0 (se necessario):** Capacitor wrapper para publicar na Play Store / App Store
4. **Futuro:** Biometria nativa, widgets, NFC (via Capacitor)

---

## Indice de ADRs

| ID | Titulo | Status |
|----|--------|--------|
| ADR-001 | Monorepo com Turborepo e npm Workspaces | Aceita |
| ADR-002 | Multi-Tenancy com `family_id` Compartilhado | Aceita |
| ADR-003 | RBAC com Grupos Hibridos (Padrao + Customizaveis) | Aceita |
| ADR-004 | JWT + Refresh Token para Autenticacao | Aceita |
| ADR-005 | Prisma como ORM | Aceita |
| ADR-006 | Stripe + Pix para Billing | Aceita |
| ADR-007 | PWA-First para Mobile | Aceita |
