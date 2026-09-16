import Phaser from 'phaser';
import { SHOP, DOOR, FURNITURE } from '../config/shop-layout';
import { Inventory } from '../data/Inventory';
import { Product } from '../data/Products';

const CUSTOMER_SPEED = 60;
const SIZE = 20;
const DISPLAY_SIZE = 36;

const SKIN_COLORS = [0xf5c6a0, 0xd4a07a, 0xc68642, 0x8d5524, 0xffdbac];
const SHIRT_COLORS = [0x5dade2, 0x58d68d, 0xf0b27a, 0xbb8fce, 0xf1948a, 0x85c1e9, 0xabebc6];
const HAIR_COLORS = [0x5c3317, 0x2c1810, 0xb8860b, 0xd4a574, 0x8b0000, 0x333333, 0xffa500];

interface CustomerAppearance {
  skinColor: number;
  shirtColor: number;
  hairColor: number;
  hairStyle: number;
  hasGlasses: boolean;
}

export type CustomerState = 'entering' | 'browsing' | 'walking-to-shelf' | 'looking' | 'walking-to-counter' | 'waiting' | 'served' | 'leaving';

export class Customer {
  sprite: Phaser.GameObjects.Container;
  state: CustomerState = 'entering';
  desiredProduct: Product | null = null;
  purchaseQty = 1;
  lostPatience = false;
  counted = false;

  private scene: Phaser.Scene;
  private targetX = 0;
  private targetY = 0;
  private waitTimer = 0;
  private maxPatience: number;
  private patienceRemaining: number;
  private patienceBar: Phaser.GameObjects.Graphics;
  private speechBubble: Phaser.GameObjects.Container | null = null;
  private customerImage: Phaser.GameObjects.Image | null = null;

  constructor(scene: Phaser.Scene, patience: number = 15) {
    this.scene = scene;
    this.maxPatience = patience;
    this.patienceRemaining = patience;

    const charIdx = Math.floor(Math.random() * 12);
    const spriteKey = `customer-${charIdx}-front`;

    this.patienceBar = scene.add.graphics();

    if (scene.textures.exists(spriteKey)) {
      this.customerImage = scene.add.image(0, 0, spriteKey);
      this.customerImage.setDisplaySize(DISPLAY_SIZE, DISPLAY_SIZE * 1.1);
      this.sprite = scene.add.container(DOOR.x, SHOP.height - SHOP.wallThickness - SIZE, [this.customerImage, this.patienceBar]);
    } else {
      const appearance = this.randomAppearance();
      const g = scene.add.graphics();
      this.drawCharacter(g, appearance);
      this.sprite = scene.add.container(DOOR.x, SHOP.height - SHOP.wallThickness - SIZE, [g, this.patienceBar]);
    }

    this.sprite.setSize(SIZE, SIZE);
    this.sprite.setDepth(9);

    this.pickBrowseTarget();
  }

