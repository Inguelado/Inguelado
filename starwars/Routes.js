const express = require('express'); // Importa o módulo Express para criar rotas
const axios = require('axios'); // Importa o módulo Axios para fazer requisições HTTP
const {
  importCharacter,
  favoriteCharacter,
  unfavoriteCharacter,
  deleteCharacterByName,
  deleteAllCharacters,
  getFavoriteCharacters,
  getAllCharacters,
} = require('./db'); // Importa funções para manipulação de personagens no banco de dados
const router = express.Router(); // Cria um roteador Express

// Função para buscar um personagem da API StarWars pelo nome
async function fetchCharacterFromAPI(name) {
  try {
    const response = await axios.get('https://swapi.dev/api/people/');
    const character = response.data.results.find(c => c.name.toLowerCase() === name.toLowerCase());
    return character || null; // Retorna o personagem ou null se não encontrar
  } catch (error) {
    console.error('Erro ao buscar personagem da API:', error);
    return null; // Retorna null se houver um erro
  }
}

// Rota para buscar personagens da API StarWars, com ou sem filtro de nome
router.get('/characters/external', async (req, res) => {
  try {
    const searchQuery = req.query.name; // Obtém o parâmetro de consulta "name", se existir
    let nextUrl = 'https://swapi.dev/api/people';
    let allCharacters = [];

    while (nextUrl) {
      const response = await axios.get(nextUrl);
      const characters = response.data.results;

      // Filtra os personagens pelo nome, caso o termo seja fornecido
      if (searchQuery) {
        const filteredCharacters = characters.filter(character =>
          character.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        allCharacters = allCharacters.concat(filteredCharacters);
      } else {
        allCharacters = allCharacters.concat(characters); // Adiciona todos os personagens
      }

      nextUrl = response.data.next; // Atualiza para a próxima página ou null
    }

    res.status(200).json(allCharacters); // Retorna todos os personagens ou os filtrados
  } catch (error) {
    console.error('Erro ao buscar personagens:', error);
    res.status(500).send('Erro ao buscar personagens');
  }
});

// Rota para marcar um personagem como favorito pelo nome
router.patch('/characters/favorite', async (req, res) => {
  const { name } = req.body; // Espera receber o nome no corpo da requisição
  try {
    const affectedRows = await favoriteCharacter(name); // Tenta marcar como favorito

    // Se nenhuma linha foi afetada, tenta buscar o personagem na API
    if (affectedRows === 0) {
      const character = await fetchCharacterFromAPI(name); // Busca o personagem na API
      if (character) {
        await importCharacter(character); // Importa o personagem para o banco
        await favoriteCharacter(name); // Marca o personagem como favorito
        return res.status(200).send(`Personagem "${name}" adicionado e marcado como favorito!`);
      }
      return res.status(404).send('Personagem não encontrado na API'); // Se não for encontrado
    }

    res.status(200).send(`Personagem "${name}" marcado como favorito!`); // Resposta de sucesso
  } catch (error) {
    console.error('Erro ao marcar personagem como favorito:', error);
    res.status(500).send('Erro ao marcar personagem como favorito');
  }
});

// Rota para desmarcar um personagem como favorito pelo nome
router.patch('/characters/unfavorite', async (req, res) => {
  const { name } = req.body; // Espera receber o nome no corpo da requisição
  try {
    const affectedRows = await unfavoriteCharacter(name); // Atualiza o status de favorito
    if (affectedRows === 0) {
      return res.status(404).send('Personagem não encontrado'); // Caso não encontre
    }
    res.status(200).send(`Personagem "${name}" desmarcado como favorito!`); // Resposta de sucesso
  } catch (error) {
    console.error('Erro ao desmarcar personagem como favorito:', error);
    res.status(500).send('Erro ao desmarcar personagem como favorito');
  }
});

// Rota para listar personagens favoritos
router.get('/characters/favorites', async (req, res) => {
  try {
    const rows = await getFavoriteCharacters(); // Filtra apenas os favoritos

    if (Array.isArray(rows) && rows.length === 0) {
      return res.status(404).send('Nenhum personagem favorito encontrado'); // Retorna se não houver favoritos
    }

    res.status(200).json(rows); // Retorna os favoritos
  } catch (error) {
    console.error('Erro ao listar personagens favoritos:', error);
    res.status(500).send('Erro ao listar personagens favoritos');
  }
});

// Rota para importar personagens da API StarWars e armazenar no banco de dados
router.post('/characters/import', async (req, res) => {
  try {
    let nextUrl = 'https://swapi.dev/api/people';
    let totalCharacters = 0;

    while (nextUrl) {
      const response = await axios.get(nextUrl);
      const characters = response.data.results;

      await Promise.all(characters.map(importCharacter)); // Importa todos os personagens simultaneamente

      totalCharacters += characters.length;
      nextUrl = response.data.next; // Atualiza para a próxima URL ou null
    }

    res.status(200).send(`Personagens importados com sucesso! Total: ${totalCharacters}`);
  } catch (error) {
    console.error('Erro ao importar personagens:', error);
    res.status(500).send('Erro ao importar personagens');
  }
});

// Rota para listar personagens
router.get('/characters', async (req, res) => {
  try {
    const rows = await getAllCharacters(); // Consulta todos os personagens

    if (Array.isArray(rows) && rows.length === 0) {
      return res.status(404).send('Nenhum personagem encontrado'); // Retorna se não houver personagens
    }
    
    res.status(200).json(rows); // Retorna a lista de personagens
  } catch (error) {
    console.error('Erro ao listar personagens:', error);
    res.status(500).send('Erro ao listar personagens');
  }
});

// Rota para apagar um personagem pelo nome
router.delete('/characters', async (req, res) => {
  const { name } = req.query; // Espera receber o nome como parâmetro de consulta
  if (!name) {
    return res.status(400).send('Nome do personagem é necessário'); // Retorna erro se não houver nome
  }

  try {
    const affectedRows = await deleteCharacterByName(name); // Executa a query de deleção

    if (affectedRows === 0) {
      return res.status(404).send('Personagem não encontrado'); // Retorna se não encontrado
    }
    
    res.status(200).send(`Personagem "${name}" apagado com sucesso!`); // Resposta de sucesso
  } catch (error) {
    console.error('Erro ao apagar personagem:', error);
    res.status(500).send('Erro ao apagar personagem');
  }
});

// Rota para apagar todos os personagens
router.delete('/characters/all', async (req, res) => {
  try {
    await deleteAllCharacters(); // Executa a query de deleção
    res.status(200).send(`Todos os personagens apagados com sucesso!`); // Resposta de sucesso
  } catch (error) {
    console.error('Erro ao apagar todos os personagens:', error);
    res.status(500).send('Erro ao apagar todos os personagens');
  }
});

module.exports = router; // Exporta o roteador para uso em outros módulos
