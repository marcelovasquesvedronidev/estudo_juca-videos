# Juca Videos

Projeto frontend em React + TypeScript (Vite), preparado para integrar uma API depois.

## Scripts

- `npm run dev`: ambiente local
- `npm run build`: build de producao
- `npm run preview`: preview do build local

## Estrutura para API

- `src/config/env.ts`: configuracao central de ambiente
- `src/lib/http.ts`: cliente HTTP com tratamento padrao de erro
- `src/services/health.ts`: exemplo de servico para endpoints da API

## Variaveis de ambiente

Copie `.env.example` para `.env` e ajuste quando necessario:

- `VITE_API_BASE_URL`: URL base da API usada pelo frontend
  - Exemplo local com proxy: `/api`
  - Exemplo API externa: `https://api.seudominio.com.br`
- `API_PROXY_TARGET`: alvo do proxy local do Vite para `/api`

## Hospedagem na Locaweb (frontend)

1. Execute `npm install`.
2. Execute `npm run build`.
3. Publique o conteudo da pasta `dist/`.

## Como ligar API depois

1. Crie sua API com rotas versionadas (exemplo: `/api/v1`).
2. Defina `VITE_API_BASE_URL` no frontend para:
   - `/api` se frontend e API estiverem no mesmo dominio/caminho.
   - URL completa se a API ficar em outro dominio/subdominio.
3. Garanta CORS se a API estiver em dominio diferente.
4. Centralize chamadas em `src/services/` usando `httpRequest` de `src/lib/http.ts`.
