import Phaser from 'phaser';
import { SHOP, DOOR, FURNITURE, collidesWithFurniture } from '../config/shop-layout';
import { Inventory } from '../data/Inventory';
import { Product } from '../data/Products';
import { SoundManager } from '../systems/SoundManager';

const CUSTOMER_SPEED = 55;
const COLLISION_HALF = 7;

const SKIN_COLORS = [0xf5c6a0, 0xd4a07a, 0xc68642, 0x8d5524, 0xffdbac, 0xf0be8a];
const SHIRT_COLORS = [0x5dade2, 0x58d68d, 0xf0b27a, 0xbb8fce, 0xf1948a, 0x85c1e9, 0xabebc6, 0xe74c3c, 0x3498db, 0x2ecc71];
const HAIR_COLORS = [0x5c3317, 0x2c1810, 0xb8860b, 0xd4a574, 0x8b0000, 0x333333, 0xffa500, 0x1a1a1a];
const PANTS_COLORS = [0x4a6fa5, 0x3a3a3a, 0x5c4033, 0x2c3e50, 0x6a5acd, 0x8b4513];

interface CustomerAppearance {
  skinColor: number;
  shirtColor: number;
  hairColor: number;
  pantsColor: number;
  hairStyle: number;
  hasGlasses: boolean;
  isFemale: boolean;
}

export type CustomerState = 'entering' | 'browsing' | 'walking-to-shelf' | 'looking' | 'walking-to-counter' | 'waiting' | 'served' | 'leaving';

const AISLE_Y = 480;

export class Customer {
  sprite: Phaser.GameObjects.Container;
  state: CustomerState = 'entering';
  desiredProduct: Product | null = null;
  purchaseQty = 1;
  lostPatience = false;
  counted = false;

  private scene: Phaser.Scene;
  private waypoints: { x: number; y: number }[] = [];
  private waypointIdx = 0;
  private waitTimer = 0;
  private maxPatience: number;
  private patienceRemaining: number;
  private patienceBar: Phaser.GameObjects.Graphics;
  private speechBubble: Phaser.GameObjects.Container | null = null;
  private stuckTimer = 0;
  private lastX = 0;
  private lastY = 0;

  constructor(scene: Phaser.Scene, patience: number = 15) {
    this.scene = scene;
    this.maxPatience = patience;
    this.patienceRemaining = patience;

    this.patienceBar = scene.add.graphics();

    const appearance = this.randomAppearance();
    const g = scene.add.graphics();
    this.drawCharacter(g, appearance);

    const startX = DOOR.x;
    const startY = SHOP.height - SHOP.wallThickness - 10;
    this.sprite = scene.add.container(startX, startY, [g, this.patienceBar]);
    this.sprite.setSize(20, 20);
    this.sprite.setDepth(9);
    this.lastX = startX;
    this.lastY = startY;

    SoundManager.doorBell();
    this.pickBrowseTarget();
  }

