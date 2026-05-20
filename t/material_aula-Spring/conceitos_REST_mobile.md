# Conceitos de REST e Consumo de API no Desenvolvimento Mobile

CENTRO UNIVERSITÁRIO DE PATOS DE MINAS – UNIPAM

BACHARELADO EM SISTEMAS DE INFORMAÇÃO

DISCIPLINA: DESENVOLVIMENTO DE SISTEMAS DE INFORMAÇÃO AVANÇADOS II

PROFESSOR: RAFAEL MARINHO E SILVA

---

## Apresentação

Este material apresenta os conceitos fundamentais sobre REST, HTTP e consumo de APIs no desenvolvimento de aplicativos mobile com React Native. Ele foi elaborado como complemento ao projeto prático de CRUD de pessoas, explicando o **porquê** de cada decisão técnica e não apenas o **como** fazer.

Compreender esses conceitos é essencial para qualquer desenvolvedor mobile, pois praticamente todos os aplicativos modernos dependem de comunicação com servidores externos para buscar, enviar e manipular dados.

---

## 1. O que é uma API?

API é a sigla para **Application Programming Interface** (Interface de Programação de Aplicações). Trata-se de um contrato entre dois sistemas: um define o que oferece e como deve ser solicitado, o outro consome esse serviço seguindo as regras estabelecidas.

Uma analogia clássica é a de um restaurante:

```
┌──────────────┐        ┌───────────┐        ┌─────────────┐
│   Cliente    │ ──────>│  Garçom   │ ──────>│   Cozinha   │
│ (App Mobile) │  pedido│   (API)   │ repassa│  (Servidor) │
│              │ <──────│           │ <──────│             │
└──────────────┘ prato  └───────────┘ entrega└─────────────┘
```

O cliente (app mobile) não precisa saber como a cozinha (servidor) prepara o prato. Ele apenas faz o pedido ao garçom (API) usando a linguagem do cardápio (contrato da API) e recebe o resultado.

---

## 2. O que é REST?

REST é a sigla para **Representational State Transfer** (Transferência de Estado Representacional). Foi definido em 2000 por Roy Fielding em sua tese de doutorado como um conjunto de princípios arquiteturais para sistemas distribuídos na web.

REST não é um protocolo nem uma linguagem. É um **estilo arquitetural** — um conjunto de restrições e boas práticas que, quando seguidas, resultam em sistemas escaláveis, simples e interoperáveis.

Uma API que segue os princípios REST é chamada de **API RESTful**.

### 2.1 Os seis princípios do REST

**1. Interface Uniforme**
Todos os recursos são acessados pelo mesmo estilo de URL, usando os mesmos métodos HTTP. Isso torna a API previsível e fácil de aprender.

**2. Cliente-Servidor**
O cliente (app mobile) e o servidor (Spring Boot) são independentes. O cliente não precisa saber como o servidor armazena os dados. O servidor não precisa saber como o cliente exibe as informações.

**3. Sem estado (Stateless)**
Cada requisição enviada ao servidor deve conter todas as informações necessárias para ser processada. O servidor não guarda o estado da sessão entre requisições. Isso torna o sistema mais escalável.

**4. Cache**
As respostas podem ser marcadas como cacheáveis, permitindo que o cliente reutilize respostas anteriores sem precisar fazer nova requisição ao servidor.

**5. Sistema em Camadas**
O cliente não precisa saber se está se comunicando diretamente com o servidor ou com um intermediário (proxy, balanceador de carga). Essa transparência facilita a evolução da infraestrutura.

**6. Código sob demanda (opcional)**
O servidor pode enviar código executável ao cliente (como JavaScript). Esse princípio é opcional e pouco usado em APIs mobile.

---

## 3. HTTP — O protocolo base do REST

HTTP é a sigla para **HyperText Transfer Protocol** (Protocolo de Transferência de Hipertexto). É o protocolo de comunicação que sustenta a web e, por extensão, as APIs REST. Toda comunicação entre o app mobile e o backend Spring Boot acontece via HTTP.

### 3.1 O modelo Requisição e Resposta

A comunicação HTTP segue sempre o mesmo ciclo:

