# Sweet Bonanza Clone

A clone of Pragmatic Play's popular "Sweet Bonanza" slot game. This project is a web-based implementation using Next.js, PixiJS for rendering, and TypeScript.

## Features

- **Game Mechanics**: Fully implemented "tumbling reels" mechanic where winning symbols disappear and new ones fall in
- **Scatter Pays**: Symbols pay anywhere on the screen, regardless of adjacency
- **Free Spins**: Triggerable free spins feature with multiplier bombs
- **Buy Feature**: Option to buy directly into the free spins feature
- **Mobile-Friendly**: Responsive design that works on desktop and mobile devices
- **Authentic Gameplay**: Matches the original game's RTP (96.48%) and volatile math model

## Game Mathematics

- **RTP**: 96.48%
- **Volatility**: High
- **Max Win Multiplier**: 21,100x
- **Layout**: 6 reels, 5 rows
- **Minimum Bet**: 0.20
- **Maximum Bet**: 100

## Technologies Used

- **Next.js**: React framework for the app shell
- **PixiJS**: Canvas-based WebGL renderer for game graphics
- **TypeScript**: For type-safe code
- **GSAP**: For smooth animations
- **TailwindCSS**: For UI styling
- **HowlerJS**: For sound management

## Development

### Prerequisites

- Node.js 18+ or Bun

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/sweet-bonanza-clone.git

# Navigate to the project directory
cd sweet-bonanza-clone

# Install dependencies with npm
npm install

# Or with Bun (recommended)
bun install
```

### Running the Development Server

```bash
# With npm
npm run dev

# With Bun
bun run dev
```

The development server will start at http://localhost:3000.

### Asset Generation

Visit http://localhost:3000/assets to generate placeholder assets for the game. You can:

1. Generate placeholder symbol images
2. Generate placeholder UI elements
3. Generate placeholder backgrounds

## Implementation Details

### Game Core Architecture

The game follows a component-based architecture:

- **GameState**: Manages the central game state
- **SceneManager**: Handles different game scenes
- **Mechanics**: Contains the game logic for symbol evaluation, tumbling, etc.
- **Renderer**: PixiJS-based rendering of game elements

### Game Flow

1. **Initialization**: Load assets and set up game state
2. **Spin**: Player places a bet and triggers a spin
3. **Evaluation**: Check for winning combinations
4. **Tumbling**: Remove winning symbols and add new ones
5. **Re-evaluation**: Continue checking for wins until no more are found
6. **Feature Triggers**: Check for scatter symbols to trigger free spins

## Legal Disclaimer

This project is created for educational purposes only. It's a non-commercial clone to demonstrate web game development techniques. All Pragmatic Play's "Sweet Bonanza" intellectual properties belong to their respective owners.

## License

MIT
