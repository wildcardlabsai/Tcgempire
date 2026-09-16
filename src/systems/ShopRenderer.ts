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
    if (this.scene.textures.exists('floor')) {
      const floor = this.scene.add.image(SHOP.width / 2, SHOP.height / 2, 'floor');
      floor.setDepth(0);
    } else {
      const g = this.scene.add.graphics();
      g.fillStyle(SHOP.floorColor);
      g.fillRect(0, 0, SHOP.width, SHOP.height);
      g.setDepth(0);
    }
  }

  private drawWalls(): void {
    if (this.scene.textures.exists('walls')) {
      const walls = this.scene.add.image(SHOP.width / 2, SHOP.height / 2, 'walls');
      walls.setDepth(1);
    } else {
      const g = this.scene.add.graphics();
      g.fillStyle(SHOP.wallColor);
      g.fillRect(0, 0, SHOP.width, SHOP.wallThickness);
      g.fillRect(0, 0, SHOP.wallThickness, SHOP.height);
      g.fillRect(SHOP.width - SHOP.wallThickness, 0, SHOP.wallThickness, SHOP.height);
      g.setDepth(1);
    }
  }

  private drawDoor(): void {
    const dx = DOOR.x;
    const dy = SHOP.height - SHOP.wallThickness;

    if (this.scene.textures.exists('door')) {
      const door = this.scene.add.image(dx, dy + DOOR.height / 2, 'door');
      door.setDepth(1);
    }

    if (this.scene.textures.exists('welcome-mat')) {
      const mat = this.scene.add.image(dx, dy - 16, 'welcome-mat');
      mat.setDepth(1);
    } else {
      const matG = this.scene.add.graphics();
      const matW = DOOR.width + 20;
      const matH = 20;
      matG.fillStyle(0x4a3a2a, 0.8);
      matG.fillRoundedRect(dx - matW / 2, dy - matH - 4, matW, matH, 3);
      matG.setDepth(1);
    }

    this.scene.add.text(dx, dy - 16, 'WELCOME', {
      fontFamily: '"Georgia", serif',
      fontSize: '8px',
      color: '#d4a854',
      fontStyle: 'bold',
    }).setOrigin(0.5).setAlpha(0.6).setDepth(2);
  }

  private drawEnvironmentDetails(): void {
    this.drawPlants();
    this.drawWallPosters();
    this.drawDisplayCase();
    this.drawShopSign();
  }

  private drawPlants(): void {
    const plantPositions = [
      { x: 30, y: 555, key: 'plant-large' },
      { x: 770, y: 555, key: 'plant-small' },
      { x: 770, y: 80, key: 'plant-small' },
      { x: 160, y: 425, key: 'plant-small' },
    ];

    for (const p of plantPositions) {
      if (this.scene.textures.exists(p.key)) {
        const plant = this.scene.add.image(p.x, p.y, p.key);
        plant.setDepth(2);
      } else {
        const g = this.scene.add.graphics();
        g.fillStyle(0x228b22, 1);
        g.fillCircle(p.x, p.y - 8, 8);
        g.fillStyle(0x8b4513, 1);
        g.fillRect(p.x - 5, p.y, 10, 8);
        g.setDepth(2);
      }
    }
  }

  private drawWallPosters(): void {
    const posters = [
      { x: 30, y: 250, w: 30, h: 40, color: 0xc0392b, title: 'DRAGON', subtitle: 'REALMS' },
      { x: 30, y: 350, w: 28, h: 36, color: 0x2980b9, title: 'OCEAN', subtitle: 'LEGENDS' },
      { x: 770, y: 250, w: 30, h: 40, color: 0x27ae60, title: 'FOREST', subtitle: 'SPIRITS' },
      { x: 770, y: 380, w: 26, h: 34, color: 0x8e44ad, title: 'GENESIS', subtitle: 'TCG' },
    ];

    for (const p of posters) {
      const g = this.scene.add.graphics();

      g.fillStyle(0xffffff, 0.9);
      g.fillRect(p.x - p.w / 2 - 2, p.y - p.h / 2 - 2, p.w + 4, p.h + 4);

      const lighter = Phaser.Display.Color.IntegerToColor(p.color).lighten(20).color;
      g.fillStyle(p.color, 1);
      g.fillRect(p.x - p.w / 2, p.y - p.h / 2, p.w, p.h);
      g.fillStyle(lighter, 0.3);
      g.fillRect(p.x - p.w / 2, p.y - p.h / 2, p.w, p.h / 3);

      g.fillStyle(0x000000, 0.15);
      g.fillRect(p.x - p.w / 2, p.y + p.h / 2 - p.h / 4, p.w, p.h / 4);

      g.fillStyle(0xffd700, 0.6);
      g.fillRect(p.x - 8, p.y - 2, 16, 3);

      g.lineStyle(1, 0x333333, 0.4);
      g.strokeRect(p.x - p.w / 2 - 2, p.y - p.h / 2 - 2, p.w + 4, p.h + 4);

      g.setDepth(2);

      this.scene.add.text(p.x, p.y - 6, p.title, {
        fontFamily: '"Georgia", serif',
        fontSize: '5px',
        color: '#ffffff',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 1,
      }).setOrigin(0.5).setDepth(3).setAlpha(0.9);

      this.scene.add.text(p.x, p.y + 4, p.subtitle, {
        fontFamily: '"Georgia", serif',
        fontSize: '4px',
        color: '#ffd700',
        stroke: '#000000',
        strokeThickness: 1,
      }).setOrigin(0.5).setDepth(3).setAlpha(0.7);
    }
  }

  private drawDisplayCase(): void {
    const cx = 260;
    const cy = 340;

    if (this.scene.textures.exists('display-case')) {
      const dc = this.scene.add.image(cx, cy, 'display-case');
      dc.setDepth(2);
    } else {
      const g = this.scene.add.graphics();
      g.fillStyle(0x2c2c2c, 1);
      g.fillRect(cx - 50, cy - 25, 100, 50);
      g.fillStyle(0x88bbdd, 0.2);
      g.fillRect(cx - 47, cy - 22, 94, 44);
      g.setDepth(2);
    }

    this.scene.add.text(cx, cy - 30, 'RARE CARDS', {
      fontFamily: '"Georgia", serif',
      fontSize: '6px',
      color: '#d4a854',
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(3).setAlpha(0.7);
  }

  private drawShopSign(): void {
    const sx = DOOR.x;
    const sy = SHOP.height - SHOP.wallThickness - 28;

    const g = this.scene.add.graphics();
    g.fillStyle(0x2c2c4a, 0.9);
    g.fillRoundedRect(sx - 65, sy - 12, 130, 24, 5);
    g.lineStyle(1.5, 0xd4a854, 0.7);
    g.strokeRoundedRect(sx - 65, sy - 12, 130, 24, 5);

    g.fillStyle(0xd4a854, 0.3);
    g.fillRect(sx - 60, sy - 1, 120, 2);

    g.setDepth(5);

    this.scene.add.text(sx, sy - 3, 'TCG EMPIRE', {
      fontFamily: '"Georgia", serif',
      fontSize: '11px',
      color: '#d4a854',
      fontStyle: 'bold',
      stroke: '#1a1a2e',
      strokeThickness: 2,
    }).setOrigin(0.5).setDepth(6);

    this.scene.add.text(sx, sy + 7, 'GENESIS TCG OFFICIAL RETAILER', {
      fontFamily: '"Segoe UI", Arial, sans-serif',
      fontSize: '4px',
      color: '#8a7a5a',
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
    const cx = f.x;
    const cy = f.y;

    if (this.scene.textures.exists('counter-unit')) {
      const counter = this.scene.add.image(cx, cy, 'counter-unit');
      counter.setDepth(2);
    } else {
      const g = this.scene.add.graphics();
      g.fillStyle(f.color, 1);
      g.fillRoundedRect(cx - f.width / 2, cy - f.height / 2, f.width, f.height, 3);
      g.setDepth(2);
    }

    this.scene.add.text(cx - 20, cy + f.height / 2 + 6, 'CHECKOUT', {
      fontFamily: '"Georgia", serif',
      fontSize: '8px',
      color: '#d4a854',
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(3).setAlpha(0.6);
  }

  private drawShelf(f: FurnitureItem): void {
    const cx = f.x;
    const cy = f.y;

    if (this.scene.textures.exists('shelf-unit')) {
      const shelf = this.scene.add.image(cx, cy, 'shelf-unit');
      shelf.setDisplaySize(f.width, f.height);
      shelf.setDepth(2);
    } else {
      const g = this.scene.add.graphics();
      g.fillStyle(f.color, 1);
      g.fillRect(cx - f.width / 2, cy - f.height / 2, f.width, f.height);
      g.setDepth(2);
    }

    const isLeft = f.id === 'shelf-left';
    const labels = isLeft
      ? ['BOOSTERS', 'DECKS']
      : ['ACCESSORIES', 'BOXES'];
    const sectionW = f.width / labels.length;

    for (let i = 0; i < labels.length; i++) {
      const lx = cx - f.width / 2 + sectionW * i + sectionW / 2;
      const ly = cy - f.height / 2 - 10;

      const labelG = this.scene.add.graphics();
      const tw = labels[i].length * 5.5 + 14;
      labelG.fillStyle(0x1a1a36, 0.92);
      labelG.fillRoundedRect(lx - tw / 2, ly - 7, tw, 14, 4);
      labelG.lineStyle(1, 0xd4a854, 0.5);
      labelG.strokeRoundedRect(lx - tw / 2, ly - 7, tw, 14, 4);
      labelG.setDepth(5);

      this.scene.add.text(lx, ly, labels[i], {
        fontFamily: '"Segoe UI", Arial, sans-serif',
        fontSize: '7px',
        color: '#d4a854',
        fontStyle: 'bold',
      }).setOrigin(0.5).setDepth(6);
    }
  }

  private drawComputer(f: FurnitureItem): void {
    const cx = f.x;
    const cy = f.y;

    if (this.scene.textures.exists('computer-desk')) {
      const desk = this.scene.add.image(cx, cy, 'computer-desk');
      desk.setDepth(2);
    } else {
      const g = this.scene.add.graphics();
      g.fillStyle(f.color, 1);
      g.fillRoundedRect(cx - f.width / 2, cy - f.height / 2, f.width, f.height, 3);
      g.setDepth(2);
    }

    if (this.scene.textures.exists('office-chair')) {
      const chair = this.scene.add.image(cx, cy + f.height / 2 + 18, 'office-chair');
      chair.setDepth(2);
    }
  }

  private drawStorage(f: FurnitureItem): void {
    const cx = f.x;
    const cy = f.y;

    if (this.scene.textures.exists('storage-rack')) {
      const storage = this.scene.add.image(cx, cy, 'storage-rack');
      storage.setDepth(2);
    } else {
      const g = this.scene.add.graphics();
      g.fillStyle(f.color, 1);
      g.fillRect(cx - f.width / 2, cy - f.height / 2, f.width, f.height);
      g.setDepth(2);
    }

    const labelG = this.scene.add.graphics();
    const lx = cx;
    const ly = cy - f.height / 2 - 10;
    const tw = 58;
    labelG.fillStyle(0x1a1a36, 0.92);
    labelG.fillRoundedRect(lx - tw / 2, ly - 7, tw, 14, 4);
    labelG.lineStyle(1, 0xd4a854, 0.5);
    labelG.strokeRoundedRect(lx - tw / 2, ly - 7, tw, 14, 4);
    labelG.setDepth(5);

    this.scene.add.text(cx, ly, 'STORAGE', {
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

        if (this.scene.textures.exists(product.textureKey)) {
          const sprite = this.scene.add.image(px, py, product.textureKey);
          sprite.setDepth(4);
          this.productSprites.push(sprite);
        } else {
          const g = this.scene.add.graphics();
          g.fillStyle(product.color, 1);
          g.fillRoundedRect(px - 7, py - 9, 14, 18, 2);
          g.setDepth(4);
          this.productSprites.push(g);
        }

        if (quantity > 1) {
          const qtyBg = this.scene.add.graphics();
          const qtyX = px + 6;
          const qtyY = py - 10;
          qtyBg.fillStyle(0x000000, 0.7);
          qtyBg.fillRoundedRect(qtyX - 6, qtyY - 5, 12, 10, 3);
          qtyBg.setDepth(5);
          this.productSprites.push(qtyBg);

          const qtyLabel = this.scene.add.text(qtyX, qtyY, `${quantity}`, {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '7px',
            color: '#ffffff',
            fontStyle: 'bold',
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
        g.fillStyle(0xffd700, 0.4);
        g.fillRect(p.x - 6, p.y + 1, 12, 2);
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
        const glowG = this.scene.add.graphics();
        glowG.fillStyle(def.color, 0.1);
        glowG.fillCircle(p.x, p.y, def.width * 0.8);
        glowG.setDepth(2);
        this.decorSprites.push(glowG);
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
