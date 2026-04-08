# Material de estudos. Aplicação mobile com React Native, Expo e Firebase.

## 1. Visão geral do projeto

Este projeto mostra, na prática, como construir uma aplicação mobile multiplataforma com **React Native**, **Expo** e **Firebase**, usando um fluxo completo de autenticação, cadastro, consulta, edição e exclusão de usuários.

A ideia central é simples e muito importante para o estudo de desenvolvimento mobile moderno. O aplicativo permite que uma pessoa se cadastre, faça login, acesse uma área restrita e, em seguida, veja uma lista de usuários armazenados no **Cloud Firestore**. Também existe uma tela de edição para alterar dados e uma confirmação antes de excluir registros.

Além da parte funcional, o projeto é excelente para aprender conceitos essenciais, como:

- Criação de projetos com **Expo**.
- Uso de **React Native** para interfaces móveis.
- Navegação com **React Navigation**.
- Autenticação com **Firebase Authentication**.
- Banco de dados em nuvem com **Cloud Firestore**.
- Uso de **hooks** como `useState` e `useEffect`.
- Organização de telas, serviços e configuração em pastas separadas.
- Boas práticas de experiência do usuário com **modais**, **validação de campos** e **confirmação de ações destrutivas**.

---

## 2. Tecnologias usadas no projeto

### React Native
É o framework usado para criar interfaces móveis com JavaScript e JSX. Ele permite desenvolver aplicativos para Android e iOS com uma única base de código.

### Expo
É uma plataforma que simplifica o desenvolvimento com React Native. Com o Expo, você consegue iniciar o projeto, testar no celular com o **Expo Go** e rodar o app sem precisar configurar o ambiente nativo de forma complexa no início.

### Expo Go
É o aplicativo instalado no celular para executar e testar o projeto em tempo real durante o desenvolvimento.

### Firebase
É a plataforma de backend utilizada no projeto. Neste caso, foram usados dois serviços principais.

- **Firebase Authentication**, para criar contas, realizar login e logout.
- **Cloud Firestore**, para salvar e ler os dados dos usuários.

### React Navigation
É a biblioteca responsável pela navegação entre telas. No projeto, ela é usada com dois tipos de navegação.

- **Stack Navigation**, para o fluxo de login, cadastro e edição.
- **Drawer Navigation**, para o menu lateral depois do login.

### StyleSheet
É o sistema de estilos do React Native. Ele organiza a aparência dos componentes com base em objetos JavaScript.

---

## 3. Comandos principais para criar e executar o projeto

### Criar o projeto
```bash
npx create-expo-app ex1Firebase --template blank@sdk-54
```

Esse comando cria um projeto Expo novo, já preparado com o SDK 54.

### Instalar o Firebase
```bash
npm install firebase
```

Esse comando adiciona o SDK do Firebase ao projeto.

### Instalar o React Navigation
```bash
npm install @react-navigation/native @react-navigation/native-stack
npx expo install react-native-screens react-native-safe-area-context
```

Essas dependências são necessárias para a navegação por pilha.

### Observação importante
Como o projeto usa o menu lateral, também é necessário instalar o pacote do drawer.

```bash
npm install @react-navigation/drawer
```

Além disso, o projeto importa `react-native-gesture-handler`, que é essencial para o funcionamento correto da navegação em muitas aplicações com drawer.

### Executar o projeto
```bash
npx expo start --tunnel
```

O modo `--tunnel` ajuda quando o computador e o celular não estão na mesma rede local ou quando há dificuldade para conexão direta.

---

## 4. Estrutura geral do projeto

Uma organização comum para esse tipo de aplicação é:

```bash
ex1Firebase
├── App.js
└── src
    ├── config
    │   └── firebaseConfig.js
    └── screens
        ├── LoginScreen.js
        ├── RegisterScreen.js
        ├── WelcomeScreen.js
        ├── UserListScreen.js
        └── EditUserScreen.js
```

