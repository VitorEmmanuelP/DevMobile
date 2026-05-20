
# Projeto React Native com Expo para CRUD de Pessoas consumindo Spring Boot REST

CENTRO UNIVERSITÁRIO DE PATOS DE MINAS – UNIPAM

BACHARELADO EM SISTEMAS DE INFORMAÇÃO

DISCIPLINA: DESENVOLVIMENTO DE SISTEMAS DE INFORMAÇÃO AVANÇADOS II

PROFESSOR RAFAEL MARINHO E SILVA

---

## Apresentação do projeto

Este tutorial mostra como construir um aplicativo mobile em React Native com Expo para cadastrar, listar, detalhar, editar e excluir pessoas a partir de uma API REST criada em Spring Boot.

O material segue a mesma lógica do arquivo `pessoa.http`, que aponta a base URL pública do Codespace e usa as rotas `POST /api/pessoas`, `GET /api/pessoas`, `GET /api/pessoas/{id}`, `PUT /api/pessoas/{id}` e `DELETE /api/pessoas/{id}` como referência para os testes da API.

O aplicativo terá três telas principais:

1. **Tela de listagem** de pessoas, com botão de nova pessoa.
2. **Tela de formulário** para cadastrar ou editar.
3. **Tela de detalhes**, com ícones para editar e excluir.

Cada operação bem-sucedida ou com falha exibirá um **modal de feedback** ao usuário, com ícone visual e mensagem clara, evitando o uso do `Alert` nativo que tem aparência diferente em cada sistema operacional.

---

## Passo 1: Entendendo a arquitetura da solução

A solução se organiza em duas partes independentes que se comunicam via HTTP.

```
┌─────────────────────────────────┐         ┌──────────────────────────────────┐
│   Frontend (React Native/Expo)  │  HTTP   │   Backend (Spring Boot / REST)   │
│                                 │ ──────> │                                  │
│  PessoaListScreen               │  JSON   │  GET    /api/pessoas             │
│  PessoaFormScreen               │ <────── │  GET    /api/pessoas/{id}        │
│  PessoaDetailScreen             │         │  POST   /api/pessoas             │
│                                 │         │  PUT    /api/pessoas/{id}        │
│  axios (chamadas HTTP)          │         │  DELETE /api/pessoas/{id}        │
└─────────────────────────────────┘         └──────────────────────────────────┘
```

O backend entrega e recebe objetos `Pessoa` em formato JSON. O mobile consome essa API com `axios`, organiza as telas com React Navigation e apresenta os dados com componentes nativos.


---

## Passo 2: Criando o projeto no GitHub Codespaces

No terminal do Codespace, crie o projeto com o comando:

```bash
npx create-expo-app appPessoas --template blank@sdk-54
```

Entre na pasta do projeto:

```bash
cd appPessoas
```

Para iniciar a aplicação durante o desenvolvimento, use o modo tunnel, que gera uma URL pública acessível de qualquer dispositivo:

```bash
npx expo start --tunnel
```

> **Dica:** O modo `--tunnel` é necessário no Codespace porque o ambiente é remoto e não há acesso direto à rede local. Ele cria uma URL pública temporária para o app.

---

## Passo 3: Instalando as dependências

O projeto precisa de navegação, consumo de API e suporte a gestos nativos.

Execute os comandos abaixo na raiz do projeto:

```bash
npm install axios @react-navigation/native @react-navigation/native-stack
```

```bash
npx expo install react-native-screens react-native-safe-area-context react-native-gesture-handler
```

### Por que dois comandos separados?

O `npm install` instala pacotes de forma direta. Já o `npx expo install` verifica a versão do Expo SDK instalada no projeto e escolhe automaticamente a versão compatível de cada biblioteca nativa, evitando conflitos de versão.

O pacote `@expo/vector-icons` já faz parte do SDK do Expo e não precisa ser instalado. Ele fornece conjuntos de ícones prontos, como o `Ionicons`, que usaremos nas telas.

---

## Passo 4: Estrutura de pastas do aplicativo

Organize o projeto desta forma antes de criar os arquivos:

```text
appPessoas
├── App.js
├── src
│   ├── services
│   │   └── api.js
│   ├── components
│   │   ├── PessoaCard.js
│   │   ├── FeedbackModal.js
│   │   └── ConfirmacaoModal.js
│   └── screens
│       ├── PessoaListScreen.js
│       ├── PessoaFormScreen.js
│       └── PessoaDetailScreen.js
└── package.json
```

Essa organização separa bem as responsabilidades:

