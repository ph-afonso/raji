# Checklist de Testes — Raji Finance v0.1.1

**Data:** 2026-04-04  
**Testador:** Phelipe Afonso (Product Owner / Cliente)  
**Versao:** 0.1.1  
**Ambiente:** Local (desenvolvimento)

---

## Como usar este checklist

1. Siga as secoes na ordem apresentada (Parte 1, 2, 3...).
2. Para cada item, execute o passo descrito e marque `[x]` se o comportamento esperado ocorreu.
3. Se algo nao funcionar como esperado, deixe `[ ]` desmarcado e anote o problema no campo **Observacoes** ao final da secao.
4. Quando indicado "tire um print", capture a tela (Windows: `Win + Shift + S`) para anexar ao relatorio de bugs.
5. Ao final, preencha a secao de **Resumo e Feedback**.

**Legenda:**

- `[POSITIVO]` — Cenario que deve funcionar corretamente
- `[NEGATIVO]` — Cenario que deve falhar de forma controlada (exibir mensagem de erro)
- `[EDGE CASE]` — Cenario limite para validar robustez

---

## Parte 1: Setup e Ambiente

**Objetivo:** Verificar se o projeto esta rodando corretamente no seu computador.

### Pre-requisitos

Antes de iniciar, certifique-se de que o projeto foi instalado seguindo o guia `docs/guides/getting-started.md`. Voce precisara de dois terminais abertos: um para a API e outro para o frontend.

### Verificacoes

- [ ] **1.1** Abra um terminal na pasta raiz do projeto e execute `npm run dev` (ou o comando indicado no getting-started). Verifique se nao ha erros no terminal.
- [ ] **1.2** Abra o navegador e acesse `http://localhost:3000/api/docs`. A pagina do **Swagger** deve carregar com a documentacao da API.
  - Tire um print da tela do Swagger aberta.
- [ ] **1.3** Acesse `http://localhost:9000` no navegador. A tela de **login** do Raji Finance deve aparecer.
  - Tire um print da tela de login.
- [ ] **1.4** Verifique no terminal da API se nao ha erros ou warnings criticos.
- [ ] **1.5** Verifique no terminal do frontend se nao ha erros ou warnings criticos.

> **Observacoes da Parte 1:**
>
> _Anote aqui qualquer problema encontrado no setup:_
>
> ---

---

## Parte 2: Testes Funcionais — Registro

**Objetivo:** Validar o fluxo completo de criacao de conta.

### Cenarios positivos

- [ ] **2.1** `[POSITIVO]` Na tela de login (`http://localhost:9000`), clique no link para **criar conta** (ou "Registrar").
  - A tela de registro deve aparecer com os campos: Nome, Email, Senha e Nome da Familia.
- [ ] **2.2** `[POSITIVO]` Preencha os campos com dados validos:
  - **Nome:** `Phelipe Afonso`
  - **Email:** `phelipe@teste.com`
  - **Senha:** `Senh@Forte123`
  - **Nome da Familia:** `Familia Afonso`
  - Clique em **Registrar** (ou botao equivalente).
  - O sistema deve criar a conta e redirecionar voce para a tela principal (dashboard/layout com sidebar).
  - Tire um print da tela apos o registro bem-sucedido.
- [ ] **2.3** `[POSITIVO]` Apos o registro, verifique se seu nome aparece no header ou na sidebar do sistema.

### Cenarios negativos

- [ ] **2.4** `[NEGATIVO]` Faca logout (se estiver logado). Volte para a tela de registro e tente registrar novamente com o **mesmo email** (`phelipe@teste.com`).
  - O sistema deve exibir uma mensagem de erro indicando que o email ja esta cadastrado.
  - Tire um print da mensagem de erro.
- [ ] **2.5** `[NEGATIVO]` Tente registrar deixando o campo **Nome** vazio e os demais preenchidos.
  - O sistema deve exibir uma mensagem de validacao.
- [ ] **2.6** `[NEGATIVO]` Tente registrar deixando o campo **Email** vazio.
  - O sistema deve exibir uma mensagem de validacao.
- [ ] **2.7** `[NEGATIVO]` Tente registrar com um email invalido (ex: `emailsemarroba`).
  - O sistema deve exibir uma mensagem indicando que o email e invalido.
- [ ] **2.8** `[NEGATIVO]` Tente registrar com uma senha curta (ex: `123`).
  - O sistema deve exibir uma mensagem indicando que a senha e muito curta (minimo 8 caracteres).
