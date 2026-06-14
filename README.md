# Streaming Platform

Plataforma full stack para autenticação de usuários, gerenciamento de playlists e descoberta de álbuns por artista.

## Visão geral

Streaming Platform é uma aplicação web construída para centralizar a criação e o gerenciamento de playlists em uma experiência simples, integrada e segura.

O projeto combina um backend em Node.js com Express, persistência em PostgreSQL via Prisma e uma interface frontend em React com Vite. Além do CRUD de playlists, a aplicação integra uma API externa para buscar álbuns de artistas, conectando dados locais do usuário com informações musicais disponíveis publicamente.

## Problema

Usuários que organizam músicas e referências musicais precisam de uma forma prática de autenticar sua conta, manter playlists próprias e consultar álbuns de artistas sem alternar entre diferentes ferramentas.

Do ponto de vista técnico, o projeto também aborda um cenário comum em produtos digitais: proteger rotas com autenticação, persistir dados relacionais, consumir APIs externas e entregar uma interface web conectada a uma API REST.

## Solução

A aplicação oferece uma plataforma full stack com autenticação JWT, rotas protegidas, gerenciamento de playlists e busca de álbuns por artista usando a iTunes Search API.

O backend expõe uma API REST responsável por autenticação, regras de negócio, validação de dados, integração externa e acesso ao banco. O frontend consome essa API, armazena o token de autenticação no fluxo da interface e entrega telas para login, playlists e consulta de álbuns.

## Funcionalidades

- Cadastro de usuários.
- Login com geração de token JWT.
- Proteção de rotas autenticadas no backend.
- Criação, listagem, atualização e exclusão de playlists.
- Busca de álbuns por artista via iTunes Search API.
- Integração entre frontend e backend usando uma URL de API configurável.
- Validação de dados com Zod.
- Criptografia de senhas com bcrypt.
- Middleware global para tratamento de erros.
- Testes automatizados para fluxos de autenticação e playlists.

## Stack

### Backend

- Node.js
- TypeScript
- Express
- Prisma ORM
- PostgreSQL
- JWT
- bcrypt
- Zod
- Axios
- Vitest
- Supertest

### Frontend

- React
- TypeScript
- Vite
- React Router DOM
- Axios
- TailwindCSS

### Infraestrutura e desenvolvimento

- Docker Compose
- PostgreSQL em container
- Migrations com Prisma

## Arquitetura

O projeto está organizado em duas aplicações principais:

```text
streaming-platform/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   └── src/
│       ├── controllers/
│       ├── middlewares/
│       ├── routes/
│       ├── schemas/
│       ├── errors/
│       └── index.ts
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── api.ts
│       └── App.tsx
└── docker-compose.yml
```

### Backend

A API segue uma separação simples por responsabilidade:

- `routes`: definição das rotas HTTP.
- `controllers`: implementação dos fluxos de autenticação, playlists e integração externa.
- `middlewares`: autenticação JWT e tratamento global de erros.
- `schemas`: validação dos dados de entrada com Zod.
- `prisma`: schema do banco e migrations.

### Frontend

A interface é estruturada com páginas dedicadas para login, playlists e busca de álbuns. A comunicação HTTP é centralizada em uma instância do Axios configurada por variável de ambiente, facilitando a troca entre ambientes locais e futuros ambientes publicados.

## Como rodar

### 1. Clone o repositório

```bash
git clone https://github.com/lucastrevvos/streaming-platform.git
cd streaming-platform
```

### 2. Configure as variáveis de ambiente

Crie o arquivo `backend/prisma/.env` com as variáveis necessárias para conexão com o banco e assinatura dos tokens JWT.

Crie também o arquivo `frontend/.env` com a URL da API utilizada pelo frontend.