- `services/api.js` concentra toda a comunicação com a REST API.
- `components/` guarda partes reutilizáveis: o cartão de pessoa, o modal de feedback e o modal de confirmação.
- `screens/` guarda as três telas do aplicativo.

---

## Passo 5: Configurando a base da API

Crie a pasta `src/services/` e dentro dela o arquivo `api.js`.

```javascript
// src/services/api.js

import axios from 'axios'

// Troque pelo endereço público do seu Codespace com a porta 8080 exposta
const BASE_URL = 'https://SEU-CODESPACE-8080.app.github.dev'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api
```

### Explicação do código

`axios.create()` cria uma instância do Axios já configurada, evitando repetir a URL completa em cada chamada HTTP.

`baseURL` aponta para o endereço público do backend Spring Boot no Codespace. Substitua `SEU-CODESPACE-8080` pelo valor real da URL pública gerada ao expor a porta 8080 no seu Codespace.

`timeout: 10000` define que, se o servidor não responder em 10 segundos, a requisição será cancelada com erro.

`headers` define que o corpo das requisições será sempre em formato JSON, compatível com o que o `@RequestBody` do Spring Boot espera receber.

> **Como encontrar a URL pública:** No Codespace, vá até a aba **Ports**, localize a porta **8080**, clique com o botão direito e copie a **URL pública**. Essa URL muda cada vez que o Codespace é reiniciado.

---

## Passo 6: Criando o componente de feedback (FeedbackModal)

Crie a pasta `src/components/` e o arquivo `FeedbackModal.js`.

Esse componente exibe uma mensagem de sucesso ou de erro após cada operação do CRUD.

```javascript
// src/components/FeedbackModal.js

import React from 'react'
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

/**
 * Modal de feedback para operações CRUD.
 *
 * Props:
 *   visivel  {boolean}  - controla se o modal está aberto
 *   tipo     {string}   - 'sucesso' ou 'erro'
 *   mensagem {string}   - texto exibido para o usuário
 *   onFechar {function} - chamado quando o usuário pressiona OK
 */
export default function FeedbackModal({ visivel, tipo, mensagem, onFechar }) {
  const ehSucesso = tipo === 'sucesso'

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visivel}
      onRequestClose={onFechar}
    >
      <View style={styles.overlay}>
        <View style={styles.caixa}>

          <Ionicons
            name={ehSucesso ? 'checkmark-circle' : 'close-circle'}
            size={64}
            color={ehSucesso ? '#16a34a' : '#dc2626'}
          />

          <Text style={styles.mensagem}>{mensagem}</Text>

          <TouchableOpacity
            style={[styles.botao, ehSucesso ? styles.botaoSucesso : styles.botaoErro]}
            onPress={onFechar}
          >
            <Text style={styles.textoBotao}>OK</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  caixa: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  mensagem: {
    fontSize: 16,
    color: '#334155',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
    lineHeight: 24,
  },
  botao: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  botaoSucesso: {
    backgroundColor: '#16a34a',
  },
  botaoErro: {
    backgroundColor: '#dc2626',
  },
  textoBotao: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
})
```

### Explicação do código

`Modal` é um componente nativo do React Native. Com `transparent={true}`, o fundo da tela fica visível atrás do modal. O `animationType="fade"` faz o modal aparecer e sumir com um efeito de transparência gradual.

`overlay` cobre toda a tela com um fundo escuro semitransparente (`rgba(0,0,0,0.5)`), destacando a caixa do modal.

O ícone `checkmark-circle` é exibido em verde para sucesso, e `close-circle` em vermelho para erro. Essa lógica depende da prop `tipo`.

`onRequestClose` é chamado quando o usuário pressiona o botão físico "Voltar" no Android, garantindo que o modal seja fechado corretamente.

---

## Passo 7: Criando o componente de confirmação (ConfirmacaoModal)

Crie o arquivo `src/components/ConfirmacaoModal.js`.

Esse componente pergunta ao usuário se ele realmente deseja excluir um registro, com os botões Cancelar e Confirmar.

