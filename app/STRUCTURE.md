# 📱 Estrutura do Projeto AppRestTS

## 🎯 Visão Geral

**AppRestTS** é um aplicativo React Native com TypeScript que consome uma API REST Spring Boot para gerenciar Pessoas e Produtos.

### Stack Tecnológico
- **Frontend**: React Native 0.81 + TypeScript + Expo 54
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **HTTP Client**: Axios
- **Backend**: Spring Boot (Java)
- **Banco de Dados**: H2/PostgreSQL (conforme configuração)

---

## 📁 Estrutura de Pastas

```
appRestTS/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── ProdutoCard.tsx      # Card para exibir produto
│   │   ├── PessoaCard.tsx       # Card para exibir pessoa
│   │   ├── ConfirmacaoModal.tsx # Modal de confirmação
│   │   └── FeedbackModal.tsx    # Modal de feedback
│   │
│   ├── screens/             # Telas da aplicação
│   │   ├── produtos/
│   │   │   ├── ProdutoListScreen.tsx    # Lista de produtos
│   │   │   ├── ProdutoDetailScreen.tsx  # Detalhes do produto
│   │   │   └── ProdutoFormScreen.tsx    # Formulário de produto
│   │   │
│   │   └── pessoas/
│   │       ├── PessoaListScreen.tsx     # Lista de pessoas
│   │       ├── PessoaDetailScreen.tsx   # Detalhes da pessoa
│   │       └── PessoaFormScreen.tsx     # Formulário de pessoa
│   │
│   ├── services/            # Serviços API
│   │   ├── api.ts              # Configuração do Axios
│   │   ├── produtoService.ts   # Serviço de Produtos
│   │   └── pessoaService.ts    # Serviço de Pessoas
│   │
│   ├── hooks/               # Custom Hooks
│   │   └── useApi.ts           # Hooks para requisições
│   │
│   ├── utils/               # Utilitários
│   │   └── formatters.ts       # Funções de formatação
│   │
│   ├── constants/           # Constantes da aplicação
│   │   └── index.ts            # Cores, espaçamentos, etc
│   │
│   ├── types/               # Tipos TypeScript
│   │   └── index.ts            # Interfaces da aplicação
│   │
│   └── assets/              # Recursos estáticos
│       ├── fonts/
│       └── images/
│
├── App.tsx                  # Ponto de entrada + Navegação
├── app.json                 # Configuração Expo
├── package.json             # Dependências
├── tsconfig.json            # Configuração TypeScript
└── index.ts                 # Arquivo de inicialização
```

---

## 🔄 Fluxo de Dados

### Camada de Serviço (Services)
```
API Request → Axios → Response Parser → TypeScript Type
```

### Exemplo: Carregar Produtos
```typescript
// 1. Hook na Screen
const { items, loading, error, load } = useList<Produto>('/api/produtos')

// 2. Ou usando o serviço diretamente
const produtos = await produtoService.listar()

// 3. Tipos garantem tipagem
const produto: Produto = {
  id: 1,
  nome: "Notebook",
  preco: 2500.00,
  quantidade: 5
}
```

---

## 🛠 Serviços Disponíveis

### `produtoService`
```typescript
await produtoService.listar()                    // GET /api/produtos
await produtoService.obterPorId(id)              // GET /api/produtos/{id}
await produtoService.criar(dados)                // POST /api/produtos
await produtoService.atualizar(id, dados)        // PUT /api/produtos/{id}
await produtoService.deletar(id)                 // DELETE /api/produtos/{id}
```

### `pessoaService`
```typescript
await pessoaService.listar()                     // GET /api/pessoas
await pessoaService.obterPorId(id)               // GET /api/pessoas/{id}
await pessoaService.criar(dados)                 // POST /api/pessoas
await pessoaService.atualizar(id, dados)         // PUT /api/pessoas/{id}
await pessoaService.deletar(id)                  // DELETE /api/pessoas/{id}
```

---

## 🎣 Custom Hooks

### `useApi<T>(url: string)`
Hook para requisições GET simples
```typescript
const { data, loading, error, refetch } = useApi<Produto>('/api/produtos/1')
```

### `useList<T>(url: string)`
Hook para listar itens
```typescript
const { items, loading, error, load } = useList<Produto>('/api/produtos')
```

---

## 📝 Tipos (TypeScript)