- [ ] **2.9** `[NEGATIVO]` Tente registrar deixando o campo **Nome da Familia** vazio.
  - O sistema deve exibir uma mensagem de validacao.

### Edge cases

- [ ] **2.10** `[EDGE CASE]` Tente registrar com um nome de apenas 1 caractere (ex: `A`).
  - O sistema deve rejeitar (minimo 2 caracteres).
- [ ] **2.11** `[EDGE CASE]` Tente registrar com espacos em branco no email (ex: `phelipe2@teste.com`).
  - O sistema deve tratar corretamente (rejeitar ou aparar os espacos).

> **Observacoes da Parte 2:**
>
> _Anote aqui qualquer problema encontrado no registro:_
>
> ---

---

## Parte 3: Testes Funcionais — Login/Logout

**Objetivo:** Validar autenticacao, sessao e logout.

### Cenarios positivos

- [ ] **3.1** `[POSITIVO]` Acesse `http://localhost:9000` e faca login com as credenciais criadas na Parte 2:
  - **Email:** `phelipe@teste.com`
  - **Senha:** `Senh@Forte123`
  - O sistema deve redirecionar para a tela principal com a sidebar e o header visiveis.
  - Tire um print da tela principal apos login.
- [ ] **3.2** `[POSITIVO]` Apos o login, verifique se a **sidebar** exibe os itens de menu corretos para um Administrador (voce foi registrado como Master/titular da familia).
- [ ] **3.3** `[POSITIVO]` Clique no botao de **Logout** (geralmente no header ou menu do usuario).
  - O sistema deve redirecionar para a tela de login.
- [ ] **3.4** `[POSITIVO]` Apos o logout, tente acessar `http://localhost:9000` diretamente.
  - O sistema deve manter voce na tela de login (nao deve acessar a area interna).

### Cenarios negativos

- [ ] **3.5** `[NEGATIVO]` Na tela de login, tente logar com **email correto** mas **senha errada** (ex: `senhaErrada`).
  - O sistema deve exibir mensagem de erro (ex: "Credenciais invalidas").
  - Tire um print da mensagem de erro.
- [ ] **3.6** `[NEGATIVO]` Tente logar com um **email que nao existe** (ex: `naoexiste@teste.com`).
  - O sistema deve exibir mensagem de erro generica (nao deve indicar se o email existe ou nao, por seguranca).
- [ ] **3.7** `[NEGATIVO]` Tente logar com ambos os campos vazios.
  - O sistema deve exibir mensagens de validacao.
- [ ] **3.8** `[NEGATIVO]` Tente logar com email invalido (ex: `abc`).
  - O sistema deve exibir mensagem de validacao.

### Teste de sessao (refresh token)

- [ ] **3.9** `[POSITIVO]` Faca login e **aguarde alguns minutos** navegando pelo sistema. Verifique se voce nao e deslogado automaticamente (o refresh token deve renovar a sessao).
- [ ] **3.10** `[POSITIVO]` Faca login, feche a aba do navegador e abra novamente `http://localhost:9000`. Verifique se voce ainda esta logado (a sessao deve persistir).

> **Observacoes da Parte 3:**
>
> _Anote aqui qualquer problema encontrado no login/logout:_
>
> ---

---

## Parte 4: Testes Funcionais — Perfil do Usuario (NOVO v0.1.1)

**Objetivo:** Validar a pagina de perfil do usuario.

### Cenarios positivos

- [ ] **4.1** `[POSITIVO]` Estando logado, navegue ate a pagina de **Perfil** (`/profile` ou via menu/header).
  - A pagina deve exibir: nome, email e informacoes do usuario logado.
  - Tire um print da pagina de perfil.
- [ ] **4.2** `[POSITIVO]` Edite o campo **Nome** para um valor valido (ex: `Phelipe Afonso Silva`).
  - Clique em salvar. O nome deve ser atualizado com sucesso.
- [ ] **4.3** `[POSITIVO]` Apos salvar, recarregue a pagina (F5). Verifique se o nome atualizado persiste.

### Cenarios negativos

- [ ] **4.4** `[NEGATIVO]` Tente salvar o perfil com o campo **Nome** vazio.
  - O sistema deve exibir mensagem de validacao.
- [ ] **4.5** `[NEGATIVO]` Tente salvar com um nome de apenas 1 caractere.
  - O sistema deve rejeitar (minimo 2 caracteres).

