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
// Optional Background Scene
// ============================================================================
export class BackgroundScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BackgroundScene' });
        this.backgroundImage = null;
        this.scaleSelector = true;
        this.backgroundAlpha = [0.1, 0.2, 0.4, 0.8, 1.0];
        this.currentAlpha = 5;
        this.backgroundColor = ['Normal', 'Red', 'Green', 'Blue'];
        this.currentColorIndex = 0;
    }

    preload() {
        // Carregar a imagem de fundo passada como data
        if (this.scene.settings.data.backgroundImage) {
            this.load.image('background', this.scene.settings.data.backgroundImage);
        }
    }

    create() {
        if (this.textures.exists('background')) {
            this.backgroundImage = this.add.image(0, 0, 'background').setOrigin(0, 0);
        }

        // Frescura
        document.getElementById('bg-scale').addEventListener('click', this.handleScale.bind(this));
        document.getElementById('bg-alpha').addEventListener('click', this.handleAlpha.bind(this));
        document.getElementById('bg-color').addEventListener('click', this.applyRGBFilter.bind(this));

        this.unlockButtons();
        this.updateInfo();
        console.log('[BackgroundScene]', { 'BackgroundScene': this })
    }

    mainEvent() {
        if (this.scaleSelector) {
            this.backgroundImage.setScale(1).setAlpha(
                this.backgroundAlpha[this.currentAlpha]
            )
        } else {
            this.backgroundImage.setDisplaySize(this.scale.width, this.scale.height).setAlpha(
                this.backgroundAlpha[this.currentAlpha]
            );
        }
    }

    handleScale() {

        this.scaleSelector = !this.scaleSelector;
        this.mainEvent();

        // Mais Frescura!
        this.updateInfo();
    }

    handleAlpha() {
        this.currentAlpha >=
            this.backgroundAlpha.length - 1 ? this.currentAlpha = 0 : this.currentAlpha++;

        this.mainEvent();
        // Mais Frescura!
        this.updateInfo();
    }

    applyRGBFilter() {
        this.currentColorIndex >=
            this.backgroundColor.length - 1 ? this.currentColorIndex = 0 : this.currentColorIndex++;

        if (this.currentColorIndex == 0) this.backgroundImage.clearTint();
        if (this.currentColorIndex == 1) this.backgroundImage.setTint(0xff0000);
        if (this.currentColorIndex == 2) this.backgroundImage.setTint(0x00ff00);
        if (this.currentColorIndex == 3) this.backgroundImage.setTint(0x0000ff);

        this.updateInfo();
    }

    updateInfo() {

        // Mudando Texto da Tela
        const doc = document.getElementById('bg-scale');
        const newName = this.scaleSelector == true ? 'Original' : 'Fit';
        doc.textContent = `Scale (${newName})`;

        // Mudando Texto da Tela
        const alphaData = document.getElementById('bg-alpha');
        const newNameA = `Alpha (${this.currentAlpha})`;
        alphaData.textContent = newNameA;

        // Mudando Texto da Tela
        const colorData = document.getElementById('bg-color');
        const newNameC = `Color Tint (${this.backgroundColor[this.currentColorIndex]})`;
        colorData.textContent = newNameC;
    }

    unlockButtons() {
        const buttons = ['bg-scale', 'bg-alpha', 'bg-color'];

        // Canvas Não Suporta Variação de Cor
        !this.game.backgroundColor ? buttons.pop() :  null;

        buttons.forEach(buttonId => {
            const button = document.getElementById(buttonId);
            
            // Restaura o estilo original a partir das variáveis CSS
            button.style.backgroundColor = 'var(--button-background)';
            button.style.pointerEvents = 'auto';
        });
    }

    update() {
        // Evitar a todo custo!
    }
}
