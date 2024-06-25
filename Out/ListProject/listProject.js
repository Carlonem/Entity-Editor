// ============================================================================
// COPYING
// ============================================================================
/*
 * This file is part of Entity Editor - EE.
 *
 * Entity Editor - EE is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
 * Entity Editor - EE is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Entity Editor - EE. If not, see <http://www.gnu.org/licenses/>.
 *
 * Author: Carlonem <carlonem.dev@gmail.com>
 */

const fs = require('fs');
const path = require('path');

const savePath = 'Out/ListProject/';
const fileName = 'Files.js'

// Diretório atual (onde o script é chamado)
const currentDirectory = './'; 

// Vetor de Strings para CACHE
function getVisibleFiles(dir, filesArray) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    if (!file.startsWith('.')) { // Excluir arquivos ocultos
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        getVisibleFiles(filePath, filesArray);
      } else {
        filesArray.push(filePath);
      }
    }
  });

  return filesArray;
}

// Retirando entradas descartaveis
function removerElementoPorPalavra(vetor, palavra) {
  return vetor.filter(item => !item.includes(palavra));
}

// Gerador de nome de CACHE
function gerarStringAleatoria() {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let resultado = '';

  for (let i = 0; i < 30; i++) {
    const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
    resultado += caracteres.charAt(indiceAleatorio);
  }

  return resultado;
}

// CACHE-NAME version
const version = gerarStringAleatoria();
console.log('CACHE-version:', version);

// Gera o vetor de Strings e Limpa o vetor
let visibleFilesList = getVisibleFiles(currentDirectory, []);
visibleFilesList = removerElementoPorPalavra(visibleFilesList, 'Out/');

// Salvar o resultado em um arquivo JS separado
fs.writeFileSync(
  savePath + fileName,
  `const version = ${JSON.stringify(version)};` + "\n" +
  `const contentToCache = ${JSON.stringify(visibleFilesList, null, 2)};`
  );

console.log('Done!');