```javascript
// src/components/ConfirmacaoModal.js

import React from 'react'
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

/**
 * Modal de confirmação para ações destrutivas (ex.: exclusão).
 *
 * Props:
 *   visivel    {boolean}  - controla se o modal está aberto
 *   mensagem   {string}   - pergunta exibida ao usuário
 *   onConfirmar {function} - chamado quando o usuário confirma
 *   onCancelar  {function} - chamado quando o usuário cancela
 */
export default function ConfirmacaoModal({ visivel, mensagem, onConfirmar, onCancelar }) {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visivel}
      onRequestClose={onCancelar}
    >
      <View style={styles.overlay}>
        <View style={styles.caixa}>

          <Ionicons name="alert-circle" size={64} color="#f59e0b" />

          <Text style={styles.titulo}>Atenção</Text>
          <Text style={styles.mensagem}>{mensagem}</Text>

          <View style={styles.acoes}>
            <TouchableOpacity style={[styles.botao, styles.botaoCancelar]} onPress={onCancelar}>
              <Text style={styles.textoCancelar}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.botao, styles.botaoConfirmar]} onPress={onConfirmar}>
              <Text style={styles.textoConfirmar}>Excluir</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  caixa: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  titulo: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 12,
  },
  mensagem: {
    fontSize: 15,
    color: '#475569',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
    lineHeight: 22,
  },
  acoes: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  botao: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
  },
  botaoCancelar: {
    backgroundColor: '#f1f5f9',
  },
  botaoConfirmar: {
    backgroundColor: '#dc2626',
  },
  textoCancelar: {
    color: '#475569',
    fontWeight: '700',
    fontSize: 15,
  },
  textoConfirmar: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
})
```

### Explicação do código

O ícone `alert-circle` em âmbar (`#f59e0b`) indica uma ação que requer atenção, seguindo a convenção visual de sistemas de confirmação.

Os dois botões ficam lado a lado com `flexDirection: 'row'` e `flex: 1` em cada um, dividindo o espaço igualmente.

O botão Cancelar tem fundo claro e texto escuro, pois é a ação segura. O botão Excluir tem fundo vermelho para reforçar o caráter destrutivo da ação.

---

## Passo 8: Componente reutilizável de cartão (PessoaCard)

Crie o arquivo `src/components/PessoaCard.js`.

```javascript
// src/components/PessoaCard.js

import React from 'react'
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

/**
 * Cartão exibido na lista de pessoas.
 *
 * Props:
 *   pessoa          {object}   - objeto com id, nome e idade
 *   onPressDetalhes {function} - navega para a tela de detalhes
 */
export default function PessoaCard({ pessoa, onPressDetalhes }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPressDetalhes} activeOpacity={0.85}>

      <View style={styles.linhaSuperior}>
        <Text style={styles.nome}>{pessoa.nome}</Text>
        <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
      </View>

      <View style={styles.infoLinha}>
        <Ionicons name="calendar-outline" size={14} color="#94a3b8" />
        <Text style={styles.info}>{pessoa.idade} anos</Text>
      </View>

      <Text style={styles.id}>ID: {pessoa.id}</Text>

    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  linhaSuperior: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  nome: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1,
  },
  infoLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  info: {
    fontSize: 14,
    color: '#64748b',
  },
  id: {
    fontSize: 12,
    color: '#cbd5e1',
    marginTop: 4,
  },
})
```

### Explicação do código

`TouchableOpacity` deixa o cartão tocável e aplica um efeito de transparência ao toque, guiado pelo `activeOpacity={0.85}`.

`pessoa` é recebido por props e contém os dados que vieram da API REST.

`onPressDetalhes` é a função que navega para a tela de detalhes ao tocar no cartão.

O ícone `chevron-forward` no lado direito indica visualmente que o item é clicável e leva a mais informações.

---

## Passo 9: Criando a tela de listagem (PessoaListScreen)

Crie o arquivo `src/screens/PessoaListScreen.js`.

