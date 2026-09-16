import Phaser from 'phaser';
import { SaveManager } from '../data/SaveManager';
import { GameState } from '../data/GameState';
import { Inventory } from '../data/Inventory';
import { Collection } from '../data/Collection';
import { PriceManager } from '../data/PriceManager';
import { Decorations } from '../data/Decorations';

export class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: 'StartScene' });
  }

  preload(): void {
    const embeddedUrl = (window as unknown as Record<string, unknown>).__startScreenUrl as string | undefined;
    this.load.image('start-screen', embeddedUrl || 'images/start-screen.png');
  }

  create(): void {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor('#1a1a2e');

    const hasImage = this.textures.exists('start-screen') &&
      this.textures.get('start-screen').key !== '__MISSING';

    if (hasImage) {
      this.createWithImage(width, height);
    } else {
      this.createFallback(width, height);
    }
  }

  private createWithImage(w: number, h: number): void {
    // Full-bleed background image — cover the entire canvas
    const bg = this.add.image(w / 2, h / 2, 'start-screen');
    const scaleX = w / bg.width;
    const scaleY = h / bg.height;
    const bgScale = Math.max(scaleX, scaleY);
    bg.setScale(bgScale);
    bg.setDepth(0);

    // The image already has the logo, taglines, cards, counter, loading bar.
    // We just need invisible hit areas for the buttons and the loading bar animation.

    const hasSave = SaveManager.hasSave();

    if (hasSave) {
      const saveInfo = SaveManager.getSaveInfo();

      // CONTINUE button over the PLAY button area in the image
      const continueBtn = this.createImageButton(w / 2, h * 0.545, 200, 50, 'CONTINUE  ▶', () => {
        SaveManager.load();
        this.startGame();
      });

      if (saveInfo) {
        const infoText = this.add.text(w / 2, h * 0.545 + 32, `Day ${saveInfo.day} · £${saveInfo.cash.toLocaleString('en-GB')}`, {
          fontFamily: '"Segoe UI", Arial, sans-serif',
          fontSize: '11px',
          color: '#ffffff',
          stroke: '#000000',
          strokeThickness: 3,
        });
        infoText.setOrigin(0.5);
        infoText.setDepth(12);
      }

      // NEW GAME below
      const newY = h * 0.645;
      const newBg = this.add.rectangle(w / 2, newY, 140, 32, 0x000000, 0.5);
      newBg.setStrokeStyle(1, 0xd4a854, 0.6);
      newBg.setInteractive({ useHandCursor: true });
      newBg.setDepth(10);

      const newText = this.add.text(w / 2, newY, 'NEW GAME', {
        fontFamily: '"Segoe UI", Arial, sans-serif',
        fontSize: '13px',
        color: '#ffffff',
        fontStyle: 'bold',
      });
      newText.setOrigin(0.5);
      newText.setDepth(11);

      newBg.on('pointerover', () => {
        newBg.setFillStyle(0x222222, 0.7);
        this.tweens.add({ targets: [newBg, newText], scaleX: 1.05, scaleY: 1.05, duration: 80 });
      });
      newBg.on('pointerout', () => {
        newBg.setFillStyle(0x000000, 0.5);
        this.tweens.add({ targets: [newBg, newText], scaleX: 1, scaleY: 1, duration: 80 });
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

      // Entrance animations
      [continueBtn, newBg, newText].forEach((el) => {
        el.setAlpha(0);
        this.tweens.add({ targets: el, alpha: 1, duration: 400, delay: 600, ease: 'Power2' });
      });
      if (saveInfo) {
        // info text also fades in
      }
    } else {
      // Invisible clickable area over the PLAY button in the image
      const playHit = this.add.rectangle(w / 2, h * 0.545, 220, 55, 0x000000, 0);
      playHit.setInteractive({ useHandCursor: true });
      playHit.setDepth(10);

      playHit.on('pointerover', () => {
        this.tweens.add({ targets: playHit, scaleX: 1.05, scaleY: 1.05, duration: 80 });
      });
      playHit.on('pointerout', () => {
        this.tweens.add({ targets: playHit, scaleX: 1, scaleY: 1, duration: 80 });
      });
      playHit.on('pointerdown', () => {
        GameState.reset();
        Inventory.reset();
        Collection.reset();
        PriceManager.reset();
        Decorations.reset();
        this.startGame();
      });
    }

    // Animated loading bar overlay matching the image's loading bar position
    this.drawLoadingBar(w, h);

    // Gold sparkles for extra polish
    this.createSparkles(w, h);
  }

  private createImageButton(x: number, y: number, bw: number, bh: number, label: string, onClick: () => void): Phaser.GameObjects.Container {
    const btnBg = this.add.graphics();
    // Golden pill button drawn over the image's button area
    btnBg.fillStyle(0xf0b030);
    btnBg.fillRoundedRect(-bw / 2, -bh / 2, bw, bh, bh / 2);
    btnBg.fillStyle(0xffcc44, 0.4);
    btnBg.fillRoundedRect(-bw / 2 + 3, -bh / 2 + 3, bw - 6, bh / 2 - 3, { tl: bh / 2 - 3, tr: bh / 2 - 3, bl: 0, br: 0 });
    btnBg.lineStyle(3, 0x8b6914);
    btnBg.strokeRoundedRect(-bw / 2, -bh / 2, bw, bh, bh / 2);

    const btnText = this.add.text(0, 0, label, {
      fontFamily: '"Segoe UI", Arial, sans-serif',
      fontSize: '20px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#8b6914',
      strokeThickness: 2,
    }).setOrigin(0.5);

    const container = this.add.container(x, y, [btnBg, btnText]);
    container.setSize(bw, bh);
    container.setInteractive({ useHandCursor: true });
    container.setDepth(11);

    container.on('pointerover', () => {
      this.tweens.add({ targets: container, scaleX: 1.06, scaleY: 1.06, duration: 80 });
    });
    container.on('pointerout', () => {
      this.tweens.add({ targets: container, scaleX: 1, scaleY: 1, duration: 80 });
    });
    container.on('pointerdown', onClick);

    return container;
  }

  private createFallback(w: number, h: number): void {
    // Fallback procedural start screen when image isn't available
    this.cameras.main.setBackgroundColor('#1a1a2e');

    const g = this.add.graphics();
    g.fillGradientStyle(0x2a1f14, 0x2a1f14, 0x1a1a2e, 0x1a1a2e);
    g.fillRect(0, 0, w, h);

    // Logo
    const shield = this.add.graphics();
    shield.setDepth(5);
    const logoY = h * 0.22;
    shield.fillStyle(0x1a1a3e);
    shield.fillRoundedRect(w / 2 - 130, logoY - 55, 260, 90, 12);
    shield.lineStyle(3, 0xd4a854);
    shield.strokeRoundedRect(w / 2 - 130, logoY - 55, 260, 90, 12);

    // Crown
    const crownX = w / 2;
    const crownY = logoY - 52;
    shield.fillStyle(0xd4a854);
    shield.fillRect(crownX - 18, crownY, 36, 14);
    shield.fillTriangle(crownX - 18, crownY, crownX - 12, crownY - 12, crownX - 6, crownY);
    shield.fillTriangle(crownX - 6, crownY, crownX, crownY - 16, crownX + 6, crownY);
    shield.fillTriangle(crownX + 6, crownY, crownX + 12, crownY - 12, crownX + 18, crownY);
    shield.fillStyle(0xe74c3c);
    shield.fillCircle(crownX - 12, crownY - 5, 2.5);
    shield.fillStyle(0x3498db);
    shield.fillCircle(crownX, crownY - 8, 2.5);
    shield.fillStyle(0x2ecc71);
    shield.fillCircle(crownX + 12, crownY - 5, 2.5);

    const tcgText = this.add.text(w / 2, logoY - 18, 'TCG', {
      fontFamily: '"Georgia", "Times New Roman", serif',
      fontSize: '42px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#1a1a3e',
      strokeThickness: 6,
    }).setOrigin(0.5).setDepth(6);

    const empireText = this.add.text(w / 2, logoY + 20, 'EMPIRE', {
      fontFamily: '"Georgia", "Times New Roman", serif',
      fontSize: '36px',
      color: '#ffd700',
      fontStyle: 'bold',
      stroke: '#8b6914',
      strokeThickness: 4,
    }).setOrigin(0.5).setDepth(6);

    // Taglines
    const taglines = ['Build your shop.', 'Build your collection.', 'Build your empire.'];
    const tagY = h * 0.46;
    taglines.forEach((line, i) => {
      const t = this.add.text(w / 2, tagY + i * 22, line, {
        fontFamily: '"Segoe UI", Arial, sans-serif',
        fontSize: '15px',
        color: '#cccccc',
      }).setOrigin(0.5).setDepth(6);
      t.setAlpha(0);
      this.tweens.add({ targets: t, alpha: 1, y: t.y - 5, duration: 500, delay: 400 + i * 150, ease: 'Power2' });
    });

    // Entrance animation for logo
    [shield, tcgText, empireText].forEach((el, i) => {
      el.setAlpha(0);
      this.tweens.add({ targets: el, alpha: 1, duration: 600, delay: i * 80, ease: 'Back.easeOut' });
    });

    // Buttons
    const hasSave = SaveManager.hasSave();
    if (hasSave) {
      const saveInfo = SaveManager.getSaveInfo();
      this.createImageButton(w / 2, h * 0.62, 200, 50, 'CONTINUE  ▶', () => {
        SaveManager.load();
        this.startGame();
      });
      if (saveInfo) {
        this.add.text(w / 2, h * 0.62 + 32, `Day ${saveInfo.day} · £${saveInfo.cash.toLocaleString('en-GB')}`, {
          fontFamily: '"Segoe UI", Arial, sans-serif',
          fontSize: '11px',
          color: '#aaa',
        }).setOrigin(0.5).setDepth(12);
      }

      const newY = h * 0.73;
      const newBg = this.add.rectangle(w / 2, newY, 140, 34, 0x2c2c4a, 0.8);
      newBg.setStrokeStyle(1, 0x555588);
      newBg.setInteractive({ useHandCursor: true });
      newBg.setDepth(10);
      const newText = this.add.text(w / 2, newY, 'NEW GAME', {
        fontFamily: '"Segoe UI", Arial, sans-serif',
        fontSize: '14px',
        color: '#cccccc',
      }).setOrigin(0.5).setDepth(11);

      newBg.on('pointerover', () => {
        newBg.setFillStyle(0x3a3a5c);
        this.tweens.add({ targets: [newBg, newText], scaleX: 1.05, scaleY: 1.05, duration: 80 });
      });
      newBg.on('pointerout', () => {
        newBg.setFillStyle(0x2c2c4a);
        this.tweens.add({ targets: [newBg, newText], scaleX: 1, scaleY: 1, duration: 80 });
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
      this.createImageButton(w / 2, h * 0.62, 220, 50, 'PLAY  ▶', () => {
        GameState.reset();
        Inventory.reset();
        Collection.reset();
        PriceManager.reset();
        Decorations.reset();
        this.startGame();
      });
    }

    this.drawLoadingBar(w, h);
    this.createSparkles(w, h);
  }

  private drawLoadingBar(w: number, h: number): void {
    const barY = h * 0.91;
    const barW = 160;
    const barH = 6;

    const loadText = this.add.text(w / 2, barY + 12, 'LOADING...', {
      fontFamily: '"Segoe UI", Arial, sans-serif',
      fontSize: '9px',
      color: '#999999',
    }).setOrigin(0.5).setDepth(8);

    const barBg = this.add.rectangle(w / 2, barY, barW, barH, 0x333333, 0.5);
    barBg.setStrokeStyle(1, 0x555555, 0.3);
    barBg.setDepth(8);

    const barFill = this.add.rectangle(w / 2 - barW / 2, barY, 0, barH, 0xd4a854);
    barFill.setOrigin(0, 0.5);
    barFill.setDepth(9);

    this.tweens.add({
      targets: barFill,
      displayWidth: barW,
      duration: 1200,
      ease: 'Power1',
      onComplete: () => {
        this.tweens.add({
          targets: [barBg, barFill, loadText],
          alpha: 0,
          duration: 400,
          delay: 300,
        });
      },
    });
  }

  private createSparkles(w: number, h: number): void {
    for (let i = 0; i < 10; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h * 0.7;
      const star = this.add.star(x, y, 4, 1, 3, 0xffd700, 0);
      star.setDepth(6);
      this.tweens.add({
        targets: star,
        alpha: { from: 0, to: 0.4 },
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
}
