import Phaser from 'phaser';
import { SHOP, DOOR, FURNITURE } from '../config/shop-layout';
import { Inventory } from '../data/Inventory';
import { Product } from '../data/Products';

const CUSTOMER_SPEED = 60;
const SIZE = 20;

const SKIN_COLORS = [0xf5c6a0, 0xd4a07a, 0xc68642, 0x8d5524, 0xffdbac];
const SHIRT_COLORS = [0x5dade2, 0x58d68d, 0xf0b27a, 0xbb8fce, 0xf1948a, 0x85c1e9, 0xabebc6];

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

  constructor(scene: Phaser.Scene, patience: number = 15) {
    this.scene = scene;
    this.maxPatience = patience;
    this.patienceRemaining = patience;

    const skinColor = SKIN_COLORS[Math.floor(Math.random() * SKIN_COLORS.length)];
    const shirtColor = SHIRT_COLORS[Math.floor(Math.random() * SHIRT_COLORS.length)];

    const body = scene.add.rectangle(0, 0, SIZE, SIZE, shirtColor);
    body.setStrokeStyle(1.5, Phaser.Display.Color.IntegerToColor(shirtColor).darken(25).color);

    const head = scene.add.circle(0, -SIZE / 2 - 3, 6, skinColor);
    head.setStrokeStyle(1, Phaser.Display.Color.IntegerToColor(skinColor).darken(15).color);

    this.patienceBar = scene.add.graphics();

    this.sprite = scene.add.container(DOOR.x, SHOP.height - SHOP.wallThickness - SIZE, [body, head, this.patienceBar]);
    this.sprite.setSize(SIZE, SIZE);
    this.sprite.setDepth(9);

    this.pickBrowseTarget();
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
        if (this.patienceRemaining <= 0) {
          this.lostPatience = true;
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
        break;
    }
  }

  private drawPatienceBar(): void {
    this.patienceBar.clear();
    const barWidth = SIZE + 4;
    const barHeight = 3;
    const x = -barWidth / 2;
    const y = -SIZE / 2 - 14;

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

  serve(): void {
    this.state = 'served';
    this.waitTimer = 0.8;
    this.patienceBar.clear();
  }

  destroy(): void {
    this.sprite.destroy();
  }
}
