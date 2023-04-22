import csv from 'csv-parser';
import { createReadStream, writeFileSync } from 'fs';

const batchSize = 1000;
let currentBatch = 0;
let batchData = [];

createReadStream('usuarios.csv')
  .pipe(csv())
  .on('data', (row) => {
    // Adiciona a linha atual ao lote atual
    batchData.push(row);

    // Verifica se o lote atual tem tamanho batchSize
    if (batchData.length === batchSize) {
      // Escreve o lote atual em um arquivo CSV separado
      const filename = `batch_${currentBatch}.csv`;
      writeFileSync(filename, convertToCsv(batchData));

      // Prepara o próximo lote
      batchData = [];
      currentBatch++;
    }
  })
  .on('end', () => {
    // Escreve o último lote, se houver
    if (batchData.length > 0) {
      const filename = `batch_${currentBatch}.csv`;
      writeFileSync(filename, convertToCsv(batchData));
    }

    console.log('Arquivos criados com sucesso!');
  });

function convertToCsv(data) {
  // Converte um array de objetos para um CSV em formato de string
  const headers = Object.keys(data[0]);
  const csv = [headers.join(',')];
  for (let row of data) {
    const values = headers.map(header => row[header]);
    csv.push(values.join(','));
  }
  return csv.join('\n');
}