### Entidades Principais
```typescript
interface Produto {
  id: number
  nome: string
  preco: number          // Campo corrigido: valor -> preco
  quantidade?: number
}

interface Pessoa {
  id: number
  nome: string
  idade?: number
}
```

### DTOs para Formulários
```typescript
interface ProdutoFormData {
  nome: string
  preco: number
  quantidade?: number
}

interface PessoaFormData {
  nome: string
  idade?: number
}
```

---

## 🎨 Design System

### Cores
```typescript
COLORS = {
  primary: '#16a34a',      // Verde
  background: '#f8fafc',   // Fundo cinza claro
  surface: '#fff',         // Branco
  text: {
    primary: '#000',
    secondary: '#64748b',
    disabled: '#94a3b8'
  }
}
```

### Espaçamentos
```typescript
SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24
}
```

### Border Radius
```typescript
BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  full: 999
}
```

---

## 🔧 Utilitários

### Formatação de Moeda
```typescript
formatCurrency(2500)              // "R$ 2.500,00"
formatCurrency(null)              // "-"
```

### Tratamento de Erros
```typescript
const msg = getErrorMessage(error)
// Extrai mensagem amigável do erro
```

### Validação de Formulário
```typescript
const { valid, errors } = validateForm(
  { nome: 'Produto', preco: 100 },
  ['nome', 'preco']
)
```

---

## 🔌 Configuração de API

### Arquivo: `src/services/api.ts`
```typescript
export const API_CONFIG = {
  TIMEOUT: 10000,
  BASE_URL: 'https://orange-yodel-6j45wj49jr5cx66p-8080.app.github.dev/'
}
```

**Para mudar a URL base:**
```typescript
import { setBaseUrl } from '../services/api'
setBaseUrl('http://localhost:8080')
```

---

## 🚀 Fluxo de Uso - Exemplo Completo

### 1. Listar Produtos
```typescript
// ProdutoListScreen.tsx
const { items: produtos, loading, error, load } = useList<Produto>('/api/produtos')

useFocusEffect(
  React.useCallback(() => {
    load()  // Recarrega quando volta para tela
  }, [load])
)

return (
  <FlatList
    data={produtos}
    renderItem={({ item }) => <ProdutoCard produto={item} />}
  />
)
```

### 2. Criar Produto
```typescript
// ProdutoFormScreen.tsx
const salvar = async () => {
  const dados: ProdutoFormData = {
    nome: 'Novo Produto',
    preco: 99.90
  }
  
  await produtoService.criar(dados)
  navigation.goBack()
}
```

### 3. Atualizar Produto
```typescript
const atualizar = async () => {
  const dados: ProdutoFormData = {
    nome: 'Nome Atualizado',
    preco: 149.90
  }
  
  await produtoService.atualizar(produtoId, dados)
  navigation.goBack()
}
```

---

## ✅ Checklist de Implementação

- ✅ Estrutura de pastas organizada
- ✅ Tipagem completa com TypeScript
- ✅ Serviços de API centralizados
- ✅ Custom Hooks reutilizáveis
- ✅ Design System com constantes
- ✅ Tratamento de erros
- ✅ Validação de formulários
- ✅ Formatação de dados
- ✅ Nomenclatura consistente (valor → preco)
- ✅ Documentação inline

---

## 🐛 Problema Corrigido: Preço dos Produtos

### Problema Original
- Backend retornava: `{ id, nome, quantidade, valor }`
- Frontend esperava: `{ id, nome, preco }`
- Resultado: Preço era `undefined`

### Solução Aplicada
1. ✅ Renomeou campo `valor` → `preco` no Backend (Java)
2. ✅ Atualizou tipos TypeScript para usar `preco` (não opcional)
3. ✅ Criou formador `formatCurrency()` para exibição
4. ✅ Adicionou validação no formulário

---

## 📚 Próximas Melhorias

- [ ] Paginação na listagem
- [ ] Busca/Filtro de produtos
- [ ] Upload de imagens
- [ ] Autenticação/Login
- [ ] Cache local com AsyncStorage
- [ ] Offline mode
- [ ] Testes unitários
- [ ] E2E tests

---

## 📞 Suporte

Para mais informações sobre as dependências:
- [React Navigation Docs](https://reactnavigation.org)
- [React Native Docs](https://reactnative.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
