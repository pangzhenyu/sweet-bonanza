import { Application, Container, Graphics, Sprite, Text, TextStyle } from 'pixi.js';
import { Scene } from './Scene';
import { GameState } from '../state';
import { GameConfig } from '../config';
import { SymbolType, WinData } from '../types';
import gsap from 'gsap';
// Import mechanics
import { evaluateWins as evaluateGameWins, checkScatterWin, getSymbolsToRemove, fillEmptyPositions, collectMultipliers, getTotalWinAmount } from '../mechanics';

export class GameScene extends Scene {
  // UI containers
  private backgroundContainer: Container = new Container();
  private reelsContainer: Container = new Container();
  private uiContainer: Container = new Container();
  private winDisplayContainer: Container = new Container();

  // UI elements
  private balanceText!: Text;
  private betText!: Text;
  private winText!: Text;
  private spinButton!: Container;
  private buyFeatureButton!: Container;
  private betUpButton!: Container;
  private betDownButton!: Container;

  // Game elements
  private symbolSprites: Sprite[][] = [];
  private reelMasks: Graphics[] = [];

  constructor(app: Application, gameState: GameState) {
    super(app, gameState);
    this.backgroundContainer = new Container();
    this.reelsContainer = new Container();
    this.uiContainer = new Container();
    this.winDisplayContainer = new Container();

    this.init();
  }

  public init(): void {
    // Add containers to main container
    this.container.addChild(this.backgroundContainer);
    this.container.addChild(this.reelsContainer);
    this.container.addChild(this.uiContainer);
    this.container.addChild(this.winDisplayContainer);

    // Initialize game elements
    this.createBackground();
    this.createReels();
    this.createUI();

    // Set up initial game state
    this.updateUI();
  }

  /**
   * Create background
   */
  private createBackground(): void {
    // For now, just add a placeholder background
    const background = new Graphics();
    background.beginFill(0x3b2b38); // Dark purple background
    background.drawRect(0, 0, GameConfig.GAME_WIDTH, GameConfig.GAME_HEIGHT);
    background.endFill();
    this.backgroundContainer.addChild(background);

    // Add candy-land background elements (placeholder)
    const bgRect = new Graphics();
    bgRect.beginFill(0xf5d19b, 0.1); // Light gold with transparency
    bgRect.drawRoundedRect(
      GameConfig.GAME_WIDTH / 2 - 500,
      GameConfig.GAME_HEIGHT / 2 - 300,
      1000,
      600,
      20
    );
    bgRect.endFill();
    this.backgroundContainer.addChild(bgRect);
  }

  /**
   * Create reels
   */
  private createReels(): void {
    // Add reels container
    this.reelsContainer.position.set(
      GameConfig.GAME_WIDTH / 2 - (GameConfig.REELS * GameConfig.REEL_WIDTH) / 2,
      GameConfig.GAME_HEIGHT / 2 - (GameConfig.ROWS * GameConfig.REEL_HEIGHT) / 2
    );

    // Create reel backdrop
    const reelBackdrop = new Graphics();
    reelBackdrop.beginFill(0x0d070f, 0.7); // Dark purple with transparency
    reelBackdrop.drawRect(
      -10,
      -10,
      GameConfig.REELS * GameConfig.REEL_WIDTH + 20,
      GameConfig.ROWS * GameConfig.REEL_HEIGHT + 20
    );
    reelBackdrop.endFill();
    this.reelsContainer.addChild(reelBackdrop);

    // Create reel masks
    for (let i = 0; i < GameConfig.REELS; i++) {
      const mask = new Graphics();
      mask.beginFill(0xffffff);
      mask.drawRect(
        i * GameConfig.REEL_WIDTH,
        0,
        GameConfig.REEL_WIDTH,
        GameConfig.ROWS * GameConfig.REEL_HEIGHT
      );
      mask.endFill();
      this.reelsContainer.addChild(mask);
      this.reelMasks.push(mask);
    }

    // Create symbol sprites
    for (let i = 0; i < GameConfig.REELS; i++) {
      const column: Sprite[] = [];
      const reelContainer = new Container();
      reelContainer.position.x = i * GameConfig.REEL_WIDTH;
      this.reelsContainer.addChild(reelContainer);

      for (let j = 0; j < GameConfig.ROWS; j++) {
        // Create placeholder sprites for now
        const symbol = this.createSymbolSprite(this.gameState.reelSymbols[i][j]);
        symbol.position.set(
          GameConfig.REEL_WIDTH / 2,
          j * GameConfig.REEL_HEIGHT + GameConfig.REEL_HEIGHT / 2
        );
        reelContainer.addChild(symbol);
        column.push(symbol);
      }

      this.symbolSprites.push(column);
    }

    // Add "Symbols pay anywhere" text at top
    const payanywhere = new Text("SYMBOLS PAY ANYWHERE ON THE SCREEN", {
      fontFamily: 'Arial',
      fontSize: 24,
      fontWeight: 'bold',
      fill: 'white',
    });
    payanywhere.anchor.set(0.5, 0);
    payanywhere.position.set(
      (GameConfig.REELS * GameConfig.REEL_WIDTH) / 2,
      -50
    );
    this.reelsContainer.addChild(payanywhere);
  }

