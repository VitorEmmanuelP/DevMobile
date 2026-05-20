# Visão geral do sistema

## 1. Objetivo do projeto

Desenvolver um aplicativo mobile de gerenciamento de presença para alunos universitários que utilizam ônibus intermunicipal para ir à faculdade. O app permite que cada aluno informe se vai ou não em determinado dia e visualize a lista de presença dos demais, descentralizando o controle que hoje fica concentrado em uma única pessoa.

## 2. Problema que o sistema resolve

Atualmente, no momento em que o ônibus vai partir, os alunos não sabem:

- Se ainda falta algum colega chegar.
- Se existe alguma carona paga confirmada para aquele dia que deve ser aguardada.
- Quem é o responsável por essas informações, pois tudo fica centralizado em uma pessoa que pode não estar presente naquele dia.

Isso gera esperas desnecessárias, risco de deixar alguém para trás e falta de organização nas viagens. O app resolve isso ao descentralizar a informação e permitir que qualquer aluno consulte e atualize sua presença e veja as caronas cadastradas.

## 3. Atores envolvidos

| Ator | Descrição |
|---|---|
| **Coordenador** | Responsável por cadastrar os alunos no sistema e distribuir os acessos (e-mail e senha). Não é um aluno do ônibus — é quem administra quem pode usar o app. |
| **Aluno** | Usuário principal. Faz login com as credenciais fornecidas pelo coordenador, marca presença nos dias da semana, visualiza a lista de colegas que vão em cada dia e pode cadastrar caronas pagas. |

## 4. Escopo inicial

### Dentro do escopo

- Autenticação de alunos (login e cadastro).
- Calendário semanal onde o aluno logado marca se vai ou não em cada dia.
- Lista de presença do dia: exibe nome e foto de perfil de cada aluno e seu status (vai / não vai).
- Cadastro de caronas pagas: qualquer aluno pode registrar uma carona informando nome do responsável, data e detalhes.
- Visualização das caronas cadastradas para um determinado dia.

### Fora do escopo nesta fase

- Notificações push.
- Chat entre alunos.
- Histórico de presença com relatórios.
- Integração com sistemas externos da faculdade.
- Alunos se auto-cadastrarem — o cadastro é sempre feito pelo coordenador.

## 5. Restrições técnicas

| Item | Decisão |
|---|---|
| **Plataforma** | React Native com Expo (template blank TypeScript) |
| **Linguagem** | TypeScript — obrigatório em todos os arquivos |
| **Navegação** | React Navigation — obrigatório |
| **Back-end / Banco** | Firebase (Authentication + Firestore) |
| **Ambiente** | Expo Go para desenvolvimento e testes |
| **Estilo** | StyleSheet nativo do React Native, sem bibliotecas de UI externas no escopo inicial |

## 6. Premissas

1. Todos os arquivos devem ser TypeScript (`.tsx` / `.ts`).
2. A navegação deve usar React Navigation (Stack e/ou Bottom Tabs conforme necessidade).
3. O Firebase será usado tanto para autenticação quanto para banco de dados (Firestore).
4. A estrutura de pastas deve seguir separação por `screens`, `components`, `routes`, `config` e `context`.
5. Cada aluno terá um perfil com nome e foto (url de imagem ou foto do Firebase Auth).
6. A presença é registrada por aluno por data — um aluno pode mudar sua presença até o horário da viagem.
7. Caronas são entidades separadas, vinculadas a uma data e ao aluno que as cadastrou.

## 7. Pedido para a IA

Atue como arquiteto de software mobile sênior. Com base no cenário acima:

1. Proponha a arquitetura inicial do projeto (estrutura de pastas, separação de responsabilidades).
2. Identifique os módulos principais e suas dependências.
3. Sugira o modelo de dados no Firestore (coleções e documentos).
4. Aponte riscos técnicos e decisões que precisam ser tomadas antes do desenvolvimento.
5. Indique a ordem recomendada para implementar os módulos.
