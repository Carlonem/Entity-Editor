
# Entity Editor - EE 

<div align="justify">

**Preliminary Testing Notice**


If you are viewing this repository by any chance, <del>please do not share it publicly yet</del>. This project is currently set up for preliminary testing and is not ready for public release. However, since you are here, feel free to explore and make yourself at home! 


**Testing Phase**
  
  This repository is in its early stages and undergoing active development and testing. Features and functionality are subject to change.

**Feedback Welcome**

  While the project is not ready for widespread sharing, we welcome any feedback you may have. Your insights can help improve the project during this critical phase.

Thank you for your understanding and cooperation!



## Entity Editor for Phaser

This project is an entity editor built using Phaser. It provides a flexible interface to create and manage entities within a canvas. Below are the main functionalities and features of the project.

This editor was created primarily for rapid prototyping of strategy games, faux 3D games (PS1 pre-render style), and pre-rendered scenes. It is not intended for creating the games themselves, but for generating the .json files that they consume.

Note that the generated file contains a base64 image for each entity. The purpose of this is to use images as prototypes and avoid using graphics and images simultaneously during development.

New tabs will be added soon, with new features, including the addition of animation states and the replacement of prototype images with appropriate images, as well as an entity manager.

The current output format is not directly compatible with Phaser.io, but a standard export function will be added soon.

####  Additional
This application is intentionally designed to be distributed and used as a PWA. Installation is recommended. The application operates 100% offline and does not communicate with any external servers or store user data.


### Main Features

#### Canvas Configuration
- **Canvas Size and Unit Cell Selection**: Choose values that match the resolution of your game's screen. Think of this directly as your game's screen.
- **Load Background**: Load a custom background image. This is useful for transforming sketches into paths in the game.
- **Master FPS Control**: Set the FPS to 10, 15, 20, 30, or 60. Note: Lower values perform much better for the editor.
- **Render Options**: Switch between WebGL and Canvas rendering. 
- **Orientation Options**: Choose between Landscape and Portrait orientations.

#### Entity Management
- **Entity Properties**: 
  - Name: Unique object identifier. If left blank, a random name will be generated.
  - Type (Zone, Path): Entities are the objects in the game, and Paths help them move around
  - Cluster (color-coded options): Entities can be grouped together to form clusters.
- **Entity Data**: Editable JSON data for each entity. Any data can be added here, including custom properties and values specific to your game.

#### Entity Actions
- **Save and Delete Entities**: Save or delete the current entity.
- **Copy and Paste Entities**: Copy an entity to clipboard or paste from clipboard.
- **Move Entities**: Move entities forward or backward in the layer stack.

#### State Management
- **Save and Return State**: Mimics the save state functionality used in emulators. Opted for this over traditional undo/redo.
- **Save Slots**: Separate save states for each workspace.

#### Workspace Layers
- **Isolated Workspaces**: Multiple layers to manage entities separately. Each workspace has its own load and save functionality, allowing you to work on different projects or insstances without interference.
- **Fast Save and Load**: Quickly save and load the entire workspace.

    **Note:** Workspaces are completely separate, and projects are saved and loaded individually per workspace.

#### Canvas View Controls
- **Move View**: Navigate the canvas view (Up, Down, Left, Right). Think of this directly as your game's screen.
- **View Multiplier**: Adjust the view multiplier to accelerate or decelerate the canvas movement.
- **Reset View**: Reset the canvas view to its default state.

    **Note:**  When you see entities move in the grid, it's relative movement. The displayed area of the canvas is changing. Pinned entities move with the canvas, appearing stationary due to relative movement.

#### Background Options
- **Scale and Alpha**: Adjust the scale and transparency of the background.
- **Color Tint**: Apply a color tint to the background.

#### Grid Options
- **Visibility and Ratio**: Toggle grid visibility and set canvas ratio.
- **Line Width, Color, and Alpha**: Customize grid line properties.

#### Widget Options
- **Draggable Widgets**: Enable or disable draggable UI widgets.
- **Reset Layout**: Restore the original layout of the UI.

