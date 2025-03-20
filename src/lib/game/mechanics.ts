import { GameConfig, MIN_SYMBOLS_TO_WIN, SYMBOL_COUNT_BREAKPOINTS } from "./config";
import { GameState } from "./state";
import { SymbolType, WinData } from "./types";

/**
 * Count occurrences of each symbol on the reels
 */
export function countSymbols(reelSymbols: SymbolType[][]): Map<SymbolType, { count: number; positions: { row: number; col: number }[] }> {
  const counts = new Map<SymbolType, { count: number; positions: { row: number; col: number }[] }>();

  // Initialize counts for all symbols
  for (let i = 0; i < GameConfig.REELS; i++) {
    for (let j = 0; j < GameConfig.ROWS; j++) {
      const symbol = reelSymbols[i][j];

      if (!counts.has(symbol)) {
        counts.set(symbol, { count: 0, positions: [] });
      }

      const data = counts.get(symbol)!;
      data.count++;
      data.positions.push({ row: j, col: i });
    }
  }

  return counts;
}

/**
 * Get payout multiplier for a symbol based on count
 */
export function getSymbolMultiplier(symbol: SymbolType, count: number): number {
  // Handle special symbols
  if (symbol === GameConfig.SPECIAL_SYMBOLS.SCATTER || symbol === GameConfig.SPECIAL_SYMBOLS.MULTIPLIER) {
    return 0; // Scatter and multiplier don't pay on their own
  }

  // Get the pay table for this symbol
  const payTable = GameConfig.SYMBOL_PAYS[symbol as keyof typeof GameConfig.SYMBOL_PAYS];

  if (!payTable) {
    return 0; // Symbol not in pay table
  }

  // If fewer than minimum required symbols, no win
  if (count < MIN_SYMBOLS_TO_WIN) {
    return 0;
  }

  // Find the appropriate multiplier based on count
  for (let i = SYMBOL_COUNT_BREAKPOINTS.length - 1; i >= 0; i--) {
    if (count >= SYMBOL_COUNT_BREAKPOINTS[i]) {
      return payTable[i];
    }
  }

  return 0;
}

/**
 * Evaluate wins on the current reels
 */
export function evaluateWins(gameState: GameState): WinData[] {
  const wins: WinData[] = [];

  // Count all symbols
  const counts = countSymbols(gameState.reelSymbols);

  // Check each symbol for wins
  counts.forEach((data, symbol) => {
    // Skip special symbols for normal wins
    if (symbol === GameConfig.SPECIAL_SYMBOLS.SCATTER || symbol === GameConfig.SPECIAL_SYMBOLS.MULTIPLIER) {
      return;
    }

    const multiplier = getSymbolMultiplier(symbol, data.count);

    if (multiplier > 0) {
      // We have a win!
      const winAmount = gameState.currentBet * multiplier * gameState.currentMultiplier;

      wins.push({
        symbolType: symbol,
        positions: data.positions,
        count: data.count,
        multiplier: multiplier,
        winAmount: winAmount
      });
    }
  });

  return wins;
}

/**
 * Check for scatter wins (free spins trigger)
 */
export function checkScatterWin(gameState: GameState): boolean {
  const counts = countSymbols(gameState.reelSymbols);
  const scatterData = counts.get(GameConfig.SPECIAL_SYMBOLS.SCATTER as SymbolType);

  if (!scatterData) {
    return false;
  }

  // Check if enough scatters for free spins trigger
  return scatterData.count >= GameConfig.FREE_SPINS_TRIGGER_COUNT;
}

/**
 * Find symbols to remove after a win
 */
export function getSymbolsToRemove(wins: WinData[]): { row: number; col: number }[] {
  const positions: { row: number; col: number }[] = [];

  // Collect all winning positions
  for (const win of wins) {
    for (const pos of win.positions) {
      // Check if position is already in the list
      const exists = positions.some(p => p.row === pos.row && p.col === pos.col);

      if (!exists) {
        positions.push(pos);
      }
    }
  }

  return positions;
}

/**
 * Fill empty positions with new symbols
 */
export function fillEmptyPositions(gameState: GameState, removedPositions: { row: number; col: number }[]): void {
  // Group positions by column
  const columnPositions = new Map<number, number[]>();

  for (const pos of removedPositions) {
    if (!columnPositions.has(pos.col)) {
      columnPositions.set(pos.col, []);
    }

    columnPositions.get(pos.col)!.push(pos.row);
  }

  // Process each column
  columnPositions.forEach((rows, col) => {
    // Sort rows to process from bottom to top
    rows.sort((a, b) => b - a);

    // Shift down symbols above removed positions
    for (const row of rows) {
      // Move all symbols above this row down by one
      for (let r = row; r > 0; r--) {
        gameState.reelSymbols[col][r] = gameState.reelSymbols[col][r - 1];
      }

      // Add new random symbol at the top
      gameState.reelSymbols[col][0] = gameState.isFreeSpin
        ? gameState.getRandomFreeSpinSymbol()
        : gameState.getRandomSymbol();
    }
  });
}

/**
 * Collect multipliers from the grid
 */
export function collectMultipliers(gameState: GameState, removedPositions: { row: number; col: number }[]): number[] {
  const multipliers: number[] = [];

  // Check if we're removing any multiplier bombs
  for (const pos of removedPositions) {
    if (gameState.reelSymbols[pos.col][pos.row] === GameConfig.SPECIAL_SYMBOLS.MULTIPLIER as SymbolType) {
      // Generate and save a random multiplier
      const multiplier = gameState.getRandomMultiplier();
      multipliers.push(multiplier);
    }
  }

  return multipliers;
}

/**
 * Get the total win amount from a set of wins
 */
export function getTotalWinAmount(wins: WinData[]): number {
  return wins.reduce((total, win) => total + win.winAmount, 0);
}