### Edge cases

- [ ] **4.6** `[EDGE CASE]` Verifique que o campo **Email** nao e editavel na pagina de perfil (email so pode ser alterado via processo especifico).

> **Observacoes da Parte 4:**
>
> _Anote aqui qualquer problema encontrado no perfil:_
>
> ---

---

## Parte 5: Testes Funcionais — Familia (NOVO v0.1.1)

**Objetivo:** Validar a pagina de configuracoes da familia.

### Cenarios positivos

- [ ] **5.1** `[POSITIVO]` Navegue ate a pagina de **Familia** (`/family` ou via menu).
  - A pagina deve exibir: nome da familia e lista resumida de membros.
  - Tire um print da pagina da familia.
- [ ] **5.2** `[POSITIVO]` Como **owner** (titular) da familia, edite o **nome da familia** para um valor valido (ex: `Familia Afonso Atualizada`).
  - O nome deve ser salvo com sucesso.
- [ ] **5.3** `[POSITIVO]` Verifique que a lista resumida de membros aparece corretamente (pelo menos voce deve aparecer).

### Cenarios negativos

- [ ] **5.4** `[NEGATIVO]` Tente salvar o nome da familia vazio.
  - O sistema deve exibir mensagem de validacao.
- [ ] **5.5** `[NEGATIVO]` Tente salvar com nome de 1 caractere.
  - O sistema deve rejeitar (minimo 2 caracteres).

### Edge cases

- [ ] **5.6** `[EDGE CASE]` Se possivel, logue como um usuario que **nao e owner**. Verifique que a edicao do nome da familia esta **bloqueada** ou **nao aparece** (apenas o owner pode editar).

> **Observacoes da Parte 5:**
>
> _Anote aqui qualquer problema encontrado nas configuracoes da familia:_
>
> ---

---

## Parte 6: Testes Funcionais — Membros (NOVO v0.1.1)

**Objetivo:** Validar a pagina de gerenciamento de membros.

### Cenarios positivos

- [ ] **6.1** `[POSITIVO]` Navegue ate a pagina de **Membros** (`/family/members` ou via menu).
  - A pagina deve exibir uma **QTable** com a lista de membros da familia.
  - Tire um print da tabela de membros.
- [ ] **6.2** `[POSITIVO]` Verifique que a tabela exibe: nome, email, grupo e status de cada membro.
- [ ] **6.3** `[POSITIVO]` Se houver mais de um membro, tente **trocar o grupo** de um membro usando o **QSelect** na tabela.
  - O grupo deve ser atualizado com sucesso.

### Cenarios negativos

- [ ] **6.4** `[NEGATIVO]` Verifique que **nao e possivel** alterar o grupo do proprio usuario owner (titular) — o Master nao deve poder ser rebaixado.

### Edge cases

- [ ] **6.5** `[EDGE CASE]` Se houver apenas 1 membro na familia, a tabela deve exibir esse unico membro corretamente (sem erros ou estado vazio).
- [ ] **6.6** `[EDGE CASE]` Verifique que os grupos disponiveis no QSelect sao os mesmos retornados por `GET /api/v1/groups`.

> **Observacoes da Parte 6:**
>
> _Anote aqui qualquer problema encontrado na pagina de membros:_
>
> ---

---

## Parte 7: Testes Funcionais — RBAC (Grupos e Permissoes)

**Objetivo:** Validar o sistema de grupos, permissoes e controle de acesso.

### 7A. Visualizar grupos

- [ ] **7.1** `[POSITIVO]` Estando logado como Administrador, navegue ate a area de **Grupos** (se houver item no menu) ou acesse via Swagger (`GET /api/v1/groups`).
  - Devem aparecer 3 grupos padrao: **Master**, **Membro Full** e **Dependente**.
  - Tire um print da lista de grupos.

### 7B. Criar grupo customizado

- [ ] **7.2** `[POSITIVO]` Crie um novo grupo (via interface ou Swagger `POST /api/v1/groups`) com os dados:
  - **Nome:** `Contador`
  - **Slug:** `contador`
  - **Descricao:** `Acesso apenas a relatorios`
  - O grupo deve ser criado com sucesso.
- [ ] **7.3** `[NEGATIVO]` Tente criar outro grupo com o **mesmo slug** (`contador`).
  - O sistema deve retornar erro 409 (slug duplicado).
