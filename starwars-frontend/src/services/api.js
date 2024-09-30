import axios from 'axios'; // Importa a biblioteca Axios para fazer requisições HTTP

// Cria uma instância do Axios com uma configuração padrão
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Define a URL base para as requisições
});

// Exporta a instância do Axios para ser utilizada em outros arquivos
export default api;

// O arquivo api.js encapsula a configuração do Axios, facilitando a realização de chamadas à API com um ponto de entrada unificado.

