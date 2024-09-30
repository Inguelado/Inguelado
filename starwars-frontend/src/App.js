import React, { useEffect, useState } from 'react'; // Importa React e hooks necessários
import api from './services/api'; // Importa a configuração da API
import SearchBar from './components/SearchBar'; // Importa o componente de barra de pesquisa
import CharacterList from './components/CharacterList'; // Importa o componente de lista de personagens
import axios from 'axios'; // Importa axios para fazer requisições HTTP

// Função auxiliar para carregar personagens de um arquivo JSON local
const loadLocalCharacters = async () => {
  const response = await fetch('/data/characters.json'); // Carrega os personagens do arquivo JSON
  if (!response.ok) {
    throw new Error('Erro ao carregar personagens locais'); // Lança erro se a requisição falhar
  }
  return await response.json(); // Retorna os dados em formato JSON
};

const App = () => {
  const [characters, setCharacters] = useState([]); // Estado para armazenar personagens
  const [favorites, setFavorites] = useState([]); // Estado para armazenar personagens favoritos
  const [currentPage, setCurrentPage] = useState(1); // Estado para controlar a página atual
  const [totalPages, setTotalPages] = useState(1); // Estado para armazenar o total de páginas
  const [viewingFavorites, setViewingFavorites] = useState(false); // Estado para controlar visualização de favoritos

  // Chame fetchCharacters e fetchFavorites ao carregar o componente
  useEffect(() => {
    fetchCharacters(); // Busca todos os personagens na inicialização
    fetchFavorites(); // Busca os personagens favoritos na inicialização
  }, []);

  // Função para buscar personagens (com ou sem termo de busca)
  const fetchCharacters = async (search = '') => {
    if (viewingFavorites) return; // Se estiver visualizando favoritos, não busque personagens

    try {
      const localCharacters = await loadLocalCharacters(); // Carrega os personagens do arquivo JSON
      setCharacters(localCharacters); // Define o estado dos personagens

      // Filtra personagens caso haja um termo de busca
      if (search) {
        const filteredCharacters = localCharacters.filter(character => 
          character.name.toLowerCase().includes(search.toLowerCase())
        );
        setCharacters(filteredCharacters); // Atualiza o estado com os personagens filtrados
      }

      setTotalPages(Math.ceil(localCharacters.length / 10)); // Calcula o total de páginas
    } catch (error) {
      console.error('Erro ao buscar personagens:', error); // Log de erro
    }
  };

  // Função para buscar personagens favoritos
  const fetchFavorites = async () => {
    try {
      const response = await api.get('/characters/favorites');
      setFavorites(response.data); // Define o estado dos favoritos
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setFavorites([]); // Define favoritos como um array vazio se não houver
        console.log('Nenhum favorito encontrado, estado atualizado para vazio.'); // Log informativo
      } else {
        console.error('Erro ao buscar favoritos:', error); // Log de erro
      }
    }
  };

  // Função chamada pelo SearchBar para buscar personagens pelo nome
  const handleSearch = (searchTerm) => {
    fetchCharacters(searchTerm); // Chama a função fetchCharacters com o termo de busca
    setViewingFavorites(false); // Reseta o estado ao buscar novos personagens
  };

  // Função para buscar personagens favoritos
  const handleFavoriteSearch = async () => {
    try {
      const response = await api.get('/characters/favorites'); // Busca os personagens favoritos
      setCharacters(response.data); // Atualiza a lista de personagens com os favoritos
      setCurrentPage(1); // Reseta para a primeira página
      setViewingFavorites(true); // Marca que está visualizando favoritos
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error); // Log de erro
    }
  };

  // Função para alternar entre marcar/desmarcar um personagem como favorito
  const toggleFavorite = async (name, isFavorite) => {
    try {
      if (isFavorite) {
        await api.patch('/characters/unfavorite', { name }); // Desmarca o personagem como favorito
      } else {
        await api.patch('/characters/favorite', { name }); // Marca o personagem como favorito
      }

      await fetchFavorites(); // Recarrega os favoritos após a alteração
    } catch (error) {
      console.error('Erro ao marcar/desmarcar favorito:', error); // Log de erro
    }
  };

  // Função para voltar à lista de todos os personagens
  const goToMainPage = async () => {
    await fetchCharacters(); // Recarrega todos os personagens
    setViewingFavorites(false); // Desativa a visualização de favoritos
  };

  // Atualiza os personagens paginados quando a página atual muda
  useEffect(() => {
    fetchCharacters(); // Recarrega os personagens sempre que a página atual mudar
  }, [currentPage]);

  // Função para passar para a próxima página
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1); // Avança para a próxima página
    }
  };

  // Função para voltar para a página anterior
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1); // Retorna para a página anterior
    }
  };

  // Funções para ir para a primeira e última página
  const goToFirstPage = () => {
    setCurrentPage(1); // Volta para a primeira página
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages); // Vai para a última página
  };

  // Calcula os personagens paginados com base na página atual
  const paginatedCharacters = characters.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <div className="app">
      <SearchBar onSearch={handleSearch} onFavoriteSearch={handleFavoriteSearch} />
      <CharacterList characters={paginatedCharacters} onToggleFavorite={toggleFavorite} favorites={favorites} />
      <div className="pagination">
        <button onClick={goToFirstPage} disabled={currentPage === 1}>Início</button>
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>Anterior</button>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>Próxima</button>
        <button onClick={goToLastPage} disabled={currentPage === totalPages}>Fim</button>
        <button onClick={goToMainPage}>Página Principal</button> {/* Botão para voltar à página principal */}
      </div>
    </div>
  );
};

