# Raji Finance - Documentacao

Indice central da documentacao do projeto Raji Finance. Este arquivo serve como mapa de navegacao e define a metodologia de organizacao que deve ser seguida em todas as sprints.

---

## Indice de Documentos

### Produto

| Documento                       | Descricao                                              |
| ------------------------------- | ------------------------------------------------------ |
| [Briefing](product/briefing.md) | Visao geral do produto, requisitos e modelo de negocio |

### Arquitetura

| Documento                                      | Descricao                                              |
| ---------------------------------------------- | ------------------------------------------------------ |
| [Arquitetura](architecture/architecture.md)    | Arquitetura tecnica, modulos, diagramas e fluxos       |
| [ADRs](architecture/adrs.md)                   | Architecture Decision Records — decisoes arquiteturais |
| [Schema Prisma](architecture/prisma-schema.md) | Modelo de dados completo (20 tabelas)                  |

### API

| Documento                             | Descricao                                |
| ------------------------------------- | ---------------------------------------- |
| [API Reference](api/api-reference.md) | Referencia completa dos endpoints da API |

### Guias

| Documento                                    | Descricao                                                      |
| -------------------------------------------- | -------------------------------------------------------------- |
| [Getting Started](guides/getting-started.md) | Setup do ambiente, primeiros passos e fluxo de desenvolvimento |

### Planejamento

| Documento                                      | Descricao                                    |
| ---------------------------------------------- | -------------------------------------------- |
| [Sprint Planning](planning/sprint-planning.md) | Planejamento de sprints e backlog priorizado |

### Seguranca

| Documento                                       | Descricao                          |
| ----------------------------------------------- | ---------------------------------- |
| [Auditoria Sprint 1](security/sprint1-audit.md) | Auditoria de seguranca da Sprint 1 |

### Releases

| Documento                    | Descricao                     |
| ---------------------------- | ----------------------------- |
| [v0.1.0](releases/v0.1.0.md) | Release notes da versao 0.1.0 |

---

## Metodologia de Organizacao

### Estrutura de Pastas

```
docs/
├── README.md            # Este arquivo — indice geral
├── product/             # Documentos de produto e negocio
├── architecture/        # Decisoes tecnicas, diagramas, schemas
├── api/                 # Referencia da API
├── guides/              # Guias para desenvolvedores
├── planning/            # Planejamento de sprints
├── security/            # Auditorias e relatorios de seguranca
└── releases/            # Release notes por versao
```

### Regra de Ouro

**Nunca crie arquivos soltos na raiz de `docs/`.** Todo documento deve estar dentro de uma subpasta adequada.

### Nomenclatura de Arquivos

- Sempre **kebab-case**: `meu-documento.md`
- Sempre extensao `.md` (Markdown)
- Nomes descritivos e curtos
- Documentos versionados por sprint usam sufixo: `sprint1-audit.md`, `sprint2-audit.md`
- Release notes usam a versao como nome: `v0.1.0.md`, `v0.2.0.md`

### Quem Cria Onde

| Papel                  | Pasta                   | Exemplos                              |
| ---------------------- | ----------------------- | ------------------------------------- |
| **PO** (Product Owner) | `product/`              | briefing, requisitos, user stories    |
| **Arquiteto**          | `architecture/`         | arquitetura, ADRs, schemas, diagramas |
| **Devs**               | `api/`, `guides/`       | referencia de API, guias de uso       |
| **QA**                 | `security/`, `testing/` | relatorios de teste, auditorias       |
| **SM** (Scrum Master)  | `planning/`             | sprint planning, retrospectivas       |
| **Release Manager**    | `releases/`             | release notes, changelogs             |
| **DevSecOps**          | `security/`             | auditorias de seguranca, compliance   |

### Guia para Agentes

Se voce e um agente da Raji e precisa criar documentacao:

1. **Identifique a categoria** do documento que vai criar (produto, arquitetura, API, guia, planning, seguranca ou release)
2. **Coloque na pasta correta** conforme a tabela acima
3. **Use kebab-case** no nome do arquivo
4. **Atualize este README.md** adicionando o novo documento na tabela da categoria correspondente
5. **Nunca crie na raiz de `docs/`** — sempre em uma subpasta
6. Se precisar de uma nova categoria, crie a pasta e adicione uma nova secao neste indice

### Convencoes de Conteudo

- Todo documento deve comecar com um titulo `# Titulo`
- Usar subtitulos hierarquicos (`##`, `###`, etc.)
- Incluir data de criacao/atualizacao quando relevante
- Referenciar outros docs usando caminhos relativos (ex: `../architecture/adrs.md`)