### O que cada pasta faz

- `config`, concentra a configuração do Firebase.
- `screens`, guarda as telas da aplicação.
- `App.js`, centraliza o roteamento principal do app.

Essa separação é muito importante porque deixa o projeto mais limpo, mais fácil de manter e mais simples de explicar em sala de aula.

---

## 5. Entendendo a arquitetura do aplicativo

O fluxo do aplicativo funciona assim.

1. O usuário abre o app e vê a tela de login.
2. Se não tiver conta, vai para o cadastro.
3. Ao entrar com sucesso, é levado para a área principal.
4. Na área principal, existe um menu lateral com:
   - tela de boas-vindas;
   - lista de usuários.
5. Na lista, o administrador pode visualizar detalhes, editar ou excluir registros.

Esse modelo é muito interessante porque mostra um sistema real, com acesso restrito e gestão de dados.

---

## 6. Explicação do arquivo `App.js`

Esse arquivo é o coração da navegação.

```javascript
import 'react-native-gesture-handler';

import React from 'react';

import { NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { createDrawerNavigator } from '@react-navigation/drawer';

import LoginScreen from './src/screens/LoginScreen';

import WelcomeScreen from './src/screens/WelcomeScreen';

import RegisterScreen from './src/screens/RegisterScreen';

import UserListScreen from './src/screens/UserListScreen';

import EditUserScreen from './src/screens/EditUserScreen';

const Stack = createNativeStackNavigator();

const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Bem-vindo" component={WelcomeScreen} />
      <Drawer.Screen name="Lista de Usuários" component={UserListScreen} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={MyDrawer} options={{ headerShown: false }} />
        <Stack.Screen name="EditUser" component={EditUserScreen} options={{ title: 'Editar Usuário' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### O que esse código faz

`react-native-gesture-handler` melhora a interação com gestos, especialmente no drawer.

`NavigationContainer` é o contêiner principal de navegação. Ele precisa envolver toda a navegação do app.

`createNativeStackNavigator` cria a navegação em pilha. Ela é usada para avançar e voltar entre telas.

`createDrawerNavigator` cria o menu lateral.

A função `MyDrawer` monta a interface que aparece após o login. Ela reúne duas telas.

- `Bem-vindo`.
- `Lista de Usuários`.

A navegação principal do `App` começa na tela `Login`.

### Por que `navigation.replace('Home')` é importante
Na tela de login, o app usa `replace` para ir para a Home. Isso evita que o usuário volte para a tela anterior usando o botão de voltar do sistema.

### O papel da tela `EditUser`
A tela de edição fica no stack principal porque ela deve ser aberta a partir da lista de usuários, sem precisar fazer parte do menu lateral.

---

## 7. Explicação do arquivo `firebaseConfig.js`

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "SUA_CHAVE",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.firebasestorage.app",
  messagingSenderId: "SEU_ID",
  appId: "SEU_APP_ID",
  measurementId: "SEU_MEASUREMENT_ID"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);
```

### O que esse arquivo faz

Ele centraliza a configuração do Firebase. Em vez de repetir a configuração em várias telas, o projeto cria uma única inicialização e exporta os serviços prontos para uso.

### Funções principais

`initializeApp(firebaseConfig)` conecta o aplicativo ao projeto Firebase.

`getAuth(app)` cria a instância de autenticação.

`getFirestore(app)` cria a conexão com o banco Firestore.

### Por que esse arquivo é importante
Esse tipo de organização evita repetição, facilita a manutenção e deixa o projeto mais profissional.

### Observação didática
As chaves do Firebase ficam visíveis no aplicativo cliente. Isso é normal em projetos mobile com Firebase, mas a segurança real deve ser protegida com regras do Firestore e com a configuração correta das permissões de autenticação.

---

## 8. Explicação da tela `LoginScreen.js`

A tela de login é responsável por validar o e-mail e a senha do usuário.

