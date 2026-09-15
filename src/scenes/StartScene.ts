import Phaser from 'phaser';
import { SaveManager } from '../data/SaveManager';
import { GameState } from '../data/GameState';
import { Inventory } from '../data/Inventory';
import { Collection } from '../data/Collection';
import { PriceManager } from '../data/PriceManager';
import { Decorations } from '../data/Decorations';

export class StartScene extends Phaser.Scene {
  private imagesLoaded = false;

  constructor() {
    super({ key: 'StartScene' });
  }

  preload(): void {
    this.load.image('logo-crest', 'images/logo-crest.png');
    this.load.image('booster-fan', 'images/booster-fan.png');
    this.load.image('shop-bg', 'images/shop-background.png');

    this.load.on('complete', () => {
      this.imagesLoaded = true;
    });
    this.load.on('loaderror', () => {
      this.imagesLoaded = false;
    });
  }

  create(): void {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor('#1a1a2e');

    const hasImages = this.textures.exists('shop-bg') &&
      this.textures.get('shop-bg').key !== '__MISSING';

    if (hasImages) {
      this.createWithImages(width, height);
    } else {
      this.createFallback(width, height);
    }

    this.handleResize();
    this.scale.on('resize', () => this.handleResize());
  }

  private createWithImages(width: number, height: number): void {
    // Background — dimmed shop image
    if (this.textures.exists('shop-bg')) {
      const bg = this.add.image(width / 2, height / 2, 'shop-bg');
      const scaleX = width / bg.width;
      const scaleY = height / bg.height;
      const bgScale = Math.max(scaleX, scaleY);
      bg.setScale(bgScale);
      bg.setAlpha(0.25);
      bg.setDepth(0);

      // Dark overlay for readability
      const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a2e, 0.6);
      overlay.setDepth(1);
    }

