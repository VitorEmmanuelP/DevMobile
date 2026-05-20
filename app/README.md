# appRestTS — Expo + TypeScript (Pessoas + Produtos)

Este projeto é uma versão em TypeScript do tutorial `projeto_AppRest.md` adaptada para Expo.

Setup rápido

1. Abra o Codespace e vá para a pasta do projeto:

   cd appRestTS

2. Instale dependências (já executado automaticamente durante scaffold):

   npm install

3. Configure a URL do backend (IMPORTANTE):

   - Abra `src/services/api.ts` e altere a constante `BASE_URL` para a URL pública do Codespace que expõe a porta 8080. Ex.: `https://SEU-CODESPACE-8080.app.github.dev`
   - Para encontrar a URL pública: abra a aba "Ports" do Codespace e torne a porta 8080 pública, copie a URL.

4. Rodar em modo desenvolvimento (tunnel recomendado no Codespace):

   npx expo start --tunnel

5. Testar no celular com Expo Go usando o QR code ou abrir o emulador.

Arquitetura

- Navegação: Bottom Tabs com duas abas (Pessoas, Produtos). Cada aba tem sua própria stack (List, Detail, Form).
- HTTP: axios em `src/services/api.ts`
- Tipos: `src/types/index.ts` define `Pessoa` e `Produto`.

Notas

- As telas básicas, componentes e tipos foram adicionados; ajuste os formulários e validações conforme necessário.
- O arquivo `src/services/api.ts` contém um placeholder para `BASE_URL` — configure antes de testar.

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
