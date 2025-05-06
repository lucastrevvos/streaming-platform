```md
# 🎵 Streaming Platform

Plataforma de streaming com gerenciamento de playlists, autenticação de usuários e integração com API externa de álbuns.

## 🚀 Tecnologias utilizadas

- Backend: Node.js + Express + Prisma
- Banco de dados: PostgreSQL (local via Docker)
- Frontend: React + Vite + TailwindCSS
- Testes: Vitest + Supertest
- Docker
- Gitflow

---

## 📦 Funcionalidades

✅ Autenticação JWT  
✅ CRUD de playlists (criar, listar, editar, excluir)  
✅ Busca de álbuns de artistas via API externa (iTunes API)  
✅ Integração frontend + backend com token  
✅ Testes automatizados (Vitest)  
✅ Middleware global de tratamento de erros

---

## 📝 Como rodar o projeto localmente

### 1️⃣ Clone o repositório

    git clone https://github.com/lucastrevvos/streaming-platform.git
    cd streaming-platform

### 2️⃣ Configure o ambiente

Crie um arquivo `.env` dentro da pasta `backend/prisma` com o conteúdo:

    DATABASE_URL=postgresql://postgres:postgres@localhost:5432/streamingdb
    JWT_SECRET=sua_chave_secreta

    (Nesse caso para facilitar a avaliação já subirei com o arquivo .env, mas sim sei da segurança e do arquivo .env.example para tal)

---

### 3️⃣ Rode o banco de dados com Docker

    docker-compose up -d

O banco estará disponível em `localhost:5432` com:

- Usuário: postgres
- Senha: postgres
- Banco: streamingdb

---

### 4️⃣ Aplique as migrations no banco

    cd backend
    npx prisma migrate deploy

---

### 5️⃣ Instale as dependências e rode o backend

    npm install
    npm run dev

O backend estará disponível em `http://localhost:3000`.

---

### 6️⃣ Instale as dependências e rode o frontend

    cd ../frontend
    npm install
    npm run dev

O frontend estará disponível em `http://localhost:5173`.

---

## 👤 Criar usuário para login

Faça uma requisição POST para `/auth/register` com:

    {
      "email": "admin@email.com",
      "password": "123456"
    }

Exemplo com curl:

    curl -X POST http://localhost:3000/auth/register -H "Content-Type: application/json" -d '{"email":"admin@email.com","password":"123456"}'

✅ Depois, use este usuário para login no frontend.

---

## 🧪 Rodar os testes

    cd backend
    npm run test

---

## 📚 Documentação da API

### 🔐 Auth

| Método | Rota           | Descrição             |
| ------ | -------------- | --------------------- |
| POST   | /auth/register | Registrar usuário     |
| POST   | /auth/login    | Login e retorna token |

**Headers esperados:** `Authorization: Bearer <token>`

---

### 🎶 Playlists

| Método | Rota           | Descrição                           |
| ------ | -------------- | ----------------------------------- |
| GET    | /playlists     | Lista todas as playlists do usuário |
| POST   | /playlists     | Cria nova playlist                  |
| GET    | /playlists/:id | Retorna playlist por ID             |
| PUT    | /playlists/:id | Atualiza playlist por ID            |
| DELETE | /playlists/:id | Exclui playlist por ID              |

---

### 📀 Álbuns

| Método | Rota                     | Descrição                                          |
| ------ | ------------------------ | -------------------------------------------------- |
| GET    | /external/albums/:artist | Busca álbuns de um artista na API externa (iTunes) |

---

## ✅ Observações

- Todas as rotas (exceto `/auth/register` e `/auth/login`) exigem token JWT.
- As respostas de erro seguem o padrão `{ error: "mensagem" }`.
- Middleware global de erros aplicado.
- Frontend integrado via `VITE_API_URL` apontando para `http://localhost:3000`.

---

## 🤝 Contato

Desenvolvido por **Lucas Amaral**  
GitHub: [https://github.com/lucastrevvos](https://github.com/lucastrevvos)
```