  /**
   * Create UI elements
   */
  private createUI(): void {
    // Create UI container at bottom of screen
    this.uiContainer.position.set(0, GameConfig.GAME_HEIGHT - 100);

    // Create UI background
    const uiBackground = new Graphics();
    uiBackground.beginFill(0x0d070f);
    uiBackground.drawRect(0, 0, GameConfig.GAME_WIDTH, 100);
    uiBackground.endFill();
    this.uiContainer.addChild(uiBackground);

    // Create balance display
    const balanceLabel = new Text("BALANCE:", {
      fontFamily: 'Arial',
      fontSize: 18,
      fill: 'gold',
    });
    balanceLabel.position.set(20, 15);
    this.uiContainer.addChild(balanceLabel);

    this.balanceText = new Text("$1000.00", {
      fontFamily: 'Arial',
      fontSize: 24,
      fontWeight: 'bold',
      fill: 'white',
    });
    this.balanceText.position.set(20, 40);
    this.uiContainer.addChild(this.balanceText);

    // Create bet display
    const betLabel = new Text("BET:", {
      fontFamily: 'Arial',
      fontSize: 18,
      fill: 'gold',
    });
    betLabel.position.set(200, 15);
    this.uiContainer.addChild(betLabel);

    this.betText = new Text("$0.20", {
      fontFamily: 'Arial',
      fontSize: 24,
      fontWeight: 'bold',
      fill: 'white',
    });
    this.betText.position.set(200, 40);
    this.uiContainer.addChild(this.betText);

    // Create win display
    const winLabel = new Text("WIN:", {
      fontFamily: 'Arial',
      fontSize: 18,
      fill: 'gold',
    });
    winLabel.position.set(350, 15);
    this.uiContainer.addChild(winLabel);

    this.winText = new Text("$0.00", {
      fontFamily: 'Arial',
      fontSize: 24,
      fontWeight: 'bold',
      fill: 'white',
    });
    this.winText.position.set(350, 40);
    this.uiContainer.addChild(this.winText);

    // Create bet up/down buttons
    this.betUpButton = this.createButton('+', 30, 30, 15, 24, 0x695962, 290, 15);
    this.betUpButton.on('pointerdown', () => this.changeBet('up'));
    this.uiContainer.addChild(this.betUpButton);

    this.betDownButton = this.createButton('-', 30, 30, 15, 24, 0x695962, 290, 50);
    this.betDownButton.on('pointerdown', () => this.changeBet('down'));
    this.uiContainer.addChild(this.betDownButton);

    // Create spin button
    this.spinButton = this.createButton('SPIN', 150, 60, 20, 25, 0xd1433e,
      GameConfig.GAME_WIDTH - 170, 20);
    this.spinButton.on('pointerdown', () => this.onSpinButtonClick());
    this.uiContainer.addChild(this.spinButton);

    // Create buy feature button
    this.buyFeatureButton = this.createButton('BUY FEATURE', 120, 30, 15, 15, 0x617091,
      GameConfig.GAME_WIDTH - 320, 20);
    this.buyFeatureButton.on('pointerdown', () => this.onBuyFeatureClick());
    this.uiContainer.addChild(this.buyFeatureButton);
  }

