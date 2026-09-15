import Phaser from 'phaser';
import { SHOP, FURNITURE, DOOR } from '../config/shop-layout';
import { Inventory } from '../data/Inventory';

export class ShopRenderer {
  private scene: Phaser.Scene;
  private productSprites: Phaser.GameObjects.GameObject[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  draw(): void {
    this.drawFloor();
    this.drawWalls();
    this.drawDoor();
    this.drawFurniture();
    this.refreshProducts();
  }

  refreshProducts(): void {
    for (const s of this.productSprites) {
      s.destroy();
    }
    this.productSprites = [];
    this.drawProducts();
  }

  private drawFloor(): void {
    const g = this.scene.add.graphics();
    g.fillStyle(SHOP.floorColor, 1);
    g.fillRect(0, 0, SHOP.width, SHOP.height);

    g.lineStyle(1, 0xe0d0b8, 0.3);
    const tileSize = 48;
    for (let x = 0; x <= SHOP.width; x += tileSize) {
      g.lineBetween(x, 0, x, SHOP.height);
    }
    for (let y = 0; y <= SHOP.height; y += tileSize) {
      g.lineBetween(0, y, SHOP.width, y);
    }
    g.setDepth(0);
  }

  private drawWalls(): void {
    const g = this.scene.add.graphics();
    const w = SHOP.wallThickness;

    g.fillStyle(SHOP.wallColor, 1);
    g.fillRect(0, 0, SHOP.width, w);
    g.fillRect(0, 0, w, SHOP.height);
    g.fillRect(SHOP.width - w, 0, w, SHOP.height);

    g.fillStyle(SHOP.wallColor, 1);
    g.fillRect(0, SHOP.height - w, DOOR.x - DOOR.width / 2, w);
    g.fillRect(
      DOOR.x + DOOR.width / 2,
      SHOP.height - w,
      SHOP.width - (DOOR.x + DOOR.width / 2),
      w
    );

    g.lineStyle(2, SHOP.accentColor, 1);
    g.lineBetween(w, w + 2, SHOP.width - w, w + 2);

    g.setDepth(1);
  }

  private drawDoor(): void {
    const g = this.scene.add.graphics();
    g.fillStyle(DOOR.color, 1);
    g.fillRect(
      DOOR.x - DOOR.width / 2,
      SHOP.height - SHOP.wallThickness,
      DOOR.width,
      SHOP.wallThickness
    );

    const mat = this.scene.add.rectangle(
      DOOR.x,
      SHOP.height - SHOP.wallThickness - 8,
      DOOR.width - 10,
      12,
      0x7aaa7a,
      0.6
    );
    mat.setDepth(1);

    this.scene.add
      .text(DOOR.x, SHOP.height - SHOP.wallThickness - 8, 'EXIT', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '9px',
        color: '#ffffff',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setAlpha(0.7)
      .setDepth(2);

    g.setDepth(1);
  }

  private drawFurniture(): void {
    for (const f of FURNITURE) {
      const rect = this.scene.add.rectangle(f.x, f.y, f.width, f.height, f.color);
      rect.setStrokeStyle(2, Phaser.Display.Color.IntegerToColor(f.color).darken(30).color);
      rect.setDepth(2);

      this.scene.add
        .text(f.x, f.y, f.label, {
          fontFamily: 'Arial, sans-serif',
          fontSize: '10px',
          color: '#ffffff',
          fontStyle: 'bold',
        })
        .setOrigin(0.5)
        .setDepth(3)
        .setAlpha(0.9);
    }
  }

  private drawProducts(): void {
    const shelves = FURNITURE.filter((f) => f.id.startsWith('shelf'));
    const shelfProducts = Inventory.getShelfProducts();

    if (shelfProducts.length === 0) return;

    for (const shelf of shelves) {
      const rows = 3;
      const cols = 2;
      const productW = 20;
      const productH = 28;
      const startY = shelf.y - shelf.height / 2 + 24;
      const gap = 50;

      let slotIndex = 0;
      for (const { product, quantity } of shelfProducts) {
        if (slotIndex >= rows * cols) break;

        const r = Math.floor(slotIndex / cols);
        const c = slotIndex % cols;
        const px = shelf.x - (cols - 1) * (productW + 2) / 2 + c * (productW + 2);
        const py = startY + r * gap;

        const pack = this.scene.add.rectangle(px, py, productW, productH, product.color);
        pack.setStrokeStyle(1, 0x000000, 0.3);
        pack.setDepth(4);
        this.productSprites.push(pack);

        const qtyLabel = this.scene.add.text(px, py + productH / 2 + 6, `×${quantity}`, {
          fontFamily: 'Arial, sans-serif',
          fontSize: '8px',
          color: '#ffffff',
          backgroundColor: 'rgba(0,0,0,0.6)',
          padding: { x: 2, y: 1 },
        });
        qtyLabel.setOrigin(0.5);
        qtyLabel.setDepth(5);
        this.productSprites.push(qtyLabel);

        slotIndex++;
      }
    }
  }
}
