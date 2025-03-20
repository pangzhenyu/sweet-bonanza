import { Application, Container } from 'pixi.js';
import { GameState } from '../state';

export abstract class Scene {
  public app: Application;
  public container: Container;
  public gameState: GameState;

  constructor(app: Application, gameState: GameState) {
    this.app = app;
    this.gameState = gameState;
    this.container = new Container();
  }

  /**
   * Initialize the scene
   * This is called once when the scene is created
   */
  public abstract init(): void;

  /**
   * Show the scene
   * This is called whenever the scene is shown
   */
  public show(): void {
    this.container.visible = true;
    this.onShow();
  }

  /**
   * Hide the scene
   * This is called whenever the scene is hidden
   */
  public hide(): void {
    this.container.visible = false;
    this.onHide();
  }

  /**
   * Update the scene
   * This is called every frame
   */
  public update(delta: number): void {
    // Override in subclasses
  }

  /**
   * Clean up the scene
   * This is called when the scene is destroyed
   */
  public destroy(): void {
    this.container.destroy({ children: true });
  }

  /**
   * On show callback
   * Override in subclasses if needed
   */
  protected onShow(): void {
    // Override in subclasses
  }

  /**
   * On hide callback
   * Override in subclasses if needed
   */
  protected onHide(): void {
    // Override in subclasses
  }
}
