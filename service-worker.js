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

// Definições iniciais
const appName = 'Entity-Editor-Cache'
const state = 'PA-S9';
const editorNotice = '24';

// Conteúdo que vai para o cache
const version = "65aOElt7S1WUDQBhTStCUAWXE7m3w0";
const contentToCache = [
  "CODE_OF_CONDUCT.md",
  "CONTRIBUTING.md",
  "COPYING.md",
  "EE-Frame/Core/BackgroundScene.js",
  "EE-Frame/Core/MainScene.js",
  "EE-Frame/Core/WidgetsCtrl.js",
  "EE-Frame/index.css",
  "EE-Frame/index.html",
  "EE-Frame/index.js",
  "EE-Frame/lib/phaser.js",
  "Examples/One.json",
  "Favicon/android-chrome-192x192.png",
  "Favicon/android-chrome-512x512.png",
  "Favicon/apple-touch-icon.png",
  "Favicon/favicon-16x16.png",
  "Favicon/favicon-32x32.png",
  "Favicon/favicon.ico",
  "README.md",
  "Screenshots/screenshot1.webp",
  "Screenshots/screenshot2.webp",
  "Screenshots/screenshot3.webp",
  "Screenshots/screenshot4.webp",
  "Screenshots/screenshot5.webp",
  "index.html",
  "register.js",
  "service-worker.js",
  "site.webmanifest"
];

// Nome e versionador do SeviceWorker
const CACHE_NAME = appName + '-' + state + '-V-' + version + '-' + editorNotice;
console.log('[Service Worker]', { "New Cache": CACHE_NAME });

// Evento de instalação
self.addEventListener("install", (e) => {
  //console.log("[Service Worker] Install");
  e.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      //console.log("[Service Worker] Caching all: app shell and content");
      await cache.addAll(contentToCache);
    })(),
  );
});

// Servindo arquivos locais no lugar dos Web = Modo Offline!
self.addEventListener("fetch", (e) => {
  e.respondWith(
    (async () => {
      try {
        const r = await caches.match(e.request);
        // console.log('[Service Worker]', { "Cache mode": CACHE_NAME });
        if (r) {
          return r;
        }
        const response = await fetch(e.request);
        const cache = await caches.open(CACHE_NAME);
        cache.put(e.request, response.clone());
        return response;
      } catch (error) {
        console.log('[Service Worker]', null);
      }
    })(),
  );
});

// Update do Cache do cliente para novas versões
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key === CACHE_NAME) {
            return;
          }

          // Caso o cache contenha uma entrada antiga, apague!
          console.log(`[Service Worker] Caching new resource: ${key}`);
          return caches.delete(key);
        }),
      );
    }),
  );
});


// Service Worker

// Adiciona um ouvinte de mensagens
self.addEventListener('message', event => {

  // Verifica o tipo da mensagem
  if (event.data && event.data.type === 'firstContact') {

    // Realiza alguma lógica com os dados recebidos
    // const dadosDaPagina = event.data.dados;
    // console.log('[Service Worker]', { "Current Cache": CACHE_NAME });

    // Envia uma resposta de volta para a página da web
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'RESPOSTA_DO_SERVICE_WORKER',
          dados: 'Resposta do Service Worker para a página',
        });
      });
    });
  }
});
