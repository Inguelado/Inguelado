# 🛠 Construindo a StarWars API

## 1. Configuração do MySQL

Para configurar o banco de dados MySQL para a nossa API, seguimos estes passos:

- **Instalação do MySQL:** Você pode baixar e instalar o MySQL a partir do [site oficial](https://www.mysql.com/downloads/).
- **Criação do banco de dados:** Após a instalação, criamos um banco de dados chamado `starwars_db`.
- **Configuração do usuário:** Criamos um usuário `root` com a senha `desafio`. Este usuário terá permissões para acessar e manipular o banco de dados.

## 2. Instalação das Dependências

A API foi construída utilizando Node.js. Para configurar o ambiente, foram instaladas as seguintes dependências:

- **Node.js:** Para instalar o Node.js, você pode baixá-lo do [site oficial](https://nodejs.org/).
- **npm:** O npm é instalado automaticamente com o Node.js.
- **Express:** Um framework web para Node.js que facilita a construção de APIs. Instalamos usando o comando:
  ```bash
  npm install express
- **CORS:** Middleware para permitir requisições de diferentes origens. Instalamos com:
  ```bash
  npm install cors
- **dotenv:** Para gerenciar variáveis de ambiente de forma segura. Instalamos com:
   ```bash
  npm install dotenv
- **mysql:** Pacote que permite a conexão e manipulação do banco de dados MySQL. Instalamos usando:
  ```bash
  npm install mysql

## 3. Estrutura do Projeto

A estrutura do projeto da API starwars-api é organizada da seguinte forma:
  ```
  starwars-api/
  │
  ├── .env                   # Arquivo para variáveis de ambiente
  ├── app.js                 # Configuração do servidor Express
  ├── db.js                  # Configuração da conexão com o banco de dados MySQL
  ├── package.json           # Dependências e scripts do projeto
  ├── package-lock.json      # Registro das dependências instaladas
  ├── routes.js              # Definição das rotas da API
  └── test.js                # Testes para a API
  ```


1. Importar Personagens
  ```bash
  curl -X POST "http://localhost:3000/api/characters/import"
  ```
2. Buscar Personagem Externo
  ```bash
  curl -X GET "http://localhost:3000/api/characters/external?name=Luke%20Skywalker"
  ```
3. Marcar Personagem como Favorito
  ```bash
  curl -X PATCH "http://localhost:3000/api/characters/favorite" -H "Content-Type: application/json" -d "{\"name\": \"Luke Skywalker\"}"
  ```
4. Desmarcar Personagem como Favorito
  ```bash
  curl -X PATCH "http://localhost:3000/api/characters/unfavorite" -H "Content-Type: application/json" -d "{\"name\": \"Luke Skywalker\"}"
  ```
5. Listar Personagens Favoritos
  ```bash
   curl -X GET "http://localhost:3000/api/characters/favorites"
  ```
6. Listar Todos os Personagens
  ```bash
  curl -X GET "http://localhost:3000/api/characters"
  ```
