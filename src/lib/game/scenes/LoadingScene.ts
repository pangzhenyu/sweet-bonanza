import { Application, Graphics, Text, TextStyle } from 'pixi.js';
import { Scene } from './Scene';
import { GameState } from '../state';
import { GameConfig } from '../config';

export class LoadingScene extends Scene {
  private progressBar: Graphics = new Graphics();
  private progressText: Text = new Text('');
  private loadingText: Text = new Text('');

  constructor(app: Application, gameState: GameState) {
    super(app, gameState);
    this.init();
  }

  public init(): void {
    // Create background
    const background = new Graphics();
    background.beginFill(0x0d070f); // Dark purple background
    background.drawRect(0, 0, GameConfig.GAME_WIDTH, GameConfig.GAME_HEIGHT);
    background.endFill();
    this.container.addChild(background);

    // Create loading text
    const titleStyle = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 48,
      fontWeight: 'bold',
      fill: 'gold', // Use simple color names
      // Modern PixiJS doesn't use dropShadow properties, use appropriate styling
    });

    this.loadingText = new Text('Sweet Bonanza', titleStyle);
    this.loadingText.anchor.set(0.5);
    this.loadingText.position.set(GameConfig.GAME_WIDTH / 2, GameConfig.GAME_HEIGHT / 2 - 50);
    this.container.addChild(this.loadingText);

    // Create progress bar background
    const progressBarBg = new Graphics();
    progressBarBg.beginFill(0x333333);
    progressBarBg.drawRoundedRect(
      GameConfig.GAME_WIDTH / 2 - 200,
      GameConfig.GAME_HEIGHT / 2 + 30,
      400,
      30,
      15
    );
    progressBarBg.endFill();
    this.container.addChild(progressBarBg);

    // Create progress bar
    this.progressBar = new Graphics();
    this.progressBar.beginFill(0xf5d19b); // Gold color
    this.progressBar.drawRoundedRect(
      GameConfig.GAME_WIDTH / 2 - 200,
      GameConfig.GAME_HEIGHT / 2 + 30,
      0, // Will be updated during loading
      30,
      15
    );
    this.progressBar.endFill();
    this.container.addChild(this.progressBar);

    // Create progress text
    const textStyle = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 18,
      fill: 'white',
    });

    this.progressText = new Text('Loading... 0%', textStyle);
    this.progressText.anchor.set(0.5);
    this.progressText.position.set(GameConfig.GAME_WIDTH / 2, GameConfig.GAME_HEIGHT / 2 + 80);
    this.container.addChild(this.progressText);

    // Simulate loading progress
    this.simulateLoading();
  }

  /**
   * Simulate loading progress
   * In a real game, this would be connected to actual asset loading
   */
  private simulateLoading(): void {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress > 100) progress = 100;

      this.updateProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 200);
  }

  /**
   * Update the progress bar and text
   */
  private updateProgress(progress: number): void {
    // Update progress bar width
    this.progressBar.clear();
    this.progressBar.beginFill(0xf5d19b);
    this.progressBar.drawRoundedRect(
      GameConfig.GAME_WIDTH / 2 - 200,
      GameConfig.GAME_HEIGHT / 2 + 30,
      (progress / 100) * 400,
      30,
      15
    );
    this.progressBar.endFill();

    // Update progress text
    this.progressText.text = `Loading... ${Math.floor(progress)}%`;
  }

  public update(delta: number): void {
    // Pulse animation for the loading text
    this.loadingText.scale.set(
      1 + Math.sin(performance.now() / 500) * 0.05,
      1 + Math.sin(performance.now() / 500) * 0.05
    );
  }
}
