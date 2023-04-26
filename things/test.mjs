const http = require('http');
const fetch = require('node-fetch');

const PORT = 3000; // porta do servidor

const GITHUB_API_URL = 'https://api.github.com';
const GITHUB_OWNER = 'seu_usuario_no_github';
const GITHUB_REPO = 'seu_repositorio_no_github';
const GITHUB_PATH = 'caminho/para/o/arquivo/da/lista.txt';

const getRandomString = async () => {
  const response = await fetch(`${GITHUB_API_URL}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_PATH}`);
  const content = await response.json();
  const list = content.content.split('\n').filter(Boolean); // converte o conteúdo do arquivo em uma lista de strings
  return list[Math.floor(Math.random() * list.length)]; // retorna uma string aleatória da lista
};

const server = http.createServer(async (req, res) => {
  const randomString = await getRandomString();
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(randomString);
});

server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
