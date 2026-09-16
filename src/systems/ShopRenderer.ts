import Phaser from 'phaser';
import { SHOP, FURNITURE, DOOR, FurnitureItem } from '../config/shop-layout';
import { Inventory } from '../data/Inventory';
import { Decorations, DECORATION_CATALOG } from '../data/Decorations';

export class ShopRenderer {
  private scene: Phaser.Scene;
  private productSprites: Phaser.GameObjects.GameObject[] = [];
  private decorSprites: Phaser.GameObjects.GameObject[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  draw(): void {
    this.drawFloor();
    this.drawWalls();
    this.drawDoor();
    this.drawEnvironmentDetails();
    this.drawFurniture();
    this.refreshProducts();
    this.refreshDecorations();
  }

  refreshProducts(): void {
    for (const s of this.productSprites) s.destroy();
    this.productSprites = [];
    this.drawProducts();
  }

  refreshDecorations(): void {
    for (const s of this.decorSprites) s.destroy();
    this.decorSprites = [];
    this.drawDecorations();
  }

  private drawFloor(): void {
    const g = this.scene.add.graphics();
    const w = SHOP.wallThickness;

    g.fillStyle(0xb8956a, 1);
    g.fillRect(0, 0, SHOP.width, SHOP.height);

    const plankH = 20;
    const plankColors = [0xc4a87c, 0xbfa075, 0xc9ad82, 0xb89b6e, 0xc0a478];
    for (let y = w; y < SHOP.height - w; y += plankH) {
      const row = Math.floor(y / plankH);
      const offset = (row % 2) * 50;
      const baseColor = plankColors[row % plankColors.length];
      g.fillStyle(baseColor, 1);
      g.fillRect(w, y, SHOP.width - w * 2, plankH - 1);

      g.lineStyle(1, 0xa08050, 0.3);
      g.lineBetween(w, y + plankH - 1, SHOP.width - w, y + plankH - 1);

      const plankW = 70;
      g.lineStyle(1, 0x9a7a5a, 0.15);
      for (let x = w + offset; x < SHOP.width - w; x += plankW) {
        g.lineBetween(x, y, x, y + plankH - 1);
      }

      if (row % 4 === 1) {
        const kx = w + 30 + (row * 37) % (SHOP.width - w * 2 - 60);
        g.fillStyle(0xa88a60, 0.2);
        g.fillCircle(kx, y + plankH / 2, 2.5);
        g.fillStyle(0x907850, 0.15);
        g.fillCircle(kx, y + plankH / 2, 1.5);
      }
    }

    g.fillStyle(0x3a2a1a, 0.08);
    g.fillRect(w, w, SHOP.width - w * 2, 20);
    g.fillRect(w, w, 20, SHOP.height - w * 2);
    g.fillRect(SHOP.width - w - 20, w, 20, SHOP.height - w * 2);

    g.setDepth(0);
  }

  private drawWalls(): void {
    const g = this.scene.add.graphics();
    const w = SHOP.wallThickness;

    g.fillStyle(0x2c2c4a, 1);
    g.fillRect(0, 0, SHOP.width, w + 30);
    g.fillRect(0, 0, w, SHOP.height);
    g.fillRect(SHOP.width - w, 0, w, SHOP.height);
    g.fillRect(0, SHOP.height - w, DOOR.x - DOOR.width / 2, w);
    g.fillRect(DOOR.x + DOOR.width / 2, SHOP.height - w, SHOP.width - (DOOR.x + DOOR.width / 2), w);

    g.fillStyle(0x5c4033, 1);
    g.fillRect(w, w + 30, SHOP.width - w * 2, 30);
    g.fillRect(w, w, 30, SHOP.height - w * 2);
    g.fillRect(SHOP.width - w - 30, w, 30, SHOP.height - w * 2);

    g.lineStyle(2, 0xd4a854, 0.6);
    g.lineBetween(w + 30, w + 30, SHOP.width - w - 30, w + 30);
    g.lineBetween(w + 30, w + 60, SHOP.width - w - 30, w + 60);

    g.lineStyle(1, 0xd4a854, 0.3);
    g.lineBetween(w + 30, w + 30, w + 30, SHOP.height - w);
    g.lineBetween(SHOP.width - w - 30, w + 30, SHOP.width - w - 30, SHOP.height - w);

    g.lineStyle(2, 0xd4a854, 0.5);
    g.lineBetween(w, w + 2, SHOP.width - w, w + 2);
    g.lineBetween(w, w + 5, SHOP.width - w, w + 5);

    g.fillStyle(0x1a1a36, 0.4);
    g.fillRect(w, w + 60, SHOP.width - w * 2, 8);

    const lampPositions = [180, 400, 620];
    for (const lx of lampPositions) {
      g.fillStyle(0x3a3a5c, 1);
      g.fillRect(lx - 6, w + 8, 12, 8);
      g.fillStyle(0xd4a854, 1);
      g.fillRect(lx - 8, w + 14, 16, 4);

      const warmG = this.scene.add.graphics();
      warmG.fillStyle(0xffd700, 0.04);
      warmG.fillCircle(lx, w + 50, 50);
      warmG.fillStyle(0xffd700, 0.02);
      warmG.fillCircle(lx, w + 70, 80);
      warmG.setDepth(0);
    }

    g.setDepth(1);
  }

  private drawDoor(): void {
    const g = this.scene.add.graphics();
    const dx = DOOR.x - DOOR.width / 2;
    const dy = SHOP.height - SHOP.wallThickness;

    g.fillStyle(0x5c4033, 1);
    g.fillRect(dx - 4, dy - 4, DOOR.width + 8, SHOP.wallThickness + 4);

    g.fillStyle(0x4a8a5a, 0.8);
    g.fillRect(dx, dy, DOOR.width / 2 - 2, SHOP.wallThickness);
    g.fillRect(dx + DOOR.width / 2 + 2, dy, DOOR.width / 2 - 2, SHOP.wallThickness);

    g.fillStyle(0x5aaa6a, 0.3);
    g.fillRect(dx + 4, dy + 2, DOOR.width / 2 - 10, SHOP.wallThickness - 4);
    g.fillRect(dx + DOOR.width / 2 + 6, dy + 2, DOOR.width / 2 - 10, SHOP.wallThickness - 4);

    g.lineStyle(1, 0x3a6a4a, 0.5);
    g.lineBetween(dx + DOOR.width / 2, dy, dx + DOOR.width / 2, dy + SHOP.wallThickness);

    g.fillStyle(0xd4a854, 1);
    g.fillCircle(dx + DOOR.width / 2 - 6, dy + SHOP.wallThickness / 2, 2);
    g.fillCircle(dx + DOOR.width / 2 + 6, dy + SHOP.wallThickness / 2, 2);

    const matG = this.scene.add.graphics();
    const matW = DOOR.width + 20;
    const matH = 20;
    const matX = DOOR.x - matW / 2;
    const matY = dy - matH - 4;
    matG.fillStyle(0x4a3a2a, 0.8);
    matG.fillRoundedRect(matX, matY, matW, matH, 3);
    matG.fillStyle(0x5a4a3a, 0.5);
    matG.fillRoundedRect(matX + 3, matY + 3, matW - 6, matH - 6, 2);
    matG.lineStyle(1, 0x6a5a4a, 0.3);
    matG.strokeRoundedRect(matX, matY, matW, matH, 3);
    matG.setDepth(1);

    this.scene.add.text(DOOR.x, matY + matH / 2, 'WELCOME', {
      fontFamily: '"Georgia", serif',
      fontSize: '8px',
      color: '#d4a854',
      fontStyle: 'bold',
    }).setOrigin(0.5).setAlpha(0.6).setDepth(2);

    g.setDepth(1);
  }

  private drawEnvironmentDetails(): void {
    this.drawPlants();
    this.drawWallPosters();
    this.drawDisplayCase();
    this.drawShopSign();
  }

  private drawPlants(): void {
    const plantPositions = [
      { x: 30, y: 560, size: 1.2 },
      { x: 770, y: 560, size: 1.0 },
      { x: 770, y: 80, size: 0.9 },
      { x: 160, y: 430, size: 0.8 },
    ];

    for (const p of plantPositions) {
      const g = this.scene.add.graphics();
      const s = p.size;

      g.fillStyle(0x8b5e3c, 1);
      g.fillRoundedRect(p.x - 7 * s, p.y + 2 * s, 14 * s, 12 * s, 2);
      g.fillStyle(0x9a6e4c, 0.7);
      g.fillRoundedRect(p.x - 8 * s, p.y + 1 * s, 16 * s, 4 * s, 1);

      g.fillStyle(0x6b4226, 0.6);
      g.fillRect(p.x - 2 * s, p.y + 10 * s, 4 * s, 6 * s);

      g.fillStyle(0x228b22, 1);
      g.fillCircle(p.x, p.y - 4 * s, 8 * s);
      g.fillStyle(0x2ca02c, 0.8);
      g.fillCircle(p.x - 4 * s, p.y - 8 * s, 6 * s);
      g.fillCircle(p.x + 5 * s, p.y - 6 * s, 5 * s);
      g.fillStyle(0x3cb043, 0.6);
      g.fillCircle(p.x - 2 * s, p.y - 10 * s, 4 * s);
      g.fillCircle(p.x + 3 * s, p.y - 9 * s, 3.5 * s);

      g.fillStyle(0x000000, 0.12);
      g.fillEllipse(p.x, p.y + 16 * s, 16 * s, 6 * s);

      g.setDepth(2);
    }
  }

  private drawWallPosters(): void {
    const posters = [
      { x: 30, y: 250, w: 30, h: 40, color: 0xc0392b, creature: 'dragon' },
      { x: 30, y: 350, w: 28, h: 36, color: 0x2980b9, creature: 'sea' },
      { x: 770, y: 250, w: 30, h: 40, color: 0x27ae60, creature: 'forest' },
      { x: 770, y: 380, w: 26, h: 34, color: 0x8e44ad, creature: 'arcane' },
    ];

    for (const p of posters) {
      const g = this.scene.add.graphics();

      g.fillStyle(0xffffff, 0.9);
      g.fillRect(p.x - p.w / 2 - 2, p.y - p.h / 2 - 2, p.w + 4, p.h + 4);

      g.fillStyle(p.color, 1);
      g.fillRect(p.x - p.w / 2, p.y - p.h / 2, p.w, p.h);

      g.fillStyle(0x000000, 0.2);
      g.fillRect(p.x - p.w / 2, p.y - p.h / 2, p.w, p.h / 3);

      if (p.creature === 'dragon') {
        g.fillStyle(0xffd700, 0.6);
        g.fillTriangle(p.x - 6, p.y + 6, p.x, p.y - 8, p.x + 6, p.y + 6);
        g.fillTriangle(p.x - 10, p.y + 2, p.x - 4, p.y - 2, p.x - 2, p.y + 6);
        g.fillTriangle(p.x + 2, p.y + 6, p.x + 4, p.y - 2, p.x + 10, p.y + 2);
      } else if (p.creature === 'sea') {
        g.fillStyle(0x74b9ff, 0.7);
        for (let i = 0; i < 3; i++) {
          g.fillCircle(p.x - 4 + i * 4, p.y + 2 + Math.sin(i) * 3, 3);
        }
      } else if (p.creature === 'forest') {
        g.fillStyle(0x55efc4, 0.7);
        g.fillTriangle(p.x, p.y - 8, p.x - 8, p.y + 6, p.x + 8, p.y + 6);
        g.fillStyle(0x00b894, 0.5);
        g.fillTriangle(p.x, p.y - 4, p.x - 6, p.y + 8, p.x + 6, p.y + 8);
      } else {
        g.fillStyle(0xdfe6e9, 0.6);
        g.fillCircle(p.x, p.y, 6);
        g.fillStyle(0xa29bfe, 0.7);
        g.fillCircle(p.x, p.y, 3);
      }

      g.fillStyle(0xffffff, 0.5);
      g.fillRect(p.x - p.w / 2 + 2, p.y + p.h / 2 - 6, p.w - 4, 4);

      g.lineStyle(1, 0x333333, 0.4);
      g.strokeRect(p.x - p.w / 2 - 2, p.y - p.h / 2 - 2, p.w + 4, p.h + 4);

      g.setDepth(2);
    }
  }

  private drawDisplayCase(): void {
    const g = this.scene.add.graphics();
    const cx = 260;
    const cy = 340;
    const w = 100;
    const h = 50;

    g.fillStyle(0x000000, 0.12);
    g.fillRect(cx - w / 2 + 4, cy - h / 2 + 4, w, h);

    g.fillStyle(0x2c2c2c, 1);
    g.fillRect(cx - w / 2, cy - h / 2, w, h);

    g.fillStyle(0x3c3c3c, 1);
    g.fillRect(cx - w / 2, cy - h / 2, w, 4);

    g.fillStyle(0x88bbdd, 0.2);
    g.fillRect(cx - w / 2 + 3, cy - h / 2 + 3, w - 6, h - 6);

    g.fillStyle(0xffffff, 0.08);
    g.fillRect(cx - w / 2 + 5, cy - h / 2 + 5, w / 3, h - 14);

    const cardColors = [0xe74c3c, 0x3498db, 0x2ecc71, 0xf39c12, 0x9b59b6];
    for (let i = 0; i < 5; i++) {
      const cardX = cx - 30 + i * 14;
      const cardY = cy - 4;
      g.fillStyle(cardColors[i], 0.7);
      g.fillRoundedRect(cardX, cardY, 10, 14, 1);
      g.fillStyle(0xffd700, 0.3);
      g.fillRect(cardX + 2, cardY + 2, 6, 3);
    }

    g.lineStyle(1, 0x555555, 0.5);
    g.strokeRect(cx - w / 2, cy - h / 2, w, h);

    g.setDepth(2);
  }

  private drawShopSign(): void {
    const g = this.scene.add.graphics();
    const sx = DOOR.x;
    const sy = SHOP.height - SHOP.wallThickness - 28;

    g.fillStyle(0x2c2c4a, 0.9);
    g.fillRoundedRect(sx - 60, sy - 10, 120, 20, 4);
    g.lineStyle(1, 0xd4a854, 0.6);
    g.strokeRoundedRect(sx - 60, sy - 10, 120, 20, 4);

    g.setDepth(5);

    this.scene.add.text(sx, sy, 'TCG EMPIRE', {
      fontFamily: '"Georgia", serif',
      fontSize: '10px',
      color: '#d4a854',
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(6).setAlpha(0.8);
  }

  private drawFurniture(): void {
    for (const f of FURNITURE) {
      if (f.id === 'counter') {
        this.drawCounter(f);
      } else if (f.id.startsWith('shelf')) {
        this.drawShelf(f);
      } else if (f.id === 'computer') {
        this.drawComputer(f);
      } else if (f.id === 'storage') {
        this.drawStorage(f);
      }
    }
  }

  private drawCounter(f: FurnitureItem): void {
    const g = this.scene.add.graphics();
    const x = f.x - f.width / 2;
    const y = f.y - f.height / 2;

    g.fillStyle(0x000000, 0.15);
    g.fillRoundedRect(x + 4, y + 4, f.width, f.height, 3);

    g.fillStyle(0x4a2e14, 1);
    g.fillRoundedRect(x, y, f.width, f.height, 3);
    g.fillStyle(0x5c3a1e, 1);
    g.fillRoundedRect(x, y, f.width, f.height - 8, 3);

    g.fillStyle(0x6b4830, 1);
    g.fillRoundedRect(x + 2, y + 2, f.width - 4, 6, 2);

    g.lineStyle(1, 0x7a5a3a, 0.4);
    g.lineBetween(x + 4, y + f.height / 3, x + f.width - 4, y + f.height / 3);
    g.lineBetween(x + 4, y + f.height * 2 / 3, x + f.width - 4, y + f.height * 2 / 3);

    g.fillStyle(0x88bbdd, 0.15);
    g.fillRoundedRect(x + 2, y + 10, f.width - 4, f.height / 3 - 4, 2);

    const cardColors = [0xe74c3c, 0x3498db, 0xf39c12];
    for (let i = 0; i < 3; i++) {
      g.fillStyle(cardColors[i], 0.5);
      g.fillRoundedRect(x + 10 + i * 18, y + 14, 12, 16, 1);
    }

    g.fillStyle(0xffffff, 0.06);
    g.fillRect(x + 4, y + 12, f.width / 3, f.height / 4);

    const regX = x + f.width - 50;
    const regY = y + 4;
    g.fillStyle(0x2c2c3c, 1);
    g.fillRoundedRect(regX, regY, 30, 20, 2);
    g.fillStyle(0x3a4a6a, 1);
    g.fillRect(regX + 3, regY + 3, 24, 10);
    g.fillStyle(0x4a8a4a, 0.8);
    g.fillRect(regX + 5, regY + 5, 10, 4);
    g.fillStyle(0x1a1a2a, 1);
    g.fillRect(regX + 3, regY + 15, 24, 3);

    const termX = x + f.width - 18;
    const termY = y + 6;
    g.fillStyle(0x1a1a1a, 1);
    g.fillRoundedRect(termX, termY, 12, 16, 2);
    g.fillStyle(0x4a8aca, 0.7);
    g.fillRect(termX + 2, termY + 2, 8, 6);

    g.lineStyle(1, 0x3a2210, 0.4);
    g.strokeRoundedRect(x, y, f.width, f.height, 3);

    g.setDepth(2);

    this.scene.add.text(f.x - 20, f.y + f.height / 2 + 6, 'CHECKOUT', {
      fontFamily: '"Georgia", serif',
      fontSize: '8px',
      color: '#d4a854',
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(3).setAlpha(0.6);
  }

  private drawShelf(f: FurnitureItem): void {
    const g = this.scene.add.graphics();
    const x = f.x - f.width / 2;
    const y = f.y - f.height / 2;

    g.fillStyle(0x000000, 0.12);
    g.fillRect(x + 3, y + 3, f.width, f.height);

    g.fillStyle(0x4a3322, 1);
    g.fillRect(x, y, f.width, f.height);
    g.fillStyle(0x5c4033, 1);
    g.fillRect(x + 2, y + 2, f.width - 4, f.height - 4);

    const tiers = 3;
    const tierH = f.height / tiers;
    for (let i = 0; i <= tiers; i++) {
      const sy = y + tierH * i;
      g.fillStyle(0x6b5040, 1);
      g.fillRect(x, sy, f.width, 4);
      g.fillStyle(0x7a6050, 0.7);
      g.fillRect(x + 1, sy, f.width - 2, 2);
      g.fillStyle(0x3a2a1a, 0.4);
      g.fillRect(x + 1, sy + 3, f.width - 2, 1);
    }

    const dividers = Math.floor(f.width / 60);
    for (let i = 1; i < dividers; i++) {
      const dx = x + (f.width / dividers) * i;
      g.fillStyle(0x5c4a3a, 0.5);
      g.fillRect(dx - 1, y, 2, f.height);
    }

    g.lineStyle(1, 0x3a2a1a, 0.5);
    g.strokeRect(x, y, f.width, f.height);

    const isLeft = f.id === 'shelf-left';
    const labels = isLeft
      ? ['BOOSTERS', 'DECKS']
      : ['ACCESSORIES', 'BOXES'];
    const sectionW = f.width / labels.length;

    for (let i = 0; i < labels.length; i++) {
      const lx = x + sectionW * i + sectionW / 2;
      const ly = y - 10;

      const labelG = this.scene.add.graphics();
      const tw = labels[i].length * 6 + 12;
      labelG.fillStyle(0x2c2c4a, 0.9);
      labelG.fillRoundedRect(lx - tw / 2, ly - 7, tw, 14, 3);
      labelG.lineStyle(1, 0xd4a854, 0.4);
      labelG.strokeRoundedRect(lx - tw / 2, ly - 7, tw, 14, 3);
      labelG.setDepth(5);

      this.scene.add.text(lx, ly, labels[i], {
        fontFamily: '"Segoe UI", Arial, sans-serif',
        fontSize: '7px',
        color: '#d4a854',
        fontStyle: 'bold',
      }).setOrigin(0.5).setDepth(6);
    }

    g.setDepth(2);
  }

  private drawComputer(f: FurnitureItem): void {
    const g = this.scene.add.graphics();
    const x = f.x - f.width / 2;
    const y = f.y - f.height / 2;

    g.fillStyle(0x000000, 0.12);
    g.fillRoundedRect(x + 3, y + 3, f.width, f.height, 3);

    g.fillStyle(0x5c4033, 1);
    g.fillRoundedRect(x, y, f.width, f.height, 3);
    g.fillStyle(0x6b4e3a, 1);
    g.fillRoundedRect(x, y, f.width, 5, 3);
    g.lineStyle(1, 0x3a2a1a, 0.4);
    g.strokeRoundedRect(x, y, f.width, f.height, 3);

    const monW = 34;
    const monH = 26;
    const monX = f.x - monW / 2 - 4;
    const monY = y + 8;

    g.fillStyle(0x1a1a2e, 1);
    g.fillRoundedRect(monX - 3, monY - 3, monW + 6, monH + 6, 3);
    g.fillStyle(0x2a3a6a, 1);
    g.fillRoundedRect(monX, monY, monW, monH, 2);

    g.fillStyle(0x3a5a9a, 0.5);
    g.fillRect(monX + 3, monY + 3, monW - 6, 4);
    g.fillStyle(0x4a6aaa, 0.3);
    g.fillRect(monX + 3, monY + 9, monW - 6, 2);
    g.fillRect(monX + 3, monY + 13, monW / 2, 2);
    g.fillRect(monX + 3, monY + 17, monW - 8, 2);
    g.fillStyle(0x3aaa5a, 0.5);
    g.fillCircle(monX + monW - 5, monY + monH - 5, 2);

    g.fillStyle(0x1a1a2e, 1);
    g.fillRect(f.x - 7, monY + monH + 3, 6, 5);
    g.fillRect(f.x - 11, monY + monH + 7, 14, 3);

    const kbY = y + f.height - 14;
    g.fillStyle(0x2c2c3c, 1);
    g.fillRoundedRect(f.x - 16, kbY, 30, 10, 2);
    g.fillStyle(0x4c4c5c, 0.4);
    for (let kx = 0; kx < 6; kx++) {
      for (let ky = 0; ky < 2; ky++) {
        g.fillRect(f.x - 13 + kx * 4.5, kbY + 2 + ky * 4, 3, 2.5);
      }
    }

    const mouseX = f.x + 16;
    const mouseY = kbY + 2;
    g.fillStyle(0x2c2c3c, 1);
    g.fillRoundedRect(mouseX, mouseY, 6, 8, 2);

    const chairX = f.x;
    const chairY = f.y + f.height / 2 + 18;
    const chairG = this.scene.add.graphics();
    chairG.fillStyle(0x000000, 0.1);
    chairG.fillEllipse(chairX, chairY + 10, 24, 8);
    chairG.fillStyle(0x2c2c4a, 1);
    chairG.fillRoundedRect(chairX - 10, chairY - 2, 20, 14, 4);
    chairG.fillStyle(0x3a3a5c, 0.8);
    chairG.fillRoundedRect(chairX - 8, chairY, 16, 10, 3);
    chairG.fillStyle(0x4a4a6c, 0.3);
    chairG.fillRect(chairX - 6, chairY + 2, 12, 3);
    chairG.setDepth(2);

    g.setDepth(2);
  }

  private drawStorage(f: FurnitureItem): void {
    const g = this.scene.add.graphics();
    const x = f.x - f.width / 2;
    const y = f.y - f.height / 2;

    g.fillStyle(0x3a3a3a, 0.15);
    g.fillRect(x - 2, y - 2, f.width + 8, f.height + 8);
    g.fillStyle(0x4a3a2a, 0.5);
    g.fillRect(x - 2, y - 2, f.width + 4, f.height + 4);

    g.fillStyle(0x5c4a3a, 1);
    g.fillRect(x, y, f.width, f.height);
    g.lineStyle(1, 0x7a6a5a, 0.4);
    g.strokeRect(x, y, f.width, f.height);

    const shelfCount = 3;
    const shelfH = f.height / shelfCount;
    for (let i = 0; i <= shelfCount; i++) {
      const sy = y + shelfH * i;
      g.fillStyle(0x6a5a4a, 1);
      g.fillRect(x, sy, f.width, 3);
    }

    const boxColors = [0x8a7050, 0x7a6a50, 0x9a8060, 0x6a5a40];
    const boxes = [
      { bx: 4, by: 6, bw: 20, bh: 18 },
      { bx: 26, by: 8, bw: 22, bh: 16 },
      { bx: 52, by: 6, bw: 18, bh: 18 },
      { bx: 4, by: shelfH + 6, bw: 24, bh: 16 },
      { bx: 30, by: shelfH + 8, bw: 20, bh: 14 },
      { bx: 54, by: shelfH + 4, bw: 22, bh: 20 },
      { bx: 8, by: shelfH * 2 + 6, bw: 26, bh: 18 },
      { bx: 38, by: shelfH * 2 + 8, bw: 22, bh: 16 },
      { bx: 64, by: shelfH * 2 + 6, bw: 18, bh: 18 },
    ];

    for (let i = 0; i < boxes.length; i++) {
      const b = boxes[i];
      const bc = boxColors[i % boxColors.length];
      g.fillStyle(bc, 1);
      g.fillRect(x + b.bx, y + b.by, b.bw, b.bh);
      g.lineStyle(1, 0x5a4a32, 0.5);
      g.strokeRect(x + b.bx, y + b.by, b.bw, b.bh);
      g.lineStyle(1, 0x8a7a60, 0.3);
      g.lineBetween(x + b.bx + 3, y + b.by + b.bh / 2, x + b.bx + b.bw - 3, y + b.by + b.bh / 2);
    }

    g.setDepth(2);

    const labelG = this.scene.add.graphics();
    const lx = f.x;
    const ly = y - 10;
    const tw = 58;
    labelG.fillStyle(0x2c2c4a, 0.9);
    labelG.fillRoundedRect(lx - tw / 2, ly - 7, tw, 14, 3);
    labelG.lineStyle(1, 0xd4a854, 0.4);
    labelG.strokeRoundedRect(lx - tw / 2, ly - 7, tw, 14, 3);
    labelG.setDepth(5);

    this.scene.add.text(f.x, y - 10, 'STORAGE', {
      fontFamily: '"Segoe UI", Arial, sans-serif',
      fontSize: '7px',
      color: '#d4a854',
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(6);
  }

  private drawProducts(): void {
    const shelves = FURNITURE.filter((f) => f.id.startsWith('shelf'));
    const shelfProducts = Inventory.getShelfProducts();
    if (shelfProducts.length === 0) return;

    for (const shelf of shelves) {
      const x = shelf.x - shelf.width / 2;
      const y = shelf.y - shelf.height / 2;
      const tiers = 3;
      const tierH = shelf.height / tiers;
      const slotsPerTier = Math.floor(shelf.width / 22);

      let slotIndex = 0;
      for (const { product, quantity } of shelfProducts) {
        if (slotIndex >= tiers * slotsPerTier) break;

        const tier = Math.floor(slotIndex / slotsPerTier);
        const col = slotIndex % slotsPerTier;
        const px = x + 12 + col * 20;
        const py = y + tier * tierH + tierH / 2 + 2;

        const g = this.scene.add.graphics();
        const pw = 14;
        const ph = 18;

        if (product.category === 'booster') {
          g.fillStyle(product.color, 1);
          g.fillRoundedRect(px - pw / 2, py - ph / 2, pw, ph, 2);
          const lighter = Phaser.Display.Color.IntegerToColor(product.color).lighten(30).color;
          g.fillStyle(lighter, 0.4);
          g.fillRect(px - pw / 2 + 2, py - ph / 2 + 2, pw - 4, 4);
          g.fillStyle(0xffd700, 0.3);
          g.fillRect(px - 3, py + 1, 6, 2);
          g.lineStyle(1, 0x000000, 0.2);
          g.strokeRoundedRect(px - pw / 2, py - ph / 2, pw, ph, 2);
        } else if (product.category === 'deck') {
          g.fillStyle(product.color, 1);
          g.fillRoundedRect(px - pw / 2 - 1, py - ph / 2, pw + 2, ph, 2);
          g.fillStyle(0xffffff, 0.2);
          g.fillRect(px - 4, py - ph / 2 + 3, 8, 5);
          g.lineStyle(1, 0x000000, 0.2);
          g.strokeRoundedRect(px - pw / 2 - 1, py - ph / 2, pw + 2, ph, 2);
        } else if (product.category === 'box') {
          g.fillStyle(product.color, 1);
          g.fillRect(px - pw / 2 - 2, py - ph / 2 + 3, pw + 4, ph - 6);
          g.fillStyle(0xffd700, 0.3);
          g.fillRect(px - pw / 2, py - 2, pw, 3);
          g.lineStyle(1, 0x000000, 0.2);
          g.strokeRect(px - pw / 2 - 2, py - ph / 2 + 3, pw + 4, ph - 6);
        } else {
          g.fillStyle(product.color, 0.9);
          g.fillRoundedRect(px - pw / 2, py - ph / 2 + 3, pw, ph - 6, 3);
          g.lineStyle(1, 0x000000, 0.15);
          g.strokeRoundedRect(px - pw / 2, py - ph / 2 + 3, pw, ph - 6, 3);
        }

        g.setDepth(4);
        this.productSprites.push(g);

        if (quantity > 1) {
          const qtyLabel = this.scene.add.text(px, py + ph / 2 + 2, `×${quantity}`, {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '6px',
            color: '#ffffff',
            backgroundColor: 'rgba(0,0,0,0.6)',
            padding: { x: 2, y: 1 },
          });
          qtyLabel.setOrigin(0.5).setDepth(5);
          this.productSprites.push(qtyLabel);
        }

        slotIndex++;
      }
    }
  }

  private drawDecorations(): void {
    const placed = Decorations.getPlaced();
    for (const p of placed) {
      const def = DECORATION_CATALOG.find(d => d.id === p.id);
      if (!def) continue;

      const g = this.scene.add.graphics();

      if (def.id.startsWith('poster')) {
        g.fillStyle(0xffffff, 0.9);
        g.fillRect(p.x - def.width / 2 - 1, p.y - def.height / 2 - 1, def.width + 2, def.height + 2);
        g.fillStyle(def.color, 1);
        g.fillRect(p.x - def.width / 2, p.y - def.height / 2, def.width, def.height);
        g.fillStyle(0xffffff, 0.2);
        g.fillRect(p.x - def.width / 2 + 2, p.y - def.height / 2 + 2, def.width - 4, def.height / 3);
        g.lineStyle(1, 0x000000, 0.2);
        g.strokeRect(p.x - def.width / 2 - 1, p.y - def.height / 2 - 1, def.width + 2, def.height + 2);
      } else if (def.id.startsWith('plant')) {
        const potW = def.id.includes('large') ? 14 : 10;
        const potH = def.id.includes('large') ? 10 : 8;
        g.fillStyle(0x8b4513, 1);
        g.fillRect(p.x - potW / 2, p.y + 2, potW, potH);
        g.fillStyle(0xa0522d, 0.6);
        g.fillRect(p.x - potW / 2 - 1, p.y + 1, potW + 2, 3);
        g.fillStyle(0x228b22, 1);
        const leafR = def.id.includes('large') ? 9 : 6;
        g.fillCircle(p.x, p.y - leafR / 2, leafR);
        g.fillStyle(0x2ecc71, 0.6);
        g.fillCircle(p.x - 3, p.y - leafR / 2 - 2, leafR * 0.6);
        g.fillCircle(p.x + 3, p.y - leafR / 2 - 1, leafR * 0.5);
      } else if (def.id === 'rug-welcome') {
        g.fillStyle(def.color, 0.5);
        g.fillRoundedRect(p.x - def.width / 2, p.y - def.height / 2, def.width, def.height, 4);
        g.lineStyle(1, def.color, 0.3);
        g.strokeRoundedRect(p.x - def.width / 2 + 3, p.y - def.height / 2 + 3, def.width - 6, def.height - 6, 2);
      } else if (def.id === 'display-case') {
        g.fillStyle(0x2c2c2c, 1);
        g.fillRect(p.x - def.width / 2, p.y - def.height / 2, def.width, def.height);
        g.fillStyle(0x5588cc, 0.3);
        g.fillRect(p.x - def.width / 2 + 2, p.y - def.height / 2 + 2, def.width - 4, def.height - 4);
        g.fillStyle(0xffd700, 0.7);
        g.fillCircle(p.x, p.y, 4);
        g.lineStyle(1, 0x444444, 0.6);
        g.strokeRect(p.x - def.width / 2, p.y - def.height / 2, def.width, def.height);
      } else if (def.id === 'neon-sign') {
        g.fillStyle(0x1a1a1a, 1);
        g.fillRoundedRect(p.x - def.width / 2, p.y - def.height / 2, def.width, def.height, 3);
        g.fillStyle(def.color, 0.8);
        g.fillRoundedRect(p.x - def.width / 2 + 3, p.y - def.height / 2 + 3, def.width - 6, def.height - 6, 2);
      } else if (def.id === 'card-banner') {
        g.fillStyle(def.color, 0.9);
        g.fillRect(p.x - def.width / 2, p.y - def.height / 2, def.width, def.height);
        g.fillStyle(0xffffff, 0.3);
        g.fillRect(p.x - def.width / 2 + 4, p.y - 1, def.width - 8, 3);
        g.lineStyle(1, 0xdaa520, 0.6);
        g.strokeRect(p.x - def.width / 2, p.y - def.height / 2, def.width, def.height);
      } else if (def.id === 'premium-flooring') {
        g.fillStyle(def.color, 0.35);
        g.fillRoundedRect(p.x - def.width / 2, p.y - def.height / 2, def.width, def.height, 6);
        g.lineStyle(1, def.color, 0.2);
        g.strokeRoundedRect(p.x - def.width / 2 + 4, p.y - def.height / 2 + 4, def.width - 8, def.height - 8, 4);
      } else if (def.id === 'trophy-shelf') {
        g.fillStyle(0x5c3a1e, 1);
        g.fillRect(p.x - def.width / 2, p.y - def.height / 2, def.width, def.height);
        g.fillStyle(0x6b4226, 1);
        g.fillRect(p.x - def.width / 2, p.y - 1, def.width, 3);
        g.fillStyle(0xffd700, 0.9);
        g.fillRect(p.x - 4, p.y - def.height / 2 + 3, 3, 7);
        g.fillCircle(p.x - 2.5, p.y - def.height / 2 + 2, 3);
        g.lineStyle(1, 0x4d3810, 0.5);
        g.strokeRect(p.x - def.width / 2, p.y - def.height / 2, def.width, def.height);
      } else {
        g.fillStyle(def.color, 0.8);
        g.fillRoundedRect(p.x - def.width / 2, p.y - def.height / 2, def.width, def.height, 3);
        g.lineStyle(1, 0xffffff, 0.3);
        g.strokeRoundedRect(p.x - def.width / 2, p.y - def.height / 2, def.width, def.height, 3);
      }

      g.setDepth(3);
      this.decorSprites.push(g);
    }
  }
}
