# Try the game
[https://canvas-game-ebon.vercel.app/](https://canvas-game-ebon.vercel.app/)

# Game Documentation

## Introduction
This document provides an overview of the JavaScript game built using Next.js. The game allows players to navigate through different levels by moving around rooms, entering doors, and changing levels.

## Installation
1. Make sure you have Node.js and yarn installed on your system.
2. Clone the game repository.
3. Navigate to the project directory.
4. Run the following command to install dependencies: yarn
5. Start the development server: yarn dev
6. Open your browser and access the game at [http://localhost:3000](http://localhost:3000).

## Game Controls
- Use the arrow keys (up, down, left, right) to move the player character in the game world.
- Press the "arrow up" key to interact with doors and change levels.

## Game Structure
The game is organized into different levels, each represented by a separate room. Each room contains doors that lead to other levels.

### Level 1
- Description: This is the starting level where players begin their adventure.
- Doors:
- Door 1: Leads to Level 2.

### Level 2
- Description: Players progress to this level by entering Door 1 from Level 1.
- Doors:
- Door 1: Leads to Level 3.

### Level 3
- Description: Players progress to this level by entering Door 2 from Level 2.
- Doors:
- Door 1: Leads back to Level 1.

## Development Guidelines
- The game code is written in JavaScript using the Next.js framework.
- The main game logic is implemented in the `src/views/main-page-view/index.tsx` file.
- The game classes for levels, doors and player logic is implemented in the `src/views/main-page-view/helpers/classes` folder.
- The game assets, such as images and sounds, are stored in the `public/images` directory.

## Conclusion
This documentation provides an overview of the JavaScript game developed using Next.js. Players can navigate through different levels, enter doors, and change levels to progress in the game. For more detailed information, refer to the source code and comments within the project files.