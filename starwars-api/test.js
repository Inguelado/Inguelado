// Importa as funções necessárias para manipulação do banco de dados
const { createCharactersTable, pool } = require('./db');

// Função assíncrona para testar a criação da tabela de personagens
(async () => {
  try {
    // Chama a função para criar a tabela de personagens
    await createCharactersTable();
    console.log('Tabela criada com sucesso!'); 
  } catch (error) {
    // Captura e exibe erros que possam ocorrer durante a criação da tabela
    console.error('Erro ao criar a tabela:', error);
  } finally {
    // Fecha a conexão com o banco de dados após o teste
    await pool.end(); 
  }
})();