```
App Mobile                              Servidor Spring Boot
     │                                          │
     │  ──── REQUISIÇÃO HTTP ────────────────>  │
     │       Método + URL + Headers + Body      │
     │                                          │
     │  <─── RESPOSTA HTTP ──────────────────   │
     │       Status Code + Headers + Body       │
     │                                          │
```

Toda interação começa com o cliente enviando uma **requisição** e termina com o servidor devolvendo uma **resposta**.

### 3.2 Anatomia de uma Requisição HTTP

Uma requisição HTTP é composta por quatro partes:

```
POST /api/pessoas HTTP/1.1
Host: verbose-dollop-x597q5v7w4vq3v6g9-8080.app.github.dev
Content-Type: application/json
Accept: application/json

{
  "nome": "Gabriel",
  "idade": 28
}
```

| Parte | Descrição | Exemplo |
|---|---|---|
| **Método** | O que o cliente quer fazer | `POST` |
| **URL** | Qual recurso está sendo acessado | `/api/pessoas` |
| **Headers** | Informações adicionais da requisição | `Content-Type: application/json` |
| **Body** | Dados enviados ao servidor (nem sempre presente) | `{ "nome": "Gabriel" }` |

### 3.3 Anatomia de uma Resposta HTTP

```
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": 1,
  "nome": "Gabriel",
  "idade": 28
}
```

| Parte | Descrição | Exemplo |
|---|---|---|
| **Status Code** | Resultado da operação | `201 Created` |
| **Headers** | Informações adicionais da resposta | `Content-Type: application/json` |
| **Body** | Dados retornados pelo servidor | `{ "id": 1, "nome": "Gabriel" }` |

---

## 4. Métodos HTTP (Verbos)

Os métodos HTTP definem a **intenção** da requisição. Em APIs REST, cada método corresponde a uma operação do CRUD.

| Método | Operação CRUD | Uso |
|---|---|---|
| `GET` | Read (Leitura) | Buscar dados sem modificar nada |
| `POST` | Create (Criação) | Enviar dados para criar um novo recurso |
| `PUT` | Update (Atualização completa) | Substituir completamente um recurso existente |
| `PATCH` | Update (Atualização parcial) | Atualizar apenas alguns campos de um recurso |
| `DELETE` | Delete (Exclusão) | Remover um recurso |

### 4.1 GET — Buscar dados

O método `GET` é usado para **ler** informações. Ele nunca deve modificar dados no servidor. É considerado **seguro** e **idempotente** (chamar várias vezes produz o mesmo resultado).

```http
GET /api/pessoas          → retorna todos os registros
GET /api/pessoas/1        → retorna apenas o registro com id 1
```

### 4.2 POST — Criar um novo recurso

O método `POST` envia dados para o servidor criar um novo registro. O corpo da requisição contém os dados do novo recurso. O servidor retorna o registro criado, geralmente já com o `id` gerado pelo banco.

```http
POST /api/pessoas
Content-Type: application/json

{ "nome": "Ana", "idade": 22 }

──── Resposta ────
201 Created
{ "id": 3, "nome": "Ana", "idade": 22 }
```

### 4.3 PUT — Atualizar um recurso completo

O método `PUT` substitui um recurso existente. O corpo deve conter **todos os campos** do recurso, mesmo os que não foram alterados. O `id` é informado na URL.

```http
PUT /api/pessoas/3
Content-Type: application/json

{ "nome": "Ana Paula", "idade": 23 }

──── Resposta ────
200 OK
{ "id": 3, "nome": "Ana Paula", "idade": 23 }
```

### 4.4 DELETE — Remover um recurso

O método `DELETE` remove o recurso identificado na URL. Normalmente não tem corpo na requisição nem na resposta.

```http
DELETE /api/pessoas/3

──── Resposta ────
204 No Content
```

### 4.5 Diferença entre PUT e PATCH

| Característica | PUT | PATCH |
|---|---|---|
| Campos no body | Todos os campos obrigatórios | Apenas os campos a alterar |
| Comportamento | Substitui o recurso inteiro | Altera apenas os campos enviados |
| Uso comum | Edição completa de um formulário | Atualização de um campo específico |

No projeto deste tutorial, usamos `PUT` porque o formulário de edição sempre envia todos os campos da pessoa.

---

## 5. Códigos de Status HTTP

Os códigos de status HTTP são números de três dígitos que o servidor envia na resposta para informar o resultado da operação. Eles são divididos em cinco famílias.