- [ ] **7.4** `[NEGATIVO]` Tente criar um grupo com slug invalido (ex: `Grupo Com Espacos`).
  - O sistema deve retornar erro de validacao (slug aceita apenas letras minusculas, numeros e hifens).
- [ ] **7.5** `[EDGE CASE]` Tente criar um grupo com nome de 1 caractere.
  - O sistema deve rejeitar (minimo 2 caracteres).

### 7C. Editar grupo

- [ ] **7.6** `[POSITIVO]` Edite o grupo "Contador" criado acima (via interface ou Swagger `PATCH /api/v1/groups/:id`):
  - Altere o nome para `Contador Familiar`
  - Altere a descricao para `Acesso a relatorios e contas`
  - A alteracao deve ser salva com sucesso.
- [ ] **7.7** `[NEGATIVO]` Tente editar um grupo padrao (Master, Membro Full ou Dependente).
  - Verifique se o sistema permite ou bloqueia a edicao (documentar o comportamento).

### 7D. Permissoes

- [ ] **7.8** `[POSITIVO]` Acesse a lista de **permissoes disponiveis** (via interface ou Swagger `GET /api/v1/groups/permissions`).
  - Deve retornar uma lista com 54 permissoes organizadas por modulo.
  - Tire um print da lista de permissoes.
- [ ] **7.9** `[POSITIVO]` Atribua permissoes ao grupo "Contador Familiar" (via interface ou Swagger `PUT /api/v1/groups/:id/permissions`):
  - Selecione apenas permissoes de leitura (ex: `accounts:read`, `transactions:read`, `reports:read`).
  - As permissoes devem ser salvas com sucesso.
- [ ] **7.10** `[POSITIVO]` Na **Matriz de Permissoes** (`/rbac/matrix`), selecione o grupo "Contador Familiar" e verifique que as checkboxes refletem as permissoes reais do grupo (correcao v0.1.1).
  - Tire um print da matriz com as permissoes corretas.
- [ ] **7.11** `[NEGATIVO]` Tente atribuir permissoes usando um ID de permissao invalido (ex: `uuid-fake-123`).
  - O sistema deve retornar erro 400.

### 7E. Deletar grupo

- [ ] **7.12** `[POSITIVO]` Delete o grupo "Contador Familiar" (via interface ou Swagger `DELETE /api/v1/groups/:id`).
  - O grupo deve ser removido com sucesso.
- [ ] **7.13** `[NEGATIVO]` Tente deletar um grupo **padrao** (Master, Membro Full ou Dependente).
  - O sistema deve retornar erro 400 (nao e permitido deletar grupos padrao).
- [ ] **7.14** `[NEGATIVO]` Tente deletar um grupo usando um ID que nao existe.
  - O sistema deve retornar erro 404.

### 7F. Sidebar filtrada por permissao

- [ ] **7.15** `[POSITIVO]` Estando logado como Administrador (Master), verifique se a sidebar exibe **todos** os itens de menu disponiveis.
  - Tire um print da sidebar completa.

> **Observacoes da Parte 7:**
>
> _Anote aqui qualquer problema encontrado com RBAC:_
>
> ---

---

## Parte 8: Testes de Seguranca (basicos)

**Objetivo:** Verificar protecoes basicas contra acessos nao autorizados.

### Acesso sem autenticacao

- [ ] **8.1** `[NEGATIVO]` Abra uma nova aba **anonima** (Ctrl+Shift+N no Chrome) e tente acessar `http://localhost:9000` (a area interna).
  - O sistema deve redirecionar para a tela de login.
- [ ] **8.2** `[NEGATIVO]` No Swagger (`http://localhost:3000/api/docs`), tente executar `GET /api/v1/users/me` **sem** informar o token de autenticacao.
  - A resposta deve ser **401 Unauthorized**.
- [ ] **8.3** `[NEGATIVO]` No Swagger, tente executar `GET /api/v1/groups` **sem** token.
  - A resposta deve ser **401 Unauthorized**.

### Token invalido

- [ ] **8.4** `[NEGATIVO]` No Swagger, informe um token falso (ex: `Bearer tokenfalso123`) no campo de autorizacao e tente executar `GET /api/v1/users/me`.
  - A resposta deve ser **401 Unauthorized**.

### Isolamento multi-tenant

