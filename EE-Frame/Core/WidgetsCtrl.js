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

// ============================================================================
// Ui Widgets Ctrl. Center
// ============================================================================
export class WidgetsCtrl {
    constructor() {
        this.active = true;
        this.init();
        this.draggableButtonActive();
    }

    init() {
        const draggables = document.querySelectorAll('.section-div');

        draggables.forEach(div => {
            const label = div.querySelector('label'); // Seleciona a label dentro da div

            label.style.position = 'relative';
            label.style.cursor = 'move';
            label.style.zIndex = '1000';

            this.addDragEvents(div, label);
        });

        // Adiciona um botão de reset global
        const resetButton = document.getElementById('reset-divs');
        resetButton.addEventListener('click', () => this.resetAllDivs());

        // Adiciona um botão de Desativação do Draggable
        const draggableButton = document.getElementById('draggable');
        draggableButton.addEventListener('click', () => this.draggableButtonActive());
    }

    draggableButtonActive() {
        this.active = !this.active;
        const draggables = document.querySelectorAll('.section-div');
        const draggableButton = document.getElementById('draggable');
        let newName = '';

        if (!this.active) {

            // Desligando Evento
            draggables.forEach(div => {
                const label = div.querySelector('label');
                label.style.pointerEvents = 'none';
            });

            // Mudando Texto da Tela
            newName = `Draggable (Off)`;

        } else {

            // Ligando Evento
            draggables.forEach(div => {
                const label = div.querySelector('label');
                label.style.pointerEvents = 'auto';
            });

            // Mudando Texto da Tela
            newName = `Draggable (On)`;
        }

        draggableButton.textContent = newName;
    }

    addDragEvents(div, button) {
        let isDragging = false;
        let startX, startY, initialX, initialY;

        button.addEventListener('mousedown', (e) => {
            e.preventDefault();
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            initialX = div.getBoundingClientRect().left;
            initialY = div.getBoundingClientRect().top;

            div.style.position = 'absolute';
            div.style.width = '300px';
            div.style.left = `${initialX}px`;
            div.style.top = `${initialY}px`;
            div.style.zIndex = '1001';

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        const onMouseMove = (e) => {
            if (!this.active) return;
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            div.style.left = `${initialX + dx}px`;
            div.style.top = `${initialY + dy}px`;
        };

        const onMouseUp = () => {
            if (!this.active) return;
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
    }

    resetAllDivs() {
        const draggables = document.querySelectorAll('.section-div');

        draggables.forEach(div => {
            const label = div.querySelector('label');

            // Resetar para as posições originais
            label.style.position = 'relative';
            label.style.cursor = 'move';
            label.style.zIndex = '1001';

            div.style.position = 'static';
            div.style.width = 'auto';
            div.style.left = 'auto';
            div.style.top = 'auto';
            div.style.zIndex = 'auto';
        });
    }
}