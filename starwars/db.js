const mysql = require('mysql2/promise');

// Cria uma pool de conexões com o banco de dados
const pool = mysql.createPool({
  host: 'localhost', // Host do banco de dados
  user: 'root',      // Usuário do banco de dados
  password: 'desafio', // Senha do banco de dados
  database: 'StarWars_DB', // Nome do banco de dados
  waitForConnections: true, // Aguarda por conexões disponíveis
  connectionLimit: 30, // Limite de conexões na pool
});

// Função para criar a tabela de personagens
async function createCharactersTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS characters (
      id INT AUTO_INCREMENT PRIMARY KEY, 
      name VARCHAR(255) NOT NULL UNIQUE, 
      height VARCHAR(50), 
      mass VARCHAR(50), 
      hair_color VARCHAR(50),
      skin_color VARCHAR(50), 
      eye_color VARCHAR(50), 
      birth_year VARCHAR(50), 
      gender VARCHAR(50), 
      favorite BOOLEAN DEFAULT 0 
    );
  `;
  await pool.query(query); // Executa a query de criação da tabela
  console.log('Tabela "characters" criada com sucesso!');
}

// Função para importar ou atualizar um personagem
async function importCharacter(character) {
  const { name, height, mass, hair_color, skin_color, eye_color, birth_year, gender } = character;

  const query = `
    INSERT INTO characters (name, height, mass, hair_color, skin_color, eye_color, birth_year, gender)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE 
      height = VALUES(height), 
      mass = VALUES(mass),
      hair_color = VALUES(hair_color), 
      skin_color = VALUES(skin_color),
      eye_color = VALUES(eye_color), 
      birth_year = VALUES(birth_year),
      gender = VALUES(gender); 
  `;

  await pool.query(query, [name, height, mass, hair_color, skin_color, eye_color, birth_year, gender]);
  console.log(`Personagem "${name}" importado ou atualizado com sucesso!`);
}

// Função para marcar um personagem como favorito
async function favoriteCharacter(name) {
  const query = 'UPDATE characters SET favorite = 1 WHERE name = ?'; // Query para marcar como favorito
  const [result] = await pool.query(query, [name]); // Executa a query
  return result.affectedRows; // Retorna quantas linhas foram afetadas
}

// Função para desmarcar um personagem como favorito
async function unfavoriteCharacter(name) {
  const query = 'UPDATE characters SET favorite = 0 WHERE name = ?'; // Query para desmarcar como favorito
  const [result] = await pool.query(query, [name]); // Executa a query
  return result.affectedRows; // Retorna quantas linhas foram afetadas
}

// Função para apagar um personagem pelo nome
async function deleteCharacterByName(name) {
  const query = 'DELETE FROM characters WHERE name = ?'; // Query para deletar pelo nome
  const [result] = await pool.query(query, [name]); // Executa a query de deleção
  return result.affectedRows; // Retorna o número de linhas afetadas
}

// Função para deletar todos os personagens
async function deleteAllCharacters() {
  const query = 'DELETE FROM characters'; // Query para deletar todos os personagens
  const [result] = await pool.query(query); // Executa a query
  return result.affectedRows; // Retorna quantas linhas foram afetadas
}

// Função para listar personagens favoritos
async function getFavoriteCharacters() {
  const [rows] = await pool.query('SELECT * FROM characters WHERE favorite = 1'); // Query para buscar favoritos
  return rows; // Retorna os personagens favoritos
}

// Função para buscar um único personagem pelo nome
async function getCharacterByName(name) {
  const [rows] = await pool.query('SELECT * FROM characters WHERE name = ?', [name]); // Query para buscar pelo nome
  return rows[0] || null; // Retorna o primeiro personagem encontrado ou null se não houver
}

// Função para listar todos os personagens
async function getAllCharacters() {
  const [rows] = await pool.query('SELECT * FROM characters'); // Query para buscar todos os personagens
  return rows; // Retorna todos os personagens
}

// Exporta as funções e a pool de conexões para serem utilizadas em outros módulos
module.exports = { 
  pool, 
  createCharactersTable, 
  importCharacter, 
  favoriteCharacter, 
  unfavoriteCharacter, 
  deleteCharacterByName, 
  deleteAllCharacters, 
  getFavoriteCharacters,
  getCharacterByName,  
  getAllCharacters 
};
