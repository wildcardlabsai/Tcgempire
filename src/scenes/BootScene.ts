import Phaser from 'phaser';
import { generateAllTextures } from '../systems/AssetGenerator';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    this.load.image('start-screen', 'images/start-screen-portrait.png');
    this.load.image('shop-bg', 'images/shop-bg-portrait.png');
    this.load.image('products-sheet', 'images/products-sheet.png');

    this.load.image('product-dragon-booster', 'images/products/booster-flame.png');
    this.load.image('product-ocean-booster', 'images/products/booster-tidal.png');
    this.load.image('product-forest-booster', 'images/products/booster-nature.png');
    this.load.image('product-starter-deck', 'images/products/starter-fire.png');
    this.load.image('product-elite-box', 'images/products/elite-trainer.png');
    this.load.image('product-card-sleeves', 'images/products/sleeves-fire.png');
  }

  create(): void {
    generateAllTextures(this);
    this.scene.start('StartScene');
  }
}
