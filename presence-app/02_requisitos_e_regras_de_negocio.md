# Requisitos e regras de negócio

## 1. Requisitos funcionais

### RF-01 — Autenticação
- O aluno deve conseguir fazer login com e-mail e senha fornecidos pelo coordenador.
- O aluno deve conseguir fazer logout.
- Usuários não autenticados são sempre redirecionados para a tela de **Sign In**.
- A tela de **Sign In** deve conter um botão que navega para a tela de **cadastro** — o cadastro não é uma rota pública direta, apenas acessível a partir do Sign In.
- O coordenador cadastra os alunos informando: e-mail, senha, nome completo e foto de perfil.

### RF-02 — Calendário semanal
- A tela principal deve exibir um calendário com os dias da semana atual.
- O aluno logado deve conseguir marcar sua presença como **vai** ou **não vai** para cada dia.
- O aluno deve conseguir alterar sua presença a qualquer momento antes da viagem.
- Cada dia deve exibir visualmente se o aluno logado já confirmou presença ou não.

### RF-03 — Lista de presença por dia
- Ao selecionar um dia no calendário, o aluno deve ver a lista de todos os alunos cadastrados com seu respectivo status naquele dia.
- Cada item da lista deve exibir: foto de perfil, nome completo e status (vai / não vai / sem resposta).
- A lista deve ser atualizada em tempo real conforme os alunos respondem.

### RF-04 — Caronas
- Qualquer aluno autenticado pode cadastrar uma carona paga para um determinado dia.
- Uma carona deve ter: nome do responsável (preenchido automaticamente com o aluno logado), data, descrição/detalhes e valor (opcional).
- Na tela do dia selecionado, deve existir uma seção mostrando as caronas cadastradas para aquele dia.
- O aluno que criou a carona pode excluí-la.
- O coordenador pode excluir qualquer carona.

---

## 2. Requisitos não funcionais

### RNF-01 — Desempenho
- A lista de presença deve carregar em menos de 2 segundos em condições normais de rede.
- Atualizações de presença devem refletir para os outros usuários em tempo real via Firestore listeners.

### RNF-02 — Segurança
- Nenhuma rota do app deve ser acessível sem autenticação válida.
- Um aluno só pode alterar sua própria presença — nunca a de outro aluno.
- Um aluno só pode excluir caronas que ele mesmo criou.
- As regras de segurança devem ser configuradas no Firestore Rules.

### RNF-03 — Confiabilidade
- Os dados de presença devem ser persistidos no Firestore — não apenas em estado local.
- Em caso de perda de conexão, o app deve indicar visualmente que está offline.

### RNF-04 — Usabilidade
- O fluxo de marcar presença deve exigir no máximo 2 toques do usuário.
- As telas devem funcionar tanto em Android quanto em iOS via Expo Go.

### RNF-05 — Manutenibilidade
- Todo o código deve ser TypeScript estrito.
- Telas devem ficar em `src/screens`.
- Navegação deve ficar em `src/routes`.
- Componentes reutilizáveis devem ser separados em `src/components`.
- A lógica de acesso ao Firestore deve ficar isolada em `src/services`, nunca diretamente nas telas.

---

## 3. Regras de negócio

| ID | Regra |
|---|---|
| RN-01 | Cada aluno possui exatamente um registro de presença por data. |
| RN-02 | O status padrão de presença de um aluno em qualquer dia é **sem resposta** — nunca ausente por padrão. |
| RN-03 | Um aluno só pode modificar seu próprio status de presença. |
| RN-04 | Caronas são independentes da presença — um aluno pode cadastrar uma carona sem marcar presença. |
| RN-05 | Apenas o criador da carona ou um coordenador pode excluí-la. |
| RN-06 | O calendário exibe sempre a semana corrente (segunda a sexta). |
| RN-07 | Finais de semana não aparecem no calendário (viagens ocorrem apenas em dias úteis). |
| RN-08 | A foto de perfil é definida no cadastro pelo coordenador e usada em toda a lista de presença. |
| RN-09 | Alunos não podem criar suas próprias contas — o acesso é sempre concedido pelo coordenador. |
| RN-10 | A tela de cadastro só é acessível navegando a partir do botão na tela de Sign In — nunca como rota inicial do app. |

---

## 4. Casos de uso prioritários

**Prioridade 1 — Obrigatório para o MVP**

1. Login do aluno (Sign In) e cadastro de aluno pelo coordenador.
2. Visualizar calendário semanal.
3. Marcar/alterar presença no dia.
4. Ver lista de presença de um dia com nome, foto e status de cada aluno.

**Prioridade 2 — Importante, mas pode vir após o MVP**

5. Cadastrar carona paga para um dia.
6. Visualizar caronas de um dia.
7. Excluir própria carona.

---

## 5. Critérios de aceite

### CA-01 — Autenticação
- [ ] Usuário não autenticado é sempre redirecionado para a tela de Sign In ao abrir o app.
- [ ] A tela de Sign In contém um botão que navega para a tela de cadastro.
- [ ] O coordenador consegue cadastrar um aluno com e-mail, senha, nome e foto.
- [ ] O aluno consegue fazer login com as credenciais fornecidas e é redirecionado para a tela principal.
- [ ] O aluno consegue fazer logout e retorna para a tela de Sign In.

### CA-02 — Calendário e presença
- [ ] O calendário exibe os dias úteis da semana atual.
- [ ] O aluno logado consegue marcar "vai" em um dia e o status é salvo no Firestore.
- [ ] O aluno logado consegue alterar de "vai" para "não vai" e o Firestore é atualizado.
- [ ] A tela reflete o status atual do aluno ao abrir (não reinicia).

### CA-03 — Lista de presença
- [ ] A lista exibe todos os alunos cadastrados com foto, nome e status.
- [ ] Quando um aluno muda seu status, a lista de outro aluno online atualiza em tempo real.
- [ ] Alunos sem resposta aparecem com status visual distinto.

### CA-04 — Caronas
- [ ] O aluno consegue cadastrar uma carona com data, descrição e valor.
- [ ] A carona aparece na seção do dia correspondente.
- [ ] Apenas o criador e o coordenador veem a opção de excluir a carona.
- [ ] Após exclusão, a carona desaparece da lista em tempo real.

---

## 6. Pedido para a IA

Analise os requisitos acima, identifique:

1. Inconsistências ou conflitos entre as regras.
2. Lacunas que precisam ser decididas antes do desenvolvimento (ex: o que acontece com a presença de dias passados? O aluno pode editar?).
3. Sugestões de simplificação para o MVP sem comprometer a proposta central.
4. Confirmação se os critérios de aceite são suficientes para cobrir os fluxos principais.
