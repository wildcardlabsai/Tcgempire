import Phaser from 'phaser';
import { generateAllTextures } from '../systems/AssetGenerator';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    this.load.image('start-screen', 'images/start-screen.png');
  }

  create(): void {
    generateAllTextures(this);
    this.scene.start('StartScene');
  }
}
