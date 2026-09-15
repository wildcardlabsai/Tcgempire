import Phaser from 'phaser';
import { SHOP, FURNITURE, DOOR } from '../config/shop-layout';
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

    g.fillStyle(0xdec9a8, 1);
    g.fillRect(0, 0, SHOP.width, SHOP.height);

    const plankH = 24;
    for (let y = w; y < SHOP.height - w; y += plankH) {
      const offset = (Math.floor(y / plankH) % 2) * 30;
      const shade = (Math.floor(y / plankH) % 3 === 0) ? 0xd4bc96 : 0xe0ccad;
      g.fillStyle(shade, 1);
      g.fillRect(w, y, SHOP.width - w * 2, plankH - 1);

      g.lineStyle(1, 0xc9b48e, 0.4);
      g.lineBetween(w, y + plankH - 1, SHOP.width - w, y + plankH - 1);

      g.lineStyle(1, 0xc4a882, 0.2);
      const plankW = 80;
      for (let x = w + offset; x < SHOP.width - w; x += plankW) {
        g.lineBetween(x, y, x, y + plankH - 1);
      }
    }

    g.lineStyle(1, 0xb8a07a, 0.15);
    for (let x = w + 12; x < SHOP.width - w; x += 160) {
      const ky = w + Math.floor(Math.random() * 8) * plankH + 8;
      g.fillStyle(0xc4a882, 0.2);
      g.fillCircle(x, ky, 2);
    }

    g.setDepth(0);
  }

  private drawWalls(): void {
    const g = this.scene.add.graphics();
    const w = SHOP.wallThickness;

    g.fillStyle(0x6b5740, 1);
    g.fillRect(0, 0, SHOP.width, w);
    g.fillRect(0, 0, w, SHOP.height);
    g.fillRect(SHOP.width - w, 0, w, SHOP.height);
    g.fillRect(0, SHOP.height - w, DOOR.x - DOOR.width / 2, w);
    g.fillRect(DOOR.x + DOOR.width / 2, SHOP.height - w, SHOP.width - (DOOR.x + DOOR.width / 2), w);

    g.fillStyle(0x7d6950, 1);
    g.fillRect(w, 0, SHOP.width - w * 2, w - 2);

    g.lineStyle(2, 0x8b7355, 1);
    g.lineBetween(w, w, SHOP.width - w, w);

    g.fillStyle(0x5a4a38, 1);
    g.fillRect(0, 0, w, 4);
    g.fillRect(SHOP.width - w, 0, w, 4);
    g.fillRect(0, 0, SHOP.width, 3);

    g.lineStyle(1, 0x9c8668, 0.6);
    g.lineBetween(w, w + 3, SHOP.width - w, w + 3);

    g.fillStyle(0x4d3d2e, 0.3);
    g.fillRect(w, w, SHOP.width - w * 2, 6);

    const trimY = w + 1;
    g.lineStyle(1, 0xa08560, 0.5);
    for (let x = w + 16; x < SHOP.width - w; x += 32) {
      g.lineBetween(x, trimY, x, trimY + 2);
    }

    g.setDepth(1);
  }

  private drawDoor(): void {
    const g = this.scene.add.graphics();
    const dx = DOOR.x - DOOR.width / 2;
    const dy = SHOP.height - SHOP.wallThickness;

    g.fillStyle(0x3d7a4a, 1);
    g.fillRect(dx, dy, DOOR.width, SHOP.wallThickness);

    g.lineStyle(1, 0x2d5a38, 0.6);
    g.lineBetween(dx + DOOR.width / 2, dy, dx + DOOR.width / 2, dy + SHOP.wallThickness);

    g.fillStyle(0x4a9a5a, 0.5);
    g.fillRect(dx + 2, dy + 2, DOOR.width / 2 - 3, SHOP.wallThickness - 4);
    g.fillRect(dx + DOOR.width / 2 + 1, dy + 2, DOOR.width / 2 - 3, SHOP.wallThickness - 4);

    const matG = this.scene.add.graphics();
    matG.fillStyle(0x6aaa7a, 0.7);
    const matW = DOOR.width + 8;
    const matH = 14;
    const matX = DOOR.x - matW / 2;
    const matY = dy - matH - 2;
    matG.fillRoundedRect(matX, matY, matW, matH, 3);
    matG.lineStyle(1, 0x5a9a6a, 0.4);
    matG.strokeRoundedRect(matX, matY, matW, matH, 3);
    matG.fillStyle(0x7aba8a, 0.3);
    matG.fillRect(matX + 4, matY + 3, matW - 8, 2);
    matG.fillRect(matX + 4, matY + 8, matW - 8, 2);
    matG.setDepth(1);

    this.scene.add
      .text(DOOR.x, matY + matH / 2, 'WELCOME', {
        fontFamily: '"Georgia", serif',
        fontSize: '7px',
        color: '#2d5a38',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setAlpha(0.7)
      .setDepth(2);

    g.setDepth(1);
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

  private drawCounter(f: typeof FURNITURE[0]): void {
    const g = this.scene.add.graphics();
    const x = f.x - f.width / 2;
    const y = f.y - f.height / 2;

    g.fillStyle(0x4a2e14, 0.3);
    g.fillRect(x + 4, y + 4, f.width, f.height);

    g.fillStyle(0x5c3a1e, 1);
    g.fillRect(x, y, f.width, f.height);

    g.fillStyle(0x6b4226, 1);
    g.fillRect(x, y, f.width, f.height - 6);

    g.lineStyle(1, 0x7a5030, 0.6);
    g.lineBetween(x + 2, y + f.height / 3, x + f.width - 2, y + f.height / 3);
    g.lineBetween(x + 2, y + (f.height * 2) / 3, x + f.width - 2, y + (f.height * 2) / 3);

    g.fillStyle(0x8b5a30, 1);
    g.fillRect(x, y, f.width, 4);

    g.lineStyle(1, 0x3d2210, 0.4);
    g.strokeRect(x, y, f.width, f.height);

    g.fillStyle(0xc0c0c0, 0.8);
    g.fillRect(x + f.width - 40, y + 3, 28, 3);
    g.fillRect(x + f.width - 36, y + 2, 20, 1);

    g.setDepth(2);

    this.scene.add
      .text(f.x, f.y + 2, 'CHECKOUT', {
        fontFamily: '"Georgia", serif',
        fontSize: '9px',
        color: '#c4956a',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setDepth(3)
      .setAlpha(0.7);
  }

  private drawShelf(f: typeof FURNITURE[0]): void {
    const g = this.scene.add.graphics();
    const x = f.x - f.width / 2;
    const y = f.y - f.height / 2;

    g.fillStyle(0x3d2e1a, 0.3);
    g.fillRect(x + 3, y + 3, f.width, f.height);

    g.fillStyle(0x6b5020, 1);
    g.fillRect(x, y, f.width, f.height);

    g.fillStyle(0x7a5e28, 1);
    g.fillRect(x + 2, y + 2, f.width - 4, f.height - 4);

    const shelfH = 4;
    const numShelves = 4;
    for (let i = 0; i <= numShelves; i++) {
      const sy = y + (f.height / numShelves) * i;
      g.fillStyle(0x8b6914, 1);
      g.fillRect(x, sy, f.width, shelfH);
      g.fillStyle(0x9a7820, 0.6);
      g.fillRect(x + 1, sy, f.width - 2, 1);
      g.fillStyle(0x5a4010, 0.4);
      g.fillRect(x + 1, sy + shelfH - 1, f.width - 2, 1);
    }

    g.fillStyle(0x5a4010, 0.4);
    g.fillRect(x + f.width / 2 - 1, y, 2, f.height);

    g.lineStyle(1, 0x4d3810, 0.5);
    g.strokeRect(x, y, f.width, f.height);

    g.setDepth(2);
  }

  private drawComputer(f: typeof FURNITURE[0]): void {
    const g = this.scene.add.graphics();
    const x = f.x - f.width / 2;
    const y = f.y - f.height / 2;

    g.fillStyle(0x3d2e1a, 0.3);
    g.fillRect(x + 3, y + 3, f.width, f.height);

    g.fillStyle(0x5c3a1e, 1);
    g.fillRect(x, y, f.width, f.height);
    g.fillStyle(0x6b4226, 1);
    g.fillRect(x, y, f.width, 4);
    g.lineStyle(1, 0x3d2210, 0.4);
    g.strokeRect(x, y, f.width, f.height);

    const monW = 28;
    const monH = 22;
    const monX = f.x - monW / 2;
    const monY = y + 8;

    g.fillStyle(0x1a1a2e, 1);
    g.fillRect(monX - 2, monY - 2, monW + 4, monH + 4);

    g.fillStyle(0x2a3a6a, 1);
    g.fillRect(monX, monY, monW, monH);

    g.fillStyle(0x4a6aaa, 0.4);
    g.fillRect(monX + 2, monY + 2, monW - 4, 3);
    g.fillRect(monX + 2, monY + 7, monW - 4, 2);
    g.fillRect(monX + 2, monY + 11, monW / 2 - 2, 2);

    g.fillStyle(0x3aaa5a, 0.6);
    g.fillCircle(monX + monW - 4, monY + monH - 4, 2);

    g.fillStyle(0x1a1a2e, 1);
    g.fillRect(f.x - 4, monY + monH + 2, 8, 4);
    g.fillRect(f.x - 8, monY + monH + 5, 16, 2);

    const kbY = y + f.height - 12;
    g.fillStyle(0x2c2c3c, 1);
    g.fillRect(f.x - 14, kbY, 28, 8);
    g.lineStyle(1, 0x3c3c4c, 0.5);
    g.strokeRect(f.x - 14, kbY, 28, 8);
    g.fillStyle(0x4c4c5c, 0.4);
    for (let kx = 0; kx < 6; kx++) {
      for (let ky = 0; ky < 2; ky++) {
        g.fillRect(f.x - 12 + kx * 4.5, kbY + 1.5 + ky * 3.5, 3, 2);
      }
    }

    g.setDepth(2);
  }

  private drawStorage(f: typeof FURNITURE[0]): void {
    const g = this.scene.add.graphics();
    const x = f.x - f.width / 2;
    const y = f.y - f.height / 2;

    g.fillStyle(0x3d2e1a, 0.25);
    g.fillRect(x + 3, y + 3, f.width, f.height);

    g.fillStyle(0x6b5c4a, 1);
    g.fillRect(x, y, f.width, f.height);

    g.lineStyle(1, 0x8a7a68, 0.5);
    g.strokeRect(x, y, f.width, f.height);

    const boxW = 22;
    const boxH = 18;
    const cols = 3;
    const rows = 2;
    const padX = (f.width - cols * boxW) / (cols + 1);
    const padY = (f.height - rows * boxH) / (rows + 1);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const bx = x + padX + c * (boxW + padX);
        const by = y + padY + r * (boxH + padY);
        g.fillStyle(0x8a7050, 1);
        g.fillRect(bx, by, boxW, boxH);
        g.lineStyle(1, 0x6a5a42, 0.6);
        g.strokeRect(bx, by, boxW, boxH);
        g.lineStyle(1, 0x9a8060, 0.4);
        g.lineBetween(bx + 3, by + boxH / 2, bx + boxW - 3, by + boxH / 2);
      }
    }

    this.scene.add
      .text(f.x, y - 6, 'STORAGE', {
        fontFamily: '"Georgia", serif',
        fontSize: '8px',
        color: '#8a7a68',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setDepth(3)
      .setAlpha(0.6);

    g.setDepth(2);
  }

  private drawProducts(): void {
    const shelves = FURNITURE.filter((f) => f.id.startsWith('shelf'));
    const shelfProducts = Inventory.getShelfProducts();
    if (shelfProducts.length === 0) return;

    for (const shelf of shelves) {
      const rows = 3;
      const cols = 2;
      const productW = 16;
      const productH = 22;
      const startY = shelf.y - shelf.height / 2 + 26;
      const gap = shelf.height / 4;

      let slotIndex = 0;
      for (const { product, quantity } of shelfProducts) {
        if (slotIndex >= rows * cols) break;

        const r = Math.floor(slotIndex / cols);
        const c = slotIndex % cols;
        const px = shelf.x - (cols - 1) * (productW + 4) / 2 + c * (productW + 4);
        const py = startY + r * gap;

        const g = this.scene.add.graphics();

        if (product.category === 'booster') {
          g.fillStyle(product.color, 1);
          g.fillRoundedRect(px - productW / 2, py - productH / 2, productW, productH, 2);
          g.lineStyle(1, 0x000000, 0.2);
          g.strokeRoundedRect(px - productW / 2, py - productH / 2, productW, productH, 2);

          const lighter = Phaser.Display.Color.IntegerToColor(product.color).lighten(30).color;
          g.fillStyle(lighter, 0.4);
          g.fillRect(px - productW / 2 + 2, py - productH / 2 + 2, productW - 4, 4);

          g.fillStyle(0xffffff, 0.3);
          g.fillRect(px - productW / 2 + 3, py + 2, productW - 6, 3);
        } else if (product.category === 'deck') {
          g.fillStyle(product.color, 1);
          g.fillRoundedRect(px - productW / 2 - 1, py - productH / 2, productW + 2, productH, 2);
          g.lineStyle(1, 0x000000, 0.2);
          g.strokeRoundedRect(px - productW / 2 - 1, py - productH / 2, productW + 2, productH, 2);
          g.fillStyle(0xffffff, 0.2);
          g.fillRect(px - 4, py - productH / 2 + 3, 8, 6);
        } else if (product.category === 'box') {
          g.fillStyle(product.color, 1);
          g.fillRect(px - productW / 2 - 2, py - productH / 2 + 2, productW + 4, productH - 4);
          g.lineStyle(1, 0x000000, 0.2);
          g.strokeRect(px - productW / 2 - 2, py - productH / 2 + 2, productW + 4, productH - 4);
          g.fillStyle(0xffd700, 0.3);
          g.fillRect(px - productW / 2, py - 2, productW, 4);
        } else {
          g.fillStyle(product.color, 0.9);
          g.fillRoundedRect(px - productW / 2, py - productH / 2 + 3, productW, productH - 6, 3);
          g.lineStyle(1, 0x000000, 0.15);
          g.strokeRoundedRect(px - productW / 2, py - productH / 2 + 3, productW, productH - 6, 3);
        }

        g.setDepth(4);
        this.productSprites.push(g);

        const qtyLabel = this.scene.add.text(px, py + productH / 2 + 4, `×${quantity}`, {
          fontFamily: '"Segoe UI", Arial, sans-serif',
          fontSize: '7px',
          color: '#ffffff',
          backgroundColor: 'rgba(0,0,0,0.55)',
          padding: { x: 2, y: 1 },
        });
        qtyLabel.setOrigin(0.5).setDepth(5);
        this.productSprites.push(qtyLabel);

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
        g.fillStyle(def.color, 0.2);
        g.fillRoundedRect(p.x - def.width / 2 + 6, p.y - def.height / 2 + 6, def.width - 12, def.height - 12, 2);
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
        g.fillStyle(0xffffff, 0.3);
        g.fillRect(p.x - def.width / 2 + 5, p.y - 1, def.width - 10, 2);
      } else if (def.id === 'card-banner') {
        g.fillStyle(def.color, 0.9);
        g.fillRect(p.x - def.width / 2, p.y - def.height / 2, def.width, def.height);
        g.fillStyle(0xffffff, 0.3);
        g.fillRect(p.x - def.width / 2 + 4, p.y - 1, def.width - 8, 3);
        g.lineStyle(1, 0xdaa520, 0.6);
        g.strokeRect(p.x - def.width / 2, p.y - def.height / 2, def.width, def.height);
        g.fillStyle(0x000000, 0.15);
        g.beginPath();
        g.moveTo(p.x - def.width / 2, p.y + def.height / 2);
        g.lineTo(p.x - def.width / 2 + 6, p.y + def.height / 2 + 5);
        g.lineTo(p.x - def.width / 2, p.y + def.height / 2 + 5);
        g.closePath();
        g.fill();
        g.beginPath();
        g.moveTo(p.x + def.width / 2, p.y + def.height / 2);
        g.lineTo(p.x + def.width / 2 - 6, p.y + def.height / 2 + 5);
        g.lineTo(p.x + def.width / 2, p.y + def.height / 2 + 5);
        g.closePath();
        g.fill();
      } else if (def.id === 'premium-flooring') {
        g.fillStyle(def.color, 0.35);
        g.fillRoundedRect(p.x - def.width / 2, p.y - def.height / 2, def.width, def.height, 6);
        g.lineStyle(1, def.color, 0.2);
        g.strokeRoundedRect(p.x - def.width / 2 + 4, p.y - def.height / 2 + 4, def.width - 8, def.height - 8, 4);
        for (let dx = 0; dx < def.width - 12; dx += 12) {
          g.fillStyle(def.color, 0.15);
          g.fillRect(p.x - def.width / 2 + 6 + dx, p.y - def.height / 2 + 6, 8, def.height - 12);
        }
      } else if (def.id === 'trophy-shelf') {
        g.fillStyle(0x5c3a1e, 1);
        g.fillRect(p.x - def.width / 2, p.y - def.height / 2, def.width, def.height);
        g.fillStyle(0x6b4226, 1);
        g.fillRect(p.x - def.width / 2, p.y - 1, def.width, 3);
        g.fillStyle(0xffd700, 0.9);
        g.fillRect(p.x - 4, p.y - def.height / 2 + 3, 3, 7);
        g.fillCircle(p.x - 2.5, p.y - def.height / 2 + 2, 3);
        g.fillStyle(0xc0c0c0, 0.8);
        g.fillRect(p.x + 6, p.y - def.height / 2 + 4, 3, 6);
        g.fillCircle(p.x + 7.5, p.y - def.height / 2 + 3, 2.5);
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