```javascript
// src/screens/PessoaListScreen.js

import React, { useCallback, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import api from '../services/api'
import PessoaCard from '../components/PessoaCard'
import FeedbackModal from '../components/FeedbackModal'

export default function PessoaListScreen({ navigation }) {
  const [pessoas, setPessoas] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Estado do modal de feedback
  const [modal, setModal] = useState({ visivel: false, tipo: '', mensagem: '' })

  const abrirModal = (tipo, mensagem) => setModal({ visivel: true, tipo, mensagem })
  const fecharModal = () => setModal({ visivel: false, tipo: '', mensagem: '' })

  const carregarPessoas = async () => {
    try {
      setLoading(true)
      const resposta = await api.get('/api/pessoas')
      setPessoas(resposta.data)
    } catch (erro) {
      abrirModal('erro', 'Não foi possível carregar a lista de pessoas. Verifique a conexão com o servidor.')
    } finally {
      setLoading(false)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await carregarPessoas()
    setRefreshing(false)
  }

  // Recarrega a lista sempre que a tela recebe foco
  useFocusEffect(
    useCallback(() => {
      carregarPessoas()
    }, [])
  )

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.textoCarregando}>Carregando...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>

      {/* Cabeçalho com título e botão de nova pessoa */}
      <View style={styles.header}>
        <View>
          <Text style={styles.titulo}>Pessoas</Text>
          <Text style={styles.subtitulo}>{pessoas.length} cadastrada(s)</Text>
        </View>

        <TouchableOpacity
          style={styles.botaoNovo}
          onPress={() => navigation.navigate('PessoaForm')}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Lista de pessoas */}
      <FlatList
        data={pessoas}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <PessoaCard
            pessoa={item}
            onPressDetalhes={() => navigation.navigate('PessoaDetail', { id: item.id })}
          />
        )}
        contentContainerStyle={pessoas.length === 0 ? styles.listaVazia : styles.lista}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2563eb']}
            tintColor="#2563eb"
          />
        }
        ListEmptyComponent={
          <View style={styles.vazioContainer}>
            <Ionicons name="people-outline" size={64} color="#cbd5e1" />
            <Text style={styles.textoVazio}>Nenhuma pessoa cadastrada.</Text>
            <Text style={styles.textoVazioSub}>Toque no botão + para adicionar.</Text>
          </View>
        }
      />

      {/* Modal de feedback para erros de carregamento */}
      <FeedbackModal
        visivel={modal.visivel}
        tipo={modal.tipo}
        mensagem={modal.mensagem}
        onFechar={fecharModal}
      />

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    gap: 12,
  },
  textoCarregando: {
    color: '#64748b',
    fontSize: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titulo: {
    fontSize: 30,
    fontWeight: '800',
    color: '#0f172a',
  },
  subtitulo: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 2,
  },
  botaoNovo: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  lista: {
    paddingBottom: 24,
  },
  listaVazia: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  vazioContainer: {
    alignItems: 'center',
    gap: 8,
  },
  textoVazio: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  textoVazioSub: {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 14,
  },
})
```

### Explicação do código

`useState` controla quatro estados: a lista de pessoas, o indicador de carregamento, o gesto de puxar para atualizar e o estado do modal de feedback.

`useFocusEffect` é um hook do React Navigation que executa a função recebida toda vez que a tela entra em foco. Isso garante que a lista seja recarregada automaticamente após criar, editar ou excluir uma pessoa, sem que o usuário precise fazer nada.

`useCallback` envolve a função passada ao `useFocusEffect` para que ela não seja recriada desnecessariamente a cada renderização, otimizando o desempenho.

`FlatList` é o componente ideal para renderizar listas grandes no React Native, porque renderiza apenas os itens visíveis na tela, economizando memória.

`RefreshControl` adiciona o gesto de "puxar para atualizar" à lista, amplamente conhecido pelos usuários de apps mobile.

`ListEmptyComponent` é exibido automaticamente pela `FlatList` quando o array `data` está vazio, indicando ao usuário que não há registros.

O `FeedbackModal` é exibido apenas quando ocorre um erro ao carregar a lista.

---

## Passo 10: Criando a tela de formulário para cadastro e edição (PessoaFormScreen)

Crie o arquivo `src/screens/PessoaFormScreen.js`.

Essa tela funciona tanto para **cadastrar** quanto para **editar** uma pessoa. A diferença é detectada pela presença do parâmetro `id` na navegação.