### 5.1 Família 2xx — Sucesso

A requisição foi recebida, entendida e processada com sucesso.

| Código | Nome | Quando ocorre |
|---|---|---|
| `200 OK` | OK | Requisição bem-sucedida com corpo de resposta (GET, PUT) |
| `201 Created` | Criado | Recurso criado com sucesso (POST) |
| `204 No Content` | Sem Conteúdo | Sucesso sem corpo de resposta (DELETE) |

### 5.2 Família 3xx — Redirecionamento

O cliente precisa fazer uma nova requisição para outro endereço.

| Código | Nome | Quando ocorre |
|---|---|---|
| `301 Moved Permanently` | Movido permanentemente | A URL do recurso mudou definitivamente |
| `302 Found` | Encontrado | Redirecionamento temporário (usado pelo `redirect:` do Spring MVC) |

### 5.3 Família 4xx — Erros do Cliente

O problema está na requisição enviada pelo cliente. São erros que o desenvolvedor do app precisa tratar.

| Código | Nome | Quando ocorre |
|---|---|---|
| `400 Bad Request` | Requisição inválida | Dados mal formatados ou inválidos no corpo |
| `401 Unauthorized` | Não autenticado | O cliente não está autenticado (falta de token) |
| `403 Forbidden` | Proibido | O cliente está autenticado mas não tem permissão |
| `404 Not Found` | Não encontrado | O recurso solicitado não existe |
| `405 Method Not Allowed` | Método não permitido | O método HTTP não é suportado naquela rota |
| `409 Conflict` | Conflito | Conflito com o estado atual do recurso (ex.: e-mail duplicado) |
| `422 Unprocessable Entity` | Entidade não processável | Dados sintaticamente válidos mas semanticamente incorretos |

### 5.4 Família 5xx — Erros do Servidor

O problema está no servidor. O cliente enviou uma requisição válida, mas o servidor falhou ao processá-la.

| Código | Nome | Quando ocorre |
|---|---|---|
| `500 Internal Server Error` | Erro interno | Exceção não tratada no servidor |
| `502 Bad Gateway` | Gateway inválido | Servidor intermediário recebeu resposta inválida |
| `503 Service Unavailable` | Serviço indisponível | Servidor sobrecarregado ou em manutenção |
| `504 Gateway Timeout` | Tempo esgotado | O servidor não respondeu a tempo |

### 5.5 Como usar os códigos no desenvolvimento mobile

No app React Native, o `axios` lança uma exceção (`throw`) para qualquer resposta com status `4xx` ou `5xx`. Por isso, toda chamada à API deve estar dentro de um bloco `try/catch`:

```javascript
try {
  const resposta = await api.get('/api/pessoas')
  // status 200: sucesso — dados disponíveis em resposta.data
  setPessoas(resposta.data)
} catch (erro) {
  if (erro.response) {
    // O servidor respondeu com um status de erro (4xx ou 5xx)
    const status = erro.response.status
    if (status === 404) abrirModal('erro', 'Pessoa não encontrada.')
    if (status === 500) abrirModal('erro', 'Erro interno no servidor.')
  } else if (erro.request) {
    // A requisição foi feita mas não houve resposta (sem conexão, timeout)
    abrirModal('erro', 'Sem conexão com o servidor.')
  } else {
    // Erro ao montar a requisição
    abrirModal('erro', 'Erro inesperado. Tente novamente.')
  }
}
```

---

## 6. JSON — O formato de dados do REST

JSON é a sigla para **JavaScript Object Notation** (Notação de Objeto JavaScript). É o formato de troca de dados mais utilizado em APIs REST por ser leve, legível por humanos e facilmente interpretado por máquinas.

### 6.1 Tipos de dados suportados

| Tipo | Exemplo |
|---|---|
| String | `"nome": "Gabriel"` |
| Número inteiro | `"idade": 28` |
| Número decimal | `"valor": 3899.99` |
| Booleano | `"ativo": true` |
| Nulo | `"foto": null` |
| Array | `"tags": ["mobile", "web"]` |
| Objeto aninhado | `"endereco": { "cidade": "Patos de Minas" }` |

### 6.2 Exemplos do projeto

**Objeto Pessoa:**
```json
{
  "id": 1,
  "nome": "Gabriel Marinho",
  "idade": 29
}
```

