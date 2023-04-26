import express from 'express';
import axios from 'axios';

// Cria uma instância do Express.js
const app = express();

// Armazena a lista de proxies em uma variável global
let proxies = [];

// Faz uma requisição HTTP para obter o conteúdo do arquivo de proxies
axios.get('https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/socks5.txt')
  .then(response => {
    // Converte o conteúdo do arquivo em um array de proxies e armazena na variável global
    proxies = response.data.split('\n').filter(Boolean);
  })
  .catch(error => {
    console.error(error);
  });

// Define a rota para a requisição GET
app.get('/', (req, res) => {
  if (proxies.length === 0) {
    // Se a lista de proxies estiver vazia, retorna um erro 500
    res.status(500).send('Lista de proxies vazia');
  } else {
    // Seleciona um proxy aleatório e remove da lista
    const randomIndex = Math.floor(Math.random() * proxies.length);
    const randomProxy = proxies.splice(randomIndex, 1)[0];

    // Faz uma requisição ao proxy selecionado e retorna a resposta para o cliente
    axios.get('http://example.com', { proxy: { host: randomProxy.split(':')[0], port: randomProxy.split(':')[1] }})
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        console.error(error);
        res.status(500).send('Erro ao fazer requisição ao proxy');
      });
  }
});

// Inicia o servidor na porta 3000
app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
