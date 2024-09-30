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
- **Iniciar Servidor:** Para rodar o servidor, utilize:
  ```bash
  node app.js

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
## 4. Considerações:

Com estas informações você conseguirá rodar o starwars-api em um localhost.

# 🛠 Construindo a StarWars-FrontEnd

## 1. Configuração do Ambiente

Para configurar o ambiente do frontend, seguimos estes passos:

- **Instalação do Node.js:** Para instalar o Node.js, você pode baixá-lo do site oficial.
- **Inicialização do projeto:** Crie um novo projeto React usando o Create React App com o seguinte comando:
  ```bash
  npx create-react-app starwars-frontend
  ```

## 2. Instalação das Dependências

Para a construção do frontend, foram instaladas as seguintes dependências:

- **Axios:** Biblioteca para realizar chamadas HTTP à API. Instalamos com:
  ```bash
  npm install axios
  ```
- **React Router Dom:** Para gerenciar a navegação entre as diferentes páginas da aplicação. Instalamos com:
  ```bash
  npm install react-router-dom
  ```
## 3. Estrutura do Projeto

A estrutura do projeto do frontend starwars-frontend é organizada da seguinte forma:

```
starwars-frontend/
│
├── public/
│   ├── data/               # Armazena o arquivo characters.json com os dados dos personagens
│   ├── index.html          # Arquivo HTML principal da aplicação
│   └── manifest.json       # Configurações da aplicação PWA
│
├── src/
│   ├── assets/             # Imagens e logos utilizados no frontend
│   ├── components/         # Componentes reutilizáveis da aplicação
│   ├── services/           # Arquivo para configurar a API
│   ├── App.js              # Componente principal da aplicação
│   ├── index.js            # Ponto de entrada da aplicação
│   └── styles.css          # Estilos globais da aplicação
│
├── package.json            # Dependências e scripts do projeto
└── package-lock.json       # Registro das dependências instaladas
````

## 4.Funcionalidades Implementadas

**1) Busca de Personagens:**

O usuário pode buscar personagens pelo nome através de uma barra de pesquisa.

**2) Listagem de Personagens:**

Todos os personagens são exibidos em uma tabela, mostrando detalhes como nome, altura, peso, cabelo, pele, olhos, ano de nascimento e gênero.

**3) Favoritar Personagens:**

Os usuários podem marcar personagens como favoritos, que são salvos na API.

**4) Navegação entre Favoritos:**

O usuário pode visualizar apenas os personagens favoritos com um botão específico.

**5)Paginação:**

A lista de personagens é paginada, permitindo a navegação entre diferentes páginas de resultados.

## 5.Considerações

Com estas informações, você conseguirá rodar o frontend da StarWars API em um localhost.

![Tela Principal](https://github.com/user-attachments/assets/5e188581-0dbb-43cb-a4e1-bf7b36e1ccdc)



