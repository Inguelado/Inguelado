const express = require('express'); // Importa o módulo Express para criar o servidor
const cors = require('cors'); // Importa o módulo CORS para habilitar solicitações cross-origin
const routes = require('./routes'); // Importa as rotas definidas em outro módulo
const { createCharactersTable } = require('./db'); // Importa a função para criar a tabela de personagens
const app = express(); // Cria uma instância do aplicativo Express
const port = 3000; // Define a porta do servidor

app.use(cors()); // Habilita CORS para permitir requisições de diferentes origens
app.use(express.json()); // Middleware para analisar o corpo das requisições em JSON

app.use('/api', routes); // Define as rotas da API sob o prefixo '/api'

// Rota principal que retorna uma mensagem de boas-vindas
app.get('/', (req, res) => {
  res.send(`
    <h1>Bem-vindo à API do Star Wars!</h1>
    <p>Criado por Marco Aurélio Veriato Zolly!</p>
  `);
});

// Inicia o servidor e cria a tabela de personagens ao mesmo tempo
app.listen(port, async () => {
  await createCharactersTable(); // Cria a tabela de personagens se não existir
  console.log(`Servidor rodando na porta ${port}`); // Informa que o servidor está rodando
});
