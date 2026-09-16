import Phaser from 'phaser';
import { SHOP, FURNITURE } from '../config/shop-layout';
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
    this.drawBackground();
    this.drawInteractionZones();
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

  private drawBackground(): void {
    if (this.scene.textures.exists('shop-bg')) {
      const bg = this.scene.add.image(SHOP.width / 2, SHOP.height / 2, 'shop-bg');
      bg.setDisplaySize(SHOP.width, SHOP.height);
      bg.setDepth(0);
    } else {
      this.drawFallbackBackground();
    }
  }

  private drawFallbackBackground(): void {
    const g = this.scene.add.graphics();
    g.fillStyle(SHOP.floorColor);
    g.fillRect(0, 0, SHOP.width, SHOP.height);
    g.fillStyle(SHOP.wallColor);
    g.fillRect(0, 0, SHOP.width, SHOP.wallThickness);
    g.fillRect(0, 0, SHOP.wallThickness, SHOP.height);
    g.fillRect(SHOP.width - SHOP.wallThickness, 0, SHOP.wallThickness, SHOP.height);
    g.setDepth(0);
  }

  private drawInteractionZones(): void {
    // Invisible interaction markers - shop-bg provides all visuals
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
      const slotsPerTier = Math.floor(shelf.width / 20);

      let slotIndex = 0;
      for (const { product, quantity } of shelfProducts) {
        if (slotIndex >= tiers * slotsPerTier) break;

        const tier = Math.floor(slotIndex / slotsPerTier);
        const col = slotIndex % slotsPerTier;
        const px = x + 10 + col * 18;
        const py = y + tier * tierH + tierH / 2 + 2;

        if (this.scene.textures.exists(product.textureKey)) {
          const sprite = this.scene.add.image(px, py, product.textureKey);
          sprite.setDisplaySize(14, 18);
          sprite.setDepth(4);
          this.productSprites.push(sprite);
        } else {
          const g = this.scene.add.graphics();
          g.fillStyle(product.color, 1);
          g.fillRoundedRect(px - 6, py - 8, 12, 16, 2);
          g.setDepth(4);
          this.productSprites.push(g);
        }

        if (quantity > 1) {
          const qtyBg = this.scene.add.graphics();
          const qtyX = px + 5;
          const qtyY = py - 9;
          qtyBg.fillStyle(0x000000, 0.7);
          qtyBg.fillRoundedRect(qtyX - 5, qtyY - 4, 10, 9, 2);
          qtyBg.setDepth(5);
          this.productSprites.push(qtyBg);

          const qtyLabel = this.scene.add.text(qtyX, qtyY, `${quantity}`, {
            fontFamily: '"Segoe UI", Arial, sans-serif',
            fontSize: '6px',
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
        g.lineStyle(1, 0x333333, 0.4);
        g.strokeRect(p.x - def.width / 2 - 1, p.y - def.height / 2 - 1, def.width + 2, def.height + 2);
      } else if (def.id.startsWith('plant')) {
        const potW = def.id.includes('large') ? 14 : 10;
        const potH = def.id.includes('large') ? 10 : 8;
        g.fillStyle(0x8b4513, 1);
        g.fillRect(p.x - potW / 2, p.y + 2, potW, potH);
        g.fillStyle(0x228b22, 1);
        const leafR = def.id.includes('large') ? 9 : 6;
        g.fillCircle(p.x, p.y - leafR / 2, leafR);
      } else {
        g.fillStyle(def.color, 0.8);
        g.fillRoundedRect(p.x - def.width / 2, p.y - def.height / 2, def.width, def.height, 3);
      }

      g.setDepth(3);
      this.decorSprites.push(g);
    }
  }
}
