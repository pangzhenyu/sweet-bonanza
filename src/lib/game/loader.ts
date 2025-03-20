import { Assets } from 'pixi.js';
import { AssetDefinition, SYMBOL_IMAGES, SymbolType } from './types';

export class PixiLoader {
  private assets: AssetDefinition[] = [];
  private backgroundAssets: AssetDefinition[] = [];
  private uiAssets: AssetDefinition[] = [];
  private soundAssets: AssetDefinition[] = [];

  constructor() {
    this.initializeAssets();
  }

  /**
   * Initialize asset definitions
   */
  private initializeAssets(): void {
    // Symbol assets (using public placeholder images)
    Object.entries(SYMBOL_IMAGES).forEach(([symbol, imageName]) => {
      this.assets.push({
        name: symbol,
        url: `/assets/symbols/${imageName}`
      });
    });

    // Background assets
    this.backgroundAssets = [
      { name: 'bg_main', url: '/assets/backgrounds/bg_main.png' },
      { name: 'bg_freespin', url: '/assets/backgrounds/bg_freespin.png' },
    ];

    // UI assets
    this.uiAssets = [
      { name: 'ui_frame', url: '/assets/ui/frame.png' },
      { name: 'ui_button_spin', url: '/assets/ui/button_spin.png' },
      { name: 'ui_button_spin_disabled', url: '/assets/ui/button_spin_disabled.png' },
      { name: 'ui_button_stop', url: '/assets/ui/button_stop.png' },
      { name: 'ui_button_buyin', url: '/assets/ui/button_buyin.png' },
      { name: 'ui_button_autospin', url: '/assets/ui/button_autospin.png' },
      { name: 'ui_button_bet_up', url: '/assets/ui/button_bet_up.png' },
      { name: 'ui_button_bet_down', url: '/assets/ui/button_bet_down.png' },
      { name: 'ui_panel', url: '/assets/ui/panel.png' },
      { name: 'ui_win_frame', url: '/assets/ui/win_frame.png' },
    ];

    // Sound assets
    this.soundAssets = [
      { name: 'sound_spin', url: '/assets/sounds/spin.mp3' },
      { name: 'sound_win', url: '/assets/sounds/win.mp3' },
      { name: 'sound_big_win', url: '/assets/sounds/big_win.mp3' },
      { name: 'sound_mega_win', url: '/assets/sounds/mega_win.mp3' },
      { name: 'sound_scatter', url: '/assets/sounds/scatter.mp3' },
      { name: 'sound_multiplier', url: '/assets/sounds/multiplier.mp3' },
      { name: 'sound_tumble', url: '/assets/sounds/tumble.mp3' },
      { name: 'sound_button', url: '/assets/sounds/button.mp3' },
      { name: 'music_main', url: '/assets/sounds/music_main.mp3' },
      { name: 'music_freespin', url: '/assets/sounds/music_freespin.mp3' },
    ];

    // Combine all assets
    this.assets = [
      ...this.assets,
      ...this.backgroundAssets,
      ...this.uiAssets,
      ...this.soundAssets
    ];
  }

  /**
   * Load all game assets
   */
  public async loadAssets(): Promise<void> {
    try {
      // Add all assets to loader
      for (const asset of this.assets) {
        // Use the object form for adding assets
        Assets.add({
          alias: asset.name,
          src: asset.url
        });
      }

      // Load all assets
      await Assets.load(this.assets.map(asset => asset.name));

      console.log('All assets loaded successfully');
    } catch (error) {
      console.error('Error loading assets:', error);

      // Create placeholder assets for development if loading fails
      this.createPlaceholderAssets();
    }
  }

  /**
   * Create placeholder assets when real assets can't be loaded
   * This ensures development can continue without real assets
   */
  private createPlaceholderAssets(): void {
    console.log('Creating placeholder assets for development');

    // We'll implement this later if needed
    // For now, we'll use placeholder images that will be created in public/assets folder
  }
}