- [ ] **8.5** `[NEGATIVO]` Crie uma **segunda conta** com outro email (ex: `outra@teste.com`, familia `Familia Outra`).
  - Faca login com essa segunda conta.
  - Tente acessar `GET /api/v1/families/me/members`. Verifique que os membros listados sao **apenas** da Familia Outra (nao deve aparecer "Phelipe Afonso" da Familia Afonso).
- [ ] **8.6** `[NEGATIVO]` Com a segunda conta logada, tente acessar `GET /api/v1/users/:id` usando o ID de usuario da **primeira** conta (Familia Afonso).
  - O sistema deve retornar **404** (nao deve expor dados de outra familia).
- [ ] **8.7** `[NEGATIVO]` Com a segunda conta, tente acessar `GET /api/v1/groups`. Verifique se os grupos exibidos sao **apenas** os da Familia Outra.

### Protecao de endpoints por permissao

- [ ] **8.8** `[NEGATIVO]` Se possivel, altere o grupo da segunda conta para "Dependente" (via Swagger ou diretamente no banco). Depois, tente executar `POST /api/v1/groups` (criar grupo) com o token dessa conta.
  - O sistema deve retornar **403 Forbidden** (Dependente nao tem permissao `groups:create`).

> **Observacoes da Parte 8:**
>
> _Anote aqui qualquer problema de seguranca encontrado:_
>
> ---

---

## Parte 9: Testes de UI/UX

**Objetivo:** Avaliar a qualidade visual, responsividade e experiencia do usuario.

### Dark Mode

- [ ] **9.1** `[POSITIVO]` Estando logado, localize o botao de **Dark Mode** no header (icone de sol/lua ou toggle).
  - Clique no botao. A interface deve alternar para o modo escuro.
  - Tire um print do modo escuro.
- [ ] **9.2** `[POSITIVO]` Clique novamente no botao. A interface deve voltar para o modo claro.
- [ ] **9.3** `[POSITIVO]` Ative o dark mode, faca logout e login novamente. Verifique se a preferencia de tema foi mantida.

### Responsividade

- [ ] **9.4** `[POSITIVO]` No navegador, pressione **F12** para abrir o DevTools. Clique no icone de **dispositivo movel** (ou pressione `Ctrl+Shift+M`).
  - Selecione a resolucao de **iPhone 12** (ou similar, ~390x844).
  - Verifique se a tela de login se adapta corretamente.
  - Tire um print.
- [ ] **9.5** `[POSITIVO]` Ainda no modo responsivo, faca login e verifique se o layout principal (sidebar + conteudo) se adapta corretamente em tela pequena.
  - A sidebar deve se tornar um menu hamburguer ou drawer.
- [ ] **9.6** `[POSITIVO]` Selecione a resolucao de **iPad** (~768x1024) e verifique o layout.
- [ ] **9.7** `[POSITIVO]` Em modo responsivo, acesse as paginas de **Perfil**, **Familia** e **Membros**. Verifique se os formularios e tabelas se adaptam corretamente em tela pequena.

### Mensagens de erro

- [ ] **9.8** `[POSITIVO]` Verifique se as mensagens de erro (login invalido, validacao de formulario) sao claras e em portugues.
- [ ] **9.9** `[POSITIVO]` Verifique se as mensagens de sucesso (registro, login, edicao de perfil, edicao de familia) sao claras e em portugues.

### Loading states

- [ ] **9.10** `[POSITIVO]` Ao clicar em "Registrar" ou "Login", verifique se o botao exibe algum indicador de carregamento (spinner, texto "Carregando..." ou fica desabilitado).
  - Isso evita cliques duplos.
- [ ] **9.11** `[POSITIVO]` Ao navegar entre paginas, verifique se ha algum indicador de carregamento.

### Paginas de erro

- [ ] **9.12** `[POSITIVO]` Acesse uma URL que nao existe (ex: `http://localhost:9000/pagina-inexistente`).
  - Deve aparecer uma pagina de **erro 404** estilizada (nao uma pagina em branco).
  - Tire um print.
- [ ] **9.13** `[POSITIVO]` Verifique se a pagina de erro 404 tem um botao ou link para voltar a pagina inicial.

> **Observacoes da Parte 9:**
>
> _Anote aqui qualquer problema de UI/UX encontrado:_
>
> ---

---

## Parte 10: Testes de API (Swagger)

**Objetivo:** Testar cada endpoint diretamente pelo Swagger para garantir que a API funciona corretamente.

### Instrucoes gerais para usar o Swagger

