# Modelagem de banco de dados (Firestore)

## 1. Objetivo da modelagem

Definir as coleções, documentos e campos que serão persistidos no Firestore, garantindo que os dados sejam suficientes para atender a todos os requisitos funcionais e regras de negócio descritos nos arquivos `01_visao_geral.md` e `02_requisitos_e_regras_de_negocio.md`.

Por se tratar de um banco NoSQL orientado a documentos (Firestore), a modelagem prioriza leituras eficientes por consulta comum, evitando joins — em vez disso, dados relacionados são desnormalizados quando necessário.

---

## 2. Entidades principais

### 2.1 `users` — Perfis de usuários cadastrados

Representa todos os usuários do sistema: alunos e o coordenador. Criado pelo coordenador via Firebase Authentication + escrita no Firestore.

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `uid` | `string` (ID do doc) | Sim | UID gerado pelo Firebase Auth |
| `name` | `string` | Sim | Nome completo do aluno |
| `email` | `string` | Sim | E-mail de login |
| `photoUrl` | `string` | Sim | URL da foto de perfil |
| `role` | `'aluno' \| 'coordenador'` | Sim | Perfil de acesso |
| `createdAt` | `Timestamp` | Sim | Data de cadastro |

> **Regra de negócio aplicada:** RN-09 — alunos não se auto-cadastram. O documento em `users` é criado exclusivamente pelo coordenador.

---

### 2.2 `presences` — Presenças por aluno por data

Registra o status de presença de um aluno em um dia específico. O ID do documento é composto para garantir unicidade e facilitar leitura direta sem consulta.

**ID do documento:** `{uid}_{YYYY-MM-DD}` — ex: `abc123_2026-05-20`

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `userId` | `string` | Sim | UID do aluno (referência ao documento em `users`) |
| `date` | `string` | Sim | Data no formato `YYYY-MM-DD` |
| `status` | `'vai' \| 'nao_vai' \| 'sem_resposta'` | Sim | Status da presença naquele dia |
| `updatedAt` | `Timestamp` | Sim | Última atualização do status |

> **Regras de negócio aplicadas:**
> - RN-01 — um único documento por aluno por data (ID composto garante isso).
> - RN-02 — status padrão é `sem_resposta`; o documento só é criado ao primeiro registro.
> - RN-03 — apenas o próprio aluno grava em documentos com seu `userId`.

---

### 2.3 `rides` — Caronas cadastradas

Registra caronas pagas disponibilizadas por alunos para um determinado dia.

**ID do documento:** gerado automaticamente pelo Firestore.

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `creatorId` | `string` | Sim | UID do aluno que criou a carona |
| `creatorName` | `string` | Sim | Nome do responsável (desnormalizado para exibição rápida) |
| `date` | `string` | Sim | Data da carona no formato `YYYY-MM-DD` |
| `description` | `string` | Sim | Detalhes da carona (rota, horário, ponto de encontro etc.) |
| `price` | `number \| null` | Não | Valor cobrado; `null` quando não informado |
| `createdAt` | `Timestamp` | Sim | Data de criação do registro |

> **Regras de negócio aplicadas:**
> - RN-04 — caronas são entidades independentes da presença.
> - RN-05 — exclusão permitida apenas ao criador (`creatorId`) ou ao coordenador (`role === 'coordenador'`), verificado nas Firestore Security Rules.

---

## 3. Relacionamentos

```
users/{uid}
    └── referenciado por presences/{uid_date}.userId
    └── referenciado por rides/{id}.creatorId

presences/{uid_date}
    └── vinculada a um usuário (userId) e a uma data (date)

rides/{id}
    └── vinculada a um usuário (creatorId) e a uma data (date)
```

**Cardinalidades:**
- Um `user` → muitas `presences` (uma por dia útil).
- Um `user` → muitas `rides` (sem limite por dia).
- Uma data → muitas `presences` (uma por aluno) e muitas `rides`.

**Desnormalização intencional:**
- `rides.creatorName` replica o nome do criador para evitar leitura adicional em `users` ao exibir a lista de caronas. Deve ser atualizado se o nome do usuário mudar (evento improvável no contexto do sistema).

---

## 4. Estratégia de modelagem NoSQL

