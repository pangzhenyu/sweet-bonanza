export const GameConfig = {
  // Game dimensions (16:9 aspect ratio)
  GAME_WIDTH: 1280,
  GAME_HEIGHT: 720,

  // Reel configuration
  REEL_WIDTH: 160,
  REEL_HEIGHT: 120,
  REELS: 6,
  ROWS: 5,
  SYMBOL_SIZE: 120,

  // Game mechanics
  RTP: 96.48, // Return to player percentage
  VOLATILITY: "HIGH", // Game volatility

  // Spin settings
  SPIN_DURATION: 1.5, // seconds
  TUMBLE_DURATION: 0.5, // seconds
  MIN_BET: 0.20,
  MAX_BET: 100,
  MAX_WIN_MULTIPLIER: 21100, // Maximum win multiplier

  // Bonus features
  FREE_SPINS_TRIGGER_COUNT: 4, // Number of scatter symbols to trigger free spins
  FREE_SPINS_COUNT: 10, // Starting number of free spins
  FREE_SPINS_RETRIGGER_COUNT: 3, // Number of scatters to retrigger free spins
  RETRIGGER_SPINS: 5, // Additional free spins on retrigger

  // Multiplier settings
  MIN_MULTIPLIER: 2,
  MAX_MULTIPLIER: 100,

  // Symbol pay table multipliers (for 8 or more matching symbols)
  SYMBOL_PAYS: {
    RED_HEART: [5, 10, 25, 50], // Pay for 8, 12, 15, 20+ symbols
    BLUE_CANDY: [4, 8, 20, 40],
    GREEN_CANDY: [3, 6, 15, 30],
    PURPLE_CANDY: [2.5, 5, 12, 25],
    PLUM: [1.5, 4, 10, 20],
    WATERMELON: [1.25, 3, 8, 15],
    APPLE: [1, 2.5, 7, 12],
    GRAPE: [0.8, 2, 6, 10],
    BANANA: [0.5, 1.5, 5, 8],
  },

  // Special symbols
  SPECIAL_SYMBOLS: {
    SCATTER: "LOLLIPOP",
    MULTIPLIER: "BOMB",
  }
} as const;

// Minimum number of symbols required for a win
export const MIN_SYMBOLS_TO_WIN = 8;

// Breakpoints for higher symbol count payouts
export const SYMBOL_COUNT_BREAKPOINTS = [8, 12, 15, 20];

// Bet levels
export const BET_LEVELS = [
  0.20, 0.40, 0.60, 0.80, 1, 2, 3, 4, 5, 10, 15, 20, 25, 50, 75, 100
];