    // Vignette effect
    const vignette = this.add.graphics();
    vignette.setDepth(2);
    vignette.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0.7, 0.7, 0, 0);
    vignette.fillRect(0, 0, width, height * 0.15);
    vignette.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0, 0, 0.7, 0.7);
    vignette.fillRect(0, height * 0.85, width, height * 0.15);

    // Logo crest
    if (this.textures.exists('logo-crest')) {
      const logo = this.add.image(width / 2, height * 0.22, 'logo-crest');
      const logoTargetHeight = height * 0.3;
      const logoScale = logoTargetHeight / logo.height;
      logo.setScale(logoScale);
      logo.setDepth(5);
      logo.setAlpha(0);
      this.tweens.add({
        targets: logo,
        alpha: 1,
        scaleX: logoScale,
        scaleY: logoScale,
        duration: 800,
        ease: 'Back.easeOut',
      });
    }

    // Title text overlay
    const title = this.add.text(width / 2, height * 0.41, 'TCG EMPIRE', {
      fontFamily: '"Georgia", "Times New Roman", serif',
      fontSize: '38px',
      color: '#ffd700',
      fontStyle: 'bold',
      stroke: '#8b6914',
      strokeThickness: 3,
    });
    title.setOrigin(0.5);
    title.setDepth(6);

    // Taglines
    const taglines = [
      'Build your shop.',
      'Build your collection.',
      'Build your empire.',
    ];

    const tagY = height * 0.49;
    taglines.forEach((line, i) => {
      const t = this.add.text(width / 2, tagY + i * 24, line, {
        fontFamily: '"Segoe UI", Arial, sans-serif',
        fontSize: '16px',
        color: '#cccccc',
      });
      t.setOrigin(0.5);
      t.setAlpha(0);
      t.setDepth(6);
      this.tweens.add({
        targets: t,
        alpha: 1,
        y: t.y - 5,
        duration: 600,
        delay: 500 + i * 200,
        ease: 'Power2',
      });
    });

    // Buttons
    this.createButtons(width, height, 0.65, 0.76, 6);

    // Booster fan at bottom
    if (this.textures.exists('booster-fan')) {
      const fan = this.add.image(width / 2, height * 0.94, 'booster-fan');
      const fanTargetWidth = width * 0.7;
      const fanScale = fanTargetWidth / fan.width;
      fan.setScale(fanScale);
      fan.setAlpha(0.5);
      fan.setDepth(3);
    }

    // Particle sparkle effect
    this.createSparkles(width, height);
  }

  private createFallback(width: number, height: number): void {
    const title = this.add.text(width / 2, height * 0.22, 'TCG EMPIRE', {
      fontFamily: '"Georgia", "Times New Roman", serif',
      fontSize: '48px',
      color: '#ffd700',
      fontStyle: 'bold',
      stroke: '#8b6914',
      strokeThickness: 3,
    });
    title.setOrigin(0.5);

    const taglines = [
      'Build your shop.',
      'Build your collection.',
      'Build your empire.',
    ];

    const tagY = height * 0.36;
    taglines.forEach((line, i) => {
      const t = this.add.text(width / 2, tagY + i * 28, line, {
        fontFamily: '"Segoe UI", Arial, sans-serif',
        fontSize: '18px',
        color: '#cccccc',
      });
      t.setOrigin(0.5);
      t.setAlpha(0);
      this.tweens.add({
        targets: t,
        alpha: 1,
        y: t.y - 5,
        duration: 600,
        delay: 300 + i * 200,
        ease: 'Power2',
      });
    });

    this.createButtons(width, height, 0.62, 0.74, 0);

    const cardColors = [0xe74c3c, 0x3498db, 0x2ecc71, 0xf39c12, 0x9b59b6];
    for (let i = 0; i < 5; i++) {
      const cx = width * 0.15 + (width * 0.7 / 4) * i;
      const cy = height * 0.92;
      const card = this.add.rectangle(cx, cy, 28, 40, cardColors[i], 0.4);
      card.setStrokeStyle(1, 0xffffff, 0.2);
      card.setAngle(-10 + i * 5);
    }
  }

  private createButtons(width: number, height: number, primaryY: number, secondaryY: number, depth: number): void {
    const hasSave = SaveManager.hasSave();
    const btnW = 200;
    const btnH = 50;

    if (hasSave) {
      const saveInfo = SaveManager.getSaveInfo();
      const continueY = height * primaryY;
      const newGameY = height * secondaryY;

      // Continue button — gradient-style with glow
      const continueBg = this.add.rectangle(width / 2, continueY, btnW, btnH, 0x27ae60);
      continueBg.setStrokeStyle(2, 0x2ecc71);
      continueBg.setInteractive({ useHandCursor: true });
      continueBg.setDepth(depth);

      const continueText = this.add.text(width / 2, continueY, 'CONTINUE', {
        fontFamily: '"Segoe UI", Arial, sans-serif',
        fontSize: '20px',
        color: '#ffffff',
        fontStyle: 'bold',
      });
      continueText.setOrigin(0.5);
      continueText.setDepth(depth + 1);

      if (saveInfo) {
        const infoText = this.add.text(width / 2, continueY + 30, `Day ${saveInfo.day} · £${saveInfo.cash.toLocaleString('en-GB')}`, {
          fontFamily: '"Segoe UI", Arial, sans-serif',
          fontSize: '12px',
          color: '#aaa',
        });
        infoText.setOrigin(0.5);
        infoText.setDepth(depth + 1);
      }

      continueBg.on('pointerover', () => {
        continueBg.setFillStyle(0x2ecc71);
        this.tweens.add({ targets: [continueBg, continueText], scaleX: 1.05, scaleY: 1.05, duration: 100 });
      });
      continueBg.on('pointerout', () => {
        continueBg.setFillStyle(0x27ae60);
        this.tweens.add({ targets: [continueBg, continueText], scaleX: 1, scaleY: 1, duration: 100 });
      });
      continueBg.on('pointerdown', () => {
        SaveManager.load();
        this.startGame();
      });

      const newBg = this.add.rectangle(width / 2, newGameY, btnW, btnH, 0x2c3e50);
      newBg.setStrokeStyle(2, 0x34495e);
      newBg.setInteractive({ useHandCursor: true });
      newBg.setDepth(depth);

      const newText = this.add.text(width / 2, newGameY, 'NEW GAME', {
        fontFamily: '"Segoe UI", Arial, sans-serif',
        fontSize: '18px',
        color: '#ffffff',
      });
      newText.setOrigin(0.5);
      newText.setDepth(depth + 1);

      newBg.on('pointerover', () => {
        newBg.setFillStyle(0x34495e);
        this.tweens.add({ targets: [newBg, newText], scaleX: 1.05, scaleY: 1.05, duration: 100 });
      });
      newBg.on('pointerout', () => {
        newBg.setFillStyle(0x2c3e50);
        this.tweens.add({ targets: [newBg, newText], scaleX: 1, scaleY: 1, duration: 100 });
      });
      newBg.on('pointerdown', () => {
        SaveManager.deleteSave();
        GameState.reset();
        Inventory.reset();
        Collection.reset();
        PriceManager.reset();
        Decorations.reset();
        this.startGame();
      });
    } else {
      const btnY = height * primaryY;
      const btnBg = this.add.rectangle(width / 2, btnY, btnW, btnH, 0xc0392b);
      btnBg.setStrokeStyle(2, 0xe74c3c);
      btnBg.setInteractive({ useHandCursor: true });
      btnBg.setDepth(depth);

      const btnText = this.add.text(width / 2, btnY, 'PLAY', {
        fontFamily: '"Segoe UI", Arial, sans-serif',
        fontSize: '22px',
        color: '#ffffff',
        fontStyle: 'bold',
      });
      btnText.setOrigin(0.5);
      btnText.setDepth(depth + 1);

      btnBg.on('pointerover', () => {
        btnBg.setFillStyle(0xe74c3c);
        this.tweens.add({ targets: [btnBg, btnText], scaleX: 1.05, scaleY: 1.05, duration: 100 });
      });
      btnBg.on('pointerout', () => {
        btnBg.setFillStyle(0xc0392b);
        this.tweens.add({ targets: [btnBg, btnText], scaleX: 1, scaleY: 1, duration: 100 });
      });
      btnBg.on('pointerdown', () => {
        GameState.reset();
        Inventory.reset();
        Collection.reset();
        PriceManager.reset();
        Decorations.reset();
        this.startGame();
      });
    }
  }

  private createSparkles(width: number, height: number): void {
    const sparkleCount = 12;
    for (let i = 0; i < sparkleCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height * 0.8;
      const star = this.add.star(x, y, 4, 1, 3, 0xffd700, 0);
      star.setDepth(4);
      this.tweens.add({
        targets: star,
        alpha: { from: 0, to: 0.6 },
        scaleX: { from: 0.5, to: 1.2 },
        scaleY: { from: 0.5, to: 1.2 },
        duration: 1500 + Math.random() * 2000,
        delay: Math.random() * 3000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }
  }

  private startGame(): void {
    this.cameras.main.fadeOut(400, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('ShopScene');
    });
  }

  private handleResize(): void {
    const { width } = this.scale;

    if (width < 500) {
      this.children.each((child) => {
        if (child instanceof Phaser.GameObjects.Text) {
          const currentSize = parseInt(child.style.fontSize as string);
          if (currentSize > 30) {
            child.setFontSize(32);
          }
        }
      });
    }
  }
}
