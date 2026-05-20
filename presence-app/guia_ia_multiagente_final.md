# Guia para estruturar instruções de uma IA multiagente

## 1. Descrição do material

Para que a IA multiagente funcione bem, o processo deve ser incremental, com documentos curtos, objetivos e com um propósito claro para cada fase.

Os principais pontos usados neste material.

1. O uso de Markdown é uma boa escolha, porque organiza o contexto de forma limpa, legível e fácil de manter.
2. A separação por etapas é essencial, porque reduz erros, evita contradições e ajuda os agentes a manterem foco.
3. A definição de contratos de API antes da implementação é uma prática correta, porque reduz retrabalho entre front-end e back-end.
4. A inclusão de testes em cada etapa é obrigatória, porque transforma o projeto em um fluxo verificável e não apenas em geração de código.
5. O registro de evolução do projeto em um arquivo próprio é uma excelente prática, porque facilita retomada, auditoria e continuidade.
6. O material deve evitar excesso de explicação genérica e repetitiva.
7. Cada arquivo precisa ter responsabilidade única.
8. O processo deve deixar explícito o que a IA deve fazer, o que o humano deve validar, e quando avançar para a próxima etapa.
9. Os testes devem aparecer desde a etapa de arquitetura, e não apenas depois.
10. O fluxo ideal é começar com visão geral, seguir para requisitos e contratos, depois modelagem técnica, implementação por módulos, testes e, por fim, registro de evolução.

## 2. Estratégia recomendada para trabalhar com IA multiagente

A melhor forma de conduzir esse tipo de projeto é usar um conjunto de arquivos Markdown bem divididos. Cada arquivo deve servir como uma camada do projeto.

A lógica é esta.

1. Primeiro, você define o problema, o escopo, os atores e as restrições.
2. Depois, você pede à IA que proponha arquitetura, estrutura técnica e padrões.
3. Em seguida, você define contratos entre os módulos.
4. Só então você pede geração de código por partes.
5. Cada parte deve vir acompanhada de testes, critérios de aceite e validação manual.
6. A cada aprovação, você registra o resultado no log de evolução.

Esse método é melhor do que entregar tudo de uma vez, porque reduz ambiguidades, permite correções rápidas e evita que a IA tente resolver todo o sistema sem contexto suficiente.

## 3. Estrutura final recomendada de arquivos

A seguir está a versão mais organizada, prática e completa dos arquivos que devem ser criados.

### 3.1 Arquivo `01_visao_geral.md`

Este arquivo deve conter o contexto do projeto, o problema que será resolvido, os atores, os objetivos de negócio, as restrições técnicas e o que a IA deve analisar primeiro.

Conteúdo recomendado.

```markdown
# Visão geral do sistema

## 1. Objetivo do projeto
Desenvolver um sistema multiagente para apoiar a criação, análise e implementação de um software.

## 2. Problema que o sistema resolve
Descrever com clareza qual dor o sistema atende, quais processos serão automatizados e qual resultado final é esperado.

## 3. Atores envolvidos
Informar quem usa o sistema, quem administra e quem consome os dados gerados.

## 4. Escopo inicial
Definir o que está dentro do projeto e o que fica fora nesta fase inicial.

## 5. Restrições técnicas
Informar a stack obrigatória, o banco de dados, o framework, o ambiente de desenvolvimento e qualquer regra que não pode ser violada.

## 6. Premissas
Descrever as decisões já tomadas e as suposições que a IA deve respeitar.

## 7. Pedido para a IA
Atue como arquiteto de software. Analise o cenário e proponha a melhor estrutura inicial, considerando arquitetura, módulos, dependências e riscos.
```

O que deve ser validado neste arquivo.

1. Se o problema está claro.
2. Se os atores estão identificados.
3. Se as restrições técnicas estão explícitas.
4. Se a IA recebeu instruções suficientes para propor uma arquitetura coerente.

### 3.2 Arquivo `02_requisitos_e_regras_de_negocio.md`

Este arquivo deve detalhar o comportamento esperado do sistema. Ele é importante porque evita que a IA invente regras ou ignore limites importantes.

Conteúdo recomendado.

```markdown
# Requisitos e regras de negócio

## 1. Requisitos funcionais
Listar o que o sistema precisa fazer, em linguagem objetiva.

## 2. Requisitos não funcionais
Descrever desempenho, segurança, confiabilidade, padronização, usabilidade e manutenção.

## 3. Regras de negócio
Descrever as regras que o sistema deve obedecer.

## 4. Casos de uso prioritários
Apontar as primeiras funcionalidades que devem ser implementadas.

## 5. Critérios de aceite
Dizer o que precisa acontecer para considerar a funcionalidade aprovada.

## 6. Pedido para a IA
Organize estes requisitos, identifique inconsistências e indique lacunas que precisam ser decididas antes do desenvolvimento.
```

O que deve ser validado neste arquivo.