```javascript
// src/screens/PessoaFormScreen.js

import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native'
import api from '../services/api'
import FeedbackModal from '../components/FeedbackModal'

export default function PessoaFormScreen({ navigation, route }) {
  // Se chegou um id pela navegação, estamos no modo edição
  const pessoaId = route.params?.id ?? null
  const editando = pessoaId !== null

  const [nome, setNome] = useState('')
  const [idade, setIdade] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [carregandoDados, setCarregandoDados] = useState(editando)

  // Estado do modal de feedback
  const [modal, setModal] = useState({ visivel: false, tipo: '', mensagem: '' })

  const abrirModal = (tipo, mensagem) => setModal({ visivel: true, tipo, mensagem })

  const fecharModal = () => {
    setModal({ visivel: false, tipo: '', mensagem: '' })
    // Volta para a tela anterior somente após fechar o modal de sucesso
    if (modal.tipo === 'sucesso') {
      navigation.goBack()
    }
  }

  // Se estiver editando, carrega os dados atuais da pessoa
  useEffect(() => {
    if (!editando) return

    const carregarPessoa = async () => {
      try {
        const resposta = await api.get(`/api/pessoas/${pessoaId}`)
        setNome(resposta.data.nome)
        setIdade(String(resposta.data.idade))
      } catch (erro) {
        abrirModal('erro', 'Não foi possível carregar os dados da pessoa para edição.')
      } finally {
        setCarregandoDados(false)
      }
    }

    carregarPessoa()
  }, [editando, pessoaId])

  const validarCampos = () => {
    if (!nome.trim()) {
      abrirModal('erro', 'O campo Nome é obrigatório.')
      return false
    }
    if (!idade.trim()) {
      abrirModal('erro', 'O campo Idade é obrigatório.')
      return false
    }
    const idadeNum = Number(idade)
    if (isNaN(idadeNum) || idadeNum <= 0 || idadeNum > 150) {
      abrirModal('erro', 'Digite uma idade válida entre 1 e 150 anos.')
      return false
    }
    return true
  }

  const salvarPessoa = async () => {
    if (!validarCampos()) return

    const payload = {
      nome: nome.trim(),
      idade: Number(idade),
    }

    try {
      setSalvando(true)

      if (editando) {
        await api.put(`/api/pessoas/${pessoaId}`, payload)
        abrirModal('sucesso', 'Pessoa atualizada com sucesso!')
      } else {
        await api.post('/api/pessoas', payload)
        abrirModal('sucesso', 'Pessoa cadastrada com sucesso!')
      }
    } catch (erro) {
      const mensagem = editando
        ? 'Não foi possível atualizar a pessoa. Tente novamente.'
        : 'Não foi possível cadastrar a pessoa. Tente novamente.'
      abrirModal('erro', mensagem)
    } finally {
      setSalvando(false)
    }
  }

  if (carregandoDados) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.textoCarregando}>Carregando dados...</Text>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">

        <Text style={styles.titulo}>
          {editando ? 'Editar pessoa' : 'Nova pessoa'}
        </Text>
        <Text style={styles.subtitulo}>
          {editando ? 'Altere os campos e salve.' : 'Preencha os campos abaixo.'}
        </Text>

        {/* Campo Nome */}
        <View style={styles.campo}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o nome completo"
            placeholderTextColor="#94a3b8"
            value={nome}
            onChangeText={setNome}
            autoCapitalize="words"
            returnKeyType="next"
          />
        </View>

        {/* Campo Idade */}
        <View style={styles.campo}>
          <Text style={styles.label}>Idade</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite a idade"
            placeholderTextColor="#94a3b8"
            value={idade}
            onChangeText={setIdade}
            keyboardType="numeric"
            returnKeyType="done"
            maxLength={3}
          />
        </View>

        {/* Botão Salvar */}
        <TouchableOpacity
          style={[styles.botaoSalvar, salvando && styles.botaoDesabilitado]}
          onPress={salvarPessoa}
          disabled={salvando}
          activeOpacity={0.85}
        >
          {salvando ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.textoBotao}>
              {editando ? 'Atualizar' : 'Cadastrar'}
            </Text>
          )}
        </TouchableOpacity>

      </ScrollView>

      {/* Modal de feedback (sucesso ou erro) */}
      <FeedbackModal
        visivel={modal.visivel}
        tipo={modal.tipo}
        mensagem={modal.mensagem}
        onFechar={fecharModal}
      />

    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    gap: 12,
  },
  textoCarregando: {
    color: '#64748b',
    fontSize: 15,
  },
  conteudo: {
    padding: 20,
    gap: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
  },
  subtitulo: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: -12,
  },
  campo: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#0f172a',
  },
  botaoSalvar: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 4,
    shadowColor: '#2563eb',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  botaoDesabilitado: {
    opacity: 0.6,
  },
  textoBotao: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
})
```

### Explicação do código

`route.params?.id` usa o operador de encadeamento opcional `?.` para acessar o parâmetro `id` com segurança. Se ele não existir, o resultado é `undefined`, e com `?? null` o valor padrão passa a ser `null`. Isso determina se a tela está no modo de cadastro ou edição.

`carregandoDados` é um estado separado de `salvando`. Ele controla o indicador de carregamento enquanto os dados da pessoa são buscados da API para preencher o formulário no modo de edição.

`validarCampos` centraliza toda a lógica de validação antes de enviar dados para a API. Cada falha de validação abre o `FeedbackModal` com uma mensagem específica, sem precisar de `Alert`.

`fecharModal` fecha o modal e, se o tipo for `'sucesso'`, também navega de volta para a tela anterior. Isso garante que o usuário veja a mensagem de sucesso antes de a tela mudar.

O botão **Salvar** exibe um `ActivityIndicator` enquanto a requisição está em andamento, substituindo o texto e impedindo duplo clique com `disabled={salvando}`.

`KeyboardAvoidingView` garante que o teclado virtual não cubra os campos de entrada, especialmente em iPhones.

`keyboardShouldPersistTaps="handled"` no `ScrollView` permite que toques fora do teclado fechem-no corretamente sem interferir nos botões da tela.