### Estrutura principal

```javascript
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
```

### Função dos imports

- `useState` controla os valores digitados no formulário e o estado do modal.
- `View`, `Text`, `TextInput`, `TouchableOpacity`, `Modal` constroem a interface.
- `signInWithEmailAndPassword` autentica o usuário no Firebase.
- `auth` é a instância já configurada do Firebase Authentication.

### Estados usados

```javascript
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [modalVisible, setModalVisible] = useState(false);
const [modalMessage, setModalMessage] = useState('');
```

Esses estados guardam:

- o e-mail digitado;
- a senha digitada;
- se o modal está visível;
- qual mensagem deve aparecer no modal.

### Fluxo do login

```javascript
const handleLogin = async () => {
  if (email === '' || password === '') {
    setModalMessage('Por favor, preencha todos os campos.');
    setModalVisible(true);
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    navigation.replace('Home');
  } catch (error) {
    if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      setModalMessage('Usuário ou senha incorretos. Verifique seus dados.');
    } else {
      setModalMessage('Erro ao acessar: ' + error.message);
    }
    setModalVisible(true);
  }
};
```

### O que acontece aqui

1. O código verifica se os campos estão vazios.
2. Se tudo estiver preenchido, tenta autenticar no Firebase.
3. Se der certo, redireciona para a Home.
4. Se der erro, exibe uma mensagem amigável no modal.

### Por que usar modal em vez de `Alert`
O modal oferece maior controle visual. Ele permite personalizar cores, textos e botões, deixando a experiência mais agradável e coerente com o design do app.

### Componentes visuais da tela
A tela também tem:

- campo de e-mail;
- campo de senha;
- botão de entrar;
- botão para ir ao cadastro;
- modal de erro com botão de tentativa novamente.

### Conceito importante
O login valida credenciais diretamente no Firebase Authentication. Isso significa que a senha não é tratada manualmente pela aplicação. O Firebase faz essa verificação com segurança.

---

## 9. Explicação da tela `RegisterScreen.js`

Essa tela faz o cadastro do usuário e mostra um dos pontos mais importantes do projeto, que é o **rollback**.

### Imports principais

```javascript
import { createUserWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';
```

### O que cada função faz

- `createUserWithEmailAndPassword`, cria a conta no Authentication.
- `deleteUser`, remove a conta criada, caso algo dê errado depois.
- `doc`, cria a referência para o documento no Firestore.
- `setDoc`, grava os dados no banco.
- `auth` e `db`, apontam para os serviços do Firebase já configurados.

### Estados do cadastro

```javascript
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [birthDate, setBirthDate] = useState('');
const [modalVisible, setModalVisible] = useState(false);
const [modalMessage, setModalMessage] = useState('');
const [isSuccess, setIsSuccess] = useState(false);
```

### Fluxo de cadastro

```javascript
const handleRegister = async () => {
  if (!name || !email || !password || !birthDate) {
    setModalMessage('Por favor, preencha todos os campos.');
    setIsSuccess(false);
    setModalVisible(true);
    return;
  }

  let userCreated = null;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    userCreated = userCredential.user;

    await setDoc(doc(db, 'users', userCreated.uid), {
      name: name,
      email: email,
      birthDate: birthDate,
      createdAt: new Date().toISOString()
    });

    setModalMessage('Cadastro realizado com sucesso!');
    setIsSuccess(true);
    setModalVisible(true);
  } catch (error) {
    if (userCreated && error.code !== 'auth/email-already-in-use') {
      try {
        await deleteUser(userCreated);
      } catch (rollbackError) {
        console.error("Falha ao reverter criação de usuário:", rollbackError);
      }
    }

    setIsSuccess(false);

    if (error.code === 'auth/email-already-in-use') {
      setModalMessage('Este e-mail já está em uso.');
    } else if (error.code === 'auth/weak-password') {
      setModalMessage('A senha deve ter pelo menos 6 caracteres.');
    } else if (error.code === 'permission-denied') {
      setModalMessage('Erro de permissão no Banco de Dados. Verifique as regras do Firestore.');
    } else {
      setModalMessage('Falha ao cadastrar: ' + error.message);
    }
    setModalVisible(true);
  }
};
```