  private randomAppearance(): CustomerAppearance {
    return {
      skinColor: SKIN_COLORS[Math.floor(Math.random() * SKIN_COLORS.length)],
      shirtColor: SHIRT_COLORS[Math.floor(Math.random() * SHIRT_COLORS.length)],
      hairColor: HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)],
      hairStyle: Math.floor(Math.random() * 4),
      hasGlasses: Math.random() < 0.25,
    };
  }

  private drawCharacter(g: Phaser.GameObjects.Graphics, a: CustomerAppearance): void {
    g.fillStyle(0x000000, 0.15);
    g.fillEllipse(0, SIZE / 2, SIZE + 2, 6);
    const darkerShirt = Phaser.Display.Color.IntegerToColor(a.shirtColor).darken(40).color;
    g.fillStyle(darkerShirt);
    g.fillRoundedRect(-6, 2, 5, 10, 1);
    g.fillRoundedRect(1, 2, 5, 10, 1);
    g.fillStyle(a.shirtColor);
    g.fillRoundedRect(-8, -6, 16, 10, 2);
    g.fillStyle(a.skinColor);
    g.fillCircle(0, -14, 8);
    g.fillStyle(a.hairColor);
    switch (a.hairStyle) {
      case 0: g.fillEllipse(0, -18, 14, 8); break;
      case 1:
        g.fillRoundedRect(-7, -20, 14, 7, 3);
        g.fillRoundedRect(-8, -19, 6, 6, 2);
        break;
      case 2:
        g.fillEllipse(0, -18, 16, 10);
        g.fillRoundedRect(-8, -18, 4, 10, 1);
        g.fillRoundedRect(4, -18, 4, 10, 1);
        break;
      case 3:
        g.fillTriangle(-6, -18, -3, -24, 0, -18);
        g.fillTriangle(-2, -18, 1, -25, 4, -18);
        g.fillTriangle(2, -18, 5, -23, 8, -18);
        g.fillEllipse(0, -17, 14, 6);
        break;
    }
    g.fillStyle(0xffffff);
    g.fillEllipse(-3, -14, 5, 4);
    g.fillEllipse(3, -14, 5, 4);
    g.fillStyle(0x333333);
    g.fillCircle(-3, -14, 1);
    g.fillCircle(3, -14, 1);
  }

  private pickBrowseTarget(): void {
    const shelves = FURNITURE.filter((f) => f.id.startsWith('shelf'));
    if (shelves.length === 0) return;
    const shelf = shelves[Math.floor(Math.random() * shelves.length)];
    const offsetX = (Math.random() - 0.5) * 40;
    const offsetY = shelf.height / 2 + SIZE;
    this.targetX = shelf.x + offsetX;
    this.targetY = shelf.y + offsetY;
    this.state = 'walking-to-shelf';
  }

  update(delta: number): void {
    const dt = delta / 1000;

    switch (this.state) {
      case 'entering':
      case 'walking-to-shelf':
        this.moveToward(this.targetX, this.targetY, dt);
        if (this.isNear(this.targetX, this.targetY, 4)) {
          this.state = 'looking';
          this.waitTimer = 1.5 + Math.random() * 2;
        }
        break;

      case 'looking':
        this.waitTimer -= dt;
        if (this.waitTimer <= 0) {
          this.decideAfterBrowsing();
        }
        break;

      case 'browsing':
        this.pickBrowseTarget();
        break;

      case 'walking-to-counter': {
        const counter = FURNITURE.find((f) => f.id === 'counter')!;
        const cx = counter.x;
        const cy = counter.y + counter.height / 2 + SIZE;
        this.moveToward(cx, cy, dt);
        if (this.isNear(cx, cy, 4)) {
          this.state = 'waiting';
          this.patienceRemaining = this.maxPatience;
        }
        break;
      }

      case 'waiting':
        this.patienceRemaining -= dt;
        this.drawPatienceBar();
        this.showSpeechBubble();
        this.updateSpeechBubblePosition();
        if (this.patienceRemaining <= 0) {
          this.lostPatience = true;
          this.hideSpeechBubble();
          this.state = 'leaving';
          this.targetX = DOOR.x;
          this.targetY = SHOP.height - SHOP.wallThickness;
        }
        break;

      case 'served':
        this.waitTimer -= dt;
        if (this.waitTimer <= 0) {
          this.state = 'leaving';
          this.targetX = DOOR.x;
          this.targetY = SHOP.height - SHOP.wallThickness;
        }
        break;

      case 'leaving':
        this.moveToward(this.targetX, this.targetY, dt);
        this.patienceBar.clear();
        this.hideSpeechBubble();
        break;
    }
  }

  private drawPatienceBar(): void {
    this.patienceBar.clear();
    const barWidth = SIZE + 4;
    const barHeight = 3;
    const x = -barWidth / 2;
    const y = -DISPLAY_SIZE / 2 - 4;

    this.patienceBar.fillStyle(0x000000, 0.5);
    this.patienceBar.fillRect(x, y, barWidth, barHeight);

    const ratio = Math.max(0, this.patienceRemaining / this.maxPatience);
    const color = ratio > 0.5 ? 0x2ecc71 : ratio > 0.25 ? 0xf39c12 : 0xe74c3c;
    this.patienceBar.fillStyle(color, 1);
    this.patienceBar.fillRect(x, y, barWidth * ratio, barHeight);
  }

  private decideAfterBrowsing(): void {
    const item = Inventory.getRandomShelfProduct();
    if (item && Math.random() < 0.7) {
      this.desiredProduct = item.product;
      this.purchaseQty = 1;
      this.state = 'walking-to-counter';
    } else if (Math.random() < 0.4) {
      this.state = 'browsing';
    } else {
      this.state = 'leaving';
      this.targetX = DOOR.x;
      this.targetY = SHOP.height - SHOP.wallThickness;
    }
  }

  private moveToward(tx: number, ty: number, dt: number): void {
    const dx = tx - this.sprite.x;
    const dy = ty - this.sprite.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 1) return;

    const speed = CUSTOMER_SPEED * dt;
    const step = Math.min(speed, dist);
    this.sprite.x += (dx / dist) * step;
    this.sprite.y += (dy / dist) * step;
  }

  private isNear(tx: number, ty: number, threshold: number): boolean {
    const dx = tx - this.sprite.x;
    const dy = ty - this.sprite.y;
    return Math.sqrt(dx * dx + dy * dy) < threshold;
  }

  isAtDoor(): boolean {
    return this.state === 'leaving' && this.isNear(DOOR.x, SHOP.height - SHOP.wallThickness, 8);
  }

  isWaitingAtCounter(): boolean {
    return this.state === 'waiting';
  }

  private showSpeechBubble(): void {
    if (this.speechBubble || !this.desiredProduct) return;
    const colorHex = this.desiredProduct.color;
    const g = this.scene.add.graphics();
    g.fillStyle(0xffffff, 0.9);
    g.fillRoundedRect(-22, -20, 44, 24, 6);
    g.fillTriangle(-4, 4, 4, 4, 0, 10);
    g.fillStyle(colorHex, 1);
    g.fillRoundedRect(-12, -14, 10, 14, 2);
    const icon = this.desiredProduct.category === 'booster' ? '!' : '?';
    const txt = this.scene.add.text(6, -12, icon, {
      fontFamily: 'Arial',
      fontSize: '10px',
      color: '#333',
      fontStyle: 'bold',
    });
    this.speechBubble = this.scene.add.container(this.sprite.x, this.sprite.y - 30, [g, txt]);
    this.speechBubble.setDepth(15);
  }

  private hideSpeechBubble(): void {
    if (this.speechBubble) {
      this.speechBubble.destroy();
      this.speechBubble = null;
    }
  }

  private updateSpeechBubblePosition(): void {
    if (this.speechBubble) {
      this.speechBubble.setPosition(this.sprite.x, this.sprite.y - 30);
    }
  }

  serve(): void {
    this.state = 'served';
    this.waitTimer = 0.8;
    this.patienceBar.clear();
    this.hideSpeechBubble();
  }

  destroy(): void {
    this.hideSpeechBubble();
    this.sprite.destroy();
  }
}
