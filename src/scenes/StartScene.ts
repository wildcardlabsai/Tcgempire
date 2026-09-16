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
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor('#1a1a2e');

    this.drawBackground(width, height);
    this.drawFloatingCards(width, height);
    this.drawCounter(width, height);
    this.drawCardPacks(width, height);
    this.drawLogo(width, height);
    this.drawTaglines(width, height);
    this.createButtons(width, height);
    this.drawLoadingBar(width, height);
    this.createSparkles(width, height);
  }

  private drawBackground(w: number, h: number): void {
    const g = this.add.graphics();
    g.setDepth(0);

    // Warm shop interior gradient
    g.fillGradientStyle(0x2a1f14, 0x2a1f14, 0x1a1a2e, 0x1a1a2e);
    g.fillRect(0, 0, w, h);

    // Warm ambient glow from top
    g.fillGradientStyle(0x3d2b1a, 0x3d2b1a, 0x2a1f14, 0x2a1f14, 0.6, 0.6, 0, 0);
    g.fillRect(0, 0, w, h * 0.4);

    // Shelving silhouettes — left wall
    g.fillStyle(0x1e1610, 0.7);
    g.fillRect(0, h * 0.05, w * 0.22, h * 0.55);
    // Shelf lines
    g.fillStyle(0x3a2a1a, 0.6);
    for (let i = 0; i < 4; i++) {
      const sy = h * 0.1 + i * (h * 0.12);
      g.fillRect(w * 0.02, sy, w * 0.18, 4);
      // Mini product rectangles on shelves
      for (let j = 0; j < 5; j++) {
        const px = w * 0.03 + j * (w * 0.035);
        const ph = 12 + Math.random() * 10;
        const color = [0x8b3a3a, 0x3a5c8b, 0x3a8b5c, 0x8b7a3a, 0x6b3a8b][j];
        g.fillStyle(color, 0.5);
        g.fillRect(px, sy - ph, w * 0.028, ph);
      }
    }

    // Shelving silhouettes — right wall
    g.fillStyle(0x1e1610, 0.7);
    g.fillRect(w * 0.78, h * 0.05, w * 0.22, h * 0.55);
    g.fillStyle(0x3a2a1a, 0.6);
    for (let i = 0; i < 4; i++) {
      const sy = h * 0.1 + i * (h * 0.12);
      g.fillRect(w * 0.80, sy, w * 0.18, 4);
      for (let j = 0; j < 5; j++) {
        const px = w * 0.81 + j * (w * 0.035);
        const ph = 12 + Math.random() * 10;
        const color = [0x8b5a3a, 0x3a8b8b, 0x5c3a8b, 0x8b3a6b, 0x3a8b3a][j];
        g.fillStyle(color, 0.5);
        g.fillRect(px, sy - ph, w * 0.028, ph);
      }
    }

    // Ceiling pendant lamps
    const lampPositions = [w * 0.25, w * 0.5, w * 0.75];
    for (const lx of lampPositions) {
      // Cord
      g.lineStyle(2, 0x444444, 0.6);
      g.lineBetween(lx, 0, lx, h * 0.04);
      // Lamp shade
      g.fillStyle(0x333333, 0.7);
      g.fillTriangle(lx - 16, h * 0.04, lx + 16, h * 0.04, lx, h * 0.01);
      // Warm glow beneath lamp
      g.fillStyle(0xffaa44, 0.08);
      g.fillCircle(lx, h * 0.06, 60);
      g.fillStyle(0xffcc66, 0.04);
      g.fillCircle(lx, h * 0.1, 100);
    }

    // Glass display case silhouette — right side
    g.fillStyle(0x1a2a3a, 0.5);
    g.fillRect(w * 0.72, h * 0.3, w * 0.08, h * 0.25);
    g.lineStyle(1, 0x88ccff, 0.2);
    g.strokeRect(w * 0.72, h * 0.3, w * 0.08, h * 0.25);

    // Plant silhouettes
    this.drawPlantSilhouette(g, w * 0.02, h * 0.35, 0.7);
    this.drawPlantSilhouette(g, w * 0.95, h * 0.25, 0.5);

    // Wall posters
    const posterColors = [0x8b3333, 0x33558b, 0x338b55, 0x8b7733];
    const posterX = [w * 0.28, w * 0.42, w * 0.58, w * 0.72];
    for (let i = 0; i < 4; i++) {
      g.fillStyle(posterColors[i], 0.35);
      g.fillRect(posterX[i] - 14, h * 0.06, 28, 36);
      g.lineStyle(1, 0xffffff, 0.1);
      g.strokeRect(posterX[i] - 14, h * 0.06, 28, 36);
    }

    // Vignette overlay
    g.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0.5, 0.5, 0, 0);
    g.fillRect(0, 0, w, h * 0.08);
    g.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0, 0, 0.6, 0.6);
    g.fillRect(0, h * 0.88, w, h * 0.12);

    // Side vignettes
    g.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0.4, 0, 0.4, 0);
    g.fillRect(0, 0, w * 0.1, h);
    g.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0, 0.4, 0, 0.4);
    g.fillRect(w * 0.9, 0, w * 0.1, h);
  }

  private drawPlantSilhouette(g: Phaser.GameObjects.Graphics, x: number, y: number, alpha: number): void {
    g.fillStyle(0x1a3a1a, alpha);
    // Pot
    g.fillRect(x - 8, y, 16, 14);
    g.fillRect(x - 10, y, 20, 4);
    // Leaves
    g.fillStyle(0x2a5a2a, alpha * 0.8);
    g.fillEllipse(x, y - 8, 20, 16);
    g.fillEllipse(x - 8, y - 14, 14, 12);
    g.fillEllipse(x + 8, y - 12, 14, 14);
    g.fillEllipse(x, y - 20, 12, 10);
  }

  private drawFloatingCards(w: number, h: number): void {
    const cardDefs = [
      { x: w * 0.08, y: h * 0.18, angle: -20, color: 0xe74c3c, depth: 3 },
      { x: w * 0.15, y: h * 0.42, angle: -12, color: 0x3498db, depth: 2 },
      { x: w * 0.92, y: h * 0.12, angle: 15, color: 0x9b59b6, depth: 3 },
      { x: w * 0.88, y: h * 0.38, angle: 22, color: 0x2ecc71, depth: 2 },
      { x: w * 0.05, y: h * 0.65, angle: -8, color: 0xf39c12, depth: 2 },
      { x: w * 0.95, y: h * 0.60, angle: 10, color: 0xe74c3c, depth: 2 },
    ];

    for (const def of cardDefs) {
      const g = this.add.graphics();
      g.setDepth(def.depth);

      // Card shadow
      g.fillStyle(0x000000, 0.3);
      g.fillRoundedRect(-18, -26, 38, 54, 3);

      // Card body
      g.fillStyle(0xf5f0e8);
      g.fillRoundedRect(-20, -28, 38, 54, 3);
      g.lineStyle(1.5, 0xd4a854, 0.8);
      g.strokeRoundedRect(-20, -28, 38, 54, 3);

      // Card art area
      g.fillStyle(def.color, 0.8);
      g.fillRect(-16, -24, 30, 28);

      // Card art — creature silhouette
      g.fillStyle(0x000000, 0.3);
      g.fillEllipse(-1, -14, 18, 12);
      g.fillTriangle(-6, -20, 4, -20, -1, -26);

      // Card text lines
      g.fillStyle(0x888888, 0.5);
      g.fillRect(-14, 8, 26, 2);
      g.fillRect(-14, 13, 20, 2);
      g.fillRect(-14, 18, 22, 2);

      const container = this.add.container(def.x, def.y, [g]);
      container.setAngle(def.angle);
      container.setDepth(def.depth);
      container.setAlpha(0);

      // Float in animation
      this.tweens.add({
        targets: container,
        alpha: 0.85,
        y: def.y - 5,
        duration: 800,
        delay: 200 + Math.random() * 600,
        ease: 'Power2',
      });

      // Gentle float
      this.tweens.add({
        targets: container,
        y: def.y - 8,
        angle: def.angle + (Math.random() > 0.5 ? 3 : -3),
        duration: 2500 + Math.random() * 1500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }
  }

  private drawCounter(w: number, h: number): void {
    const g = this.add.graphics();
    g.setDepth(4);

    const counterY = h * 0.78;
    const counterH = h * 0.22;

    // Counter front face — warm wood
    g.fillGradientStyle(0x5c3a1e, 0x5c3a1e, 0x4a2e16, 0x4a2e16);
    g.fillRect(0, counterY, w, counterH);

    // Counter top surface — polished
    g.fillGradientStyle(0x7a5030, 0x7a5030, 0x6a4428, 0x6a4428);
    g.fillRect(0, counterY - 6, w, 10);

    // Gold trim on counter edge
    g.fillStyle(0xd4a854, 0.7);
    g.fillRect(0, counterY - 7, w, 2);

    // Wood grain lines
    g.lineStyle(1, 0x4a2a12, 0.2);
    for (let i = 0; i < 8; i++) {
      const ly = counterY + 10 + i * (counterH / 8);
      g.lineBetween(0, ly, w, ly);
    }

    // Counter highlight
    g.fillStyle(0xffffff, 0.04);
    g.fillRect(0, counterY - 6, w, 5);
  }

  private drawCardPacks(w: number, h: number): void {
    const counterY = h * 0.78;

    // Left card pack stack
    this.drawPackStack(w * 0.12, counterY - 24, -5, 0x2a3a6a, 'GENESIS');
    // Right card pack + binder
    this.drawPackStack(w * 0.82, counterY - 20, 4, 0x2a3a6a, 'GENESIS');
    this.drawBinder(w * 0.9, counterY - 18, 6);

    // Scattered loose cards on counter
    this.drawLooseCards(w * 0.35, counterY - 16);
    this.drawLooseCards(w * 0.6, counterY - 14);
  }

  private drawPackStack(x: number, y: number, angle: number, color: number, label: string): void {
    const container = this.add.container(x, y);
    container.setDepth(5);
    container.setAngle(angle);

    const g = this.add.graphics();

    // Stack of packs (3 layers)
    for (let i = 2; i >= 0; i--) {
      const ox = i * 2;
      const oy = -i * 3;
      // Pack shadow
      g.fillStyle(0x000000, 0.2);
      g.fillRoundedRect(-28 + ox + 2, -18 + oy + 2, 56, 36, 3);
      // Pack body
      g.fillStyle(color);
      g.fillRoundedRect(-28 + ox, -18 + oy, 56, 36, 3);
      // Pack art stripe
      g.fillStyle(0xd4a854, 0.6);
      g.fillRect(-24 + ox, -14 + oy, 48, 4);
      g.fillRect(-24 + ox, 8 + oy, 48, 4);
      // Foil effect
      g.fillStyle(0xffffff, 0.05);
      g.fillRect(-28 + ox, -18 + oy, 56, 12);
    }

    // Label text on top pack
    const text = this.add.text(0, -4, label, {
      fontFamily: '"Georgia", serif',
      fontSize: '8px',
      color: '#d4a854',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const subText = this.add.text(0, 5, 'TRADING CARD GAME', {
      fontFamily: '"Segoe UI", sans-serif',
      fontSize: '5px',
      color: '#aaaaaa',
    }).setOrigin(0.5);

    container.add([g, text, subText]);

    // Subtle entrance animation
    container.setAlpha(0);
    this.tweens.add({
      targets: container,
      alpha: 1,
      y: y - 3,
      duration: 600,
      delay: 400,
      ease: 'Power2',
    });
  }

  private drawBinder(x: number, y: number, angle: number): void {
    const container = this.add.container(x, y);
    container.setDepth(5);
    container.setAngle(angle);

    const g = this.add.graphics();

    // Binder body
    g.fillStyle(0x1a1a3a);
    g.fillRoundedRect(-22, -16, 44, 32, 2);
    g.lineStyle(1, 0x333366, 0.6);
    g.strokeRoundedRect(-22, -16, 44, 32, 2);

    // Spine
    g.fillStyle(0x2a2a4a);
    g.fillRect(-22, -16, 6, 32);

    // Cover label
    const text = this.add.text(2, -4, 'GENESIS', {
      fontFamily: '"Georgia", serif',
      fontSize: '7px',
      color: '#d4a854',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Crown icon on cover
    g.fillStyle(0xd4a854, 0.6);
    g.fillTriangle(-2, -12, 6, -12, 2, -15);
    g.fillRect(-1, -12, 6, 2);

    container.add([g, text]);
    container.setAlpha(0);
    this.tweens.add({
      targets: container,
      alpha: 1,
      duration: 600,
      delay: 500,
      ease: 'Power2',
    });
  }

  private drawLooseCards(x: number, y: number): void {
    const colors = [0xe74c3c, 0x3498db, 0x2ecc71];
    for (let i = 0; i < 3; i++) {
      const g = this.add.graphics();
      g.setDepth(5);

      const cx = x + i * 14 - 14;
      const cy = y + i * 2;
      const ang = -8 + i * 8;

      // Card
      g.fillStyle(0xf5f0e8);
      g.fillRoundedRect(cx - 10, cy - 14, 20, 28, 2);
      g.lineStyle(0.5, 0xcccccc, 0.5);
      g.strokeRoundedRect(cx - 10, cy - 14, 20, 28, 2);
      // Art
      g.fillStyle(colors[i], 0.7);
      g.fillRect(cx - 8, cy - 12, 16, 14);
      // Text lines
      g.fillStyle(0xaaaaaa, 0.4);
      g.fillRect(cx - 7, cy + 5, 14, 1.5);
      g.fillRect(cx - 7, cy + 8, 10, 1.5);

      g.setAngle(ang);
    }
  }

  private drawLogo(w: number, h: number): void {
    const logoY = h * 0.22;

    // Logo shield/banner background
    const shield = this.add.graphics();
    shield.setDepth(10);

    // Shield shape — dark navy
    shield.fillStyle(0x1a1a3e);
    shield.fillRoundedRect(w / 2 - 130, logoY - 55, 260, 90, 12);
    // Gold border
    shield.lineStyle(3, 0xd4a854);
    shield.strokeRoundedRect(w / 2 - 130, logoY - 55, 260, 90, 12);
    // Inner border
    shield.lineStyle(1, 0xd4a854, 0.4);
    shield.strokeRoundedRect(w / 2 - 124, logoY - 49, 248, 78, 10);

    // Crown above logo
    const crownG = this.add.graphics();
    crownG.setDepth(11);
    const crownX = w / 2;
    const crownY = logoY - 52;

    // Crown body — gold
    crownG.fillStyle(0xd4a854);
    crownG.fillRect(crownX - 18, crownY, 36, 14);
    // Crown points
    crownG.fillTriangle(crownX - 18, crownY, crownX - 12, crownY - 12, crownX - 6, crownY);
    crownG.fillTriangle(crownX - 6, crownY, crownX, crownY - 16, crownX + 6, crownY);
    crownG.fillTriangle(crownX + 6, crownY, crownX + 12, crownY - 12, crownX + 18, crownY);
    // Crown gems
    crownG.fillStyle(0xe74c3c);
    crownG.fillCircle(crownX - 12, crownY - 5, 2.5);
    crownG.fillStyle(0x3498db);
    crownG.fillCircle(crownX, crownY - 8, 2.5);
    crownG.fillStyle(0x2ecc71);
    crownG.fillCircle(crownX + 12, crownY - 5, 2.5);
    // Crown base band
    crownG.fillStyle(0xc49844);
    crownG.fillRect(crownX - 18, crownY + 10, 36, 4);

    // "TCG" text — large, white with dark stroke
    const tcgText = this.add.text(w / 2, logoY - 18, 'TCG', {
      fontFamily: '"Georgia", "Times New Roman", serif',
      fontSize: '42px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#1a1a3e',
      strokeThickness: 6,
    });
    tcgText.setOrigin(0.5);
    tcgText.setDepth(12);

    // "EMPIRE" text — gold gradient style
    const empireText = this.add.text(w / 2, logoY + 20, 'EMPIRE', {
      fontFamily: '"Georgia", "Times New Roman", serif',
      fontSize: '36px',
      color: '#ffd700',
      fontStyle: 'bold',
      stroke: '#8b6914',
      strokeThickness: 4,
    });
    empireText.setOrigin(0.5);
    empireText.setDepth(12);

    // Entrance animation
    const logoElements = [shield, crownG, tcgText, empireText];
    logoElements.forEach((el, i) => {
      el.setAlpha(0);
      if ('y' in el && typeof el.y === 'number') {
        const origY = el.y;
        el.y = origY + 15;
        this.tweens.add({
          targets: el,
          alpha: 1,
          y: origY,
          duration: 700,
          delay: i * 80,
          ease: 'Back.easeOut',
        });
      } else {
        this.tweens.add({
          targets: el,
          alpha: 1,
          duration: 700,
          delay: i * 80,
          ease: 'Back.easeOut',
        });
      }
    });
  }

  private drawTaglines(w: number, h: number): void {
    const taglines = [
      'Build your shop.',
      'Build your collection.',
      'Build your empire.',
    ];

    const tagY = h * 0.48;
    taglines.forEach((line, i) => {
      const t = this.add.text(w / 2, tagY + i * 22, line, {
        fontFamily: '"Segoe UI", Arial, sans-serif',
        fontSize: '15px',
        color: '#dddddd',
      });
      t.setOrigin(0.5);
      t.setAlpha(0);
      t.setDepth(10);
      this.tweens.add({
        targets: t,
        alpha: 1,
        y: t.y - 5,
        duration: 500,
        delay: 600 + i * 180,
        ease: 'Power2',
      });
    });
  }

  private createButtons(w: number, h: number): void {
    const hasSave = SaveManager.hasSave();
    const depth = 10;

    if (hasSave) {
      const saveInfo = SaveManager.getSaveInfo();
      this.createGoldenButton(w, h * 0.62, 'CONTINUE  ▶', depth, () => {
        SaveManager.load();
        this.startGame();
      });

      if (saveInfo) {
        const infoText = this.add.text(w / 2, h * 0.62 + 30, `Day ${saveInfo.day} · £${saveInfo.cash.toLocaleString('en-GB')}`, {
          fontFamily: '"Segoe UI", Arial, sans-serif',
          fontSize: '11px',
          color: '#aaa',
        });
        infoText.setOrigin(0.5);
        infoText.setDepth(depth + 1);
      }

      // New Game — smaller, secondary
      const newY = h * 0.72;
      const newBg = this.add.rectangle(w / 2, newY, 140, 34, 0x2c2c4a, 0.8);
      newBg.setStrokeStyle(1, 0x555588);
      newBg.setInteractive({ useHandCursor: true });
      newBg.setDepth(depth);

      const newText = this.add.text(w / 2, newY, 'NEW GAME', {
        fontFamily: '"Segoe UI", Arial, sans-serif',
        fontSize: '14px',
        color: '#cccccc',
      });
      newText.setOrigin(0.5);
      newText.setDepth(depth + 1);

      newBg.on('pointerover', () => {
        newBg.setFillStyle(0x3a3a5c);
        this.tweens.add({ targets: [newBg, newText], scaleX: 1.04, scaleY: 1.04, duration: 80 });
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
      this.createGoldenButton(w, h * 0.62, 'PLAY  ▶', depth, () => {
        GameState.reset();
        Inventory.reset();
        Collection.reset();
        PriceManager.reset();
        Decorations.reset();
        this.startGame();
      });
    }
  }

  private createGoldenButton(w: number, y: number, label: string, depth: number, onClick: () => void): void {
    const btnW = 220;
    const btnH = 50;

    // Button glow behind
    const glow = this.add.ellipse(w / 2, y, btnW + 30, btnH + 20, 0xd4a854, 0.12);
    glow.setDepth(depth - 1);

    // Button background — golden pill shape
    const btnBg = this.add.graphics();
    btnBg.setDepth(depth);

    // Golden gradient effect
    btnBg.fillStyle(0xf0b030);
    btnBg.fillRoundedRect(w / 2 - btnW / 2, y - btnH / 2, btnW, btnH, btnH / 2);
    // Highlight on top half
    btnBg.fillStyle(0xffcc44, 0.5);
    btnBg.fillRoundedRect(w / 2 - btnW / 2 + 3, y - btnH / 2 + 3, btnW - 6, btnH / 2 - 3, { tl: btnH / 2 - 3, tr: btnH / 2 - 3, bl: 0, br: 0 });
    // Dark border
    btnBg.lineStyle(3, 0x8b6914);
    btnBg.strokeRoundedRect(w / 2 - btnW / 2, y - btnH / 2, btnW, btnH, btnH / 2);

    const btnText = this.add.text(w / 2, y, label, {
      fontFamily: '"Segoe UI", Arial, sans-serif',
      fontSize: '22px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#8b6914',
      strokeThickness: 2,
    });
    btnText.setOrigin(0.5);
    btnText.setDepth(depth + 1);

    // Hit area
    const hitArea = this.add.rectangle(w / 2, y, btnW, btnH, 0x000000, 0);
    hitArea.setInteractive({ useHandCursor: true });
    hitArea.setDepth(depth + 2);

    // Hover effects
    hitArea.on('pointerover', () => {
      this.tweens.add({ targets: [btnBg, btnText, hitArea, glow], scaleX: 1.06, scaleY: 1.06, duration: 100 });
    });
    hitArea.on('pointerout', () => {
      this.tweens.add({ targets: [btnBg, btnText, hitArea, glow], scaleX: 1, scaleY: 1, duration: 100 });
    });
    hitArea.on('pointerdown', onClick);

    // Pulse glow animation
    this.tweens.add({
      targets: glow,
      alpha: { from: 0.12, to: 0.25 },
      scaleX: { from: 1, to: 1.08 },
      scaleY: { from: 1, to: 1.08 },
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Entrance animation
    [btnBg, btnText, hitArea, glow].forEach((el) => {
      el.setAlpha(0);
      this.tweens.add({
        targets: el,
        alpha: el === glow ? 0.12 : 1,
        duration: 500,
        delay: 800,
        ease: 'Power2',
      });
    });
  }

  private drawLoadingBar(w: number, h: number): void {
    const barY = h * 0.92;
    const barW = 160;
    const barH = 6;

    // "LOADING..." text
    const loadText = this.add.text(w / 2, barY - 14, 'LOADING...', {
      fontFamily: '"Segoe UI", Arial, sans-serif',
      fontSize: '10px',
      color: '#888888',
    });
    loadText.setOrigin(0.5);
    loadText.setDepth(8);

    // Bar background
    const barBg = this.add.rectangle(w / 2, barY, barW, barH, 0x333333, 0.6);
    barBg.setStrokeStyle(1, 0x555555, 0.4);
    barBg.setDepth(8);

    // Bar fill — animates to full then fades away
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
    for (let i = 0; i < 16; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h * 0.75;
      const star = this.add.star(x, y, 4, 1, 3, 0xffd700, 0);
      star.setDepth(6);
      this.tweens.add({
        targets: star,
        alpha: { from: 0, to: 0.5 },
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