1. Acesse `http://localhost:3000/api/docs`
2. Para endpoints protegidos: clique no botao **Authorize** (cadeado) no topo da pagina e cole o `accessToken` obtido no login.
3. Para executar um endpoint: clique nele para expandir, clique em **Try it out**, preencha os dados e clique em **Execute**.

### 10A. Auth — Registro

- [ ] **10.1** Execute `POST /api/v1/auth/register` com dados validos:
  ```json
  {
    "name": "Teste Swagger",
    "email": "swagger@teste.com",
    "password": "Senh@Forte123",
    "familyName": "Familia Swagger"
  }
  ```

  - Resposta esperada: **201** com `accessToken`, `refreshToken` e dados do usuario.
  - Anote o `accessToken` retornado para usar nos proximos testes.
- [ ] **10.2** Execute `POST /api/v1/auth/register` com o **mesmo email**.
  - Resposta esperada: **409** (email ja cadastrado).
- [ ] **10.3** Execute `POST /api/v1/auth/register` com body vazio `{}`.
  - Resposta esperada: **400** com erros de validacao.

### 10B. Auth — Login

- [ ] **10.4** Execute `POST /api/v1/auth/login` com credenciais validas:
  ```json
  {
    "email": "swagger@teste.com",
    "password": "Senh@Forte123"
  }
  ```

  - Resposta esperada: **200** com tokens, dados do usuario e lista de `permissions`.
  - Copie o `accessToken` e use no botao **Authorize** do Swagger.
- [ ] **10.5** Execute `POST /api/v1/auth/login` com senha errada.
  - Resposta esperada: **401**.
- [ ] **10.6** Execute `POST /api/v1/auth/login` com email inexistente.
  - Resposta esperada: **401**.

### 10C. Auth — Refresh

- [ ] **10.7** Execute `POST /api/v1/auth/refresh` com o `refreshToken` obtido no login:
  ```json
  {
    "refreshToken": "<cole_o_refresh_token_aqui>"
  }
  ```

  - Resposta esperada: **200** com novos `accessToken` e `refreshToken`.
- [ ] **10.8** Execute `POST /api/v1/auth/refresh` com um token invalido:
  ```json
  {
    "refreshToken": "token_invalido_123"
  }
  ```

  - Resposta esperada: **401**.

### 10D. Auth — Logout

- [ ] **10.9** Execute `POST /api/v1/auth/logout` (com o token no Authorize).
  - Resposta esperada: **200** com mensagem de sucesso.
- [ ] **10.10** Apos o logout, tente executar `GET /api/v1/users/me` com o **mesmo token**.
  - Resposta esperada: **401** (token deve ter sido invalidado).
  - **Nota:** Se o access token ainda funcionar (pois JWTs sao stateless), isso e esperado ate ele expirar. O refresh token e que foi revogado.

### 10E. Users

- [ ] **10.11** Faca login novamente para obter um novo token. Execute `GET /api/v1/users/me`.
  - Resposta esperada: **200** com seus dados (nome, email, familyId, etc.).
- [ ] **10.12** Execute `PATCH /api/v1/users/me` para atualizar seu nome:
  ```json
  {
    "name": "Teste Swagger Atualizado"
  }
  ```

  - Resposta esperada: **200** com o nome atualizado.
- [ ] **10.13** Execute `GET /api/v1/users/me` novamente e confirme que o nome foi alterado.
- [ ] **10.14** Execute `GET /api/v1/users/:id` usando seu proprio ID (obtido no passo 10.11).
  - Resposta esperada: **200** com seus dados.
- [ ] **10.15** Execute `GET /api/v1/users/:id` com um UUID aleatorio (ex: `00000000-0000-0000-0000-000000000000`).
  - Resposta esperada: **404**.

### 10F. Families

- [ ] **10.16** Execute `GET /api/v1/families/me`.
  - Resposta esperada: **200** com os dados da sua familia.
- [ ] **10.17** Execute `PATCH /api/v1/families/me`:
  ```json
  {
    "name": "Familia Swagger Renomeada"
  }
  ```

  - Resposta esperada: **200** com o nome atualizado.
- [ ] **10.18** Execute `GET /api/v1/families/me` novamente e confirme que o nome foi alterado.
- [ ] **10.19** Execute `GET /api/v1/families/me/members`.
  - Resposta esperada: **200** com a lista de membros da familia (pelo menos voce).