  /**
   * Create a button
   */
  private createButton(
    label: string,
    width: number,
    height: number,
    radius = 10,
    fontSize = 20,
    color = 0xd1433e,
    x = 0,
    y = 0
  ): Container {
    const container = new Container();
    container.position.set(x, y);
    container.interactive = true;
    container.cursor = 'pointer';

    // Button background
    const bg = new Graphics();
    bg.beginFill(color);
    bg.drawRoundedRect(0, 0, width, height, radius);
    bg.endFill();
    container.addChild(bg);

    // Button text
    const text = new Text(label, {
      fontFamily: 'Arial',
      fontSize: fontSize,
      fontWeight: 'bold',
      fill: 'white',
    });
    text.anchor.set(0.5);
    text.position.set(width / 2, height / 2);
    container.addChild(text);

    return container;
  }

  /**
   * Create a symbol sprite
   */
  private createSymbolSprite(symbolType: SymbolType): Sprite {
    // For development, we'll create colored rectangles as placeholders
    const colors: Record<SymbolType, number> = {
      RED_HEART: 0xff0000,
      BLUE_CANDY: 0x0000ff,
      GREEN_CANDY: 0x00ff00,
      PURPLE_CANDY: 0xff00ff,
      PLUM: 0x8800ff,
      WATERMELON: 0x00ff88,
      APPLE: 0xff4400,
      GRAPE: 0x8800ff,
      BANANA: 0xffff00,
      LOLLIPOP: 0xff88ff,
      BOMB: 0x222222
    };

    // Create sprite
    const sprite = new Sprite();
    sprite.anchor.set(0.5);

    // Add colored rectangle as placeholder
    const graphics = new Graphics();
    graphics.beginFill(colors[symbolType] || 0xcccccc);
    graphics.drawRoundedRect(-50, -50, 100, 100, 20);
    graphics.endFill();
    sprite.addChild(graphics);

    // Add symbol text
    const text = new Text(symbolType.substring(0, 1), {
      fontFamily: 'Arial',
      fontSize: 30,
      fontWeight: 'bold',
      fill: 'white',
    });
    text.anchor.set(0.5);
    sprite.addChild(text);

    return sprite;
  }

  /**
   * Update UI elements with current game state
   */
  private updateUI(): void {
    this.balanceText.text = `$${this.gameState.balance.toFixed(2)}`;
    this.betText.text = `$${this.gameState.currentBet.toFixed(2)}`;
    this.winText.text = `$${this.gameState.totalWin.toFixed(2)}`;

    // Update buttons based on game state
    this.spinButton.visible = !this.gameState.isSpinning;

    // Disable bet buttons during spinning
    this.betUpButton.interactive = !this.gameState.isSpinning;
    this.betDownButton.interactive = !this.gameState.isSpinning;
    this.buyFeatureButton.interactive = !this.gameState.isSpinning;

    // Disable spin button if balance is too low
    this.spinButton.interactive = this.gameState.balance >= this.gameState.currentBet;

    // Update buy feature button text
    const buyFeatureText = this.buyFeatureButton.getChildAt(1) as Text;
    buyFeatureText.text = `BUY FEATURE ($${this.gameState.getBuyFeatureCost().toFixed(2)})`;
  }

