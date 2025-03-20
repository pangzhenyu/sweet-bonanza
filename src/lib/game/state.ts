import { BET_LEVELS, GameConfig } from "./config";
import { SymbolType } from "./types";

export class GameState {
  // Player state
  public balance: number = 1000.0;
  public currentBet: number = GameConfig.MIN_BET;
  public betLevel: number = 0;
  public wins: number = 0;
  public totalWin: number = 0;

  // Game state
  public isSpinning: boolean = false;
  public isTumbling: boolean = false;
  public isFreeSpin: boolean = false;
  public freeSpinsLeft: number = 0;
  public freeSpinsWon: number = 0;
  public freeSpinsTotalWin: number = 0;
  public buyingFeature: boolean = false;

  // Reel state
  public reelSymbols: SymbolType[][] = [];
  public symbolsToRemove: { row: number; col: number }[] = [];
  public currentMultiplier: number = 1;
  public multipliers: number[] = [];

  constructor() {
    this.initializeReels();
  }

  /**
   * Initialize the reels with random symbols
   */
  public initializeReels(): void {
    this.reelSymbols = [];

    for (let i = 0; i < GameConfig.REELS; i++) {
      const column: SymbolType[] = [];

      for (let j = 0; j < GameConfig.ROWS; j++) {
        column.push(this.getRandomSymbol());
      }

      this.reelSymbols.push(column);
    }
  }

  /**
   * Get a random symbol (excludes special symbols)
   */
  public getRandomSymbol(): SymbolType {
    const symbols: SymbolType[] = [
      'RED_HEART',
      'BLUE_CANDY',
      'GREEN_CANDY',
      'PURPLE_CANDY',
      'PLUM',
      'WATERMELON',
      'APPLE',
      'GRAPE',
      'BANANA'
    ];

    // Small chance to get scatter
    if (Math.random() < 0.05) {
      return GameConfig.SPECIAL_SYMBOLS.SCATTER as SymbolType;
    }

    // Random regular symbol
    return symbols[Math.floor(Math.random() * symbols.length)];
  }

  /**
   * Get random symbol for free spins (includes multiplier symbol)
   */
  public getRandomFreeSpinSymbol(): SymbolType {
    const symbols: SymbolType[] = [
      'RED_HEART',
      'BLUE_CANDY',
      'GREEN_CANDY',
      'PURPLE_CANDY',
      'PLUM',
      'WATERMELON',
      'APPLE',
      'GRAPE',
      'BANANA'
    ];

    // Higher chance for multiplier bombs during free spins
    if (Math.random() < 0.1) {
      return GameConfig.SPECIAL_SYMBOLS.MULTIPLIER as SymbolType;
    }

    // Small chance to get scatter
    if (Math.random() < 0.05) {
      return GameConfig.SPECIAL_SYMBOLS.SCATTER as SymbolType;
    }

    // Random regular symbol
    return symbols[Math.floor(Math.random() * symbols.length)];
  }

  /**
   * Generate a random multiplier for the multiplier symbol
   */
  public getRandomMultiplier(): number {
    // Weighted distribution to favor lower multipliers
    const weights = [
      { value: 2, weight: 30 },
      { value: 3, weight: 25 },
      { value: 5, weight: 20 },
      { value: 10, weight: 15 },
      { value: 25, weight: 7 },
      { value: 50, weight: 2 },
      { value: 100, weight: 1 }
    ];

    const totalWeight = weights.reduce((acc, curr) => acc + curr.weight, 0);
    let random = Math.random() * totalWeight;

    for (const item of weights) {
      if (random < item.weight) {
        return item.value;
      }
      random -= item.weight;
    }

    return 2; // Default to lowest multiplier
  }

  /**
   * Change the bet level
   */
  public changeBet(direction: 'up' | 'down'): void {
    if (direction === 'up' && this.betLevel < BET_LEVELS.length - 1) {
      this.betLevel += 1;
    } else if (direction === 'down' && this.betLevel > 0) {
      this.betLevel -= 1;
    }

    this.currentBet = BET_LEVELS[this.betLevel];
  }

  /**
   * Place a bet
   */
  public placeBet(): boolean {
    if (this.balance >= this.currentBet) {
      if (!this.isFreeSpin) {
        this.balance -= this.currentBet;
      }
      return true;
    }
    return false;
  }

  /**
   * Add wins to balance
   */
  public addWinToBalance(): void {
    this.balance += this.totalWin;

    if (this.isFreeSpin) {
      this.freeSpinsTotalWin += this.totalWin;
    }

    this.totalWin = 0;
  }

  /**
   * Calculate the cost to buy free spins feature
   */
  public getBuyFeatureCost(): number {
    return this.currentBet * 100;
  }

  /**
   * Buy the free spins feature
   */
  public buyFeature(): boolean {
    const cost = this.getBuyFeatureCost();

    if (this.balance >= cost) {
      this.balance -= cost;
      this.buyingFeature = true;
      return true;
    }

    return false;
  }

  /**
   * Reset game state for a new spin
   */
  public resetForNewSpin(): void {
    this.wins = 0;
    this.totalWin = 0;
    this.isSpinning = true;
    this.isTumbling = false;
    this.symbolsToRemove = [];
    this.currentMultiplier = 1;
    this.multipliers = [];
  }

  /**
   * Start free spins mode
   */
  public startFreeSpins(): void {
    this.isFreeSpin = true;
    this.freeSpinsLeft = GameConfig.FREE_SPINS_COUNT;
    this.freeSpinsWon = GameConfig.FREE_SPINS_COUNT;
    this.freeSpinsTotalWin = 0;
    this.buyingFeature = false;
  }

  /**
   * End free spins mode
   */
  public endFreeSpins(): void {
    this.isFreeSpin = false;
    this.freeSpinsLeft = 0;
    this.addWinToBalance();
  }
}
