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


// Ctes de Ativação do Pwa e de Segurança
const PwaActive = true;
const Destructor = false;

// Ativando serviceWorker para Pwa
if ('serviceWorker' in navigator && PwaActive) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/Entity-Editor/service-worker.js', {
            scope: '/Entity-Editor/'
        })
            .then(registration => {
                console.info(
                    '[Register]',
                    { 'SWorker:': registration }
                );
            })
            .catch(error => {
                console.error(
                    '[Register]',
                    'Falha ao registrar o Service Worker:',
                    error
                );
            });
    });
} else {
    console.info(
        '[Register]',
        {
            Info: 'O Service Worker Não Foi Registrado:',
            Presence: 'serviceWorker' in navigator
        });

    // Mecanismo 
    destructPage();

}

// Verifica se o Service Worker está registrado
if (window.navigator && 'serviceWorker' in navigator) {

    navigator.serviceWorker.ready.then(registration => {

        // Envia uma mensagem para o Service Worker
        registration.active.postMessage({
            type: 'firstContact',
            dados: 'Dados da página para o Service Worker',
        });
    });
}

// Destruidor de Page
function destructPage() {

    // Medida de Segurança
    if (!Destructor) return;

    try {
        // Limpa o conteúdo da página
        document.documentElement.innerHTML = '';

        // Interrompe a execução de scripts
        window.stop();

        // Desconecta os eventos globais
        window.onclick = null;
        window.onkeydown = null;
        window.onresize = null;
        window.onscroll = null;

        // Remove todas as referências a objetos globais
        Object.getOwnPropertyNames(window).forEach(propriedade => {
            try {
                delete window[propriedade];
            } catch (e) {
                // Ignora erros de exclusão
            }
        });

        // Limpa o cache de service workers
        if ('caches' in window) {
            caches.keys().then(keys => {
                keys.forEach(key => caches.delete(key));
            });
        }

        // Limpa o localStorage e o sessionStorage
        if ('localStorage' in window) {
            window.localStorage.clear();
        }

        if ('sessionStorage' in window) {
            window.sessionStorage.clear();
        }

        // Cria um novo objeto window
        var newWindow = window.open('', '_self', '');
        newWindow.document.write('<html><head></head><body></body></html>');
        newWindow.document.close();

        // Fecha a janela do navegador 
        // window.close();
    } catch (e) {

    }
}