#### Data Input/Output
- **Save Project**: Export the current project to a JSON file.
- **Load Project**: Import a project from a JSON file.
- **Load Prototype Object**: Import prototype objects from a JSON file.

### Usage Instructions

1. **Setup**: Open `index.html` in your preferred browser. 

    **Local Run Warning:** You must run this PWA in `http://localhost:port/Entity-Editor/`

    If run in another path, it will conflict with the manifest;

2. **Canvas Setup**: Configure the canvas size, grid, and background as desired.
3. **Entity Management**: Create, modify, and manage entities using the provided UI.
4. **State and Workspace Management**: Utilize save slots and layers for complex projects.
5. **Export and Import**: Save your progress and load existing projects using JSON files.

---

### Current Development Tasks

**Version: Pre-Alpha: PA-S9 **

#### Pre-Boot:
- [x] Add Phaser config for FPS, WebGL and Canvas, and Screen Mode.
- [ ] Directly read grid size of an integer.

#### drawGrid():
- [x] View and change the rotation and scale center (red dot).
- [x] Skip drawing entities with `{"visible": false}` property.
- [x] Apply alpha property to entities.
- [x] Change frame resolution.
- [x] Move entities up and down.
- [x] Move the screen.
- [x] Handle fixed and movable elements.
- [x] Manage Path and Zone types.
- [ ] Skip drawing off-screen elements. -> ?
- [ ] Add orthographic, normal, and isometric cell types.
- [x] Refactor drawGrid function family.
- [x] Refactor: drawGridLines -> new Phaser Scene: GridLines.
- [ ] Add appropriate image view layer -> Entity Texture.
- [ ] Problem: selection square is too small with small grids.

#### UI:
- [x] Ensure `{"width": 0,"height": 0}` is multiple of grid size.
- [x] Add Copy and Paste buttons.
- [x] Add Undo and Redo buttons.
- [x] Add Save slots [1 ... 10].
- [x] Add more resolution options, line width, and ratio types.
- [x] Implement Fast Save and Load.
- [ ] Load appropriate image for entities <- Phaser texture.
- [x] Move UI elements.
- [ ] Add help information for UI elements.
- [ ] Add index.
- [ ] Add individual entity state for animations.
- [ ] Add workspace overlay instance <- Delicate change.

#### UI Visualization Options:
- [x] Toggle grid visibility.
- [x] Set grid ratio (16:9 or 4:3).
- [x] Control line style (width, color, alpha).
- [x] Control background properties (alpha, origin, scale).
- [ ] Change grid size after boot. <- ?
- [ ] Toggle info/Debug visibility.
- [ ] Fullscreen mode.
- [ ] Reload page.

#### Save and Load:
- [ ] Add metaData to Project.json file.
- [ ] Block load different gridSize to new gridSize.

#### Keyboard Controls:
- [ ] Implement keyboard controls.

#### Urgent:
- [x] Fix function performance issue in drawGridEntity().
- [x] Fix function performance issue in drawSelectionDot().
- [x] Fix function performance issue in drawGridLines().

#### Code Review:
- [ ] Code review PA-S9 -> A-S1 (1/n).
- [ ] ENTER: **Version: Alpha A-S1**

---

### Future Development

- [x] PWA build.
- [x] Multi-tab support, each tab as an iframe.
- [ ] Entity Viewer tab (Alpha S2).
- [ ] Entity Physics Editor tab (Alpha S3).
- [ ] Animation Editor tab (Alpha S4).
- [ ] Tile to Entity Editor tab (Alpha S5).
- [ ] Phaser game viewer tab (Alpha S6).

#### Phaser Atlas Exporter:
- Export multi-resolution atlas.
- Full Phaser compatibility for atlas.

---

## GNU AFFERO GENERAL PUBLIC LICENSE

    This file is part of Entity Editor - EE.

    Entity Editor - EE is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    any later version.

    Entity Editor - EE is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with Entity Editor - EE. If not, see <http://www.gnu.org/licenses/>.

    Author: Carlonem <carlonem.dev@gmail.com>


#### This project is currently in pre-alpha and is not recommended for production use.

</div>