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
// mainScene
// ============================================================================
export class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
        this.gridSize;
        this.gridData = {};
        this.selectedGridKey = null;
        this.selectedName = null;
        this.coin = true;
        this.activeGrid = false;

        this.newEntityData = '';
        this.usedProtpEntityData = '';

        this.buttonIds = [
            'layer-one', 'layer-two', 'layer-three', 'layer-four', 'layer-five',
            'layer-six', 'layer-seven', 'layer-eight', 'layer-nine', 'layer-ten'
        ];
        this.copyButtonIds = [
            'c0', 'c1', 'c2', 'c3', 'c4',  // 'c5', 'c6', 'c7', 'c8', 'c9'
        ];
        this.stateButtonIds = [
            's0', 's1', 's2', 's3', 's4',   // 's5', 's6', 's7', 's8', 's9'
        ];
        this.gridDataHolder = {};
        this.gridDataOld = {};

        // Workspace Zone
        this.currentWorkspace = '';
        this.currentCopyIslot = '';
        this.currentStateIslot = '';

        this.lineWidth = [0.5, 1.0, 1.5, 2.0, 2.5];
        this.lineColor = ['0xffffff', '0xE2A3AD', '0xBAF4B4', '0xF3F4B4', '0xD9B4F4'];
        this.lineAlpha = [0.1, 0.3, 0.5, 0.7, 0.9];

        this.resolution = document.getElementById('canvas-resolution');
        this.resolutionData = this.resolution.value.split('x');
        this.currentLineInfo = [this.resolutionData[3], this.resolutionData[4], this.resolutionData[5]];

        // Novo estado de arraste
        this.isDragging = false;
        this.copyDataValue = {};
        this.copyEntityValue = {};
        this.copyRalEntityValue = {};
        this.saveEntityInfoState = {};

        // Posição inicial da área visíve
        this.viewPosition = {};
        this.moveViewMultiplierIndex = 0;
        this.moveViewMultiplierList = [1, 5, 10, 15, 20, 30, 40];

    }

    //  ============================================================================
    //  Phaser Scene 
    //  ============================================================================
    preload() {

    }

    create() {
        this.gridSize = parseInt(this.game.cellSize);
        this.graphics = this.add.graphics();
        //this.newEntityData = this.game.entityData.zone;

        const initialRealType = document.getElementById('entity-real-type').value;
        this.setEntityRealType(initialRealType);

        this.input.on('pointerdown', this.handlePointerDown, this);
        this.input.on('pointermove', this.handlePointerMove, this);
        this.input.on('pointerup', this.handlePointerUp, this);

        // Set up UI event listeners
        document.getElementById('entity-type').addEventListener('change', this.handleEntityTypeChange.bind(this));
        document.getElementById('load').addEventListener('change', this.loadGrid.bind(this));
        document.getElementById('loadProtoJSON').addEventListener('change', this.loadPrototype.bind(this));

        // Real Type Change
        document.getElementById('entity-real-type').addEventListener('change', this.handleEntityRealTypeChange.bind(this));

        // Save and Delet no Obj
        document.getElementById('save-entity').addEventListener('click', this.saveEntityData.bind(this));
        document.getElementById('delete-entity').addEventListener('click', this.deleteSelectedKey.bind(this));
        document.getElementById('save').addEventListener('click', this.saveGrid.bind(this));

        // Copy and Paste
        document.getElementById('copy-entity').addEventListener('click', this.copyEntity.bind(this));
        document.getElementById('paste-entity').addEventListener('click', this.pasteEntity.bind(this));

        // Save State
        document.getElementById('save-state').addEventListener('click', this.saveState.bind(this));
        document.getElementById('return-state').addEventListener('click', this.returnState.bind(this));

        // Fast Save
        document.getElementById('fast-save').addEventListener('click', this.fastSaveGrid.bind(this));
        document.getElementById('fast-load').addEventListener('click', this.fastLoadGrid.bind(this));

        // Move Entity Key in gridData()
        document.getElementById('move-up-entity').addEventListener('click', this.moveKeyUp.bind(this));
        document.getElementById('move-down-entity').addEventListener('click', this.moveKeyDown.bind(this));

        // Move View
        document.getElementById('move-view-up').addEventListener('click', this.moveView.bind(this, 'up'));
        document.getElementById('move-view-down').addEventListener('click', this.moveView.bind(this, 'down'));
        document.getElementById('move-view-left').addEventListener('click', this.moveView.bind(this, 'left'));
        document.getElementById('move-view-right').addEventListener('click', this.moveView.bind(this, 'right'));
        document.getElementById('move-view-reset').addEventListener('click', this.moveView.bind(this, 'reset'));
        document.getElementById('move-view-multiplier').addEventListener('click', this.moveViewMultiplier.bind(this));

        // Frescura
        document.getElementById('grid-visibility').addEventListener('click', this.changeGridVisibilite.bind(this));
        document.getElementById('line-width').addEventListener('click', this.lineWidthButton.bind(this));
        document.getElementById('line-color').addEventListener('click', this.lineColorButton.bind(this));
        document.getElementById('line-alpha').addEventListener('click', this.lineAlphaButton.bind(this));

        // Boot Scene!
        this.initializeButtons();
        this.initializeCopyIslotButtons();
        this.initializeStateIslotButtons();
        this.drawGrid();
        this.updateLineInfo();
        this.nullState(true)

        this.initCustomCamera();
    }

    update() {
        // this.coin = !this.coin;
        // if (this.coin) this.drawGrid();
    }

    initCustomCamera() {

    }

    //  ============================================================================
    //  Bloco de Eventos Relacionados ao Movimento do Canvas
    //  ============================================================================
    moveView(id) {
        this.moveViewCmd(id);

        // Info na Tela
        this.moveInfo();

        // Redesenhar a grade com a nova posição da área visível
        this.drawGrid();
        this.nullState(true);
    }

    moveInfo() {

        // Mudando Texto da Tela canvas-info {(0,0),(0,0)}
        const textData = document.getElementById('canvas-info');

        const pontA = this.viewPosition[this.currentWorkspace].x;
        const pontB = this.viewPosition[this.currentWorkspace].y;
        const pontC = pontA + this.game.config.width;
        const pontD = pontB + this.game.config.height;

        const newName = `{ (${pontA} , ${pontB}) , (${pontC} , ${pontD}) }`;
        textData.textContent = newName;
    }

    moveViewMultiplier() {

        // Força do Deslocamento
        this.moveViewMultiplierIndex >=
            this.moveViewMultiplierList.length - 1 ? this.moveViewMultiplierIndex = 0 : this.moveViewMultiplierIndex++;

        // Mudando Texto da Tela
        const data = document.getElementById('move-view-multiplier');
        const newName = `Multiplier (${this.moveViewMultiplierList[this.moveViewMultiplierIndex]}x)`;
        data.textContent = newName;
    }

    // Função para mover a área visível
    moveViewCmd(direction) {
        const step = this.gridSize;
        const multiplier = this.moveViewMultiplierList[this.moveViewMultiplierIndex];
        switch (direction) {
            case 'up':
                this.viewPosition[this.currentWorkspace].y -= multiplier * step;
                break;
            case 'down':
                this.viewPosition[this.currentWorkspace].y += multiplier * step;
                break;
            case 'left':
                this.viewPosition[this.currentWorkspace].x -= multiplier * step;
                break;
            case 'right':
                this.viewPosition[this.currentWorkspace].x += multiplier * step;
                break;
            case 'reset':
                this.viewPosition[this.currentWorkspace] = { x: 0, y: 0 };
                break;
            default:
                console.error("Invalid direction. Use 'up', 'down', 'left', or 'right'.");
                return;
        }
        this.repositionPinnedEntities();
    }

    repositionPinnedEntities() {
        const offsetX = this.viewPosition[this.currentWorkspace].x;
        const offsetY = this.viewPosition[this.currentWorkspace].y;

        //console.log(this.viewPosition)

        Object.values(this.gridData).forEach(entity => {
            if (entity.data.pinned) {

                // Reposicionando a entidade
                entity.data.x = entity.data.originalX + offsetX;
                entity.data.y = entity.data.originalY + offsetY;
            }
        });
    }

    //  ============================================================================
    //  Bloco de Eventos Relacionados ao Movimento das keys de GridData
    //  ============================================================================
    moveKeyUp() {

        if (this.selectedName && this.gridData[this.selectedName]) {
            const keys = Object.keys(this.gridData);
            const index = keys.indexOf(this.selectedName);

            if (index > 0) {
                const newKeys = [
                    ...keys.slice(0, index - 1),
                    keys[index],
                    keys[index - 1],
                    ...keys.slice(index + 1)
                ];

                const newGridData = {};
                newKeys.forEach(key => {
                    newGridData[key] = this.gridData[key];
                });

                this.gridData = newGridData;
                this.drawGrid();
            }
        }
    }

    moveKeyDown() {

        if (this.selectedName && this.gridData[this.selectedName]) {
            const keys = Object.keys(this.gridData);
            const index = keys.indexOf(this.selectedName);

            if (index < keys.length - 1) {
                const newKeys = [
                    ...keys.slice(0, index),
                    keys[index + 1],
                    keys[index],
                    ...keys.slice(index + 2)
                ];

                const newGridData = {};
                newKeys.forEach(key => {
                    newGridData[key] = this.gridData[key];
                });

                this.gridData = newGridData;
                this.drawGrid();
            }
        }
    }

    //  ============================================================================
    //  Bloco de Eventos Relacionados ao Copy and Paste
    //  ============================================================================
    initializeCopyIslotButtons() {

        // Loop de Inicialização
        this.copyButtonIds.forEach(id => {
            const button = document.getElementById(id);
            if (button) {
                button.addEventListener('click', this.copIslotEvent.bind(this, id));
                button.style.backgroundColor = 'gray';
                this.copyDataValue[id] = this.newEntityData;
                this.copyEntityValue[id] = '0x00FFFF';
            }
        });

        // Botão Padrão de Camada da Grdi
        const baseLayer = document.getElementById(this.copyButtonIds[0]);
        baseLayer.style.backgroundColor = '#007bff';
        this.currentCopyIslot = this.copyButtonIds[0];
    }

    copIslotEvent(buttonId) {

        // Mudando Copy Slot
        this.currentCopyIslot = buttonId;

        // Cores e frescura
        this.copyButtonIds.forEach(id => {
            document.getElementById(id).style.backgroundColor = 'gray';
        });
        document.getElementById(buttonId).style.backgroundColor = '#007bff';
    }

    copyEntity() {
        this.copyDataValue[this.currentCopyIslot] = document.getElementById('entity-data').value;
        this.copyEntityValue[this.currentCopyIslot] = document.getElementById('entity-type').value;
        this.copyRalEntityValue[this.currentCopyIslot] = document.getElementById('entity-real-type').value;

    }

    pasteEntity() {
        document.getElementById('entity-data').value = this.copyDataValue[this.currentCopyIslot];
        document.getElementById('entity-type').value = this.copyEntityValue[this.currentCopyIslot];
        document.getElementById('entity-real-type').value = this.copyRalEntityValue[this.currentCopyIslot];
        this.setEntityRealType(this.copyRalEntityValue[this.currentCopyIslot]);

        // Mostrando o Que Foi Copiado Na Tela
        this.saveEntityData();
    }


    //  ============================================================================
    //  Bloco de Eventos Relacionados ao Save State
    //  ============================================================================
    initializeStateIslotButtons() {

        // Loop de Inicialização
        this.stateButtonIds.forEach(id => {
            const button = document.getElementById(id);
            if (button) {
                button.addEventListener('click', this.stateIslotEvent.bind(this, id));
                button.style.backgroundColor = 'gray';
                //this.copyDataValue[id] = this.newEntityData;
                //this.copyEntityValue[id] = '0x00FFFF';
            }
        });

        // Botão Padrão de Camada da Grdi
        const baseLayer = document.getElementById(this.stateButtonIds[0]);
        baseLayer.style.backgroundColor = '#007bff';
        this.currentStateIslot = this.stateButtonIds[0];
    }

    stateIslotEvent(buttonId) {

        // Mudando Copy Slot
        this.currentStateIslot = buttonId;

        // Cores e frescura
        this.stateButtonIds.forEach(id => {
            document.getElementById(id).style.backgroundColor = 'gray';
        });
        document.getElementById(buttonId).style.backgroundColor = '#007bff';
    }

    saveState() {

        // Salvando Dados por Workspace
        this.gridDataOld[this.currentWorkspace][this.currentStateIslot] = JSON.parse(JSON.stringify(this.gridData));

        // Atualizando a Tela
        this.nullState(true);
        this.drawGrid();
    }

    returnState() {

        if (this.gridDataOld[this.currentWorkspace][this.currentStateIslot]) {

            // Retornando Dados por Workspace
            this.gridData = JSON.parse(JSON.stringify(this.gridDataOld[this.currentWorkspace][this.currentStateIslot]));

            // Atualizando a Tela
            this.nullState(true);
            this.drawGrid();
        }
    }


    //  ============================================================================
    //  Bloco de Eventos Relacionados aos Workspaces
    //  ============================================================================
    initializeButtons() {

        // Loop de Inicialização
        this.buttonIds.forEach(id => {
            const button = document.getElementById(id);
            if (button) {
                button.addEventListener('click', this.handleButtonClick.bind(this, id));
                button.style.backgroundColor = 'gray';
                this.gridDataHolder[id] = {};
                this.gridDataOld[id] = {};
                this.viewPosition[id] = { x: 0, y: 0 };
            }
        });

        // Botão Padrão de Camada da Grdi
        const baseLayer = document.getElementById(this.buttonIds[0]);
        baseLayer.style.backgroundColor = '#007bff';
        this.currentWorkspace = this.buttonIds[0];
    }

    handleButtonClick(buttonId) {
        // console.log(`Button with ID ${buttonId} was clicked.`);

        // Salvando Workspace Atual
        this.gridDataHolder[this.currentWorkspace] = this.gridData;

        // Novo Workspace
        this.currentWorkspace = buttonId;
        this.gridData = this.gridDataHolder[this.currentWorkspace];

        // Voltando Estado Original
        this.nullState(true);

        // Cores e frescura
        this.buttonIds.forEach(id => {
            document.getElementById(id).style.backgroundColor = 'gray';
        });
        document.getElementById(buttonId).style.backgroundColor = '#007bff';

        // Info na Tela da Posição do Canvas
        this.moveInfo();

        // Atualizando a Tela
        this.drawGrid();
    }


    //  ============================================================================
    //  drawGrid => Main Function Of The Class
    //  ============================================================================
    drawGrid() {
        this.drawGridLines();
        this.drawGridEntity();
        this.drawSelectionDot();
    }

    drawGridLinesOld() {
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

        // Calcula o deslocamento baseado na posição da visualização
        const offsetX = this.viewPosition[this.currentWorkspace].x;
        const offsetY = this.viewPosition[this.currentWorkspace].y;

        // Desenhando a Grade
        for (let x = offsetX % this.gridSize; x < this.game.config.width; x += this.gridSize) {
            for (let y = offsetY % this.gridSize; y < this.game.config.height; y += this.gridSize) {
                this.graphics.fillStyle(0x000000, 0);
                this.graphics.fillRect(x, y, this.gridSize, this.gridSize);
                this.graphics.strokeRect(x, y, this.gridSize, this.gridSize);
            }
        }
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

        // Calcula o deslocamento baseado na posição da visualização
        const offsetX = this.viewPosition[this.currentWorkspace].x;
        const offsetY = this.viewPosition[this.currentWorkspace].y;

        // Desenhando a Grade
        for (let x = offsetX % this.gridSize; x < this.game.config.width; x += this.gridSize) {
            for (let y = offsetY % this.gridSize; y < this.game.config.height; y += this.gridSize) {
                this.graphics.fillStyle(0x000000, 0);
                this.graphics.fillRect(x, y, this.gridSize, this.gridSize);
                this.graphics.strokeRect(x, y, this.gridSize, this.gridSize);
            }
        }
    }

    drawGridEntity() {
        const offsetX = this.viewPosition[this.currentWorkspace].x;
        const offsetY = this.viewPosition[this.currentWorkspace].y;

        Object.values(this.gridData).forEach(entity => {
            // Resetar o estilo de linha antes de desenhar cada entidade
            this.graphics.lineStyle(0, 0x000000, 0);

            if (entity.drawType === 'zone') {
                this.drawZoneEntity(entity, offsetX, offsetY);
            } else if (entity.drawType === 'path') {
                this.drawPathEntity(entity, offsetX, offsetY);
            }
        });
    }

    drawZoneEntity(entity, offsetX, offsetY) {
        const x = entity.data.x - offsetX;
        const y = entity.data.y - offsetY;
        let width = entity.data.width;
        let height = entity.data.height;
        const rotation = entity.data.rotation || 0;
        const scaleX = entity.data.scaleX || 1;
        const scaleY = entity.data.scaleY || 1;
        const centerX = entity.data.centerX !== undefined ? entity.data.centerX : 0.5;
        const centerY = entity.data.centerY !== undefined ? entity.data.centerY : 0.5;
        const visible = entity.data.visible !== undefined ? entity.data.visible : true;
        const alpha = entity.data.alpha !== undefined ? entity.data.alpha : 1;
        const frameX = entity.data.frameX || 1;
        const frameY = entity.data.frameY || 1;

        width /= frameX;
        height /= frameY;

        const pivotX = x + centerX * width;
        const pivotY = y + centerY * height;

        if (visible) {
            this.graphics.save();
            this.graphics.translateCanvas(pivotX, pivotY);
            this.graphics.scaleCanvas(scaleX, scaleY);
            this.graphics.rotateCanvas(rotation);
            this.graphics.fillStyle(entity.type, alpha);
            this.graphics.fillRect(-centerX * width, -centerY * height, width, height);
            this.graphics.strokeRect(-centerX * width, -centerY * height, width, height);
            this.graphics.restore();
        }

        this.graphics.save();
        this.graphics.translateCanvas(pivotX, pivotY);
        this.graphics.fillStyle(0xff0000, 1);
        this.graphics.fillCircle(0, 0, 2);
        this.graphics.restore();
    }

    drawPathEntity(entity, offsetX, offsetY) {
        const x = entity.data.x;
        const y = entity.data.y;
        const rotation = entity.data.rotation || 0;
        const scaleX = entity.data.scaleX || 1;
        const scaleY = entity.data.scaleY || 1;
        const visible = entity.data.visible !== undefined ? entity.data.visible : true;
        const alpha = entity.data.alpha !== undefined ? entity.data.alpha : 1;
        const lineColor = entity.type;

        const pivotX = x;
        const pivotY = y;

        // Add the origin point p0
        entity.data.p0 = [pivotX, pivotY];

        if (visible) {
            this.graphics.save();

            // Translate to p0
            this.graphics.translateCanvas(pivotX - offsetX, pivotY - offsetY);
            this.graphics.scaleCanvas(scaleX, scaleY);
            this.graphics.rotateCanvas(rotation);
            this.graphics.lineStyle(2, lineColor, alpha);

            // Starting from p0, which is now [0, 0] after translation
            let prevPoint = [0, 0];
            Object.keys(entity.data).forEach(key => {
                if (key.startsWith('p') && key !== 'p0') {
                    const point = entity.data[key];

                    this.graphics.beginPath();
                    this.graphics.moveTo(prevPoint[0], prevPoint[1]);
                    this.graphics.lineTo(point[0], point[1]);
                    this.graphics.strokePath();

                    // Draw red point at current position
                    this.graphics.fillStyle(0xff0000, 1);
                    this.graphics.fillCircle(point[0], point[1], 2);

                    prevPoint = point;
                }
            });

            this.graphics.restore();
        }

        // Resetar o estilo de linha após desenhar cada caminho
        this.graphics.lineStyle(0, 0x000000, 0);
    }

    drawSelectionDot() {
        const offsetX = this.viewPosition[this.currentWorkspace].x;
        const offsetY = this.viewPosition[this.currentWorkspace].y;

        // Desenhando o quadrado de seleção (amarelo) e os quadrados vermelhos
        for (let x = offsetX % this.gridSize; x < this.game.config.width; x += this.gridSize) {
            for (let y = offsetY % this.gridSize; y < this.game.config.height; y += this.gridSize) {
                const key = `${x + offsetX},${y + offsetY}`;
                const isSelected = key === this.selectedGridKey;
                const entity = Object.values(this.gridData).find(entity => entity.data.x === x + offsetX && entity.data.y === y + offsetY);
                const hasData = entity;

                if (isSelected) {
                    this.graphics.fillStyle(0xffff99, 1);
                    this.graphics.fillRect(x, y, this.gridSize, this.gridSize);
                    this.graphics.strokeRect(x, y, this.gridSize, this.gridSize);
                }

                if (hasData && !isSelected) {
                    this.graphics.fillStyle(0xff0000, 1);
                    this.graphics.fillRect(entity.data.x - offsetX, entity.data.y - offsetY, this.gridSize, this.gridSize);
                    this.graphics.strokeRect(entity.data.x - offsetX, entity.data.y - offsetY, this.gridSize, this.gridSize);
                }
            }
        }
    }

    //  ============================================================================
    //  Lidando Com Eventos de Click
    //  ============================================================================
    handlePointerDown(pointer) {

        const gridX = Math.floor((pointer.x + this.viewPosition[this.currentWorkspace].x) / this.gridSize) * this.gridSize;
        const gridY = Math.floor((pointer.y + this.viewPosition[this.currentWorkspace].y) / this.gridSize) * this.gridSize;
        const key = `${gridX},${gridY}`;
        this.selectedGridKey = key;

        const entity = Object.values(this.gridData).find(entity => entity.data.x === gridX && entity.data.y === gridY);

        if (entity) {

            //  Atuando Sobre a Entidade Selecionada
            this.saveEntityInfoState = entity;
            this.inEntityInfoState(entity);

            // Começando a arrastar a Entidade
            this.isDragging = true;

        } else {

            // Aplicando estado Padrão
            this.nullState();
        }

        // Atualizando a Tela
        this.drawGrid();
    }

    handlePointerMove(pointer) {
        if (this.isDragging && this.selectedName) {
            const gridX = Math.floor((pointer.x + this.viewPosition[this.currentWorkspace].x) / this.gridSize) * this.gridSize;
            const gridY = Math.floor((pointer.y + this.viewPosition[this.currentWorkspace].y) / this.gridSize) * this.gridSize;

            const entity = this.gridData[this.selectedName];
            const pinned = entity.data.pinned;
            if (entity && !pinned) {
                entity.data.x = gridX;
                entity.data.y = gridY;

                // Pinned data
                entity.data.originalX = entity.data.x;
                entity.data.originalY = entity.data.y;

                // Atualizando a posição selecionada
                this.selectedGridKey = `${gridX},${gridY}`;
                this.drawGrid();
            }
        }
    }

    handlePointerUp(pointer) {
        if (this.isDragging) {
            this.isDragging = false;
            this.drawGrid();
            this.inEntityInfoState(this.saveEntityInfoState);
        }
    }


    inEntityInfoState(entity) {
        this.selectedName = entity.name;
        this.setEntityRealType(entity.drawType);
        document.getElementById('entity-name').value = this.selectedName;
        document.getElementById('entity-type').value = entity.type;
        document.getElementById('entity-real-type').value = entity.drawType;
        document.getElementById('entity-data').value = JSON.stringify(entity.data, null, 2);
    }

    nullState(full = false) {

        // Tela Limpa e Nada Selecionado
        this.selectedName = null;
        document.getElementById('entity-name').value = '';
        document.getElementById('entity-type').value = '0x00FFFF';
        document.getElementById('entity-data').value = this.newEntityData; //this.game.entityData;

        if (full) {
            this.selectedGridKey = null;
        }
    }

    handleEntityTypeChange(event) {
        if (this.selectedName) {
            this.gridData[this.selectedName] = this.gridData[this.selectedName] || { name: this.selectedName, type: 'empty', data: {} };
            this.gridData[this.selectedName].type = event.target.value;
        }

        //Atualizando a Tela
        this.drawGrid();
    }

    handleEntityRealTypeChange(event) {

        // Mudando Entre Zone e Path
        const type = event.target.value;
        this.setEntityRealType(type);
        this.nullState();
    }

    setEntityRealType(type) {

        // Aplicando Real Type
        this.newEntityData = this.game.entityData[type];
        this.usedProtpEntityData = type;
    }

    //  ============================================================================
    //  Principal Ação -> Salvar Entidade
    //  ============================================================================
    saveEntityData() {

        // Salvando Entidade no Obj
        if (this.selectedGridKey) {

            let entityName = document.getElementById('entity-name').value.trim();
            const fullObj = document.getElementById('entity-name');
            if (!entityName) {
                entityName = this.generateRandomString(13);
                fullObj.value = entityName;
            }

            try {
                const data = JSON.parse(document.getElementById('entity-data').value);
                const type = document.getElementById('entity-type').value;
                const drawType = this.usedProtpEntityData;

                // Safe Mode
                if (drawType == 'path') {
                    data.width = 0;
                    data.height = 0;
                }

                data.x = parseInt(this.selectedGridKey.split(',')[0]);
                data.y = parseInt(this.selectedGridKey.split(',')[1]);

                // Calculando o próximo múltiplo inteiro de gridSize para width
                if (data.width % this.gridSize !== 0) {
                    let oldVaue = data.width;
                    data.width = Math.ceil(data.width / this.gridSize) * this.gridSize;
                    console.log(`ERROR in width: ${oldVaue} -> ${data.width}`);
                }

                // Calculando o próximo múltiplo inteiro de gridSize para height
                if (data.height % this.gridSize !== 0) {
                    let oldVaue = data.height;
                    data.height = Math.ceil(data.height / this.gridSize) * this.gridSize;
                    console.log(`ERROR in height: ${oldVaue} -> ${data.height}`);
                }

                // Pinned data
                data.originalX = data.x;
                data.originalY = data.y;

                if (type !== 'empty' || Object.keys(data).length > 2) {
                    const imageUrl = this.createEntityImage(entityName, data.width, data.height, type);
                    this.gridData[entityName] = {
                        name: entityName,
                        type: type,
                        drawType: drawType,
                        data: data,
                        image: imageUrl
                    };
                } else {
                    delete this.gridData[entityName];
                }

                // Estado de Seleção Pós Entrada
                this.selectedName = entityName;
                document.getElementById('entity-data').value = JSON.stringify(data, null, 2);

            } catch (error) {
                console.error('Invalid JSON data');
                alert('Invalid JSON data');
            }
        }

        // Atualizando a Tela
        this.drawGrid();
    }

    generateRandomString(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        let result = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters[randomIndex];
        }
        return result;
    }

    deleteSelectedKey() {

        // Coletando Obj
        let entityName = document.getElementById('entity-name').value.trim();

        // Apagando key de Obj
        if (this.gridData[entityName]) delete this.gridData[entityName];

        //Atualizando a Tela
        this.drawGrid();
    }

    //  ============================================================================
    //  Load e Save Obj
    //  ============================================================================
    saveGrid() {
        const blob = new Blob([JSON.stringify(this.gridData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'project.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        //Atualizando a Tela
        this.drawGrid();
    }

    loadGrid(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.gridData = JSON.parse(e.target.result);

                //Atualizando a Tela
                this.drawGrid();

                // Reseta o valor do input para permitir carregar o mesmo arquivo novamente
                event.target.value = null;
            };
            reader.readAsText(file);
        }
    }

    fastSaveGrid() {
        // Salva os dados da grade no localStorage
        localStorage.setItem('gridData', JSON.stringify(this.gridData, null, 2));

        // Atualizando a Tela
        this.drawGrid();
    }

    fastLoadGrid() {
        // Carrega os dados da grade do localStorage
        const savedGridData = localStorage.getItem('gridData');
        if (savedGridData) {
            this.gridData = JSON.parse(savedGridData);

            // Atualizando a Tela
            this.drawGrid();
        }
    }

    loadPrototype(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.newEntityData = (e.target.result);

                // Atualizando a Tela
                this.drawGrid();

                // Reseta o valor do input para permitir carregar o mesmo arquivo novamente
                event.target.value = null;
            };
            reader.readAsText(file);
        }
    }

    createEntityImage(name, width, height, color) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = `#${color.substring(2)}`; //'#A9A9A9';
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 5;
        ctx.strokeRect(0, 0, width, height);

        const maxFontSize = Math.min(1.5 * width / name.length, 40);

        ctx.font = `${maxFontSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.strokeText(name, width / 2, height / 2);

        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(name, width / 2, height / 2);

        return canvas.toDataURL();
    }

    // Nova função para habilitar o arrasto de entidade
    enableEntityDragging() {
        this.input.on('pointerdown', this.handlePointerDown, this);
        this.input.on('pointermove', this.handlePointerMove, this);
        this.input.on('pointerup', this.handlePointerUp, this);
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
