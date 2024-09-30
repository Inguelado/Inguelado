import React from 'react';

// Componente que exibe um item da lista de personagens, com a opção de marcar/desmarcar como favorito
const CharacterItem = ({ character, onToggleFavorite, isFavorite }) => {
  return (
    <tr className="character-item">
      {/* Exibe os atributos do personagem */}
      <td>{character.name}</td>
      <td>{character.height}</td>
      <td>{character.mass}</td>
      <td>{character.hair_color}</td>
      <td>{character.skin_color}</td>
      <td>{character.eye_color}</td>
      <td>{character.birth_year}</td>
      <td>{character.gender}</td>

      {/* Botão de favorito, usando uma estrela */}
      <td>
        <span
          className={`favorite-star ${isFavorite ? 'selected' : ''}`} // Adiciona a classe 'selected' se for favorito
          onClick={() => onToggleFavorite(character.name, isFavorite)} // Chama a função ao clicar, alternando o estado de favorito
          role="button" // Define o span como um elemento clicável
          aria-label={isFavorite ? "Remover favorito" : "Marcar como favorito"} // Atualiza o aria-label para acessibilidade
          style={{ cursor: 'pointer', fontSize: '24px', color: isFavorite ? '#FFD700' : '#ccc' }} // Altera a cor e o estilo da estrela
        >
          ★
        </span>
      </td>
    </tr>
  );
};

export default CharacterItem;
