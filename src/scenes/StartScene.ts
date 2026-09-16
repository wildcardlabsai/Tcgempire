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

  create(): void {
    const { width: w, height: h } = this.scale;
    this.cameras.main.setBackgroundColor('#1a1a2e');

    const hasImage = this.textures.exists('start-screen') &&
      this.textures.get('start-screen').key !== '__MISSING';

    if (hasImage) {
      this.createWithImage(w, h);
    } else {
      this.createFallback(w, h);
    }

  }

  private createWithImage(w: number, h: number): void {
    const bg = this.add.image(w / 2, h / 2, 'start-screen');
    const scaleX = w / bg.width;
    const scaleY = h / bg.height;
    const bgScale = Math.max(scaleX, scaleY);
    bg.setScale(bgScale);
    bg.setDepth(0);

    const hasSave = SaveManager.hasSave();

    if (hasSave) {
      const saveInfo = SaveManager.getSaveInfo();

      const continueBtn = this.createPlayButton(w / 2, h * 0.55, 220, 56, 'CONTINUE  ▶', () => {
        SaveManager.load();
        this.startGame();
      });

      if (saveInfo) {
        const infoText = this.add.text(w / 2, h * 0.55 + 36, `Day ${saveInfo.day} · £${saveInfo.cash.toLocaleString('en-GB')}`, {
          fontFamily: '"Segoe UI", Arial, sans-serif',
          fontSize: '12px',
          color: '#ffffff',
          stroke: '#000000',
          strokeThickness: 3,
        });
        infoText.setOrigin(0.5).setDepth(12);
      }

      const newBtn = this.createPlayButton(w / 2, h * 0.65, 160, 40, 'NEW GAME', () => {
        SaveManager.deleteSave();
        this.resetAndStart();
      });
      newBtn.setAlpha(0.8);

      [continueBtn, newBtn].forEach((el) => {
        el.setAlpha(0);
        this.tweens.add({ targets: el, alpha: 1, duration: 400, delay: 600, ease: 'Power2' });
      });
    } else {
      const playBtn = this.createPlayButton(w / 2, h * 0.55, 240, 60, 'PLAY  ▶', () => {
        this.resetAndStart();
      });

      playBtn.setAlpha(0);
      this.tweens.add({ targets: playBtn, alpha: 1, duration: 400, delay: 400, ease: 'Power2' });
    }

    this.drawLoadingBar(w, h);
    this.createSparkles(w, h);
  }

  private createPlayButton(x: number, y: number, bw: number, bh: number, label: string, onClick: () => void): Phaser.GameObjects.Container {
    const btnBg = this.add.graphics();
    btnBg.fillStyle(0xf0b030);
    btnBg.fillRoundedRect(-bw / 2, -bh / 2, bw, bh, bh / 2);
    btnBg.fillStyle(0xffcc44, 0.4);
    btnBg.fillRoundedRect(-bw / 2 + 3, -bh / 2 + 3, bw - 6, bh / 2 - 3, { tl: bh / 2 - 3, tr: bh / 2 - 3, bl: 0, br: 0 });
    btnBg.lineStyle(3, 0x8b6914);
    btnBg.strokeRoundedRect(-bw / 2, -bh / 2, bw, bh, bh / 2);

    const btnText = this.add.text(0, 0, label, {
      fontFamily: '"Segoe UI", Arial, sans-serif',
      fontSize: `${Math.max(16, Math.min(22, bh * 0.4))}px`,
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#8b6914',
      strokeThickness: 2,
    }).setOrigin(0.5);

    const hitArea = this.add.rectangle(0, 0, bw + 20, bh + 20, 0x000000, 0);

    const container = this.add.container(x, y, [hitArea, btnBg, btnText]);
    container.setSize(bw + 20, bh + 20);
    container.setInteractive({ useHandCursor: true });
    container.setDepth(11);

    container.on('pointerover', () => {
      this.tweens.add({ targets: container, scaleX: 1.06, scaleY: 1.06, duration: 80 });
    });
    container.on('pointerout', () => {
      this.tweens.add({ targets: container, scaleX: 1, scaleY: 1, duration: 80 });
    });
    container.on('pointerdown', () => {
      this.tweens.add({
        targets: container,
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 60,
        yoyo: true,
        onComplete: onClick,
      });
    });

    return container;
  }

  private createFallback(w: number, h: number): void {
    this.cameras.main.setBackgroundColor('#1a1a2e');

    const g = this.add.graphics();
    g.fillGradientStyle(0x2a1f14, 0x2a1f14, 0x1a1a2e, 0x1a1a2e);
    g.fillRect(0, 0, w, h);

    const shield = this.add.graphics();
    shield.setDepth(5);
    const logoY = h * 0.22;
    shield.fillStyle(0x1a1a3e);
    shield.fillRoundedRect(w / 2 - 130, logoY - 55, 260, 90, 12);
    shield.lineStyle(3, 0xd4a854);
    shield.strokeRoundedRect(w / 2 - 130, logoY - 55, 260, 90, 12);

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

    this.add.text(w / 2, logoY + 46, 'GENESIS TCG OFFICIAL RETAILER', {
      fontFamily: '"Segoe UI", Arial, sans-serif',
      fontSize: '10px',
      color: '#8a7a5a',
    }).setOrigin(0.5).setDepth(6).setAlpha(0.8);

    const taglines = ['Build your shop.', 'Build your collection.', 'Build your empire.'];
    const tagY = h * 0.40;
    taglines.forEach((line, i) => {
      const t = this.add.text(w / 2, tagY + i * 22, line, {
        fontFamily: '"Segoe UI", Arial, sans-serif',
        fontSize: '15px',
        color: '#cccccc',
      }).setOrigin(0.5).setDepth(6);
      t.setAlpha(0);
      this.tweens.add({ targets: t, alpha: 1, y: t.y - 5, duration: 500, delay: 400 + i * 150, ease: 'Power2' });
    });

    [shield, tcgText, empireText].forEach((el, i) => {
      el.setAlpha(0);
      this.tweens.add({ targets: el, alpha: 1, duration: 600, delay: i * 80, ease: 'Back.easeOut' });
    });

    const hasSave = SaveManager.hasSave();
    if (hasSave) {
      const saveInfo = SaveManager.getSaveInfo();
      this.createPlayButton(w / 2, h * 0.55, 220, 56, 'CONTINUE  ▶', () => {
        SaveManager.load();
        this.startGame();
      });
      if (saveInfo) {
        this.add.text(w / 2, h * 0.55 + 36, `Day ${saveInfo.day} · £${saveInfo.cash.toLocaleString('en-GB')}`, {
          fontFamily: '"Segoe UI", Arial, sans-serif',
          fontSize: '11px',
          color: '#aaa',
        }).setOrigin(0.5).setDepth(12);
      }

      this.createPlayButton(w / 2, h * 0.66, 160, 40, 'NEW GAME', () => {
        SaveManager.deleteSave();
        this.resetAndStart();
      });
    } else {
      this.createPlayButton(w / 2, h * 0.55, 240, 60, 'PLAY  ▶', () => {
        this.resetAndStart();
      });
    }

    this.drawLoadingBar(w, h);
    this.createSparkles(w, h);
  }

  private drawLoadingBar(w: number, h: number): void {
    const barY = h * 0.88;
    const barW = Math.min(180, w * 0.5);
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

  private resetAndStart(): void {
    GameState.reset();
    Inventory.reset();
    Collection.reset();
    PriceManager.reset();
    Decorations.reset();
    this.startGame();
  }

  private startGame(): void {
    this.cameras.main.fadeOut(400, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('ShopScene');
    });
  }
}