  /**
   * Handle spin button click
   */
  private onSpinButtonClick(): void {
    if (this.gameState.isSpinning || this.gameState.balance < this.gameState.currentBet) {
      return;
    }

    // Place bet and start spin
    if (this.gameState.placeBet()) {
      this.gameState.resetForNewSpin();
      this.updateUI();
      this.spin();
    }
  }

  /**
   * Handle buy feature button click
   */
  private onBuyFeatureClick(): void {
    if (this.gameState.isSpinning || this.gameState.buyingFeature) {
      return;
    }

    if (this.gameState.buyFeature()) {
      this.gameState.resetForNewSpin();
      this.updateUI();
      // TODO: Implement free spins feature
      console.log('Buy feature clicked');
    }
  }

  /**
   * Handle bet change
   */
  private changeBet(direction: 'up' | 'down'): void {
    if (this.gameState.isSpinning) {
      return;
    }

    this.gameState.changeBet(direction);
    this.updateUI();
  }

  /**
   * Perform a spin
   */
  private spin(): void {
    // Generate new symbols for each reel
    for (let i = 0; i < GameConfig.REELS; i++) {
      for (let j = 0; j < GameConfig.ROWS; j++) {
        this.gameState.reelSymbols[i][j] = this.gameState.getRandomSymbol();
      }
    }

    // Animate spin
    const spinDuration = GameConfig.SPIN_DURATION;
    const reelDelay = 0.2; // Delay between reels

    for (let i = 0; i < GameConfig.REELS; i++) {
      for (let j = 0; j < GameConfig.ROWS; j++) {
        const sprite = this.symbolSprites[i][j];

        // Remove old sprite content
        while (sprite.children.length > 0) {
          sprite.removeChildAt(0);
        }

        // Create new symbol sprite
        const newSymbol = this.createSymbolSprite(this.gameState.reelSymbols[i][j]);
        sprite.addChild(newSymbol.children[0]);
        sprite.addChild(newSymbol.children[0]);

        // Animate spin
        gsap.fromTo(
          sprite,
          {
            y: -GameConfig.REEL_HEIGHT * 2 + j * GameConfig.REEL_HEIGHT + GameConfig.REEL_HEIGHT / 2,
            alpha: 0
          },
          {
            y: j * GameConfig.REEL_HEIGHT + GameConfig.REEL_HEIGHT / 2,
            alpha: 1,
            duration: spinDuration,
            delay: i * reelDelay,
            ease: 'bounce.out'
          }
        );
      }
    }

    // End spin after all reels have stopped
    gsap.delayedCall(spinDuration + (GameConfig.REELS - 1) * reelDelay, () => {
      this.gameState.isSpinning = false;
      this.evaluateWins();
      this.updateUI();
    });
  }

  /**
   * Evaluate wins after a spin
   */
  private evaluateWins(): void {
    // Check for wins
    const wins = evaluateGameWins(this.gameState);

    if (wins.length > 0) {
      // We have wins!
      this.gameState.wins = wins.length;

      // Get symbols to remove
      this.gameState.symbolsToRemove = getSymbolsToRemove(wins);

      // Check for multipliers in the removed symbols
      const newMultipliers = collectMultipliers(this.gameState, this.gameState.symbolsToRemove);
      this.gameState.multipliers.push(...newMultipliers);

      // If we have multipliers, update current multiplier
      if (this.gameState.multipliers.length > 0) {
        this.gameState.currentMultiplier = this.gameState.multipliers.reduce((a, b) => a + b, 0);
      }

      // Calculate total win
      const winAmount = getTotalWinAmount(wins);
      this.gameState.totalWin += winAmount;

      // Show win animation
      this.showWinAnimation();

      // Start tumbling after showing win
      gsap.delayedCall(1.5, () => {
        this.tumbleReels();
      });
    } else {
      // No wins, check for scatters
      const hasScatterWin = checkScatterWin(this.gameState);

      if (hasScatterWin && !this.gameState.isFreeSpin) {
        // Trigger free spins
        console.log('Free spins triggered!');
        // TODO: Implement free spins feature
        this.gameState.addWinToBalance();
      } else {
        // No wins or free spins, just add any previous wins to balance
        this.gameState.addWinToBalance();
      }
    }

    // Update UI
    this.updateUI();
  }