Por se tratar do Firestore (documento/coleção), as decisões de modelagem seguem as práticas recomendadas para bancos orientados a documentos:

1. **Coleções planas** — `users`, `presences` e `rides` vivem como coleções de nível raiz, evitando subcoleções desnecessárias que complicariam consultas cross-collection.
2. **ID composto em `presences`** — `{uid}_{YYYY-MM-DD}` elimina a necessidade de query para verificar se o registro existe e garante unicidade (RN-01) por estrutura, não por lógica de aplicação.
3. **Desnormalização seletiva** — `creatorName` em `rides` e `userId` + `date` em `presences` reduzem o número de leituras por tela, respeitando o modelo de cobrança do Firestore (por leitura de documento).
4. **Listeners em tempo real** — as consultas de `presences` e `rides` por data serão assinadas com `onSnapshot`, atendendo ao RNF-01 (atualização em tempo real).

---

## 5. Padrões obrigatórios

| Padrão | Decisão |
|---|---|
| Formato de data | `string` no formato `YYYY-MM-DD` (ISO 8601 sem fuso) |
| Timestamps | `Timestamp` do Firestore (não `Date` ou `string`) para `createdAt` e `updatedAt` |
| IDs de documentos | `users`: UID do Auth; `presences`: `{uid}_{YYYY-MM-DD}`; `rides`: auto-gerado |
| Nomenclatura de campos | `camelCase` em todos os documentos |
| Valores nulos | `price: null` (não omitir o campo) para garantir tipagem TypeScript consistente |
| Role padrão | Todo novo usuário criado pelo coordenador recebe `role: 'aluno'`; o coordenador define seu próprio `role: 'coordenador'` no cadastro inicial |

---

## 6. Estrutura de coleções — exemplos de documentos

### Coleção `users`

```json
// users/uid_abc123
{
  "name": "João da Silva",
  "email": "joao@email.com",
  "photoUrl": "https://storage.googleapis.com/...",
  "role": "aluno",
  "createdAt": "Timestamp(2026-03-01T10:00:00Z)"
}
```

### Coleção `presences`

```json
// presences/uid_abc123_2026-05-20
{
  "userId": "uid_abc123",
  "date": "2026-05-20",
  "status": "vai",
  "updatedAt": "Timestamp(2026-05-19T18:30:00Z)"
}
```

### Coleção `rides`

```json
// rides/autoId_xyz789
{
  "creatorId": "uid_abc123",
  "creatorName": "João da Silva",
  "date": "2026-05-20",
  "description": "Saindo do terminal às 06h45. Carro azul, 3 vagas.",
  "price": 15.00,
  "createdAt": "Timestamp(2026-05-19T20:00:00Z)"
}
```

---

## 7. Firestore Security Rules (esboço)

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Funções auxiliares
    function isAuthenticated() {
      return request.auth != null;
    }
    function isCoordinator() {
      return isAuthenticated() &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'coordenador';
    }
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // Usuários
    match /users/{uid} {
      allow read: if isAuthenticated();
      allow create: if isCoordinator();
      allow update: if isCoordinator();
      allow delete: if isCoordinator();
    }

    // Presenças
    match /presences/{docId} {
      allow read: if isAuthenticated();
      allow create, update: if isAuthenticated() &&
        request.resource.data.userId == request.auth.uid;
      allow delete: if false; // presença nunca é excluída
    }

    // Caronas
    match /rides/{rideId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() &&
        request.resource.data.creatorId == request.auth.uid;
      allow delete: if isAuthenticated() &&
        (resource.data.creatorId == request.auth.uid || isCoordinator());
      allow update: if false; // caronas não são editadas, apenas excluídas
    }
  }
}
```

---

## 8. Pedido para a IA

Analise a modelagem proposta acima e:

1. Identifique riscos de desempenho ou inconsistência nas coleções definidas.
2. Aponte se alguma regra de negócio dos arquivos `01` e `02` não está coberta pelo modelo de dados.
3. Confirme se as Firestore Security Rules são suficientes para os requisitos de segurança (RNF-02).
4. Sugira índices compostos necessários para as consultas esperadas (ex: `presences` filtrado por `date`).
5. Indique se a desnormalização de `creatorName` em `rides` traz riscos de dados desatualizados e como mitigar.
