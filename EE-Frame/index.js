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
import { MainScene } from "./Core/MainScene.js";
import { BackgroundScene } from "./Core/BackgroundScene.js";
import { WidgetsCtrl } from "./Core/WidgetsCtrl.js"

// ============================================================================
// End Of Load Event
// ============================================================================
window.addEventListener("load", () => {

    // Main Obj.
    window.gameConfig = new GameConfig();
});

// ============================================================================
// Phaser Init.
// ============================================================================
class GameConfig {
    constructor() {
        this.defaultConfig = {
            type: Phaser.AUTO,
            pixelArt: false,
            width: undefined,
            height: undefined,
            parent: 'canvas-container',
            fps: {
                target: 14,
                forceSetTimeOut: true
            },
            scene: []
        };
        this.config = { ...this.defaultConfig };
        this.game = undefined;
        this.init = false;
        this.backgroundImage = null;
        this.gridData;
        this.saveStyle;
        this.saveStyleTwo;
        this.saveStyleProto;
        this.raito16dot9 = true;
        this.handleResolutionChange = this.handleResolutionChange.bind(this);
        this.loadBackground = this.loadBackground.bind(this);
        this.entityData = { zone: this.protoObjectZone(), path: this.protoObjectPath() };
        this.ratio = '';
        this.raitoList = ['16:9', '4:3'];
        this.fpsButtonIds = ['fps0', 'fps1', 'fps2', 'fps3', 'fps4'];
        this.renderButtonIds = ['render-webgl', 'render-canvas'];
        this.orientationButtonIds = ['orientation-landscape', 'orientation-portrait'];
        this.orientation = '';
        this.raitoIndex = 0;

        // Boot Using -> handleResolutionChange
        this.boot();

        // Initialize Draggable functionality
        this.widgetsCtrl = new WidgetsCtrl();
    }

    // ============================================================================
    // Phaser Pre. Int.
    // ============================================================================

    boot() {

        // Pre-init Phaser Config.
        this.initializeFpsButtons();
        this.initializeRenderButtons();
        this.initializeOrientationButtons();

        // Botões do boot
        document.getElementById('canvas-ratio').addEventListener('click', this.handleCanvasRaitoChange.bind(this));
        document.getElementById('set-resolution').addEventListener('click', this.handleResolutionChange);
        document.getElementById('background-load').addEventListener('change', this.loadBackground);

        // Bloqueando Coisas Inoportunas
        this.blockLoadGrid();
        this.blockSaveProject();
        this.blockLoadProto();
        this.lockBackgroundButtons();
    }

    // ============================================================================
    // Phaser Functions
    // ============================================================================

    handleResolutionChange(event) {
        const gridSize = document.getElementById('canvas-grid');
        const resolution = document.getElementById('canvas-resolution');
        const resolutionData = resolution.value.split('x');
        this.gridData = gridSize.value;

        if (this.orientation == 'portrait') {
            this.config.width = parseInt(resolutionData[1]);
            this.config.height = parseInt(resolutionData[0]);
        } else if (this.orientation == 'landscape') {
            this.config.width = parseInt(resolutionData[0]);
            this.config.height = parseInt(resolutionData[1]);
        }

        // Safe Mode
        this.ratio = resolutionData[2];
        if (this.ratio == '4:3') this.raitoIndex = 1;

        // Linha inicial
        this.lineWidth = resolutionData[3];
        this.linaAlpha = resolutionData[4];

        // Safe Mode
        if (this.init) this.finishGame();

        this.startGame();
        this.andOfBoot();
    }

    startGame() {
        this.init = true;

        this.config.scene = this.backgroundImage ? [BackgroundScene, MainScene] : [MainScene];
        this.game = new Phaser.Game(this.config);
        this.game.cellSize = this.gridData;
        this.game.entityData = this.entityData;

        if (this.backgroundImage) {
            this.game.scene.start('BackgroundScene', { backgroundImage: this.backgroundImage });
        }

        this.game.scene.start('MainScene');
    }

    andOfBoot() {
        const setResolutionButton = document.getElementById('set-resolution');
        const backgroundLoadInput = document.getElementById('background-load');

        setResolutionButton.removeEventListener('click', this.handleResolutionChange);
        backgroundLoadInput.removeEventListener('change', this.loadBackground);

        this.blockLoadBackground();
        this.blockChangeResolution();
        this.unblockLoadGrid();
        this.unblockSaveProject();
        this.unblockLoadProto();

        this.setCanvasAspectRatio();

        const delay = 50;

        this.hideDiv(delay);
        this.showDiv(delay);
    }