### O que esse fluxo ensina

Esse trecho é ótimo para estudar uma ideia muito importante em sistemas reais, que é a consistência de dados.

#### Etapa 1. Criar o usuário no Auth
Primeiro a conta é criada no Firebase Authentication.

#### Etapa 2. Salvar o perfil no Firestore
Depois, o aplicativo cria um documento com os dados do usuário na coleção `users`.

#### Etapa 3. Fazer rollback em caso de erro
Se a gravação no Firestore falhar, o usuário já criado no Auth é removido. Assim, o sistema evita deixar uma conta sem perfil correspondente.

### Por que o rollback é importante
Sem essa estratégia, o aplicativo poderia criar um login válido, mas não salvar os dados do usuário. Isso geraria registros incompletos e dificultaria a administração do sistema.

### Modal de sucesso e erro
A tela usa um modal com duas possibilidades visuais.

- Verde, quando o cadastro deu certo.
- Vermelho, quando ocorreu erro.

Isso melhora muito a clareza da interface.

---

## 10. Explicação da tela `UserListScreen.js`

Essa é uma das telas mais importantes do projeto, porque ela mostra leitura de dados, expansão de conteúdo e exclusão com confirmação.

### Imports principais

```javascript
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
```

### O que cada import faz

- `useState` controla os estados da tela.
- `useEffect` busca os dados assim que a tela é carregada.
- `FlatList` exibe listas de forma eficiente.
- `Modal` cria a confirmação de exclusão.
- `Alert` mostra erros simples.
- `collection`, `getDocs`, `deleteDoc`, `doc` trabalham com o Firestore.
- `Ionicons` fornece ícones visuais.

### Estados da tela

```javascript
const [users, setUsers] = useState([]);
const [expandedUserId, setExpandedUserId] = useState(null);
const [modalDeleteVisible, setModalDeleteVisible] = useState(false);
const [userToDelete, setUserToDelete] = useState(null);
```

### O que cada estado faz

- `users`, armazena a lista de usuários vindos do Firestore.
- `expandedUserId`, controla qual usuário está com os detalhes abertos.
- `modalDeleteVisible`, controla o modal de exclusão.
- `userToDelete`, guarda o usuário que será apagado.

### Busca dos dados

```javascript
const fetchUsers = async () => {
  const querySnapshot = await getDocs(collection(db, 'users'));
  const userList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  setUsers(userList);
};

useEffect(() => {
  fetchUsers();
}, []);
```

### Como isso funciona

Quando a tela abre, o `useEffect` chama `fetchUsers`.

`getDocs(collection(db, 'users'))` busca todos os documentos da coleção `users`.

Depois, cada documento é transformado em um objeto comum, contendo:

- `id`, com o identificador do documento.
- os dados do documento, como nome, e-mail e data de nascimento.

### Exibição de detalhes
A função `toggleDetails` abre ou fecha os dados extras de um usuário.

```javascript
const toggleDetails = (id) => {
  setExpandedUserId(expandedUserId === id ? null : id);
};
```

Esse recurso é útil porque evita mostrar tudo de uma vez. A interface fica mais limpa e organizada.

### Preparação para exclusão

```javascript
const confirmDelete = (user) => {
  setUserToDelete(user);
  setModalDeleteVisible(true);
};
```

Antes de excluir, o aplicativo pergunta se a ação realmente deve ser feita. Isso é uma boa prática, porque exclusão é uma ação irreversível na maioria dos sistemas.

### Exclusão do registro