---

## Passo 11: Criando a tela de detalhes com ícones de editar e excluir (PessoaDetailScreen)

Crie o arquivo `src/screens/PessoaDetailScreen.js`.

```javascript
// src/screens/PessoaDetailScreen.js

import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import api from '../services/api'
import FeedbackModal from '../components/FeedbackModal'
import ConfirmacaoModal from '../components/ConfirmacaoModal'

export default function PessoaDetailScreen({ navigation, route }) {
  const { id } = route.params

  const [pessoa, setPessoa] = useState(null)
  const [loading, setLoading] = useState(true)
  const [excluindo, setExcluindo] = useState(false)

  // Estado do modal de feedback (sucesso/erro)
  const [feedback, setFeedback] = useState({ visivel: false, tipo: '', mensagem: '' })

  // Estado do modal de confirmação de exclusão
  const [confirmacao, setConfirmacao] = useState(false)

  const abrirFeedback = (tipo, mensagem) => setFeedback({ visivel: true, tipo, mensagem })

  const fecharFeedback = () => {
    const tipo = feedback.tipo
    setFeedback({ visivel: false, tipo: '', mensagem: '' })
    // Se a exclusão foi bem-sucedida, volta para a lista ao fechar o modal
    if (tipo === 'sucesso') {
      navigation.goBack()
    }
  }

  const carregarPessoa = async () => {
    try {
      setLoading(true)
      const resposta = await api.get(`/api/pessoas/${id}`)
      setPessoa(resposta.data)
    } catch (erro) {
      abrirFeedback('erro', 'Não foi possível carregar os detalhes desta pessoa.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarPessoa()
  }, [id])

  const confirmarExclusao = () => setConfirmacao(true)
  const cancelarExclusao = () => setConfirmacao(false)

  const excluirPessoa = async () => {
    setConfirmacao(false)
    try {
      setExcluindo(true)
      await api.delete(`/api/pessoas/${id}`)
      abrirFeedback('sucesso', 'Pessoa excluída com sucesso!')
    } catch (erro) {
      abrirFeedback('erro', 'Não foi possível excluir esta pessoa. Tente novamente.')
    } finally {
      setExcluindo(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.textoCarregando}>Carregando detalhes...</Text>
      </View>
    )
  }

  if (!pessoa) {
    return (
      <View style={styles.center}>
        <Ionicons name="person-remove-outline" size={64} color="#cbd5e1" />
        <Text style={styles.textoErro}>Pessoa não encontrada.</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>

      {/* Avatar com inicial do nome */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarLetra}>
            {pessoa.nome.charAt(0).toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Card com os dados da pessoa */}
      <View style={styles.card}>
        <Text style={styles.nomeDestaque}>{pessoa.nome}</Text>

        <View style={styles.separador} />

        <View style={styles.linha}>
          <View style={styles.linhaEsquerda}>
            <Ionicons name="finger-print-outline" size={18} color="#94a3b8" />
            <Text style={styles.rotulo}>Código</Text>
          </View>
          <Text style={styles.valor}>{pessoa.id}</Text>
        </View>

        <View style={styles.linha}>
          <View style={styles.linhaEsquerda}>
            <Ionicons name="calendar-outline" size={18} color="#94a3b8" />
            <Text style={styles.rotulo}>Idade</Text>
          </View>
          <Text style={styles.valor}>{pessoa.idade} anos</Text>
        </View>
      </View>

      {/* Botões de ação */}
      <View style={styles.acoes}>
        <TouchableOpacity
          style={[styles.botaoAcao, styles.botaoEditar]}
          onPress={() => navigation.navigate('PessoaForm', { id: pessoa.id })}
          activeOpacity={0.85}
        >
          <Ionicons name="create-outline" size={20} color="#ffffff" />
          <Text style={styles.textoAcao}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.botaoAcao, styles.botaoExcluir, excluindo && styles.botaoDesabilitado]}
          onPress={confirmarExclusao}
          disabled={excluindo}
          activeOpacity={0.85}
        >
          {excluindo ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <>
              <Ionicons name="trash-outline" size={20} color="#ffffff" />
              <Text style={styles.textoAcao}>Excluir</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Modal de confirmação de exclusão */}
      <ConfirmacaoModal
        visivel={confirmacao}
        mensagem={`Deseja realmente excluir "${pessoa.nome}"? Esta ação não pode ser desfeita.`}
        onConfirmar={excluirPessoa}
        onCancelar={cancelarExclusao}
      />

      {/* Modal de feedback (sucesso ou erro da exclusão) */}
      <FeedbackModal
        visivel={feedback.visivel}
        tipo={feedback.tipo}
        mensagem={feedback.mensagem}
        onFechar={fecharFeedback}
      />

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  conteudo: {
    padding: 20,
    gap: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    gap: 12,
  },
  textoCarregando: {
    color: '#64748b',
    fontSize: 15,
  },
  textoErro: {
    fontSize: 16,
    color: '#94a3b8',
    marginTop: 8,
  },
  avatarContainer: {
    alignItems: 'center',
    paddingTop: 8,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  avatarLetra: {
    fontSize: 38,
    fontWeight: '800',
    color: '#ffffff',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  nomeDestaque: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 16,
  },
  separador: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginBottom: 16,
  },
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  linhaEsquerda: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rotulo: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  valor: {
    fontSize: 16,
    color: '#0f172a',
    fontWeight: '700',
  },
  acoes: {
    flexDirection: 'row',
    gap: 12,
  },
  botaoAcao: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  botaoEditar: {
    backgroundColor: '#16a34a',
    shadowColor: '#16a34a',
  },
  botaoExcluir: {
    backgroundColor: '#dc2626',
    shadowColor: '#dc2626',
  },
  botaoDesabilitado: {
    opacity: 0.6,
  },
  textoAcao: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
})
```

