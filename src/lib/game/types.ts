// Symbol types
export type SymbolType =
  | 'RED_HEART'
  | 'BLUE_CANDY'
  | 'GREEN_CANDY'
  | 'PURPLE_CANDY'
  | 'PLUM'
  | 'WATERMELON'
  | 'APPLE'
  | 'GRAPE'
  | 'BANANA'
  | 'LOLLIPOP'  // Scatter
  | 'BOMB';     // Multiplier

// Game scene names
export type SceneName =
  | 'loading'
  | 'main'
  | 'freespins';

// Win data
export interface WinData {
  symbolType: SymbolType;
  positions: { row: number; col: number }[];
  count: number;
  multiplier: number;
  winAmount: number;
}

// Animation types
export type AnimationType =
  | 'spin'
  | 'tumble'
  | 'win'
  | 'bigWin'
  | 'megaWin'
  | 'gigaWin'
  | 'scatterWin'
  | 'multiplierReveal';

// Button states
export type ButtonState =
  | 'enabled'
  | 'disabled'
  | 'hidden';

// Game states
export type GameStateType =
  | 'idle'
  | 'spinning'
  | 'tumbling'
  | 'evaluating'
  | 'showingWins'
  | 'freeSpinIntro'
  | 'freeSpinOutro';

// Asset definitions
export interface AssetDefinition {
  name: string;
  url: string;
}

// Symbol to image mapping
export const SYMBOL_IMAGES: Record<SymbolType, string> = {
  RED_HEART: 'red_heart.png',
  BLUE_CANDY: 'blue_candy.png',
  GREEN_CANDY: 'green_candy.png',
  PURPLE_CANDY: 'purple_candy.png',
  PLUM: 'plum.png',
  WATERMELON: 'watermelon.png',
  APPLE: 'apple.png',
  GRAPE: 'grape.png',
  BANANA: 'banana.png',
  LOLLIPOP: 'lollipop.png',
  BOMB: 'bomb.png'
};