**Lista de Pessoas (array de objetos):**
```json
[
  { "id": 1, "nome": "Gabriel Marinho", "idade": 29 },
  { "id": 2, "nome": "Ana Paula", "idade": 23 }
]
```

**Objeto Produto:**
```json
{
  "id": 1,
  "nome": "Notebook",
  "quantidade": 10,
  "valor": 3899.99
}
```

### 6.3 Como o Spring Boot e o React Native lidam com JSON

No **Spring Boot**, a anotação `@RestController` combina `@Controller` e `@ResponseBody`. Isso instrui o framework a serializar automaticamente os objetos Java em JSON (usando a biblioteca Jackson) antes de enviar a resposta, e a desserializar o JSON recebido de volta para objetos Java (via `@RequestBody`).

No **React Native com axios**, o JSON da resposta já está disponível como objeto JavaScript em `resposta.data`, sem necessidade de conversão manual. O axios cuida da desserialização automaticamente.

---

## 7. URL e Endpoints REST

### 7.1 Estrutura de uma URL RESTful

```
https://verbose-dollop-8080.app.github.dev/api/pessoas/1
│──────────────────────────────────────────│────────│─│
          Base URL (endereço do servidor)  recurso   id
```

| Parte | Nome | Exemplo |
|---|---|---|
| `https://` | Protocolo | Garante comunicação criptografada |
| `verbose-dollop-8080.app.github.dev` | Host | Endereço do servidor |
| `/api/pessoas` | Caminho do recurso | Identifica a coleção |
| `/1` | Parâmetro de rota | Identifica um item específico da coleção |

### 7.2 Boas práticas de nomenclatura

| Prática | Correto | Incorreto |
|---|---|---|
| Substantivos no plural | `/api/pessoas` | `/api/getPessoa` |
| Letras minúsculas | `/api/produtos` | `/api/Produtos` |
| Hífens para separar palavras | `/api/itens-pedido` | `/api/itensPedido` |
| Hierarquia reflete relacionamento | `/api/pedidos/1/itens` | `/api/getItensDoPedido` |
| Não usar verbos na URL | `/api/pessoas` | `/api/listarPessoas` |

A ação é definida pelo **método HTTP**, não pela URL. A URL identifica **o quê**, o método define **o que fazer com ele**.

### 7.3 Parâmetros de rota vs. parâmetros de consulta

**Parâmetro de rota** (`@PathVariable` no Spring Boot): identifica um recurso específico.
```
GET /api/pessoas/5        → busca a pessoa com id 5
```

**Parâmetro de consulta** (`@RequestParam` no Spring Boot): filtra ou pagina uma coleção.
```
GET /api/pessoas?nome=Gabriel     → filtra por nome
GET /api/pessoas?page=0&size=10   → paginação
```

---

## 8. Assincronia — Por que as chamadas à API não são instantâneas

### 8.1 O problema do tempo

Quando um app mobile faz uma requisição a um servidor, ele precisa:

1. Montar a requisição
2. Enviar pelo protocolo HTTP
3. O servidor receber, processar e consultar o banco de dados
4. O servidor montar e enviar a resposta
5. O app receber e exibir os dados

Esse processo leva tempo — de milissegundos a vários segundos, dependendo da rede e do servidor. Se o app **bloqueasse a interface** esperando a resposta, o usuário ficaria com uma tela congelada até os dados chegarem. Isso é inaceitável em termos de experiência do usuário.

### 8.2 A solução: código assíncrono

JavaScript (e React Native) resolve isso com **Promises** e a sintaxe **async/await**.

Uma `Promise` representa um valor que ainda não está disponível, mas estará no futuro. Em vez de bloquear o app esperando, a execução continua e, quando a resposta chegar, o código é retomado.

### 8.3 async/await na prática

```javascript
// SEM async/await (difícil de ler, "callback hell")
api.get('/api/pessoas')
  .then(resposta => {
    setPessoas(resposta.data)
  })
  .catch(erro => {
    console.log(erro)
  })

// COM async/await (limpo e legível)
const carregarPessoas = async () => {
  try {
    const resposta = await api.get('/api/pessoas')
    setPessoas(resposta.data)
  } catch (erro) {
    console.log(erro)
  }
}
```

