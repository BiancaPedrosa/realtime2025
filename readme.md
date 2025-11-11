

# Realtime Firebase — Demo (2025.2)

Pequena aplicação de exemplo que demonstra operações CRUD (Criar, Ler, Atualizar, Excluir) usando Firebase Realtime Database com uma interface HTML/JavaScript simples.

## Visão geral
- Projeto educativo para demonstrar integração cliente → Realtime Database.
- Operações: listar músicas, adicionar, atualizar, excluir.
- Frontend simples em `public/` e regras em `database.rules.json`.

## Principais arquivos
- `public/index.html` — interface web.
- `public/main.js` — lógica do frontend e configuração do Firebase.
- `database.rules.json` — regras do Realtime Database.
- `firebase.json` / `.firebaserc` — configuração do Firebase hosting/emuladores.

## Funcionalidades
- Listagem automática ao carregar a página.
- Inserir/editar/excluir registros em `/Musicas`.
- Campos exemplo: id, artista, título.

## Requisitos
- Node.js (v14+ recomendado)
- Firebase CLI
  - Instalação: `npm install -g firebase-tools`

## Configuração local
1. Clone o repositório:
   git clone <URL-do-repositório>
   cd realtime252
2. Faça login no Firebase e selecione o projeto:
   firebase login
   firebase use --add
3. (Opcional) Inicie emuladores para testar localmente:
   firebase emulators:start --only hosting,database
4. Ou sirva o hosting localmente:
   firebase serve --only hosting

## Deploy
Para publicar no Firebase Hosting:
firebase deploy --only hosting

Observação: confirme o projeto selecionado (`firebase use`) antes do deploy.

## Segurança
- As credenciais do Firebase (config do cliente) podem aparecer em `public/main.js` — isso é normal para apps cliente, mas não exponha chaves administrativas.
- Ajuste `database.rules.json` antes de usar em produção. As regras de demo geralmente permitem escrita/leitura pública e não são seguras para dados sensíveis.

## Estrutura sugerida
- public/
  - index.html
  - main.js
- database.rules.json
- firebase.json
- .firebaserc

## Contribuição
- Abra issues para bugs ou sugestões.
- Pull requests são bem-vindos; mantenha mudanças pequenas e documentadas.

## Licença
MIT — veja o arquivo LICENSE ou adicione uma licença conforme necessário.