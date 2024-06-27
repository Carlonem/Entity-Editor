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
// Essential Components -> ImportList
// ============================================================================


// ============================================================================
// GridLines Phase Class Scene
// ============================================================================
export class GridLines extends Phaser.Scene {
    constructor() {
        super({ key: 'GridLines' });

        this.lineWidth = [0.5, 1.0, 1.5, 2.0, 2.5];
        this.lineColor = ['0xffffff', '0xE2A3AD', '0xBAF4B4', '0xF3F4B4', '0xD9B4F4'];
        this.lineAlpha = [0.1, 0.3, 0.5, 0.7, 0.9];

        this.resolution = document.getElementById('canvas-resolution');
        this.resolutionData = this.resolution.value.split('x');
        this.currentLineInfo = [this.resolutionData[3], this.resolutionData[4], this.resolutionData[5]];

        // Calcula o deslocamento baseado na posição da visualização
        this.offsetX = 0;
        this.offsetY = 0;
    }

    create() {

        this.gridSize = parseInt(this.game.cellSize);
        this.graphics = this.add.graphics();

        // Frescura
        document.getElementById('grid-visibility').addEventListener('click', this.changeGridVisibilite.bind(this));
        document.getElementById('line-width').addEventListener('click', this.lineWidthButton.bind(this));
        document.getElementById('line-color').addEventListener('click', this.lineColorButton.bind(this));
        document.getElementById('line-alpha').addEventListener('click', this.lineAlphaButton.bind(this));

        // Desenhando Entidades
        this.drawGridLines();

        console.log('[GridLines]', { 'GridLines': this });
    }

    //  ============================================================================
    //  drawGrid => Main Function Of The Class
    //  ============================================================================
    drawGrid() {

        // Calcula o deslocamento baseado na posição da visualização
        this.offsetX = 0 //this.viewPosition[this.currentWorkspace].x;
        this.offsetY = 0 //this.viewPosition[this.currentWorkspace].y;

        // Limpando a Tela
        this.graphics.clear();

        // Desenhando Entidades
        this.drawGridLines();

    }

    drawGridLines() {

        // Estilo da Grade
        this.graphics.clear();
        if (!this.activeGrid) {
            this.graphics.lineStyle(
                this.lineWidth[this.currentLineInfo[0]],
                this.lineColor[this.currentLineInfo[1]],
                this.lineAlpha[this.currentLineInfo[2]]
            );
        } else {
            this.graphics.lineStyle(1, 0x000000, 0);
        }

        // Parando: Caso -> Grid Desativada
        if (this.activeGrid) return null;

        // Desenhando a Grade
        for (let x = this.offsetX % this.gridSize; x < this.game.config.width; x += this.gridSize) {
            for (let y = this.offsetY % this.gridSize; y < this.game.config.height; y += this.gridSize) {
                this.graphics.fillStyle(0x000000, 0);
                this.graphics.fillRect(x, y, this.gridSize, this.gridSize);
                this.graphics.strokeRect(x, y, this.gridSize, this.gridSize);
            }
        }
    }

    //  ============================================================================
    //  Bloco de Eventos Relacionados a Frescura
    //  ============================================================================

    lineWidthButton() {
        this.currentLineInfo[0] >= this.lineWidth.length - 1 ? this.currentLineInfo[0] = 0 : this.currentLineInfo[0]++;
        this.updateLineInfo();
    }

    lineColorButton() {
        this.currentLineInfo[1] >= this.lineColor.length - 1 ? this.currentLineInfo[1] = 0 : this.currentLineInfo[1]++;
        this.updateLineInfo();
    }

    lineAlphaButton() {
        this.currentLineInfo[2] >= this.lineAlpha.length - 1 ? this.currentLineInfo[2] = 0 : this.currentLineInfo[2]++;
        this.updateLineInfo();
    }

    updateLineInfo() {

        // Mudando Texto da Tela
        const lineWidthData = document.getElementById('line-width');
        const newNameW = `Width (${this.currentLineInfo[0]})`;
        lineWidthData.textContent = newNameW;

        // Mudando Texto da Tela
        const lineColorData = document.getElementById('line-color');
        const newNameC = `Color (${this.currentLineInfo[1]})`;
        lineColorData.textContent = newNameC;

        // Mudando Texto da Tela
        const lineAlphaData = document.getElementById('line-alpha');
        const newNameA = `Alpha (${this.currentLineInfo[2]})`;
        lineAlphaData.textContent = newNameA;

        // Atualizando a Tela
        this.drawGrid();
    }

    changeGridVisibilite() {

        const gridVisibilite = document.getElementById('grid-visibility');
        let newName = '';

        // Mudando Texto da Tela
        if (this.activeGrid) newName = 'Grid (On)';
        else newName = 'Grid (Off)';

        gridVisibilite.textContent = newName;
        this.activeGrid = !this.activeGrid;

        //Atualizando a Tela
        this.drawGrid();
    }
}