- [ ] **10.20** Execute `PATCH /api/v1/families/me` com nome vazio `{"name": ""}`.
  - Resposta esperada: **400** (validacao).
- [ ] **10.21** Execute `PATCH /api/v1/families/me` com nome de 1 caractere `{"name": "A"}`.
  - Resposta esperada: **400** (minimo 2 caracteres).

### 10G. Groups

- [ ] **10.22** Execute `GET /api/v1/groups`.
  - Resposta esperada: **200** com 3 grupos padrao (Master, Membro Full, Dependente).
- [ ] **10.23** Execute `POST /api/v1/groups`:
  ```json
  {
    "name": "Auditor",
    "slug": "auditor",
    "description": "Grupo de teste via Swagger"
  }
  ```

  - Resposta esperada: **201** com os dados do grupo criado.
  - Anote o `id` do grupo criado.
- [ ] **10.24** Execute `PATCH /api/v1/groups/:id` (usando o ID do grupo criado):
  ```json
  {
    "name": "Auditor Senior"
  }
  ```

  - Resposta esperada: **200** com o nome atualizado.
- [ ] **10.25** Execute `GET /api/v1/groups/permissions`.
  - Resposta esperada: **200** com a lista de todas as permissoes do sistema.
  - Anote 2 ou 3 IDs de permissao para o proximo teste.
- [ ] **10.26** Execute `PUT /api/v1/groups/:id/permissions` (usando o ID do grupo "Auditor Senior"):
  ```json
  {
    "permissionIds": ["<id_permissao_1>", "<id_permissao_2>"]
  }
  ```

  - Resposta esperada: **200** com as permissoes atualizadas.
- [ ] **10.27** Execute `DELETE /api/v1/groups/:id` (usando o ID do grupo "Auditor Senior").
  - Resposta esperada: **200** com `{"deleted": true}`.
- [ ] **10.28** Execute `DELETE /api/v1/groups/:id` usando o ID de um grupo **padrao** (Master).
  - Resposta esperada: **400** (nao permitido).
- [ ] **10.29** Execute `GET /api/v1/groups` novamente e confirme que o grupo "Auditor Senior" foi removido.

> **Observacoes da Parte 10:**
>
> _Anote aqui qualquer problema encontrado nos testes de API:_
>
> ---

---

## Parte 11: Verificacao de Bugs Corrigidos (v0.1.1)

**Objetivo:** Confirmar que os 4 bugs corrigidos na v0.1.1 estao de fato resolvidos.

- [ ] **11.1** `[REGRESSAO]` Verifique que o frontend consegue se comunicar com a API (a baseURL `/api/v1` esta correta). Faca login pela interface web — se funcionar, a baseURL esta OK.
- [ ] **11.2** `[REGRESSAO]` Acesse a **Matriz de Permissoes** e verifique que a lista de permissoes carrega (path `/groups/permissions` corrigido).
- [ ] **11.3** `[REGRESSAO]` Na Matriz de Permissoes, selecione um grupo (ex: Membro Full) e verifique que as checkboxes refletem as permissoes **reais** do grupo (nao devem estar todas desmarcadas).
- [ ] **11.4** `[REGRESSAO]` Altere as permissoes de um grupo customizado na Matriz de Permissoes e salve. Verifique que a operacao completa sem erro (payload `{ permissionIds }` corrigido).

> **Observacoes da Parte 11:**
>
> _Anote aqui se algum bug voltou:_
>
> ---

---

## Parte 12: Revisao de Documentacao

**Objetivo:** Verificar se os documentos do projeto estao corretos, atualizados e acessiveis.

Para cada documento abaixo, abra o arquivo na pasta `docs/` do projeto e verifique os criterios indicados.

### Documentos do produto

- [ ] **12.1** Abra `docs/product/briefing.md`.
  - O conteudo descreve corretamente o projeto Raji Finance?
  - As informacoes de stack tecnologica estao corretas?
- [ ] **12.2** Abra `docs/releases/v0.1.1.md`.
  - As funcionalidades e bugs listados correspondem ao que foi corrigido/entregue?
- [ ] **12.3** Abra `docs/releases/v0.1.0.md`.
  - As funcionalidades listadas correspondem ao que foi entregue na versao anterior?

### Documentos de arquitetura

- [ ] **12.4** Abra `docs/architecture/architecture.md`.
  - A secao "Status de Implementacao" lista as novas paginas frontend da v0.1.1?