A palavra-chave `await` pausa a execução **apenas dentro da função assíncrona**, sem bloquear o restante do aplicativo. A interface continua respondendo ao toque enquanto a requisição está em andamento.

### 8.4 Indicadores de carregamento (loading states)

Como as operações são assíncronas, é fundamental informar visualmente ao usuário que algo está acontecendo:

```javascript
const carregarPessoas = async () => {
  setLoading(true)          // exibe o spinner antes da chamada
  try {
    const resposta = await api.get('/api/pessoas')
    setPessoas(resposta.data)
  } catch (erro) {
    abrirModal('erro', 'Falha ao carregar.')
  } finally {
    setLoading(false)       // esconde o spinner independentemente do resultado
  }
}
```

O bloco `finally` garante que o indicador de carregamento seja removido mesmo que ocorra um erro, evitando que o app fique "travado" em um estado de loading eterno.

---

## 9. O axios — Biblioteca HTTP para React Native

O **axios** é uma biblioteca JavaScript para fazer requisições HTTP. Ela é amplamente utilizada em projetos React Native porque oferece:

- Sintaxe simples e consistente
- Conversão automática de JSON
- Interceptors (para adicionar tokens de autenticação em todas as requisições)
- Cancelamento de requisições
- Tratamento unificado de erros

### 9.1 Criando uma instância centralizada

Em vez de configurar a URL base em cada chamada, cria-se uma instância única do axios com as configurações compartilhadas:

```javascript
// src/services/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://SEU-CODESPACE-8080.app.github.dev',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api
```

`baseURL`: endereço base do servidor. Toda requisição usa essa URL como prefixo.

`timeout`: tempo máximo de espera em milissegundos. Se o servidor não responder em 10 segundos, a requisição é cancelada e um erro é lançado.

`headers`: cabeçalhos enviados em todas as requisições. `Content-Type: application/json` informa ao servidor que o corpo da requisição está em formato JSON.

### 9.2 Os quatro métodos principais do axios

```javascript
// GET — buscar dados
const resposta = await api.get('/api/pessoas')
const resposta = await api.get('/api/pessoas/1')

// POST — criar
const resposta = await api.post('/api/pessoas', {
  nome: 'Gabriel',
  idade: 28
})

// PUT — atualizar
const resposta = await api.put('/api/pessoas/1', {
  nome: 'Gabriel Silva',
  idade: 29
})

// DELETE — excluir
await api.delete('/api/pessoas/1')
```

Em todos os casos, os dados retornados pelo servidor estão em `resposta.data`.

### 9.3 Estrutura do objeto de erro do axios

Quando o servidor retorna um status de erro (4xx ou 5xx) ou quando não há conexão, o axios lança uma exceção. O objeto de erro tem uma estrutura específica:

```javascript
catch (erro) {
  if (erro.response) {
    // O servidor respondeu com erro
    console.log(erro.response.status)  // ex: 404, 500
    console.log(erro.response.data)    // corpo da resposta de erro
  } else if (erro.request) {
    // Requisição enviada mas sem resposta (timeout, sem conexão)
    console.log('Servidor não respondeu')
  } else {
    // Erro ao configurar a requisição
    console.log('Erro na requisição:', erro.message)
  }
}
```

---

## 10. Ciclo de vida das requisições no React Native

### 10.1 useEffect — Quando buscar dados

O hook `useEffect` é o lugar correto para fazer chamadas à API porque permite controlar **quando** a requisição acontece:

```javascript
// Executa uma única vez quando o componente é montado
useEffect(() => {
  carregarPessoas()
}, [])  // array vazio = executa apenas na montagem

// Executa sempre que o valor de "id" mudar
useEffect(() => {
  carregarPessoa()
}, [id])
```

### 10.2 useFocusEffect — Atualizar ao voltar para a tela

No React Navigation, `useEffect` **não é reexecutado** quando o usuário volta para uma tela que já estava na pilha de navegação. Para resolver isso, usa-se `useFocusEffect`:

```javascript
import { useFocusEffect } from '@react-navigation/native'
import { useCallback } from 'react'

useFocusEffect(
  useCallback(() => {
    carregarPessoas()  // executa toda vez que a tela recebe foco
  }, [])
)
```

