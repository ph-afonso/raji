# 📄 Briefing de Projeto: Raji Finance

## 1. Introdução e Visão Geral

O **Raji - Finance** é uma plataforma moderna de controle financeiro doméstico, projetada para consolidar receitas e despesas de múltiplos membros de uma família em um único ambiente seguro. O foco principal é a **transparência colaborativa** aliada a um controle rigoroso de **permissões por grupo**, garantindo que cada membro acesse apenas o que lhe é de direito.

---

## 2. Stack Tecnológica (Modern Stack)

O sistema será construído utilizando tecnologias de ponta para garantir performance, escalabilidade e facilidade de manutenção:

- **Frontend:**
  - **Vue.js 3** (Composition API) para uma interface reativa.
  - **Quasar Framework** para componentes de UI de alta performance e suporte nativo a **PWA** (Mobile) e **Dark Mode**.
  - **Pinia** para gerenciamento de estado global.
  - **ApexCharts** para visualização de dados e dashboards.
- **Backend:**
  - **NestJS** (Node.js + TypeScript) seguindo arquitetura modular.
  - **Prisma ORM** para comunicação com o banco de dados.
  - **Passport + JWT** para autenticação e segurança.
- **Banco de Dados:**
  - **Desenvolvimento:** SQLite (Praticidade e zero-config).
  - **Produção:** PostgreSQL (Robustez e integridade).

---

## 3. Arquitetura de Controle de Acesso (RBAC)

Este é o pilar central do sistema. Todo o acesso será baseado em **Grupos de Usuários** com permissões granulares.

### **Níveis de Controle:**

1.  **Menu & Navegação:** Itens de menu no _Sidebar_ do Quasar só aparecem se o grupo tiver a permissão `view_menu`.
2.  **Acesso a Telas:** Bloqueio via _Navigation Guards_ no Vue Router.
3.  **Ações de CRUD:** Botões (Criar, Editar, Excluir) são removidos do DOM via diretivas customizadas (ex: `v-perm`) se o grupo não possuir a permissão.
4.  **Backend Guard:** O NestJS validará cada requisição via _Guards_ de API, impedindo acessos não autorizados mesmo via chamadas diretas (Postman/Insomnia).

---

## 4. Requisitos Funcionais

### **A. Gestão Financeira**

- **Multi-contas:** Gerenciamento de contas bancárias, carteiras e cartões de crédito.
- **Lançamentos Detalhados:** Registro de receitas, despesas e transferências entre contas.
- **Categorização:** Classificação de gastos com suporte a subcategorias.
- **Contas Recorrentes:** Automação de lançamentos fixos (aluguel, assinaturas, parcelas).

### **B. Planejamento e Dashboards**

- **Metas de Economia:** Barra de progresso para objetivos familiares (ex: Viagem, Fundo de Emergência).
- **Orçamentos por Categoria:** Definição de limites de gastos mensais com alertas visuais.
- **Gráficos Interativos:** Visão de fluxo de caixa e composição de despesas por categoria.

### **C. Administração e Grupos**

- **Painel de Grupos:** Criação de grupos (ex: Admin, Filho, Visitante).
- **Matriz de Permissões:** Interface de "checkboxes" para definir o que cada grupo pode Ver, Criar, Editar ou Excluir em cada módulo.

---

## 5. Requisitos Não Funcionais (Qualidade)

- **Segurança:** Criptografia de senhas com `bcrypt` e tokens de acesso expiráveis.
- **Responsividade:** Interface adaptável para Desktop, Tablets e Smartphones (PWA).
- **Offline First:** Capacidade básica de visualização de dados mesmo sem conexão estável.
- **Performance:** Cálculos financeiros pesados processados no Backend para evitar lentidão no navegador.

---

## 6. Modelo de Dados Sugerido (Lógica de Permissão)

Para suportar o controle de grupos, a estrutura de dados seguirá o padrão:

- **Usuário:** `id, nome, email, password, group_id`
- **Grupo:** `id, nome_grupo`
- **Permissão:** `id, modulo (ex: transacoes), acao (ex: create), habilitado (boolean), group_id`

No NestJS, a validação será feita através de um Decorator customizado:

```typescript
@CheckPermission('transactions', 'delete')
@Delete(':id')
remove(@Param('id') id: string) { ... }
```

---

## 7. O que esperamos do sistema?

Esperamos uma aplicação **fluida e profissional**, que não pareça uma planilha, mas sim uma ferramenta de gestão estratégica. O sistema deve transmitir confiança através de dados precisos e oferecer uma barreira de segurança clara, onde um filho (no grupo "Dependente") possa registrar seus gastos sem conseguir visualizar o salário dos pais (no grupo "Admin") ou excluir contas fixas da casa.

---

## 8. Modelo de Negócio e Monetização

- **Regime SaaS:** Multi-tenancy com isolamento por `family_id`.
- **Trial:** 15 dias de uso completo para validação do usuário (Admin + até 2 membros).
- **Billing Unit:**
  1. Assinatura Mensal (Titular/Admin).
  2. Taxa de Ativação por Assento — valor único (_one-time fee_) por membro adicional.
- **Paywall:** Bloqueio de escrita e visualização de gráficos para contas inadimplentes ou após expiração do trial (modo _Read-only_).
- **Fase 2 (Premium):** Notificações via E-mail/WhatsApp para estouro de orçamento.

---

## 9. Fluxo de Convite de Membros

1. Admin envia convite via e-mail.
2. Sistema verifica se o "slot" de membro foi pago.
3. Se pago, dispara o convite; se não, redireciona para o checkout (Stripe/Pix).
4. Após confirmação, o membro é vinculado ao `family_id` com o grupo definido no convite.

---

## 10. Grupos de Acesso (Padrão + Custom)

### Grupos Pré-definidos

| Grupo                  | Descrição                                      | Nível  |
| ---------------------- | ---------------------------------------------- | ------ |
| **Master/Pai**         | Acesso total, gerencia membros e billing       | Admin  |
| **Membro Full**        | CRUD completo de lançamentos, vê dashboards    | Editor |
| **Dependente/Leitura** | Registra próprios gastos, não vê dados globais | Viewer |

### Customização

- Admin pode criar grupos adicionais (ex: "Contador da Família", "Diarista")
- Perfis padrão resolvem ~90% dos casos de uso

---

## 11. Estratégia de Notificações

| Fase                 | Canal                       | Gatilho                              |
| -------------------- | --------------------------- | ------------------------------------ |
| **Fase 1 (MVP)**     | Dashboard visual + Push PWA | Orçamento > 80%, Conta vencendo      |
| **Fase 2 (Premium)** | E-mail + WhatsApp           | Estouro de orçamento, Resumo semanal |

---

## 12. Importação de Dados

- **MVP:** Lançamento manual + Importação CSV/OFX
- **Diferencial:** Categorização automática de extratos bancários via NestJS (reduz churn nos primeiros 15 dias)

---

## 13. Decisões de Arquitetura (Sprint 0)

- **Multi-tenant:** Banco compartilhado (PostgreSQL) com isolamento por `family_id`
- **Sprint 1 — Caminho Crítico:** Auth + RBAC primeiro (motor de permissões no DNA do código)
- **Prioridade de entrega:** Auth/RBAC → Contas/Lançamentos → Dashboard
- **Dev:** SQLite local → PostgreSQL em produção (via Prisma)

---

_Este documento serve como guia base para o início do desenvolvimento (Sprint 0)._