export default App;

/*
import React, { useEffect, useState } from 'react';
import api from './services/api';
import SearchBar from './components/SearchBar';
import CharacterList from './components/CharacterList';
import axios from 'axios';

// Função auxiliar para carregar personagens de um arquivo JSON local
const loadLocalCharacters = async () => {
  const response = await fetch('/data/characters.json'); // Ajuste o caminho conforme necessário
  if (!response.ok) {
    throw new Error('Erro ao carregar personagens locais');
  }
  return await response.json();
};

const App = () => {
  const [characters, setCharacters] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewingFavorites, setViewingFavorites] = useState(false); // Novo estado

  // Chame fetchCharacters e fetchFavorites ao carregar o componente
  useEffect(() => {
    fetchCharacters(); // Chama a função para buscar todos os personagens na inicialização
    fetchFavorites(); // Chama a função para buscar personagens favoritos
  }, []);

  // Função para buscar personagens (com ou sem termo de busca)
  const fetchCharacters = async (search = '') => {
    if (viewingFavorites) return; // Se estiver visualizando favoritos, não busque personagens

    try {
      // Carrega personagens locais se disponíveis, caso contrário, faz a chamada à API
      const localCharacters = await loadLocalCharacters();
      setCharacters(localCharacters); // Define o estado dos personagens
      setTotalPages(Math.ceil(localCharacters.length / 10)); // Calcula o total de páginas
    } catch (error) {
      console.error('Erro ao buscar personagens:', error);
    }
  };

  // Resto do código permanece inalterado...
  
  // Função para buscar personagens favoritos
  const fetchFavorites = async () => {
    try {
      const response = await api.get('/characters/favorites');
      setFavorites(response.data); // Define o estado dos favoritos
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setFavorites([]); // Define favoritos como um array vazio
        console.log('Nenhum favorito encontrado, estado atualizado para vazio.');
      } else {
        console.error('Erro ao buscar favoritos:', error);
      }
    }
  };

  // Função chamada pelo SearchBar para buscar personagens pelo nome
  const handleSearch = (searchTerm) => {
    fetchCharacters(searchTerm); // Chama a função fetchCharacters com o termo de busca
    setViewingFavorites(false); // Reseta o estado ao buscar novos personagens
  };

  // Função para buscar personagens favoritos
  const handleFavoriteSearch = async () => {
    try {
      const response = await api.get('/characters/favorites'); // Busca os personagens favoritos
      setCharacters(response.data); // Atualiza a lista de personagens com os favoritos
      setCurrentPage(1); // Reseta para a primeira página
      setViewingFavorites(true); // Marca que está visualizando favoritos
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error);
    }
  };

  // Função para alternar entre marcar/desmarcar um personagem como favorito
  const toggleFavorite = async (name, isFavorite) => {
    try {
      if (isFavorite) {
        await api.patch('/characters/unfavorite', { name });
      } else {
        await api.patch('/characters/favorite', { name });
      }

      await fetchFavorites(); // Recarrega os favoritos
    } catch (error) {
      console.error('Erro ao marcar/desmarcar favorito:', error);
    }
  };

  // Função para voltar à lista de todos os personagens
  const goToMainPage = async () => {
    await fetchCharacters(); // Recarrega todos os personagens
    setViewingFavorites(false); // Desativa a visualização de favoritos
  };

  // Atualiza os personagens paginados quando a página atual muda
  useEffect(() => {
    fetchCharacters(); // Recarrega os personagens sempre que a página atual mudar
  }, [currentPage]);

  // Função para passar para a próxima página
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Função para voltar para a página anterior
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Novas funções para ir para a primeira e última página
  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };

  // Calcula os personagens paginados com base na página atual
  const paginatedCharacters = characters.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <div className="app">
      <SearchBar onSearch={handleSearch} onFavoriteSearch={handleFavoriteSearch} />
      <CharacterList characters={paginatedCharacters} onToggleFavorite={toggleFavorite} favorites={favorites} />
      <div className="pagination">
        <button onClick={goToFirstPage} disabled={currentPage === 1}>Início</button>
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>Anterior</button>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>Próxima</button>
        <button onClick={goToLastPage} disabled={currentPage === totalPages}>Fim</button>
        <button onClick={goToMainPage}>Página Principal</button>
      </div>
    </div>
  );
};

export default App;
*/
/*
import React, { useEffect, useState } from 'react';
import api from './services/api';
import SearchBar from './components/SearchBar';
import CharacterList from './components/CharacterList';
import axios from 'axios';

const App = () => {
  const [characters, setCharacters] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewingFavorites, setViewingFavorites] = useState(false); // Novo estado

  // Chame fetchCharacters e fetchFavorites ao carregar o componente
  useEffect(() => {
    fetchCharacters(); // Chama a função para buscar todos os personagens na inicialização
    fetchFavorites(); // Chama a função para buscar personagens favoritos
  }, []);

  // Função para buscar personagens (com ou sem termo de busca)
  const fetchCharacters = async (search = '') => {
    if (viewingFavorites) return; // Se estiver visualizando favoritos, não busque personagens

    try {
      const response = await axios.get('http://localhost:3000/api/characters/external', {
        params: { name: search }, // Envia o termo de busca como parâmetro
      });
      setCharacters(response.data); // Define o estado dos personagens
      setTotalPages(Math.ceil(response.data.length / 10)); // Calcula o total de páginas
    } catch (error) {
      console.error('Erro ao buscar personagens:', error);
    }
  };

  // Função para buscar personagens favoritos
  const fetchFavorites = async () => {
    try {
      const response = await api.get('/characters/favorites');
      setFavorites(response.data); // Define o estado dos favoritos
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setFavorites([]); // Define favoritos como um array vazio
        console.log('Nenhum favorito encontrado, estado atualizado para vazio.');
      } else {
        console.error('Erro ao buscar favoritos:', error);
      }
    }
  };

  // Função chamada pelo SearchBar para buscar personagens pelo nome
  const handleSearch = (searchTerm) => {
    fetchCharacters(searchTerm); // Chama a função fetchCharacters com o termo de busca
    setViewingFavorites(false); // Reseta o estado ao buscar novos personagens
  };

  // Função para buscar personagens favoritos
  const handleFavoriteSearch = async () => {
    try {
      const response = await api.get('/characters/favorites'); // Busca os personagens favoritos
      setCharacters(response.data); // Atualiza a lista de personagens com os favoritos
      setCurrentPage(1); // Reseta para a primeira página
      setViewingFavorites(true); // Marca que está visualizando favoritos
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error);
    }
  };

  // Função para alternar entre marcar/desmarcar um personagem como favorito
  const toggleFavorite = async (name, isFavorite) => {
    try {
      if (isFavorite) {
        await api.patch('/characters/unfavorite', { name });
      } else {
        await api.patch('/characters/favorite', { name });
      }

      await fetchFavorites(); // Recarrega os favoritos
    } catch (error) {
      console.error('Erro ao marcar/desmarcar favorito:', error);
    }
  };

 // Função para voltar à lista de todos os personagens
  const goToMainPage = async () => {
    await fetchCharacters(); // Recarrega todos os personagens
    setViewingFavorites(false); // Desativa a visualização de favoritos
  };

  // Atualiza os personagens paginados quando a página atual muda
  useEffect(() => {
    fetchCharacters(); // Recarrega os personagens sempre que a página atual mudar
  }, [currentPage]);

  // Função para passar para a próxima página
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Função para voltar para a página anterior
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Novas funções para ir para a primeira e última página
  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };

  // Calcula os personagens paginados com base na página atual
  const paginatedCharacters = characters.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <div className="app">
      <SearchBar onSearch={handleSearch} onFavoriteSearch={handleFavoriteSearch} />
      <CharacterList characters={paginatedCharacters} onToggleFavorite={toggleFavorite} favorites={favorites} />
      <div className="pagination">
        <button onClick={goToFirstPage} disabled={currentPage === 1}>Início</button>
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>Anterior</button>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>Próxima</button>
        <button onClick={goToLastPage} disabled={currentPage === totalPages}>Fim</button>

        
        <button onClick={goToMainPage}>Página Principal</button>
      </div>
    </div>
  );
};

export default App;
*/
/*
import React, { useEffect, useState } from 'react';
import api from './services/api';
import SearchBar from './components/SearchBar';
import CharacterList from './components/CharacterList';
import axios from 'axios';

const App = () => {
  const [characters, setCharacters] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewingFavorites, setViewingFavorites] = useState(false); // Estado para visualizar favoritos

  // Chame fetchCharacters e fetchFavorites ao carregar o componente
  useEffect(() => {
    fetchCharacters(); // Chama a função para buscar todos os personagens na inicialização
    fetchFavorites(); // Chama a função para buscar personagens favoritos
  }, []);

  // Função para buscar personagens (com ou sem termo de busca)
  const fetchCharacters = async (search = '') => {
    if (viewingFavorites) return; // Se estiver visualizando favoritos, não busca personagens

    try {
      const response = await axios.get('http://localhost:3000/api/characters/external', {
        params: { name: search }, // Envia o termo de busca como parâmetro
      });
      setCharacters(response.data); // Define o estado dos personagens
      setTotalPages(Math.ceil(response.data.length / 10)); // Calcula o total de páginas
    } catch (error) {
      console.error('Erro ao buscar personagens:', error);
    }
  };

  // Função para buscar personagens favoritos
  const fetchFavorites = async () => {
    try {
      const response = await api.get('/characters/favorites');
      setFavorites(response.data); // Define o estado dos favoritos
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setFavorites([]); // Define favoritos como um array vazio
        console.log('Nenhum favorito encontrado, estado atualizado para vazio.');
      } else {
        console.error('Erro ao buscar favoritos:', error);
      }
    }
  };

  // Função chamada pelo SearchBar para buscar personagens pelo nome
  const handleSearch = (searchTerm) => {
    fetchCharacters(searchTerm); // Chama a função fetchCharacters com o termo de busca
    setViewingFavorites(false); // Reseta o estado ao buscar novos personagens
  };

  // Função para buscar personagens favoritos
  const handleFavoriteSearch = async () => {
    try {
      const response = await api.get('/characters/favorites'); // Busca os personagens favoritos
      setCharacters(response.data); // Atualiza a lista de personagens com os favoritos
      setCurrentPage(1); // Reseta para a primeira página
      setViewingFavorites(true); // Marca que está visualizando favoritos
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error);
    }
  };

  // Função para alternar entre marcar/desmarcar um personagem como favorito
  const toggleFavorite = async (name, isFavorite) => {
    try {
      if (isFavorite) {
        await api.patch('/characters/unfavorite', { name });
      } else {
        await api.patch('/characters/favorite', { name });
      }

      await fetchFavorites(); // Recarrega os favoritos
    } catch (error) {
      console.error('Erro ao marcar/desmarcar favorito:', error);
    }
  };

  // Função para voltar à lista de todos os personagens
  const goToMainPage = () => {
    fetchCharacters(); // Recarrega todos os personagens
    setViewingFavorites(false); // Desativa a visualização de favoritos
  };

  // Atualiza os personagens paginados quando a página atual muda
  useEffect(() => {
    fetchCharacters(); // Recarrega os personagens sempre que a página atual mudar
  }, [currentPage]);

  // Função para passar para a próxima página
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Função para voltar para a página anterior
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Novas funções para ir para a primeira e última página
  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };

  // Calcula os personagens paginados com base na página atual
  const paginatedCharacters = characters.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <div className="app">
      <SearchBar onSearch={handleSearch} onFavoriteSearch={handleFavoriteSearch} />
      <CharacterList characters={paginatedCharacters} onToggleFavorite={toggleFavorite} favorites={favorites} />
      <div className="pagination">
        <button onClick={goToFirstPage} disabled={currentPage === 1}>Início</button>
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>Anterior</button>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>Próxima</button>
        <button onClick={goToLastPage} disabled={currentPage === totalPages}>Fim</button>

        
        <button onClick={goToMainPage}>Página Principal</button>

    
        {viewingFavorites && (
          <button className="back-button" onClick={goToMainPage}>
            Voltar
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
*/
/*
import React, { useEffect, useState } from 'react';
import api from './services/api';
import SearchBar from './components/SearchBar';
import CharacterList from './components/CharacterList';
import axios from 'axios';

const App = () => {
  const [characters, setCharacters] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewingFavorites, setViewingFavorites] = useState(false); // Novo estado

  // Chame fetchCharacters e fetchFavorites ao carregar o componente
  useEffect(() => {
    fetchCharacters(); // Chama a função para buscar todos os personagens na inicialização
    fetchFavorites(); // Chama a função para buscar personagens favoritos
  }, []);

  // Função para buscar personagens (com ou sem termo de busca)
  const fetchCharacters = async (search = '') => {
    if (viewingFavorites) return; // Se estiver visualizando favoritos, não busque personagens

    try {
      const response = await axios.get('http://localhost:3000/api/characters/external', {
        params: { name: search }, // Envia o termo de busca como parâmetro
      });
      setCharacters(response.data); // Define o estado dos personagens
      setTotalPages(Math.ceil(response.data.length / 10)); // Calcula o total de páginas
    } catch (error) {
      console.error('Erro ao buscar personagens:', error);
    }
  };

  // Função para buscar personagens favoritos
  const fetchFavorites = async () => {
    try {
      const response = await api.get('/characters/favorites');
      setFavorites(response.data); // Define o estado dos favoritos
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setFavorites([]); // Define favoritos como um array vazio
        console.log('Nenhum favorito encontrado, estado atualizado para vazio.'); // Log informativo
      } else {
        console.error('Erro ao buscar favoritos:', error);
      }
    }
  };

  // Função chamada pelo SearchBar para buscar personagens pelo nome
  const handleSearch = (searchTerm) => {
    fetchCharacters(searchTerm); // Chama a função fetchCharacters com o termo de busca
    setViewingFavorites(false); // Reseta o estado ao buscar novos personagens
  };

  // Função para buscar personagens favoritos
  const handleFavoriteSearch = async () => {
    try {
      const response = await api.get('/characters/favorites'); // Busca os personagens favoritos
      setCharacters(response.data); // Atualiza a lista de personagens com os favoritos
      setCurrentPage(1); // Reseta para a primeira página
      setViewingFavorites(true); // Marca que está visualizando favoritos
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error);
    }
  };

  // Função para alternar entre marcar/desmarcar um personagem como favorito
  const toggleFavorite = async (name, isFavorite) => {
    try {
      if (isFavorite) {
        await api.patch('/characters/unfavorite', { name });
      } else {
        await api.patch('/characters/favorite', { name });
      }

      await fetchFavorites(); // Recarrega os favoritos
      // Remova a linha abaixo para evitar a chamada de fetchCharacters
      // await fetchCharacters(); // Recarrega os personagens
    } catch (error) {
      console.error('Erro ao marcar/desmarcar favorito:', error);
    }
  };

  // Atualiza os personagens paginados quando a página atual muda
  useEffect(() => {
    fetchCharacters(); // Recarrega os personagens sempre que a página atual mudar
  }, [currentPage]);

  // Função para passar para a próxima página
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Função para voltar para a página anterior
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Novas funções para ir para a primeira e última página
  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };

  // Calcula os personagens paginados com base na página atual
  const paginatedCharacters = characters.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <div className="app">
      <SearchBar onSearch={handleSearch} onFavoriteSearch={handleFavoriteSearch} />
      <CharacterList characters={paginatedCharacters} onToggleFavorite={toggleFavorite} favorites={favorites} />
      <div className="pagination">
        <button onClick={goToFirstPage} disabled={currentPage === 1}>Início</button>
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>Anterior</button>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>Próxima</button>
        <button onClick={goToLastPage} disabled={currentPage === totalPages}>Fim</button>
      </div>
    </div>
  );
};

export default App;
*/
/*
import React, { useEffect, useState } from 'react';
import api from './services/api';
import SearchBar from './components/SearchBar';
import CharacterList from './components/CharacterList';
import axios from 'axios';

const App = () => {
  const [characters, setCharacters] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewingFavorites, setViewingFavorites] = useState(false); // Novo estado

  // Chame fetchCharacters e fetchFavorites ao carregar o componente
  useEffect(() => {
    fetchCharacters(); // Chama a função para buscar todos os personagens na inicialização
    fetchFavorites(); // Chama a função para buscar personagens favoritos
  }, []);

  // Função para buscar personagens (com ou sem termo de busca)
  const fetchCharacters = async (search = '') => {
    if (viewingFavorites) return; // Se estiver visualizando favoritos, não busque personagens

    try {
      const response = await axios.get('http://localhost:3000/api/characters/external', {
        params: { name: search }, // Envia o termo de busca como parâmetro
      });
      setCharacters(response.data); // Define o estado dos personagens
      setTotalPages(Math.ceil(response.data.length / 10)); // Calcula o total de páginas
    } catch (error) {
      console.error('Erro ao buscar personagens:', error);
    }
  };

  // Função para buscar personagens favoritos
  const fetchFavorites = async () => {
    try {
      const response = await api.get('/characters/favorites');
      setFavorites(response.data); // Define o estado dos favoritos
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setFavorites([]); // Define favoritos como um array vazio
        console.log('Nenhum favorito encontrado, estado atualizado para vazio.'); // Log informativo
      } else {
        console.error('Erro ao buscar favoritos:', error);
      }
    }
  };

  // Função chamada pelo SearchBar para buscar personagens pelo nome
  const handleSearch = (searchTerm) => {
    fetchCharacters(searchTerm); // Chama a função fetchCharacters com o termo de busca
    setViewingFavorites(false); // Reseta o estado ao buscar novos personagens
  };

  // Função para buscar personagens favoritos
  const handleFavoriteSearch = async () => {
    try {
      const response = await api.get('/characters/favorites'); // Busca os personagens favoritos
      setCharacters(response.data); // Atualiza a lista de personagens com os favoritos
      setCurrentPage(1); // Reseta para a primeira página
      setViewingFavorites(true); // Marca que está visualizando favoritos
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error);
    }
  };

  // Função para alternar entre marcar/desmarcar um personagem como favorito
  const toggleFavorite = async (name, isFavorite) => {
    try {
      if (isFavorite) {
        await api.patch('/characters/unfavorite', { name });
      } else {
        await api.patch('/characters/favorite', { name });
      }

      await fetchFavorites(); // Recarrega os favoritos
      await fetchCharacters(); // Recarrega os personagens
    } catch (error) {
      console.error('Erro ao marcar/desmarcar favorito:', error);
    }
  };

  // Atualiza os personagens paginados quando a página atual muda
  useEffect(() => {
    fetchCharacters(); // Recarrega os personagens sempre que a página atual mudar
  }, [currentPage]);

  // Função para passar para a próxima página
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Função para voltar para a página anterior
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Novas funções para ir para a primeira e última página
  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };

  // Calcula os personagens paginados com base na página atual
  const paginatedCharacters = characters.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <div className="app">
      <SearchBar onSearch={handleSearch} onFavoriteSearch={handleFavoriteSearch} />
      <CharacterList characters={paginatedCharacters} onToggleFavorite={toggleFavorite} favorites={favorites} />
      <div className="pagination">
        <button onClick={goToFirstPage} disabled={currentPage === 1}>Início</button>
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>Anterior</button>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>Próxima</button>
        <button onClick={goToLastPage} disabled={currentPage === totalPages}>Fim</button>
      </div>
    </div>
  );
};

export default App;
*/
/*
import React, { useEffect, useState } from 'react';
import api from './services/api';
import SearchBar from './components/SearchBar';
import CharacterList from './components/CharacterList';
import axios from 'axios';

const App = () => {
  const [characters, setCharacters] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Chame fetchCharacters e fetchFavorites ao carregar o componente
  useEffect(() => {
    fetchCharacters(); // Chama a função para buscar todos os personagens na inicialização
    fetchFavorites(); // Chama a função para buscar personagens favoritos
  }, []);

  // Função para buscar personagens (com ou sem termo de busca)
  const fetchCharacters = async (search = '') => {
    try {
      const response = await axios.get('http://localhost:3000/api/characters/external', {
        params: { name: search }, // Envia o termo de busca como parâmetro
      });
      setCharacters(response.data); // Define o estado dos personagens
      setTotalPages(Math.ceil(response.data.length / 10)); // Calcula o total de páginas
    } catch (error) {
      console.error('Erro ao buscar personagens:', error);
    }
  };
  
 const fetchFavorites = async () => {
  try {
    const response = await api.get('/characters/favorites');
    setFavorites(response.data); // Atualiza o estado dos favoritos
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // Se o erro for 404, significa que não há favoritos
      setFavorites([]); // Define favoritos como um array vazio
      console.log('Nenhum favorito encontrado, estado atualizado para vazio.'); // Log informativo
    } else {
      console.error('Erro ao buscar favoritos:', error);
    }
  }
};

  // Função chamada pelo SearchBar para buscar personagens pelo nome
  const handleSearch = (searchTerm) => {
    fetchCharacters(searchTerm); // Chama a função fetchCharacters com o termo de busca
  };

  // Função para buscar personagens favoritos
  const handleFavoriteSearch = async () => {
    try {
      const response = await api.get('/characters/favorites'); // Busca os personagens favoritos
      setCharacters(response.data); // Atualiza a lista de personagens com os favoritos
      setCurrentPage(1); // Reseta para a primeira página
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error);
    }
  };
  
const toggleFavorite = async (name, isFavorite) => {
  try {
    if (isFavorite) {
      await api.patch('/characters/unfavorite', { name });
    } else {
      await api.patch('/characters/favorite', { name });
    }

    await fetchFavorites(); // Recarrega os favoritos
    await fetchCharacters(); // Recarrega os personagens
  } catch (error) {
    console.error('Erro ao marcar/desmarcar favorito:', error);
  }
};  

// Atualiza os personagens paginados quando a página atual muda
  useEffect(() => {
    fetchCharacters(); // Recarrega os personagens sempre que a página atual mudar
  }, [currentPage]);

  // Função para passar para a próxima página
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Função para voltar para a página anterior
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Novas funções para ir para a primeira e última página
  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };

  // Calcula os personagens paginados com base na página atual
  const paginatedCharacters = characters.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <div className="app">
      <SearchBar onSearch={handleSearch} onFavoriteSearch={handleFavoriteSearch} />
      <CharacterList characters={paginatedCharacters} onToggleFavorite={toggleFavorite} favorites={favorites} />
      <div className="pagination">
        <button onClick={goToFirstPage} disabled={currentPage === 1}>Início</button>
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>Anterior</button>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>Próxima</button>
        <button onClick={goToLastPage} disabled={currentPage === totalPages}>Fim</button>
      </div>
    </div>
  );
};

export default App;
*/


