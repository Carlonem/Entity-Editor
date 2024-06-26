# Entity Editor - EE 

## Entity Editor for Phaser

This project is an entity editor built using Phaser. It provides a flexible interface to create and manage entities within a canvas. Below are the main functionalities and features of the project.

This editor was created primarily for rapid prototyping of strategy games, faux 3D games (PS1 pre-render style), and motion graphics. It is not intended for creating the games themselves, but for generating the .json files that they consume.

Note that the generated file contains a base64 image for each entity. The purpose of this is to use images as prototypes and avoid using graphics and images simultaneously during development.

New tabs will be added soon, with new features, including the addition of animation states and the replacement of prototype images with appropriate images, as well as an entity manager.

The current output format is not directly compatible with Phaser.io, but a standard export function will be added soon.

####  Additional
This application is intentionally designed to be distributed and used as a PWA. Installation is recommended. The application operates 100% offline and does not communicate with any external servers or store user data.


### Main Features

#### Canvas Configuration
- **Canvas Size and Unit Cell Selection**: Allows choosing from various resolutions and grid sizes.
- **Load Background**: Load a custom background image.
- **Master FPS Control**: Set the FPS to 10, 15, 20, 30, or 60.
- **Render Options**: Switch between WebGL and Canvas rendering.
- **Orientation Options**: Choose between Landscape and Portrait orientations.

#### Entity Management
- **Entity Properties**: 
  - Name
  - Type (Zone, Path)
  - Cluster (color-coded options)
- **Entity Data**: Editable JSON data for each entity.

#### Entity Actions
- **Save and Delete Entities**: Save or delete the current entity.
- **Copy and Paste Entities**: Copy an entity to clipboard or paste from clipboard.
- **Move Entities**: Move entities forward or backward in the layer stack.

#### State Management
- **Save and Return State**: Mimics the save state functionality used in emulators. Opted for this over traditional undo/redo.
- **Save Slots**: Separate save states for each workspace.

#### Workspace Layers
- **Isolated Workspaces**: Multiple layers to manage entities separately.
- **Fast Save and Load**: Quickly save and load the entire workspace.

Note: Workspaces are completely separate, and projects are saved and loaded individually per workspace.

#### Canvas View Controls
- **Move View**: Navigate the canvas view (Up, Down, Left, Right).
- **View Multiplier**: Adjust the view multiplier for precision.
- **Reset View**: Reset the canvas view to its default state.

Note: When you see entities move in the grid, it's relative movement. The displayed area of the canvas is changing. Pinned entities move with the canvas, appearing stationary due to relative movement.

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

### Usage

1. **Setup**: Open `index.html` in your preferred browser.
2. **Canvas Setup**: Configure the canvas size, grid, and background as desired.
3. **Entity Management**: Create, modify, and manage entities using the provided UI.
4. **State and Workspace Management**: Utilize save slots and layers for complex projects.
5. **Export and Import**: Save your progress and load existing projects using JSON files.

---

### Current Development Tasks

**Version: Pre-Alpha: PA-S9 **

#### Pre-Boot:
- [x] Add Phaser config for FPS, WebGL and Canvas, and Screen Mode.

#### drawGrid():
- [x] View and change the rotation and scale center (red dot).
- [x] Skip drawing entities with `{"visible": false}` property.
- [x] Apply alpha property to entities.
- [x] Change frame resolution.
- [x] Move entities up and down.
- [x] Move the screen.
- [x] Handle fixed and movable elements.
- [x] Manage Path and Zone types.
- [ ] Skip drawing off-screen elements -> ?
- [ ] Add orthographic, normal, and isometric cell types.
- [x] Refactor drawGrid function family.
- [ ] Refactor: drawGridLines -> save and restore canvas state.
- [ ] Add appropriate image view layer -> Entity Texture.

#### UI:
- [x] Ensure `{"width": 0,"height": 0}` is multiple of grid size.
- [x] Add Copy and Paste buttons.
- [x] Add Undo and Redo buttons.
- [x] Add Save slots [1 ... 10].
- [x] Add more resolution options, line width, and ratio types.
- [x] Implement Fast Save and Load.
- [ ] Load appropriate image for entities.
- [x] Move UI elements.
- [ ] Add help information for UI elements.
- [ ] Add index.
- [ ] Add individual entity state animations.

#### UI Visualization Options:
- [x] Toggle grid visibility.
- [x] Set grid ratio (16:9 or 4:3).
- [x] Control line style (width, color, alpha).
- [x] Control background properties (alpha, origin, scale).
- [ ] Toggle info/Debug visibility.
- [ ] Fullscreen mode.
- [ ] Reload page.

#### Keyboard Controls:
- [ ] Implement keyboard controls.

#### Code Review:
- [ ] Code review PA-S9 -> A-S1.
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