1. Se os requisitos estão completos.
2. Se há regras conflitantes.
3. Se a ordem de prioridade faz sentido.
4. Se a IA apontou dúvidas antes de codificar.

### 3.3 Arquivo `03_modelagem_banco_e_dados.md`

Este arquivo deve tratar da estrutura de dados. Ele deve ser criado antes do código, porque influencia toda a aplicação.

Conteúdo recomendado.

```markdown
# Modelagem de banco de dados

## 1. Objetivo da modelagem
Descrever quais entidades serão persistidas e como elas se relacionam.

## 2. Entidades principais
Listar as tabelas e sua função no sistema.

## 3. Relacionamentos
Descrever cardinalidades, chaves estrangeiras e regras de integridade.

## 4. Normalização
Indicar até qual forma normal será aplicada e justificar a escolha.

## 5. Padrões obrigatórios
Definir regras como tipo de chave primária, padrões de nomeação, uso de índices e restrições.

## 6. Script inicial
Solicitar que a IA gere o script SQL inicial com tabelas, chaves, índices e restrições.

## 7. Pedido para a IA
Analise a modelagem proposta e indique riscos, melhorias e possíveis simplificações.
```

O que deve ser validado neste arquivo.

1. Se os tipos de dados estão corretos.
2. Se os relacionamentos fazem sentido.
3. Se há integridade referencial.
4. Se a estratégia de chave primária está consistente.
5. Se os índices atendem às consultas esperadas.

### 3.4 Arquivo `04_contratos_de_api.md`

Este arquivo define a comunicação entre módulos. Ele é essencial para evitar desalinhamento entre front-end e back-end.

Conteúdo recomendado.

```markdown
# Contratos de API

## 1. Objetivo
Definir os endpoints, métodos, parâmetros, respostas e erros esperados.

## 2. Padrão de versionamento
Definir se a API terá versão no caminho, como /api/v1.

## 3. Endpoints
Listar cada rota disponível para a funcionalidade em desenvolvimento.

## 4. Requisição e resposta
Para cada endpoint, informar payload de entrada, payload de saída e exemplos reais em JSON.

## 5. Erros esperados
Informar códigos HTTP, mensagens de erro e situações de validação.

## 6. Regras de contrato
Definir campos obrigatórios, formatos aceitos, nomes e padrões de retorno.

## 7. Pedido para a IA
Documente o contrato completo e destaque qualquer ponto ambíguo que precise de validação antes do desenvolvimento.
```

O que deve ser validado neste arquivo.

1. Se os JSONs estão coerentes.
2. Se as rotas são consistentes.
3. Se os status HTTP estão corretos.
4. Se o contrato é suficiente para consumo pelo front-end.

### 3.5 Arquivo `05_desenvolvimento_backend_modulo.md`

Este arquivo deve ser usado para cada módulo do back-end. Ele não deve misturar várias funcionalidades diferentes.

Conteúdo recomendado.

```markdown
# Desenvolvimento back-end, módulo específico

## 1. Contexto do módulo
Descrever qual funcionalidade será implementada.

## 2. Requisitos técnicos
Informar framework, versão, banco, padrões arquiteturais e bibliotecas obrigatórias.

## 3. Contrato da API
Incluir o contrato previamente aprovado para este módulo.

## 4. O que deve ser gerado
Solicitar entity, repository, service, controller, exceptions e configurações necessárias.

## 5. Testes obrigatórios
Solicitar testes unitários, testes de integração e validações manuais.

## 6. Critérios de aceite
Definir quando o módulo pode ser considerado concluído.

## 7. Pedido para a IA
Gere o código completo do módulo, junto com os testes, seguindo estritamente o contrato definido.
```

O que deve ser validado neste arquivo.

1. Se o código compila.
2. Se as regras de negócio foram aplicadas.
3. Se os testes unitários passam.
4. Se os testes de integração passam.
5. Se os endpoints se comportam conforme o contrato.

### 3.6 Arquivo `06_desenvolvimento_frontend_mobile_modulo.md`

Este arquivo deve ser usado para cada módulo do front-end ou mobile.

Conteúdo recomendado.

```markdown
# Desenvolvimento front-end ou mobile, módulo específico

## 1. Contexto do módulo
Descrever a tela, o fluxo e o comportamento esperado.

## 2. Contrato consumido
Informar a API que será utilizada.

## 3. O que deve ser gerado
Solicitar componentes, serviços de consumo, tratamento de estado e validações visuais.

## 4. Experiência esperada
Definir carregamento, mensagem de erro, feedback de sucesso e comportamento dos formulários.

## 5. Testes obrigatórios
Solicitar testes de renderização, testes de interação e validação manual do fluxo.

## 6. Critérios de aceite
Definir o que a tela precisa fazer para ser aprovada.

## 7. Pedido para a IA
Gere a interface completa do módulo, consumindo o contrato aprovado e incluindo os testes necessários.
```

O que deve ser validado neste arquivo.

