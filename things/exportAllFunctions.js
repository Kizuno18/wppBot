const fs = require('fs');
const path = require('path');
const importAll = require('import-all');

async function exportAllFunctions(directoryPath=__dirname) {
  // Nomes de arquivos a serem ignorados
  const ignoreFiles = [];

  const files = fs.readdirSync(directoryPath);
  const modules = {};

  for (const file of files) {
    // Ignora arquivos que devem ser ignorados
    if (ignoreFiles.includes(file) || !(('.js' in path.parse(file)) || ('.mjs' in path.parse(file)) || ('.cjs' in path.parse(file)))) {
      continue;
    }
    const filePath = path.join(directoryPath, file);
    const { ext } = path.parse(filePath);

    // Verifica se o arquivo é um módulo ES ou um módulo CommonJS
    const isModule = ext === '.mjs' || ext === '.cjs';

    try {
      // Importa o módulo
      const importedModule = isModule ? await import(filePath) : importAll(filePath);

      // Verifica se o módulo exporta alguma função
      if (typeof importedModule === 'function') {
        modules[file.replace(ext, '')] = importedModule;
        console.log("alo");
      } else if (typeof importedModule === 'object') {
        Object.entries(importedModule).forEach(([key, value]) => {
          if (typeof value === 'function') {
            modules[`${file.replace(ext, '')}.${key}`] = value;
            console.log("alo2");
          }
        });
      }
    } catch (err) {
      console.error(`Erro ao importar o módulo ${filePath}:`, err);
    }
  }

  return modules;
}

module.exports = exportAllFunctions;