  private randomAppearance(): CustomerAppearance {
    return {
      skinColor: SKIN_COLORS[Math.floor(Math.random() * SKIN_COLORS.length)],
      shirtColor: SHIRT_COLORS[Math.floor(Math.random() * SHIRT_COLORS.length)],
      hairColor: HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)],
      pantsColor: PANTS_COLORS[Math.floor(Math.random() * PANTS_COLORS.length)],
      hairStyle: Math.floor(Math.random() * 5),
      hasGlasses: Math.random() < 0.2,
      isFemale: Math.random() < 0.5,
    };
  }

  private drawCharacter(g: Phaser.GameObjects.Graphics, a: CustomerAppearance): void {
    g.fillStyle(0x000000, 0.15);
    g.fillEllipse(0, 16, 24, 7);

    g.fillStyle(0x888888);
    g.fillRoundedRect(-7, 12, 6, 4, 1);
    g.fillRoundedRect(1, 12, 6, 4, 1);

    g.fillStyle(a.pantsColor);
    g.fillRoundedRect(-7, 4, 6, 9, 2);
    g.fillRoundedRect(1, 4, 6, 9, 2);

    const darkerShirt = Phaser.Display.Color.IntegerToColor(a.shirtColor).darken(30).color;
    g.fillStyle(a.shirtColor);
    g.fillRoundedRect(-9, -6, 18, 12, 3);
    g.fillStyle(darkerShirt);
    g.fillRoundedRect(-12, -4, 5, 10, 2);
    g.fillRoundedRect(7, -4, 5, 10, 2);

    g.fillStyle(a.skinColor);
    g.fillCircle(0, -15, 10);

    g.fillStyle(0xffffff);
    g.fillEllipse(-3, -15, 5, 4.5);
    g.fillEllipse(3, -15, 5, 4.5);
    g.fillStyle(0x333333);
    g.fillCircle(-3, -14.5, 1.8);
    g.fillCircle(3, -14.5, 1.8);
    g.fillStyle(0x000000);
    g.fillCircle(-3, -14.5, 0.8);
    g.fillCircle(3, -14.5, 0.8);

    g.fillStyle(Phaser.Display.Color.IntegerToColor(a.skinColor).darken(15).color);
    g.fillCircle(0, -12, 1);

    if (a.isFemale) {
      g.fillStyle(0xcc5555);
      g.fillEllipse(0, -10.5, 4, 1.5);
    }

    g.fillStyle(a.hairColor);
    switch (a.hairStyle) {
      case 0:
        g.fillEllipse(0, -21, 18, 10);
        g.fillTriangle(-5, -22, -2, -28, 1, -21);
        g.fillTriangle(0, -21, 3, -27, 6, -20);
        break;
      case 1:
        g.fillRoundedRect(-9, -24, 18, 9, 4);
        if (a.isFemale) {
          g.fillRoundedRect(-10, -22, 5, 14, 2);
          g.fillRoundedRect(5, -22, 5, 14, 2);
        }
        break;
      case 2:
        g.fillEllipse(0, -21, 20, 12);
        g.fillRoundedRect(-10, -21, 5, 10, 2);
        g.fillRoundedRect(5, -21, 5, 10, 2);
        break;
      case 3:
        g.fillEllipse(0, -22, 16, 8);
        g.fillRoundedRect(-8, -22, 16, 6, 3);
        break;
      case 4:
        g.fillEllipse(0, -22, 22, 10);
        g.fillTriangle(-8, -22, -4, -30, 0, -22);
        g.fillTriangle(-3, -22, 0, -29, 4, -22);
        g.fillTriangle(2, -22, 5, -28, 9, -22);
        break;
    }

    if (a.hasGlasses) {
      g.lineStyle(1, 0x333333, 0.8);
      g.strokeCircle(-3, -15, 3.5);
      g.strokeCircle(3, -15, 3.5);
      g.lineBetween(-0.5, -15, 0.5, -15);
    }
  }

  private pickBrowseTarget(): void {
    const shelves = FURNITURE.filter((f) => f.id.startsWith('shelf'));
    if (shelves.length === 0) return;
    const shelf = shelves[Math.floor(Math.random() * shelves.length)];
    const offsetX = (Math.random() - 0.5) * 20;
    const targetX = shelf.x + offsetX;
    const targetY = shelf.y + shelf.height / 2 + 20;

    this.waypoints = this.buildWaypoints(targetX, targetY);
    this.waypointIdx = 0;
    this.stuckTimer = 0;
    this.state = 'walking-to-shelf';
  }

  private buildWaypoints(tx: number, ty: number): { x: number; y: number }[] {
    const cx = this.sprite.x;
    const cy = this.sprite.y;
    const points: { x: number; y: number }[] = [];

    if (Math.abs(cy - ty) > 60 && this.wouldCrossObstacle(cx, cy, tx, ty)) {
      points.push({ x: cx, y: AISLE_Y });
      points.push({ x: tx, y: AISLE_Y });
    }
    points.push({ x: tx, y: ty });
    return points;
  }

  private wouldCrossObstacle(x1: number, y1: number, x2: number, y2: number): boolean {
    const steps = 6;
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      const mx = x1 + (x2 - x1) * t;
      const my = y1 + (y2 - y1) * t;
      if (collidesWithFurniture(mx, my, COLLISION_HALF, COLLISION_HALF)) return true;
    }
    return false;
  }

  update(delta: number): void {
    const dt = delta / 1000;

    switch (this.state) {
      case 'entering':
      case 'walking-to-shelf': {
        if (this.waypoints.length === 0) break;
        const wp = this.waypoints[this.waypointIdx];
        this.moveToward(wp.x, wp.y, dt);
        if (this.isNear(wp.x, wp.y, 6)) {
          this.waypointIdx++;
          if (this.waypointIdx >= this.waypoints.length) {
            this.state = 'looking';
            this.waitTimer = 1.5 + Math.random() * 2;
          }
        }
        this.checkStuck(dt);
        break;
      }

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
        if (this.waypoints.length === 0) break;
        const wp = this.waypoints[this.waypointIdx];
        this.moveToward(wp.x, wp.y, dt);
        if (this.isNear(wp.x, wp.y, 6)) {
          this.waypointIdx++;
          if (this.waypointIdx >= this.waypoints.length) {
            this.state = 'waiting';
            this.patienceRemaining = this.maxPatience;
          }
        }
        this.checkStuck(dt);
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
          SoundManager.customerSad();
          this.state = 'leaving';
          this.setLeaveWaypoints();
        }
        break;

      case 'served':
        this.waitTimer -= dt;
        if (this.waitTimer <= 0) {
          this.state = 'leaving';
          this.setLeaveWaypoints();
        }
        break;

      case 'leaving': {
        if (this.waypoints.length === 0) break;
        const wp = this.waypoints[this.waypointIdx];
        this.moveToward(wp.x, wp.y, dt);
        if (this.isNear(wp.x, wp.y, 6)) {
          this.waypointIdx++;
          if (this.waypointIdx >= this.waypoints.length) {
            this.waypointIdx = this.waypoints.length - 1;
          }
        }
        this.patienceBar.clear();
        this.hideSpeechBubble();
        this.checkStuck(dt);
        break;
      }
    }
  }

  private setLeaveWaypoints(): void {
    const doorX = DOOR.x;
    const doorY = SHOP.height - SHOP.wallThickness;
    this.waypoints = this.buildWaypoints(doorX, doorY);
    this.waypointIdx = 0;
    this.stuckTimer = 0;
  }

  private checkStuck(dt: number): void {
    const dx = Math.abs(this.sprite.x - this.lastX);
    const dy = Math.abs(this.sprite.y - this.lastY);
    if (dx < 0.5 && dy < 0.5) {
      this.stuckTimer += dt;
    } else {
      this.stuckTimer = 0;
    }
    this.lastX = this.sprite.x;
    this.lastY = this.sprite.y;

    if (this.stuckTimer > 0.8) {
      if (this.waypointIdx < this.waypoints.length) {
        this.waypointIdx++;
        if (this.waypointIdx >= this.waypoints.length) {
          if (this.state === 'leaving') {
            this.sprite.y += 2;
          } else if (this.state === 'walking-to-shelf') {
            this.state = 'looking';
            this.waitTimer = 1 + Math.random();
          } else if (this.state === 'walking-to-counter') {
            this.state = 'waiting';
            this.patienceRemaining = this.maxPatience;
          }
        }
      }
      this.stuckTimer = 0;
    }
  }

  private drawPatienceBar(): void {
    this.patienceBar.clear();
    const barWidth = 22;
    const barHeight = 3;
    const x = -barWidth / 2;
    const y = -30;

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
      const counter = FURNITURE.find((f) => f.id === 'counter')!;
      const cx = counter.x + (Math.random() - 0.5) * 40;
      const cy = counter.y + counter.height / 2 + 20;
      this.waypoints = this.buildWaypoints(cx, cy);
      this.waypointIdx = 0;
      this.stuckTimer = 0;
      this.state = 'walking-to-counter';
    } else if (Math.random() < 0.4) {
      this.state = 'browsing';
    } else {
      this.state = 'leaving';
      this.setLeaveWaypoints();
    }
  }

  private moveToward(tx: number, ty: number, dt: number): void {
    const dx = tx - this.sprite.x;
    const dy = ty - this.sprite.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 1) return;

    const speed = CUSTOMER_SPEED * dt;
    const step = Math.min(speed, dist);
    const nx = this.sprite.x + (dx / dist) * step;
    const ny = this.sprite.y + (dy / dist) * step;

    const wallT = SHOP.wallThickness;
    const clampedX = Phaser.Math.Clamp(nx, wallT + COLLISION_HALF, SHOP.width - wallT - COLLISION_HALF);
    const clampedY = Phaser.Math.Clamp(ny, wallT + COLLISION_HALF, SHOP.height - wallT - COLLISION_HALF);

    if (!collidesWithFurniture(clampedX, clampedY, COLLISION_HALF, COLLISION_HALF)) {
      this.sprite.x = clampedX;
      this.sprite.y = clampedY;
    } else if (!collidesWithFurniture(clampedX, this.sprite.y, COLLISION_HALF, COLLISION_HALF)) {
      this.sprite.x = clampedX;
    } else if (!collidesWithFurniture(this.sprite.x, clampedY, COLLISION_HALF, COLLISION_HALF)) {
      this.sprite.y = clampedY;
    }
  }

  private isNear(tx: number, ty: number, threshold: number): boolean {
    const dx = tx - this.sprite.x;
    const dy = ty - this.sprite.y;
    return Math.sqrt(dx * dx + dy * dy) < threshold;
  }

  isAtDoor(): boolean {
    return this.state === 'leaving' && this.isNear(DOOR.x, SHOP.height - SHOP.wallThickness, 12);
  }

  isWaitingAtCounter(): boolean {
    return this.state === 'waiting';
  }

  private showSpeechBubble(): void {
    if (this.speechBubble || !this.desiredProduct) return;
    const colorHex = this.desiredProduct.color;
    const g = this.scene.add.graphics();
    g.fillStyle(0xffffff, 0.92);
    g.fillRoundedRect(-22, -20, 44, 24, 6);
    g.fillTriangle(-3, 4, 3, 4, 0, 10);
    g.fillStyle(colorHex, 1);
    g.fillRoundedRect(-12, -14, 10, 14, 2);
    const icon = this.desiredProduct.category === 'booster' ? '!' : '?';
    const txt = this.scene.add.text(5, -12, icon, {
      fontFamily: 'Arial',
      fontSize: '10px',
      color: '#333',
      fontStyle: 'bold',
    });
    this.speechBubble = this.scene.add.container(this.sprite.x, this.sprite.y - 32, [g, txt]);
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
      this.speechBubble.setPosition(this.sprite.x, this.sprite.y - 32);
    }
  }

  serve(): void {
    this.state = 'served';
    this.waitTimer = 0.8;
    this.patienceBar.clear();
    this.hideSpeechBubble();
    SoundManager.cashRegister();
  }

  destroy(): void {
    this.hideSpeechBubble();
    this.sprite.destroy();
  }
}