Isso garante que a lista de pessoas seja sempre atualizada ao voltar do formulário de cadastro ou edição, sem que o usuário precise puxar para atualizar manualmente.

### 10.3 Fluxo completo de uma operação — Exemplo de Cadastro

```
Usuário preenche o formulário e toca em "Cadastrar"
  │
  ▼
validarCampos()
  │── campos inválidos ──> abre FeedbackModal com tipo 'erro'
  │
  ▼ campos válidos
setSalvando(true)    → botão vira spinner, impede duplo clique
  │
  ▼
api.post('/api/pessoas', payload)
  │
  ├── SUCESSO (201) ──> abre FeedbackModal com tipo 'sucesso'
  │                     ao fechar o modal: navigation.goBack()
  │
  └── ERRO (4xx/5xx) → abre FeedbackModal com tipo 'erro'
                        usuário permanece na tela para corrigir
  │
  ▼ (sempre, em finally)
setSalvando(false)   → botão volta ao estado normal
```

---

## 11. CORS — Por que o app mobile não consegue acessar a API

### 11.1 O que é CORS

CORS é a sigla para **Cross-Origin Resource Sharing** (Compartilhamento de Recursos entre Origens Diferentes). É um mecanismo de segurança implementado nos navegadores e em alguns clientes HTTP que **bloqueia requisições feitas de uma origem para outra origem diferente**.

Uma **origem** é definida pela combinação de protocolo, domínio e porta:

```
https://meuapp.com:443   ← origem A
https://meuapi.com:8080  ← origem B (diferente!)
```

Uma requisição da origem A para a origem B é chamada de **cross-origin** e pode ser bloqueada por CORS.

### 11.2 Por que afeta o app mobile

O app React Native nativo (rodando via Expo Go no celular) **não** aplica restrições de CORS, pois não é um navegador. No entanto, quando o app é aberto pelo **Expo Web** (no navegador), as restrições de CORS são aplicadas pelo browser.

Além disso, o **axios** em modo web envia uma requisição de preflight `OPTIONS` antes de `POST` e `PUT`. Se o servidor não responder corretamente ao `OPTIONS`, a requisição é bloqueada antes mesmo de ser enviada.

### 11.3 Como o Spring Boot resolve o CORS

A configuração global de CORS instrui o servidor a aceitar requisições de origens externas:

```java
@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins("*")
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*");
            }
        };
    }
}
```

`allowedOrigins("*")`: aceita qualquer origem. Em produção, substitua pelo domínio real do app.

`allowedMethods(...)`: inclui `OPTIONS` para responder corretamente às requisições de preflight.

---

## 12. Boas práticas no consumo de APIs REST

### 12.1 Centralizar a configuração da API

Nunca espalhe a URL base pelo código. Mantenha-a em um único arquivo (`src/services/api.js`). Quando a URL mudar (e ela vai mudar, especialmente no Codespace), você altera em um único lugar.

### 12.2 Validar antes de enviar

Nunca confie que o usuário preencheu os dados corretamente. Valide os campos no cliente antes de enviar a requisição ao servidor. Isso economiza tempo de resposta e dá feedback imediato ao usuário.

```javascript
const validarCampos = () => {
  if (!nome.trim()) {
    abrirModal('erro', 'O campo Nome é obrigatório.')
    return false
  }
  if (isNaN(Number(idade)) || Number(idade) <= 0) {
    abrirModal('erro', 'Digite uma idade válida.')
    return false
  }
  return true
}
```

### 12.3 Nunca deixar o usuário sem feedback

Toda operação assíncrona deve comunicar ao usuário:
- **Antes**: indicador de carregamento (spinner, botão desabilitado)
- **Depois**: confirmação de sucesso ou mensagem de erro

O uso de modais customizados (como `FeedbackModal`) é preferível ao `Alert` nativo porque garante aparência consistente em iOS e Android.

### 12.4 Separar responsabilidades

| Camada | Arquivo | Responsabilidade |
|---|---|---|
| Serviço | `src/services/api.js` | Configuração HTTP e instância do axios |
| Tela | `src/screens/*.js` | Estado, lógica de negócio e chamadas à API |
| Componente | `src/components/*.js` | Apresentação visual e interação do usuário |

Essa separação facilita a manutenção: se a URL mudar, apenas `api.js` precisa ser alterado. Se o design mudar, apenas os componentes precisam ser tocados.

