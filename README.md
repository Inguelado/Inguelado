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
-**dotenv:** Para gerenciar variáveis de ambiente de forma segura. Instalamos com:
   ```bash
  npm install dotenv- **mysql**: Pacote que permite a conexão e manipulação do banco de dados MySQL. Instalamos usando:
  '''bash
Copiar código
npm install mysql