```javascript
const handleDelete = async () => {
  try {
    await deleteDoc(doc(db, 'users', userToDelete.id));
    setModalDeleteVisible(false);
    fetchUsers();
  } catch (error) {
    Alert.alert("Erro", "Não foi possível excluir o usuário.");
  }
};
```

### O que esse trecho faz

- Remove o documento do Firestore.
- Fecha o modal.
- Recarrega a lista para mostrar a atualização.

### Renderização de cada usuário

```javascript
const renderUser = ({ item }) => (
  <View style={styles.userCard}>
    <View style={styles.userMainRow}>
      <Text style={styles.userName}>{item.name}</Text>
      <View style={styles.iconGroup}>
        <TouchableOpacity onPress={() => toggleDetails(item.id)}>
          <Ionicons name={expandedUserId === item.id ? "eye" : "eye-off"} size={24} color="#555" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('EditUser', { userData: item })}>
          <Ionicons name="pencil" size={24} color="#007bff" style={{ marginHorizontal: 15 }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => confirmDelete(item)}>
          <Ionicons name="trash" size={24} color="#dc3545" />
        </TouchableOpacity>
      </View>
    </View>

    {expandedUserId === item.id && (
      <View style={styles.detailsBox}>
        <Text>E-mail: {item.email}</Text>
        <Text>Nascimento: {item.birthDate}</Text>
      </View>
    )}
  </View>
);
```

### O que aparece em cada linha da lista

Cada card mostra:

- nome do usuário;
- botão para mostrar ou esconder detalhes;
- botão para editar;
- botão para excluir.

### Por que usar ícones
Os ícones tornam a interface mais intuitiva. O usuário reconhece rapidamente as ações sem precisar ler longos textos.

### FlatList
O `FlatList` é melhor que um `map` simples quando há listas maiores, porque ele otimiza o desempenho da renderização.

---

## 11. Explicação da tela `EditUserScreen.js`

Essa tela é responsável pela atualização dos dados do usuário no Firestore.

### Imports principais

```javascript
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
```

### Estados

```javascript
const { userData } = route.params;
const [name, setName] = useState(userData.name);
const [birthDate, setBirthDate] = useState(userData.birthDate);
```

Os campos já começam preenchidos com os dados recebidos da lista.

### Atualização dos dados

```javascript
const handleUpdate = async () => {
  if (!name || !birthDate) {
    Alert.alert("Erro", "Todos os campos devem ser preenchidos.");
    return;
  }

  try {
    const userRef = doc(db, 'users', userData.id);

    await updateDoc(userRef, {
      name: name,
      birthDate: birthDate
    });

    Alert.alert("Sucesso", "Dados de perfil atualizados com sucesso!");
    navigation.goBack();
  } catch (error) {
    console.error(error);
    Alert.alert("Erro", "Não foi possível atualizar os dados no banco de dados.");
  }
};
```

### O que esse trecho ensina

- `doc(db, 'users', userData.id)` aponta para o documento correto.
- `updateDoc` altera apenas os campos informados.
- `navigation.goBack()` retorna para a tela anterior depois da atualização.

### Diferença entre `setDoc` e `updateDoc`
Esse é um ponto importante para o estudo.

- `setDoc` cria ou substitui um documento.
- `updateDoc` altera apenas campos existentes de um documento já criado.

---

## 12. Explicação da tela `WelcomeScreen.js`

Essa tela representa a área inicial da parte autenticada.

```javascript
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
```

### O que ela faz

Ela exibe uma mensagem de boas-vindas e o e-mail do usuário logado.

```javascript
<Text style={styles.emailText}>{auth.currentUser?.email}</Text>
```

Esse trecho pega o e-mail do usuário autenticado diretamente da sessão atual.

### Logout

```javascript
const handleLogout = () => {
  signOut(auth).then(() => {
    navigation.replace('Login');
  }).catch((error) => {
    console.error(error);
  });
};
```

### Como funciona o logout

1. O Firebase encerra a sessão.
2. O app volta para a tela de login.
3. O uso de `replace` impede retorno fácil para a área logada.