### Explicação do código

`confirmarExclusao` abre o `ConfirmacaoModal` sem executar nenhuma ação. Somente após o usuário confirmar no modal, `excluirPessoa` é chamada.

`excluirPessoa` executa o `DELETE /api/pessoas/{id}`. Em caso de sucesso, abre o `FeedbackModal` com tipo `'sucesso'`. Em caso de erro, abre o mesmo modal com tipo `'erro'`.

`fecharFeedback` verifica o tipo do modal antes de fechá-lo. Se o tipo for `'sucesso'` (exclusão bem-sucedida), também chama `navigation.goBack()`, levando o usuário de volta à lista. Isso garante que ele veja a confirmação de sucesso antes de a tela mudar.

O avatar com a inicial do nome é gerado com `pessoa.nome.charAt(0).toUpperCase()`, criando uma identidade visual simples e rápida sem depender de fotos.

O estado `excluindo` desabilita o botão de excluir e exibe um `ActivityIndicator` durante a requisição, evitando que o usuário clique duas vezes.

---

## Passo 12: Montando a navegação do aplicativo (App.js)

Substitua o conteúdo do arquivo `App.js` na raiz do projeto:

```javascript
// App.js

import 'react-native-gesture-handler'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { StatusBar } from 'expo-status-bar'

import PessoaListScreen from './src/screens/PessoaListScreen'
import PessoaFormScreen from './src/screens/PessoaFormScreen'
import PessoaDetailScreen from './src/screens/PessoaDetailScreen'

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator
          initialRouteName="PessoaList"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#ffffff',
            },
            headerTitleStyle: {
              fontWeight: '700',
              fontSize: 18,
              color: '#0f172a',
            },
            headerTintColor: '#2563eb',
            headerShadowVisible: false,
            contentStyle: {
              backgroundColor: '#f8fafc',
            },
          }}
        >
          <Stack.Screen
            name="PessoaList"
            component={PessoaListScreen}
            options={{ title: 'Lista de Pessoas' }}
          />
          <Stack.Screen
            name="PessoaDetail"
            component={PessoaDetailScreen}
            options={{ title: 'Detalhes' }}
          />
          <Stack.Screen
            name="PessoaForm"
            component={PessoaFormScreen}
            options={({ route }) => ({
              title: route.params?.id ? 'Editar Pessoa' : 'Nova Pessoa',
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  )
}
```

### Explicação do código

`import 'react-native-gesture-handler'` deve ser a **primeira linha** do arquivo de entrada. Isso garante que o sistema de gestos esteja disponível antes de qualquer componente ser renderizado.

`GestureHandlerRootView` envolve toda a aplicação e é obrigatório para que o React Navigation e os gestos funcionem corretamente em apps nativos.

`NavigationContainer` gerencia o histórico de navegação e fornece o contexto de navegação para todos os componentes filhos.

`createNativeStackNavigator` cria um navegador em pilha. Cada nova tela é "empilhada" sobre a anterior, e o botão de voltar desfaz essa pilha. É ideal para o fluxo lista → detalhes → formulário.

`screenOptions` centraliza o estilo visual do cabeçalho em um único lugar, evitando repetição nas telas individuais.

`options` na tela `PessoaForm` usa uma função que recebe `route` para alterar o título dinamicamente: "Editar Pessoa" quando há um `id`, ou "Nova Pessoa" quando não há.

---