1. Se a interface abre corretamente.
2. Se o consumo da API está correto.
3. Se as mensagens de erro e sucesso aparecem adequadamente.
4. Se os estados de carregamento e submissão funcionam.
5. Se a experiência de uso está coerente.

### 3.7 Arquivo `07_plano_de_testes.md`

Este arquivo deve centralizar a estratégia de verificação. Ele é muito importante para projetos com IA, porque obriga a equipe a pensar em qualidade desde o começo.

Conteúdo recomendado.

```markdown
# Plano de testes

## 1. Objetivo
Definir como cada etapa será validada.

## 2. Testes de arquitetura
Descrever verificações de consistência técnica, restrições e padrões.

## 3. Testes de back-end
Descrever testes unitários, testes de integração e validações manuais via terminal ou ferramenta de API.

## 4. Testes de front-end ou mobile
Descrever testes de tela, comportamento visual, integração com API e cenários de erro.

## 5. Critérios de aprovação
Explicar quando uma tarefa pode ser marcada como concluída.

## 6. Evidências
Registrar logs, capturas, saídas de console e resultados dos testes.

## 7. Pedido para a IA
Organize os testes por prioridade e indique o que deve ser validado em cada etapa de desenvolvimento.
```

O que deve ser validado neste arquivo.

1. Se os testes cobrem o fluxo principal.
2. Se há validação manual e automatizada.
3. Se os critérios de aprovação estão claros.
4. Se existe rastreabilidade dos resultados.

### 3.8 Arquivo `08_log_de_evolucao.md`

Este arquivo serve para acompanhar o andamento do projeto, o que foi feito, o que passou nos testes e o que ainda está pendente.

Conteúdo recomendado.

```markdown
# Log de evolução do projeto

## 1. Resumo da execução
Registrar cada avanço de forma cronológica.

## 2. Status por módulo
Informar o nome do módulo, a versão, o status de implementação e o status dos testes.

## 3. Pendências
Listar o que ainda precisa ser ajustado.

## 4. Decisões técnicas
Registrar decisões importantes tomadas ao longo do projeto.

## 5. Erros encontrados e correções
Documentar falhas, causa e solução.

## 6. Pedido para a IA
Mantenha este arquivo atualizado a cada entrega aprovada e cada correção relevante.
```

O que deve ser validado neste arquivo.

1. Se a evolução está clara.
2. Se as versões estão registradas.
3. Se as pendências estão visíveis.
4. Se a documentação permite retomada futura sem perda de contexto.

## 4. Fluxo ideal de uso dos arquivos

O fluxo recomendado é o seguinte.

1. Criar o arquivo `01_visao_geral.md`.
2. Solicitar à IA a análise da arquitetura.
3. Ajustar o arquivo com as decisões aprovadas.
4. Criar o arquivo `02_requisitos_e_regras_de_negocio.md`.
5. Criar o arquivo `03_modelagem_banco_e_dados.md`.
6. Criar o arquivo `04_contratos_de_api.md`.
7. Criar o arquivo `05_desenvolvimento_backend_modulo.md` para um módulo por vez.
8. Criar o arquivo `06_desenvolvimento_frontend_mobile_modulo.md` para um módulo por vez.
9. Criar e manter o arquivo `07_plano_de_testes.md`.
10. Registrar tudo no arquivo `08_log_de_evolucao.md`.

## 5. Modelo de instrução que você pode usar com a IA

Abaixo está um modelo mais forte e mais claro para enviar para um agente.

```markdown
Você é um arquiteto e desenvolvedor sênior atuando em um sistema multiagente.

Contexto do projeto.
[Descreva aqui o sistema.]

Arquivo de referência.
[Indique quais arquivos Markdown a IA deve considerar.]

Objetivo desta etapa.
[Explique exatamente o que deve ser produzido.]

Restrições obrigatórias.
[Liste stack, banco, padrões, limitações e regras que não podem ser violadas.]

Entregáveis esperados.
[Liste o que a IA deve entregar.]

Testes obrigatórios.
[Liste os testes unitários, de integração e validação manual.]

Critério de aceite.
[Explique o que significa estar concluído.]

Saída esperada.
[Peça para a IA responder de forma objetiva, técnica e organizada.]
```

## 6. Conclusão prática

A estrutura mais eficiente para seu caso não é um único arquivo gigante, mas um conjunto de arquivos pequenos, cada um com função definida. Isso permite que a IA pense melhor, reduza contradições e entregue código com mais qualidade.

A recomendação final é esta.

1. Use Markdown para organizar tudo.
2. Separe visão, requisitos, dados, contratos, código, testes e evolução.
3. Trabalhe por módulos.
4. Inclua testes em todas as etapas.
5. Só avance depois de validar o resultado.
6. Registre as decisões e correções no log do projeto.

Esse é o formato mais seguro e produtivo para conduzir um sistema multiagente com qualidade técnica e rastreabilidade.