- [ ] **12.5** Abra `docs/architecture/adrs.md`.
  - As decisoes de arquitetura estao documentadas e fazem sentido?
- [ ] **12.6** Abra `docs/architecture/prisma-schema.md`.
  - O schema do banco de dados esta documentado?

### Documentos de API e guias

- [ ] **12.7** Abra `docs/api/api-reference.md`.
  - Todos os 16 endpoints estao documentados?
  - Os exemplos de request/response correspondem ao que voce testou no Swagger?
- [ ] **12.8** Abra `docs/guides/getting-started.md`.
  - A secao "Paginas Disponiveis" lista Perfil, Familia e Membros?
  - As instrucoes de instalacao estao claras e completas?

### Documentos de planejamento e seguranca

- [ ] **12.9** Abra `docs/planning/sprint-planning.md`.
  - A secao da Sprint 1 menciona os debitos corrigidos na v0.1.1?
- [ ] **12.10** Abra `docs/security/sprint1-audit.md`.
  - A auditoria de seguranca esta documentada?
- [ ] **12.11** Abra `CHANGELOG.md` (na raiz do projeto).
  - O changelog possui a secao v0.1.1 com os bugs corrigidos e funcionalidades adicionadas?

> **Observacoes da Parte 12:**
>
> _Anote aqui qualquer documento com problema, desatualizado ou ausente:_
>
> ---

---

## Parte 13: Resumo e Feedback

**Objetivo:** Consolidar sua experiencia e fornecer feedback para a equipe.

### Resumo dos testes

| Secao                              | Total de itens | Passou | Falhou | Nao testado |
| ---------------------------------- | -------------- | ------ | ------ | ----------- |
| Parte 1: Setup e Ambiente          | 5              |        |        |             |
| Parte 2: Registro                  | 11             |        |        |             |
| Parte 3: Login/Logout              | 10             |        |        |             |
| Parte 4: Perfil (NOVO v0.1.1)      | 6              |        |        |             |
| Parte 5: Familia (NOVO v0.1.1)     | 6              |        |        |             |
| Parte 6: Membros (NOVO v0.1.1)     | 6              |        |        |             |
| Parte 7: RBAC                      | 15             |        |        |             |
| Parte 8: Seguranca                 | 8              |        |        |             |
| Parte 9: UI/UX                     | 13             |        |        |             |
| Parte 10: API (Swagger)            | 29             |        |        |             |
| Parte 11: Bugs Corrigidos (v0.1.1) | 4              |        |        |             |
| Parte 12: Documentacao             | 11             |        |        |             |
| **TOTAL**                          | **124**        |        |        |             |

### Classificacao geral

Em uma escala de 1 a 5, como voce avalia:

| Criterio                       | Nota (1-5) | Comentario |
| ------------------------------ | ---------- | ---------- |
| Facilidade de instalacao/setup |            |            |
| Fluxo de registro              |            |            |
| Fluxo de login/logout          |            |            |
| Pagina de Perfil (NOVO)        |            |            |
| Pagina de Familia (NOVO)       |            |            |
| Pagina de Membros (NOVO)       |            |            |
| Controle de acesso (RBAC)      |            |            |
| Qualidade visual (UI)          |            |            |
| Responsividade (mobile)        |            |            |
| Dark Mode                      |            |            |
| Mensagens de erro              |            |            |
| Documentacao do projeto        |            |            |
| Documentacao da API (Swagger)  |            |            |
| **Impressao geral da v0.1.1**  |            |            |

### Bugs encontrados

Liste aqui os bugs encontrados durante os testes, por ordem de gravidade:

| #   | Secao | Item | Descricao do bug | Gravidade (Alta/Media/Baixa) | Print? |
| --- | ----- | ---- | ---------------- | ---------------------------- | ------ |
| 1   |       |      |                  |                              |        |
| 2   |       |      |                  |                              |        |
| 3   |       |      |                  |                              |        |
| 4   |       |      |                  |                              |        |
| 5   |       |      |                  |                              |        |

### Sugestoes de melhoria

_O que voce gostaria de ver na proxima versao? O que pode ser melhorado?_

1.
2.
3.

### Comentarios adicionais

_Espaco livre para observacoes gerais:_

---

_Checklist criado por Tatiana Texto — Technical Writer da Raji_
_Em colaboracao com Quiteria QA, Samuel Sprint (SM) e Pedro Produto (PO)_
_v0.1.1 | 2026-04-04_