    setCanvasAspectRatio() {
        const canvas = document.querySelector('canvas');
        let newName = '';

        // Remove as classes existentes de proporção
        canvas.classList.remove('canvas-16-9', 'canvas-4-3', 'canvas-16-9-portrait', 'canvas-4-3-portrait');

        // Adiciona a classe de proporção apropriada
        if (this.ratio == '16:9' && this.orientation == 'landscape') {
            canvas.classList.add('canvas-16-9');
            newName = 'Ratio (16:9)';
        } else if (this.ratio == '4:3' && this.orientation == 'landscape') {
            canvas.classList.add('canvas-4-3');
            newName = 'Ratio (4:3)';
        } else if (this.ratio == '16:9' && this.orientation == 'portrait') {
            canvas.classList.add('canvas-16-9-portrait');
            newName = 'Ratio (9:16)';
        } else if (this.ratio == '4:3' && this.orientation == 'portrait') {
            canvas.classList.add('canvas-4-3-portrait');
            newName = 'Ratio (3:4)';
        }

        document.getElementById('canvas-ratio').textContent = newName;
    }

    handleCanvasRaitoChange() {
        if (!this.init) return;

        this.raitoIndex >= this.raitoList.length - 1 ? this.raitoIndex = 0 : this.raitoIndex++;
        this.ratio = this.raitoList[this.raitoIndex];

        this.setCanvasAspectRatio();
    }

    finishGame() {
        if (this.game) {
            this.game.destroy(true);
            this.game = undefined;
        }
    }

    restartGame() {
        if (this.init) this.finishGame();
        this.startGame();
    }

    // ============================================================================
    // Ui Events for Load.
    // ============================================================================

    showDiv(delay) {
        // Seleciona o div pela classe
        const div = document.querySelector('.section-main-div');

        if (div) {
            // Certifica-se de que o div está visível, mas transparente
            div.style.opacity = 0;
            div.style.display = 'block';

            // Gradualmente aumenta a opacidade
            const fadeEffect = setInterval(() => {
                if (div.style.opacity < 1) {
                    div.style.opacity = parseFloat(div.style.opacity) + 0.1;
                } else {
                    clearInterval(fadeEffect);
                }
            }, delay); // intervalo para o efeito de fade
        }
    }

    hideDiv(delay) {
        // Seleciona o div pela classe
        const div = document.querySelector('.section-boot-div');

        if (div) {
            // Define a opacidade inicial
            div.style.opacity = 1;

            // Gradualmente reduz a opacidade
            const fadeEffect = setInterval(() => {
                if (!div.style.opacity) {
                    div.style.opacity = 1;
                }
                if (div.style.opacity > 0) {
                    div.style.opacity -= 0.1;
                } else {
                    clearInterval(fadeEffect);
                    div.style.display = 'none';
                    div.remove();
                }
            }, delay); // intervalo para o efeito de fade
        }
    }

    lockBackgroundButtons() {
        const buttons = ['bg-scale', 'bg-alpha', 'bg-color'];
        buttons.forEach(buttonId => {
            const button = document.getElementById(buttonId);
            // Altera o estilo para desabilitar o botão
            button.style.backgroundColor = 'grey';
            button.style.pointerEvents = 'none';
        });
    }

