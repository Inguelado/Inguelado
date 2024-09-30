const axios = require('axios');  // Biblioteca para realizar chamadas HTTP
const fs = require('fs');        // Módulo do Node.js para manipulação de arquivos
const path = './public/data/';    // Caminho para salvar o arquivo JSON

// Função principal para buscar personagens e salvar em JSON
const fetchCharactersAndSaveToJSON = async () => {
  // Verifica se o diretório 'public/data/' existe; se não, cria o diretório
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });  // Cria o diretório e subdiretórios se necessário
  }

  try {
    // Faz a solicitação GET para buscar os personagens da API
    console.log('Buscando personagens...');
    const response = await axios.get('http://localhost:3000/api/characters/external');
    const characters = response.data;  // Armazena os personagens recebidos da API

    // Grava os personagens no arquivo JSON
    fs.writeFileSync(`${path}characters.json`, JSON.stringify(characters, null, 2));  // Converte os dados para string e formata com indentação
    console.log('Personagens salvos em characters.json com sucesso!');
  } catch (error) {
    // Exibe erro no console caso a solicitação falhe
    console.error('Erro ao buscar personagens da API:', error);
  }
};

// Chama a função para buscar e salvar os personagens
fetchCharactersAndSaveToJSON();