## Passo 13: Resumo do fluxo de comunicação com a API

A tabela abaixo resume como cada tela se comunica com o backend:

| Tela                | Operação    | Rota REST                     | Quando ocorre                         |
|---------------------|-------------|-------------------------------|---------------------------------------|
| PessoaListScreen    | `GET` lista | `GET /api/pessoas`            | Ao focar a tela e ao puxar para atualizar |
| PessoaDetailScreen  | `GET` um    | `GET /api/pessoas/{id}`       | Ao abrir a tela de detalhes           |
| PessoaDetailScreen  | `DELETE`    | `DELETE /api/pessoas/{id}`    | Após confirmar no ConfirmacaoModal    |
| PessoaFormScreen    | `GET` um    | `GET /api/pessoas/{id}`       | Ao abrir a tela no modo edição        |
| PessoaFormScreen    | `POST`      | `POST /api/pessoas`           | Ao salvar no modo cadastro            |
| PessoaFormScreen    | `PUT`       | `PUT /api/pessoas/{id}`       | Ao salvar no modo edição              |

Essas chamadas seguem exatamente o padrão de rotas que aparece no arquivo `pessoa.http`, com a adição do `PUT` para fechar o CRUD completo.

---

## Passo 14: Executando o projeto no Codespaces

Com todos os arquivos criados, execute o projeto:

```bash
npx expo start --tunnel
```

O terminal exibirá um QR Code. Use o aplicativo **Expo Go** no seu celular para escanear o código e testar o app em tempo real.

> **Atenção com a URL da API:** Cada vez que o Codespace é reiniciado, a URL pública da porta 8080 muda. Lembre-se de atualizar o valor da constante `BASE_URL` no arquivo `src/services/api.js` com a nova URL.

**Para garantir que o backend está acessível antes de testar o app:**

1. No Codespace, abra a aba **Ports**.
2. Localize a porta **8080**.
3. Confirme que a visibilidade está como **Public**.
4. Copie a URL e cole em `BASE_URL` no `api.js`.
5. Teste no arquivo `pessoa.http` com a extensão **REST Client** do VS Code para confirmar que a API responde corretamente.

---

## Passo 15: Checklist final do que o aplicativo precisa entregar

Antes de considerar o projeto pronto, confirme se todos os itens abaixo estão funcionando:

**Backend Spring Boot** *(detalhado no tutorial `aulaSpring.md`)*:
- [ ] Endpoint `GET /api/pessoas` retorna lista de pessoas em JSON
- [ ] Endpoint `GET /api/pessoas/{id}` retorna uma pessoa por ID
- [ ] Endpoint `POST /api/pessoas` cadastra uma nova pessoa
- [ ] Endpoint `PUT /api/pessoas/{id}` atualiza os dados de uma pessoa
- [ ] Endpoint `DELETE /api/pessoas/{id}` remove uma pessoa
- [ ] A porta 8080 está pública no Codespace

**Frontend React Native:**
- [ ] A tela de listagem carrega os dados da API ao abrir
- [ ] A lista se atualiza automaticamente ao voltar de outras telas
- [ ] O formulário de cadastro valida os campos e exibe modal de erro
- [ ] O cadastro bem-sucedido exibe modal de sucesso e volta para a lista
- [ ] A tela de detalhes exibe os dados corretamente
- [ ] O botão Editar abre o formulário com os dados preenchidos
- [ ] A edição bem-sucedida exibe modal de sucesso e volta para a lista
- [ ] O botão Excluir abre o ConfirmacaoModal antes de agir
- [ ] A exclusão bem-sucedida exibe modal de sucesso e volta para a lista
- [ ] Erros de rede exibem modal de erro com mensagem clara
- [ ] A URL em `src/services/api.js` aponta para o Codespace correto

---

## Conclusão

Com essa estrutura, você terá um aplicativo React Native com Expo completo para consumir um backend Spring Boot via REST, com:

- **Três telas bem definidas:** listagem, formulário e detalhes.
- **CRUD completo:** criação, leitura, atualização e exclusão.
- **Modais de feedback** customizados no lugar do `Alert` nativo, com ícones visuais de sucesso e erro.
- **Modal de confirmação** para proteger a operação de exclusão contra cliques acidentais.
- **Navegação organizada** com React Navigation Native Stack.
- **Interface limpa e moderna** com cartões, sombras, bordas arredondadas e paleta de cores consistente.
- **Experiência de carregamento** com indicadores visuais em todas as operações assíncronas.

O material segue o mesmo espírito do arquivo `aulaSpring.md`, mas adaptado para a camada mobile e para a comunicação com a API REST do projeto de pessoas.