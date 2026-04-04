# Raji Finance

Plataforma SaaS de controle financeiro familiar — transparente, colaborativa e segura.

## Sobre

O **Raji Finance** consolida receitas e despesas de todos os membros da familia em um unico ambiente, com controle rigoroso de permissoes por grupo (RBAC). Cada membro acessa apenas o que lhe e de direito.

## Stack

| Camada       | Tecnologia                                       |
| ------------ | ------------------------------------------------ |
| **Frontend** | Vue.js 3 + Quasar Framework + Pinia + ApexCharts |
| **Backend**  | NestJS + TypeScript + Prisma ORM + Passport JWT  |
| **Database** | PostgreSQL (prod) / SQLite (dev)                 |
| **Infra**    | Docker + GitHub Actions + Turborepo              |

## Estrutura do Monorepo

```
raji-finance/
├── apps/
│   ├── api/          # Backend NestJS
│   └── web/          # Frontend Vue.js + Quasar
├── packages/
│   └── shared/       # Tipos, enums e validadores compartilhados
└── docs/             # Documentacao do projeto
```

## Funcionalidades

- Multi-contas (bancarias, carteiras, cartoes de credito)
- Lancamentos com categorias e subcategorias
- Transacoes recorrentes automatizadas
- Orcamentos por categoria com alertas visuais
- Metas de economia com barra de progresso
- Dashboard interativo com graficos
- Importacao de extratos CSV/OFX
- Controle de acesso por grupos (RBAC 4 camadas)
- PWA instalavel com push notifications
- Multi-tenant (SaaS multi-familia)

## Modelo de Negocio

- **Trial:** 15 dias com acesso completo
- **Assinatura mensal:** Titular da familia
- **Add-on:** Taxa unica por membro adicional
- **Pagamento:** Stripe (cartao) + Pix

## Documentacao

Consulte o [indice completo da documentacao](docs/README.md) para navegar todos os documentos.

| Documento                                            | Descricao                               |
| ---------------------------------------------------- | --------------------------------------- |
| [Briefing](docs/product/briefing.md)                 | Visao geral do produto e requisitos     |
| [Arquitetura](docs/architecture/architecture.md)     | Arquitetura tecnica, modulos, diagramas |
| [Schema Prisma](docs/architecture/prisma-schema.md)  | Modelo de dados completo (20 tabelas)   |
| [ADRs](docs/architecture/adrs.md)                    | Decisoes arquiteturais documentadas     |
| [API Reference](docs/api/api-reference.md)           | Referencia completa dos endpoints       |
| [Getting Started](docs/guides/getting-started.md)    | Setup e primeiros passos                |
| [Sprint Planning](docs/planning/sprint-planning.md)  | Planejamento de sprints e backlog       |
| [Seguranca Sprint 1](docs/security/sprint1-audit.md) | Auditoria de seguranca                  |
| [Release v0.1.0](docs/releases/v0.1.0.md)            | Release notes                           |

## Padrao de Commits

```
<emoji> <Tipo>: <Descricao breve>
```

| Emoji | Tipo     | Uso                                 |
| ----- | -------- | ----------------------------------- |
| ✨    | Feat     | Nova funcionalidade                 |
| 🐛    | Fix      | Correcao de bug                     |
| 🔥    | Hotfix   | Correcao critica em producao        |
| ♻️    | Refactor | Refatoracao sem mudar comportamento |
| 🧪    | Test     | Adicionar ou corrigir testes        |
| 📝    | Docs     | Documentacao                        |
| 🚀    | Deploy   | Deploy e infra                      |
| 🔧    | Chore    | Manutencao e configs                |
| 🔒    | Security | Correcoes de seguranca              |
| 🗃️    | Database | Migrations e schemas                |

## Licenca

Proprietario - Raji &copy; 2026