/*
import React, { useEffect, useState } from 'react';
import api from './services/api';
import SearchBar from './components/SearchBar';
import CharacterList from './components/CharacterList';
import axios from 'axios';

const App = () => {
  const [characters, setCharacters] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Chame fetchCharacters ao carregar o componente
  useEffect(() => {
    fetchCharacters(); // Chama a função para buscar todos os personagens na inicialização
  }, []);

  // Função para buscar personagens (com ou sem termo de busca)
  const fetchCharacters = async (search = '') => {
    try {
      const response = await axios.get('http://localhost:3000/api/characters/external', {
        params: { name: search }, // Envia o termo de busca como parâmetro
      });
      setCharacters(response.data); // Define o estado dos personagens
      setTotalPages(Math.ceil(response.data.length / 10)); // Calcula o total de páginas
    } catch (error) {
      console.error('Erro ao buscar personagens:', error);
    }
  };

  // Função chamada pelo SearchBar para buscar personagens pelo nome
  const handleSearch = (searchTerm) => {
    fetchCharacters(searchTerm); // Chama a função fetchCharacters com o termo de busca
  };

  // Função para buscar personagens favoritos
  const handleFavoriteSearch = async () => {
    try {
      const response = await api.get('/characters/favorites');
      setFavorites(response.data); // Define o estado dos favoritos
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error);
    }
  };

  // Função para alternar entre marcar/desmarcar um personagem como favorito
  const toggleFavorite = async (name, isFavorite) => {
  try {
    let response;
    if (isFavorite) {
      response = await api.patch('/characters/unfavorite', { name });
    } else {
      response = await api.patch('/characters/favorite', { name });
    }
    console.log('Resposta do back-end:', response.data); // Verifica a resposta
    handleFavoriteSearch(); // Recarrega os personagens favoritos
  } catch (error) {
    console.error('Erro ao marcar/desmarcar favorito:', error);
  }
};
  // Atualiza os personagens paginados quando a página atual muda
  useEffect(() => {
    fetchCharacters(); // Recarrega os personagens sempre que a página atual mudar
  }, [currentPage]);

  // Função para passar para a próxima página
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Função para voltar para a página anterior
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Calcula os personagens paginados com base na página atual
  const paginatedCharacters = characters.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <div className="app">
      {/* Barra de busca com as funções de busca e favoritos */ // }
