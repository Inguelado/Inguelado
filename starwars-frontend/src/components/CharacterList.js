import React from 'react';
import CharacterItem from './CharacterItem';

const CharacterList = ({ characters, onToggleFavorite, favorites }) => {
  return (
    <div className="character-list">
      <table>
        <thead>
          <tr>
            {/* Cabeçalhos da tabela */}
            <th>Nome</th>
            <th>Altura</th>
            <th>Peso</th>
            <th>Cabelo</th>
            <th>Pele</th>
            <th>Olhos</th>
            <th>Nascimento</th>
            <th>Gênero</th>
            <th>Favorito</th>
          </tr>
        </thead>
        <tbody>
          {characters.length > 0 ? ( 
            // Se há personagens, mapeia cada um para um componente CharacterItem
            characters.map((character) => (
              <CharacterItem
                key={character.name} // Atribui uma chave única por nome
                character={character} // Passa o personagem atual como prop
                onToggleFavorite={onToggleFavorite} // Passa a função para alternar favoritos
                isFavorite={favorites.some(fav => fav.name === character.name)} // Verifica se o personagem está nos favoritos
              />
            ))
          ) : (
            <tr>
              {/* Exibe uma mensagem se não houver personagens */}
              <td colSpan="9">Nenhum personagem encontrado.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CharacterList;
