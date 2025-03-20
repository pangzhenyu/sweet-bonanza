import { Application, Container } from 'pixi.js';
import { SceneName } from '../types';
import { Scene } from './Scene';

export class SceneManager {
  private app: Application;
  private scenes: Map<SceneName, Scene> = new Map();
  private activeScene: Scene | null = null;

  constructor(app: Application) {
    this.app = app;
  }

  /**
   * Add a scene to the manager
   */
  public addScene(name: SceneName, scene: Scene): void {
    this.scenes.set(name, scene);
  }

  /**
   * Get a scene by name
   */
  public getScene(name: SceneName): Scene | undefined {
    return this.scenes.get(name);
  }

  /**
   * Show a scene
   */
  public showScene(name: SceneName): void {
    // Hide the current active scene
    if (this.activeScene) {
      this.activeScene.hide();
      this.app.stage.removeChild(this.activeScene.container);
    }

    // Get the new scene
    const scene = this.scenes.get(name);

    if (!scene) {
      console.error(`Scene ${name} not found`);
      return;
    }

    // Set the new active scene
    this.activeScene = scene;

    // Add the scene container to the stage
    this.app.stage.addChild(scene.container);

    // Show the scene
    scene.show();
  }

  /**
   * Update all scenes (called every frame)
   */
  public update(delta: number): void {
    // Update the active scene if it exists
    if (this.activeScene) {
      this.activeScene.update(delta);
    }
  }
}
