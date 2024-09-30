import React, { useState } from 'react';
import '../styles.css';
import logo from '../assets/logo.svg'; // Importa o logo SVG

const SearchBar = ({ onSearch, onFavoriteSearch, resetCharacters }) => {
  const [search, setSearch] = useState(''); // Estado para armazenar o termo de busca

  // Função para lidar com a busca quando o botão é clicado
  const handleSearch = () => {
    onSearch(search); // Chama a função de busca com o termo atual
  };

  return (
    <div className="search-bar">
      {/* Logo SVG ao lado esquerdo da barra de pesquisa */}
      <img 
        src={logo} 
        alt="Logo" 
        className="logo-image" 
        onClick={resetCharacters} // Reseta os personagens ao clicar no logo
        style={{ cursor: 'pointer', marginRight: '15px' }} // Estilo do logo
      />

      {/* Barra de pesquisa */}
      <label htmlFor="searchInput" className="visually-hidden">Buscar Personagem</label>
      <input
        id="searchInput"
        type="text"
        value={search} // Valor do input é o estado de busca
        onChange={(e) => setSearch(e.target.value)} // Atualiza o estado de busca ao digitar
        placeholder="Buscar por nome..." // Placeholder para descrever o campo
        aria-label="Buscar personagem pelo nome" // Atributo para acessibilidade
      />

      {/* Botão de busca */}
      <button onClick={handleSearch} title="Buscar personagens" aria-label="Buscar personagens">
        Buscar
      </button>

      {/* Botão para buscar personagens favoritos */}
      <button onClick={onFavoriteSearch} title="Buscar personagens favoritos" aria-label="Buscar personagens favoritos">
        Personagens Favoritos
      </button>
    </div>
  );
};

export default SearchBar;