---

## 13. Conceitos importantes

### 13.1 Hooks
Os hooks são funções que permitem usar estado e ciclo de vida em componentes funcionais.

#### `useState`
Usado para armazenar e atualizar informações da interface.

Exemplos no projeto:

- texto do e-mail;
- texto da senha;
- visibilidade do modal;
- usuário selecionado para exclusão.

#### `useEffect`
Usado para executar ações quando a tela é carregada.

Exemplo no projeto:

- buscar usuários no Firestore ao abrir a lista.

---

### 13.2 Componentes do React Native
Os principais componentes usados no projeto são:

- `View`, para criar blocos de layout.
- `Text`, para exibir texto.
- `TextInput`, para entrada de dados.
- `TouchableOpacity`, para botões e interações.
- `Modal`, para janelas sobrepostas.
- `FlatList`, para listar itens.
- `Alert`, para mensagens rápidas.

---

### 13.3 Navegação
A navegação organiza o caminho que o usuário percorre dentro do app.

#### Stack
Usado quando faz sentido seguir um fluxo de telas em sequência.

#### Drawer
Usado para menu lateral, muito comum em aplicações com várias áreas principais.

---

### 13.4 Firebase Authentication
É o serviço responsável por autenticar usuários.

No projeto, ele é usado para:

- criar conta;
- realizar login;
- realizar logout.

---

### 13.5 Cloud Firestore
É o banco de dados NoSQL do Firebase.

No projeto, ele é usado para:

- armazenar perfis de usuários;
- listar documentos;
- editar dados;
- excluir registros.

---

### 13.6 Rollback
Rollback é a reversão de uma operação quando uma etapa falha.

No cadastro, ele aparece assim:

1. usuário é criado no Auth.
2. a gravação no Firestore falha.
3. a conta criada no Auth é apagada.

Isso evita inconsistências.

---

### 13.7 Modal
Modal é uma janela sobreposta à tela principal.

No projeto, ele é usado para:

- mostrar erro de login;
- mostrar sucesso ou erro de cadastro;
- confirmar exclusão.

---

### 13.8 FlatList
`FlatList` é a forma mais adequada de listar dados em React Native quando existe uma coleção dinâmica ou maior.

---

## 14. Fluxo completo do usuário

### Fluxo do usuário comum
1. Abre o aplicativo.
2. Faz login.
3. Vê a tela de boas-vindas.
4. Pode sair da sessão.

### Fluxo do cadastro
1. Acessa a tela de cadastro.
2. Preenche nome, data de nascimento, e-mail e senha.
3. O sistema cria a conta no Firebase.
4. Os dados são salvos no Firestore.
5. O modal de sucesso é exibido.

### Fluxo do administrador
1. Faz login.
2. Abre a lista de usuários.
3. Visualiza dados.
4. Edita informações.
5. Exclui registros, com confirmação.

---

## 15. Pontos fortes deste projeto para estudo

Este projeto é excelente para aprendizado porque reúne vários conceitos importantes em um único sistema.

- Autenticação real.
- Persistência em nuvem.
- Estrutura de pastas organizada.
- Navegação com mais de um padrão.
- Formulários com validação.
- Modais personalizados.
- Operações CRUD completas.
- Boas práticas de reversão de falhas.

---

## 16. Possíveis melhorias

Como material de estudo, é interessante também pensar em evolução do projeto.

### Melhorias técnicas
- usar `onAuthStateChanged` para gerenciar sessão de forma global;
- adicionar validação mais robusta de e-mail e data;
- usar um componente separado para os modais;
- criar campos de perfil mais completos;
- aplicar regras de segurança mais rígidas no Firestore;
- usar contexto ou Redux para estados globais.

### Melhorias visuais
- criar um layout mais moderno;
- adicionar animações;
- usar componentes reutilizáveis;
- melhorar contraste e acessibilidade.