/*     <SearchBar onSearch={handleSearch} onFavoriteSearch={handleFavoriteSearch} />
      
      {/* Lista de personagens paginados */ // }
/*      <CharacterList characters={paginatedCharacters} onToggleFavorite={toggleFavorite} />
      
      {/* Controles de paginação */  //}
 /*     <div className="pagination">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>Anterior</button>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>Próxima</button>
      </div>
    </div>
  );
};

export default App;
*/
/*
import React, { useEffect, useState } from 'react';
import api from './services/api';
import SearchBar from './components/SearchBar';
import CharacterList from './components/CharacterList';
import axios from 'axios';

const App = () => {
  const [characters, setCharacters] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Chame fetchCharacters ao carregar o componente
  useEffect(() => {
    fetchCharacters(); // Chama a função para buscar todos os personagens na inicialização
  }, []);

  // Função para buscar todos os personagens
  const fetchCharacters = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/characters/external'); // Sem o ?name=
      setCharacters(response.data); // Define o estado dos personagens
      setTotalPages(Math.ceil(response.data.length / 10)); // Calcula o total de páginas
    } catch (error) {
      console.error('Erro ao buscar personagens:', error);
    }
  };

  const handleSearch = (search) => {
    fetchCharacters(search);
  };

  const handleFavoriteSearch = async () => {
    try {
      const response = await api.get('/characters/favorites');
      setFavorites(response.data);
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error);
    }
  };

  const toggleFavorite = async (name, isFavorite) => {
    try {
      if (isFavorite) {
        await api.patch('/characters/unfavorite', { name });
      } else {
        await api.patch('/characters/favorite', { name });
      }
      fetchCharacters(); // Recarrega os personagens para atualizar o estado de favoritos
    } catch (error) {
      console.error('Erro ao marcar/desmarcar favorito:', error);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const paginatedCharacters = characters.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <div className="app">
      <SearchBar onSearch={handleSearch} onFavoriteSearch={handleFavoriteSearch} />
      <CharacterList characters={paginatedCharacters} onToggleFavorite={toggleFavorite} />
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>Anterior</button>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>Próxima</button>
      </div>
    </div>
  );
};

export default App;
*/