  /**
   * Show win animation
   */
  private showWinAnimation(): void {
    if (this.gameState.totalWin <= 0) {
      return;
    }

    // Create win message
    const winMessage = new Text(`WIN $${this.gameState.totalWin.toFixed(2)}!`, {
      fontFamily: 'Arial',
      fontSize: 48,
      fontWeight: 'bold',
      fill: 'gold', // Single color name
    });
    winMessage.anchor.set(0.5);
    winMessage.position.set(GameConfig.GAME_WIDTH / 2, GameConfig.GAME_HEIGHT / 2);
    this.winDisplayContainer.addChild(winMessage);

    // Animate win message
    gsap.fromTo(
      winMessage.scale,
      { x: 0, y: 0 },
      { x: 1, y: 1, duration: 0.5, ease: 'back.out' }
    );

    gsap.to(winMessage, {
      alpha: 0,
      duration: 1,
      delay: 2,
      onComplete: () => {
        this.winDisplayContainer.removeChild(winMessage);
        this.updateUI();
      }
    });
  }

  /**
   * Tumble the reels (remove winning symbols and add new ones)
   */
  private tumbleReels(): void {
    if (this.gameState.symbolsToRemove.length === 0) {
      return;
    }

    this.gameState.isTumbling = true;

    // Animate symbols to remove
    for (const pos of this.gameState.symbolsToRemove) {
      const sprite = this.symbolSprites[pos.col][pos.row];

      // Fade out and scale down
      gsap.to(sprite, {
        alpha: 0,
        scale: 0,
        duration: 0.3,
        ease: 'back.in'
      });
    }

    // Wait for removal animation to complete
    gsap.delayedCall(0.4, () => {
      // Fill empty positions with new symbols
      fillEmptyPositions(this.gameState, this.gameState.symbolsToRemove);

      // Update sprites with new symbols
      for (let i = 0; i < GameConfig.REELS; i++) {
        for (let j = 0; j < GameConfig.ROWS; j++) {
          const sprite = this.symbolSprites[i][j];

          // Reset sprite properties
          sprite.alpha = 1;
          sprite.scale.set(1);

          // Clear sprite
          while (sprite.children.length > 0) {
            sprite.removeChildAt(0);
          }

          // Add new symbol
          const newSymbol = this.createSymbolSprite(this.gameState.reelSymbols[i][j]);
          sprite.addChild(newSymbol.children[0]);
          sprite.addChild(newSymbol.children[0]);
        }
      }

      // Animate new symbols falling in
      for (let i = 0; i < GameConfig.REELS; i++) {
        for (let j = 0; j < GameConfig.ROWS; j++) {
          const sprite = this.symbolSprites[i][j];

          // Animate from above
          if (this.gameState.symbolsToRemove.some(pos => pos.col === i && pos.row === j)) {
            gsap.fromTo(
              sprite,
              {
                y: -GameConfig.REEL_HEIGHT + j * GameConfig.REEL_HEIGHT + GameConfig.REEL_HEIGHT / 2,
                alpha: 0.5
              },
              {
                y: j * GameConfig.REEL_HEIGHT + GameConfig.REEL_HEIGHT / 2,
                alpha: 1,
                duration: 0.5,
                ease: 'bounce.out'
              }
            );
          }
        }
      }

      // Evaluate wins again after tumble
      gsap.delayedCall(0.6, () => {
        this.gameState.isTumbling = false;
        this.gameState.symbolsToRemove = [];
        this.evaluateWins();
      });
    });
  }

  /**
   * Update function called every frame
   */
  public update(delta: number): void {
    // TODO: Implement any per-frame updates
  }
}
