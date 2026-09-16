import Phaser from 'phaser';
import { generateAllTextures } from '../systems/AssetGenerator';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    this.load.image('start-screen', 'images/start-screen-portrait.png');
    this.load.image('shop-bg', 'images/shop-bg-portrait.png');

    this.load.spritesheet('player-sheet', 'images/player-sheet.png', {
      frameWidth: 352,
      frameHeight: 279,
    });

    this.load.image('customers-sheet', 'images/customers-sheet.png');
    this.load.image('products-sheet', 'images/products-sheet.png');

    this.load.image('product-dragon-booster', 'images/products/booster-flame.png');
    this.load.image('product-ocean-booster', 'images/products/booster-tidal.png');
    this.load.image('product-forest-booster', 'images/products/booster-nature.png');
    this.load.image('product-starter-deck', 'images/products/starter-fire.png');
    this.load.image('product-elite-box', 'images/products/elite-trainer.png');
    this.load.image('product-card-sleeves', 'images/products/sleeves-fire.png');
  }

  create(): void {
    this.extractPlayerFrames();
    this.extractCustomerSprites();
    generateAllTextures(this);
    this.scene.start('StartScene');
  }

  private extractPlayerFrames(): void {
    if (!this.textures.exists('player-sheet')) return;

    const sheet = this.textures.get('player-sheet');
    const source = sheet.getSourceImage() as HTMLImageElement;
    const fw = 352;
    const fh = 279;
    const directions: string[] = ['down', 'left', 'right', 'up'];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const key = `player-${directions[row]}-${col}`;
        const ct = this.textures.createCanvas(key, fw, fh);
        if (!ct) continue;
        const c = ct.getContext();
        c.drawImage(source, col * fw, row * fh, fw, fh, 0, 0, fw, fh);
        ct.refresh();
      }
    }
  }

  private extractCustomerSprites(): void {
    if (!this.textures.exists('customers-sheet')) return;

    const sheet = this.textures.get('customers-sheet');
    const source = sheet.getSourceImage() as HTMLImageElement;

    const charW = 384;
    const charH = 341;
    const frameW = 96;
    const frameH = 85;

    for (let charRow = 0; charRow < 3; charRow++) {
      for (let charCol = 0; charCol < 4; charCol++) {
        const charIdx = charRow * 4 + charCol;
        const baseX = charCol * charW;
        const baseY = charRow * charH;

        const key = `customer-${charIdx}-front`;
        const ct = this.textures.createCanvas(key, frameW, frameH);
        if (!ct) continue;
        const c = ct.getContext();
        c.drawImage(source, baseX, baseY, frameW, frameH, 0, 0, frameW, frameH);
        ct.refresh();
      }
    }
  }
}
