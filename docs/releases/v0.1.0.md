# Raji Finance v0.1.0 — Release Notes

**Data:** 04/04/2026
**Release Manager:** Renato Release
**Tipo:** Release Inicial (Sprint 0 + Sprint 1)

---

## O que foi construido

O Raji Finance v0.1.0 entrega a **fundacao completa** da plataforma: infraestrutura de desenvolvimento, autenticacao robusta e controle de acesso granular por grupos.

## Funcionalidades prontas

### Autenticacao

- Registro com criacao automatica de familia
- Login/logout com tokens JWT seguros
- Renovacao automatica de sessao (sem logout involuntario)
- Senhas protegidas com criptografia forte

### Controle de Acesso (RBAC)

- 3 perfis de acesso: Administrador, Membro e Dependente
- O administrador pode criar perfis customizados
- Cada botao e tela respeita as permissoes do usuario
- 54 permissoes granulares cobrindo todo o sistema

### Interface

- Telas de login e registro responsivas
- Layout com menu lateral inteligente (mostra apenas o que o usuario pode acessar)
- Suporte a modo escuro
- Preparado para instalacao como app no celular (PWA)

### Seguranca

- Auditoria de seguranca realizada e aprovada
- Isolamento total entre familias (multi-tenant)
- Protecao contra ataques comuns (OWASP Top 10)

## Stack tecnologica

| Camada         | Tecnologia                         |
| -------------- | ---------------------------------- |
| Frontend       | Vue.js 3 + Quasar Framework        |
| Backend        | NestJS + TypeScript                |
| Banco de Dados | SQLite (dev) / PostgreSQL (prod)   |
| Testes         | Vitest (frontend) + Jest (backend) |
| CI/CD          | GitHub Actions                     |
| Monorepo       | Turborepo                          |

## Numeros desta release

| Metrica               | Valor                   |
| --------------------- | ----------------------- |
| Commits               | 25                      |
| Arquivos fonte        | 88+                     |
| Models no banco       | 20                      |
| Permissoes do sistema | 54                      |
| Testes (backend)      | 3 suites                |
| Testes (frontend)     | 41 unitarios            |
| Sprints completas     | 2 (Sprint 0 + Sprint 1) |

## Proximos passos (Sprint 2)

- **Contas bancarias** — Cadastro de contas, carteiras e cartoes
- **Transacoes** — Registro de receitas, despesas e transferencias
- **Categorias** — Organizacao de gastos com subcategorias
- **Dashboard** — Primeiros graficos e resumos financeiros

---

_Raji Finance — Controle financeiro familiar, transparente e seguro._
