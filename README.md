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

Toda a documentacao tecnica do projeto esta organizada em [`docs/`](docs/README.md), com indice completo e metodologia de organizacao.

**Links rapidos:** [Getting Started](docs/guides/getting-started.md) | [API Reference](docs/api/api-reference.md) | [Arquitetura](docs/architecture/architecture.md)

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