Consulte a seção [Configuração](#configuração) para ver os nomes das variáveis.

### 3. Suba o banco de dados

```bash
docker-compose up -d
```

### 4. Instale as dependências do backend

```bash
cd backend
npm install
```

### 5. Aplique as migrations

```bash
npx prisma migrate deploy
```

### 6. Execute o backend

```bash
npm run dev
```

Por padrão, a API fica disponível em `http://localhost:3000`.

### 7. Instale as dependências do frontend

Em outro terminal, a partir da raiz do projeto:

```bash
cd frontend
npm install
```

### 8. Execute o frontend

```bash
npm run dev
```

Por padrão, a aplicação web fica disponível em `http://localhost:5173`.

## Configuração

### Backend

Arquivo: `backend/prisma/.env`

```env
DATABASE_URL="postgresql://<usuario>:<senha>@<host>:<porta>/<database>"
JWT_SECRET="<chave-secreta-para-assinatura-dos-tokens>"
```

### Frontend

Arquivo: `frontend/.env`

```env
VITE_API_URL="http://localhost:3000"
```

### Banco local com Docker

O `docker-compose.yml` disponibiliza um PostgreSQL local para desenvolvimento. A configuração padrão cria um banco chamado `streamingdb` exposto na porta `5432`.

## Rotas principais da API

### Autenticação

| Método | Rota | Descrição |
| --- | --- | --- |
| `POST` | `/auth/register` | Cadastra um usuário |
| `POST` | `/auth/login` | Autentica o usuário e retorna um token JWT |

### Playlists

As rotas de playlists utilizam o header `Authorization: Bearer <token>`.

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/playlists` | Lista playlists |
| `POST` | `/playlists` | Cria uma playlist |
| `GET` | `/playlists/:id` | Retorna uma playlist por ID |
| `PUT` | `/playlists/:id` | Atualiza uma playlist por ID |
| `DELETE` | `/playlists/:id` | Remove uma playlist por ID |

### Álbuns

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/external/albums/:artist` | Busca álbuns de um artista na iTunes Search API |

## Decisões técnicas

- **TypeScript no frontend e no backend:** melhora a previsibilidade do código e reduz erros comuns durante o desenvolvimento.
- **Prisma como ORM:** simplifica o acesso ao PostgreSQL, mantém o schema versionado e organiza migrations do banco.
- **JWT para autenticação:** permite proteger endpoints da API de forma stateless e compatível com clientes web.
- **bcrypt para senhas:** armazena senhas de forma criptografada antes da persistência.
- **Zod para validação:** centraliza a validação de payloads recebidos pela API.
- **Axios para comunicação HTTP:** padroniza chamadas externas no backend e chamadas para a API no frontend.
- **Docker Compose para banco local:** reduz atrito na configuração do ambiente de desenvolvimento.
- **Separação entre frontend e backend:** mantém responsabilidades bem definidas e facilita evolução independente das camadas.

## Status

O projeto está em versão funcional de portfólio, com backend, frontend, banco de dados, autenticação, CRUD de playlists, integração externa e testes automatizados cobrindo fluxos centrais da API.

## Roadmap

- Adicionar associação de músicas às playlists pela interface.
- Evoluir a experiência visual da área autenticada.
- Incluir paginação e filtros nas listagens.
- Expandir a cobertura de testes automatizados.
- Preparar configuração de deploy para frontend e backend.
- Adicionar documentação interativa da API.

## O que este projeto demonstra

- Desenvolvimento full stack com React, Node.js e TypeScript.
- Criação de APIs REST com autenticação JWT.
- Modelagem relacional com Prisma e PostgreSQL.
- Integração com APIs externas.
- Organização de camadas no backend.
- Validação de dados e tratamento de erros.
- Consumo de API no frontend com rotas protegidas.
- Configuração de ambiente local com Docker.
- Escrita de testes automatizados para fluxos de API.

## Testes

Para executar os testes do backend:

```bash
cd backend
npm run test
```

## Autor

Desenvolvido por **Lucas Amaral**.

GitHub: [lucastrevvos](https://github.com/lucastrevvos)