### 12.5 Usar `finally` para liberar estados de carregamento

```javascript
try {
  setSalvando(true)
  await api.post('/api/pessoas', payload)
  abrirModal('sucesso', 'Cadastrado com sucesso!')
} catch (erro) {
  abrirModal('erro', 'Erro ao cadastrar.')
} finally {
  setSalvando(false)  // sempre executa, mesmo em caso de erro
}
```

Sem o `finally`, um erro faria o botão permanecer desabilitado para sempre, forçando o usuário a fechar e reabrir o app.

---

## 13. Mapa mental dos conceitos

```
                        REST / API
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
        HTTP              JSON            Endpoint
          │                 │                 │
    ┌─────┴────┐      Tipos de dados    ┌────┴────┐
    │          │       (string,         │         │
 Requisição Resposta   número,        URL      Método
    │          │       boolean,         │         │
  Método   Status      array,      /api/     GET POST
  Headers   Code       objeto)    pessoas   PUT DELETE
  Body       Body                  /{id}
                                              │
                              ┌───────────────┼───────────────┐
                              │               │               │
                           axios           async/         useEffect
                              │             await         useFocusEffect
                         api.get()             │
                         api.post()        try/catch
                         api.put()          finally
                         api.delete()
                              │
                        resposta.data
                        erro.response
                        erro.request
```

---

## 14. Tabela resumo — CRUD com REST

| Operação | Tela | Método HTTP | Rota | Status Sucesso | Status Erro |
|---|---|---|---|---|---|
| Listar todos | PessoaListScreen | `GET` | `/api/pessoas` | `200 OK` | `500` |
| Buscar um | PessoaDetailScreen | `GET` | `/api/pessoas/{id}` | `200 OK` | `404` |
| Cadastrar | PessoaFormScreen | `POST` | `/api/pessoas` | `201 Created` | `400`, `500` |
| Editar | PessoaFormScreen | `PUT` | `/api/pessoas/{id}` | `200 OK` | `404`, `400` |
| Excluir | PessoaDetailScreen | `DELETE` | `/api/pessoas/{id}` | `204 No Content` | `404`, `500` |

---

## 15. Glossário

| Termo | Definição |
|---|---|
| **API** | Interface que permite a comunicação entre sistemas |
| **REST** | Estilo arquitetural para APIs web baseado em HTTP |
| **RESTful** | API que segue os princípios REST |
| **HTTP** | Protocolo de comunicação da web |
| **HTTPS** | HTTP com camada de segurança TLS/SSL |
| **Endpoint** | URL específica que representa um recurso da API |
| **Recurso** | Entidade exposta pela API (pessoa, produto, pedido) |
| **JSON** | Formato de texto para troca de dados |
| **axios** | Biblioteca JavaScript para requisições HTTP |
| **async/await** | Sintaxe para trabalhar com código assíncrono |
| **Promise** | Objeto que representa um valor futuro |
| **CORS** | Mecanismo de segurança para requisições entre origens diferentes |
| **Status Code** | Código numérico que indica o resultado de uma requisição |
| **Serialização** | Conversão de objeto Java/JavaScript para JSON |
| **Desserialização** | Conversão de JSON para objeto Java/JavaScript |
| **Preflight** | Requisição OPTIONS enviada pelo browser antes de POST/PUT |
| **Payload** | Dados enviados no corpo de uma requisição |
| **Header** | Cabeçalho com metadados de uma requisição ou resposta |
| **Idempotente** | Operação que produz o mesmo resultado independente de quantas vezes é executada |
| **Stateless** | Sem estado — cada requisição é independente e autocontida |

---

## Referências e Leituras Complementares

- **Fielding, Roy T.** Architectural Styles and the Design of Network-based Software Architectures. Doctoral dissertation, University of California, Irvine, 2000. — Tese original que definiu o REST.
- **MDN Web Docs** — HTTP: https://developer.mozilla.org/pt-BR/docs/Web/HTTP
- **Documentação oficial do axios** — https://axios-http.com/docs/intro
- **React Navigation** — https://reactnavigation.org/docs/getting-started
- **Expo Documentation** — https://docs.expo.dev
- **Spring Boot REST** — https://spring.io/guides/gs/rest-service