    loadBackground(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    this.backgroundImage = e.target.result;
                    // Desabilitar a label e mudar a cor para cinza
                    this.blockLoadBackground();
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    blockLoadBackground() {
        // Desabilitar a label e mudar a cor para cinza
        const backgroundLabel = document.querySelector('label[for="background-load"]');
        backgroundLabel.style.backgroundColor = 'gray';
        backgroundLabel.style.pointerEvents = 'none';
    }

    blockChangeResolution() {
        // Desabilitar o botão de resolução e mudar a cor para cinza
        const resolutionButton = document.getElementById('set-resolution');
        resolutionButton.disabled = true;
        resolutionButton.style.backgroundColor = 'gray';
        resolutionButton.style.pointerEvents = 'none';
    }

    blockLoadGrid() {
        // Desabilitar o botão de resolução e mudar a cor para cinza
        const backgroundLabel = document.querySelector('label[for="load"]');
        this.saveStyle = backgroundLabel.style;
        backgroundLabel.style.backgroundColor = 'gray';
        backgroundLabel.style.pointerEvents = 'none';
    }

    unblockLoadGrid() {
        const backgroundLabel = document.querySelector('label[for="load"]');
        backgroundLabel.style = this.saveStyle;
    }

    blockSaveProject() {
        // Desabilitar o botão de resolução e mudar a cor para cinza
        const saveButton = document.getElementById('save');
        this.saveStyleTwo = saveButton.style;
        saveButton.style.backgroundColor = 'gray';
        saveButton.style.pointerEvents = 'none';
    }

    unblockSaveProject() {
        const saveButton = document.getElementById('save');
        saveButton.style = this.saveStyleTwo;
    }

    blockLoadProto() {
        // Desabilitar o botão de resolução e mudar a cor para cinza
        const Proto = document.querySelector('label[for="loadProtoJSON"]');
        this.saveStyleProto = Proto.style;
        Proto.style.backgroundColor = 'gray';
        Proto.style.pointerEvents = 'none';
    }

    unblockLoadProto() {
        const Proto = document.querySelector('label[for="loadProtoJSON"]');
        Proto.style = this.saveStyleProto;
    }

    // ============================================================================
    // Opções do Boot do Phaser -> FPS
    // ============================================================================
    initializeFpsButtons() {

        // Loop de Inicialização
        this.fpsButtonIds.forEach(id => {
            const button = document.getElementById(id);
            if (button) {
                button.addEventListener('click', this.handleFpsButtonClick.bind(this, id));
                button.style.backgroundColor = 'gray';
            }
        });

        // Botão Padrão
        const baseLayer = document.getElementById(this.fpsButtonIds[1]);
        baseLayer.style.backgroundColor = '#007bff';
        this.config.fps.target = parseInt(document.getElementById(this.fpsButtonIds[1]).value);
    }

    handleFpsButtonClick(buttonId) {
    
        // Cores e frescura
        this.fpsButtonIds.forEach(id => {
            document.getElementById(id).style.backgroundColor = 'gray';
        });
        document.getElementById(buttonId).style.backgroundColor = '#007bff';
        
        this.config.fps.target = parseInt(document.getElementById(buttonId).value);
    }

    // ============================================================================
    // Opções do Boot do Phaser -> Render
    // ============================================================================
    initializeRenderButtons() {

        // Loop de Inicialização
        this.renderButtonIds.forEach(id => {
            const button = document.getElementById(id);
            if (button) {
                button.addEventListener('click', this.handleRenderButtonClick.bind(this, id));
                button.style.backgroundColor = 'gray';
            }
        });

        // Botão Padrão
        const baseLayer = document.getElementById(this.renderButtonIds[0]);
        baseLayer.style.backgroundColor = '#007bff';
        const render = parseInt(document.getElementById(this.renderButtonIds[0]).value);
        this.config.type =  render;
    }

    handleRenderButtonClick(buttonId) {
    
        // Cores e frescura
        this.renderButtonIds.forEach(id => {
            document.getElementById(id).style.backgroundColor = 'gray';
        });
        document.getElementById(buttonId).style.backgroundColor = '#007bff';
        
        const render = parseInt(document.getElementById(buttonId).value);
        this.config.type =  render;
    }

    // ============================================================================
    // Opções do Boot do Phaser -> Orientation
    // ============================================================================
    initializeOrientationButtons() {

        // Loop de Inicialização
        this.orientationButtonIds.forEach(id => {
            const button = document.getElementById(id);
            if (button) {
                button.addEventListener('click', this.handleOrientationButtonClick.bind(this, id));
                button.style.backgroundColor = 'gray';
            }
        });

        // Botão Padrão
        const baseLayer = document.getElementById(this.orientationButtonIds[0]);
        baseLayer.style.backgroundColor = '#007bff';
        this.orientation = document.getElementById(this.orientationButtonIds[0]).value;       
    }

    handleOrientationButtonClick(buttonId) {
    
        // Cores e frescura
        this.orientationButtonIds.forEach(id => {
            document.getElementById(id).style.backgroundColor = 'gray';
        });
        document.getElementById(buttonId).style.backgroundColor = '#007bff';
        
        this.orientation = document.getElementById(buttonId).value;
    }

    // ============================================================================
    // Data obj.
    // ============================================================================

    protoObjectZone() {
        const obj = {
            width: 0,
            height: 0,
            scaleX: 1,
            scaleY: 1,
            centerX: 0.5,
            centerY: 0.5,
            alpha: 1,
            rotation: 0,
            visible: true,
            pinned: false,
            frameX: 1,
            frameY: 1
        };
        return JSON.stringify(obj, null, 3);
    }

    protoObjectPath() {
        const obj = {
            p1: [0, 0],
            scaleX: 1,
            scaleY: 1,
            alpha: 1,
            rotation: 0,
            visible: true,
            pinned: false,
        };
        return JSON.stringify(obj, null, 3);
    }
}
