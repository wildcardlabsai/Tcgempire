import Phaser from 'phaser';
import { SHOP, collidesWithFurniture } from '../config/shop-layout';
import { SoundManager } from '../systems/SoundManager';

const SPEED = 160;
const COLLISION_HALF = 10;

type Direction = 'down' | 'up' | 'left' | 'right';

export class Player {
  sprite: Phaser.GameObjects.Container;
  private scene: Phaser.Scene;
  private vx = 0;
  private vy = 0;
  private direction: Direction = 'down';
  private animTimer = 0;
  private isMoving = false;
  private bodyGfx: Phaser.GameObjects.Graphics;
  private bobOffset = 0;
  private footstepTimer = 0;

  private tapTargetX: number | null = null;
  private tapTargetY: number | null = null;
  private tapMarker: Phaser.GameObjects.Arc | null = null;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;
    this.bodyGfx = scene.add.graphics();
    this.drawCharacter(0);
    this.sprite = scene.add.container(x, y, [this.bodyGfx]);
    this.sprite.setSize(28, 28);
    this.sprite.setDepth(10);
  }

  private drawCharacter(bob: number): void {
    const g = this.bodyGfx;
    g.clear();

    const facingDown = this.direction === 'down';
    const facingUp = this.direction === 'up';
    const facingLeft = this.direction === 'left';
    const facingRight = this.direction === 'right';
    const side = facingLeft || facingRight;

    g.fillStyle(0x000000, 0.18);
    g.fillEllipse(0, 20, 30, 8);

    const shoeY = 15 + bob;
    g.fillStyle(0xcccccc);
    if (side) {
      g.fillRoundedRect(-5, shoeY, 10, 5, 2);
    } else {
      g.fillRoundedRect(-9, shoeY, 8, 5, 2);
      g.fillRoundedRect(1, shoeY, 8, 5, 2);
    }
    g.fillStyle(0x999999);
    if (side) {
      g.fillRect(-4, shoeY, 8, 2);
    } else {
      g.fillRect(-8, shoeY, 6, 2);
      g.fillRect(2, shoeY, 6, 2);
    }

    const legY = 6 + bob;
    g.fillStyle(0x4a6fa5);
    if (side) {
      const off = this.isMoving ? Math.sin(this.animTimer * 10) * 2 : 0;
      g.fillRoundedRect(-4, legY + off, 8, 10, 2);
    } else {
      const spread = this.isMoving ? Math.sin(this.animTimer * 10) * 1.5 : 0;
      g.fillRoundedRect(-9, legY, 7, 10 + spread, 2);
      g.fillRoundedRect(2, legY, 7, 10 - spread, 2);
    }

    const bodyY = -4 + bob;
    g.fillStyle(0x2c2c3a);
    g.fillRoundedRect(-12, bodyY, 24, 14, 4);
    g.fillStyle(0x222233);
    if (side) {
      const armOff = this.isMoving ? Math.sin(this.animTimer * 10) * 3 : 0;
      const ax = facingLeft ? 6 : -10;
      g.fillRoundedRect(ax, bodyY + 2 + armOff, 5, 11, 2);
    } else if (facingDown) {
      const armSwing = this.isMoving ? Math.sin(this.animTimer * 10) * 2 : 0;
      g.fillRoundedRect(-14, bodyY + 1 - armSwing, 5, 11, 2);
      g.fillRoundedRect(9, bodyY + 1 + armSwing, 5, 11, 2);
    } else {
      g.fillRoundedRect(-14, bodyY + 1, 5, 11, 2);
      g.fillRoundedRect(9, bodyY + 1, 5, 11, 2);
    }

    if (facingDown || side) {
      g.fillStyle(0xd4a854);
      const crownX = side ? (facingLeft ? -5 : -3) : -4;
      const crownY = bodyY + 3;
      g.fillRect(crownX, crownY, 8, 6);
      g.fillTriangle(crownX, crownY, crownX + 2, crownY - 3, crownX + 4, crownY);
      g.fillTriangle(crownX + 4, crownY, crownX + 6, crownY - 3, crownX + 8, crownY);
    }

    const headY = -16 + bob;
    g.fillStyle(0xf0be8a);
    g.fillCircle(0, headY, 12);

    if (facingDown) {
      g.fillStyle(0xffffff);
      g.fillEllipse(-4, headY - 1, 7, 6);
      g.fillEllipse(4, headY - 1, 7, 6);
      g.fillStyle(0x3a2210);
      g.fillCircle(-4, headY, 3);
      g.fillCircle(4, headY, 3);
      g.fillStyle(0x000000);
      g.fillCircle(-4, headY, 1.5);
      g.fillCircle(4, headY, 1.5);
      g.fillStyle(0xffffff);
      g.fillCircle(-3, headY - 1, 0.8);
      g.fillCircle(5, headY - 1, 0.8);
      g.fillStyle(0xe0a070);
      g.fillCircle(0, headY + 3, 1.5);
      g.fillStyle(0xc07060);
      g.fillEllipse(0, headY + 5.5, 4, 2);
    } else if (facingUp) {
      g.fillStyle(0xe8ae78);
      g.fillEllipse(-4, headY, 2, 1);
      g.fillEllipse(4, headY, 2, 1);
    } else {
      const eyeX = facingLeft ? -3 : 3;
      g.fillStyle(0xffffff);
      g.fillEllipse(eyeX, headY - 1, 6, 6);
      g.fillStyle(0x3a2210);
      g.fillCircle(eyeX + (facingLeft ? -1 : 1), headY, 2.5);
      g.fillStyle(0x000000);
      g.fillCircle(eyeX + (facingLeft ? -1 : 1), headY, 1.2);
      g.fillStyle(0xffffff);
      g.fillCircle(eyeX + (facingLeft ? 0 : 2), headY - 1, 0.7);
      g.fillStyle(0xe0a070);
      const noseX = facingLeft ? -6 : 6;
      g.fillCircle(noseX, headY + 2, 1.2);
    }

    const hairY = headY - 6;
    g.fillStyle(0x4a2a10);
    if (facingUp) {
      g.fillEllipse(0, hairY - 2, 26, 16);
      g.fillRoundedRect(-13, hairY, 26, 8, 3);
    } else {
      g.fillEllipse(0, hairY, 26, 14);
      g.fillTriangle(-8, hairY - 4, -4, hairY - 12, 0, hairY - 2);
      g.fillTriangle(-2, hairY - 3, 2, hairY - 14, 6, hairY - 2);
      g.fillTriangle(4, hairY - 4, 8, hairY - 11, 11, hairY - 1);
      g.fillTriangle(-5, hairY - 2, -1, hairY - 10, 3, hairY);
      if (side) {
        const backX = facingLeft ? 8 : -8;
        g.fillEllipse(backX, hairY + 4, 10, 12);
      }
    }
    g.fillStyle(0x5c3317);
    if (!facingUp) {
      g.fillTriangle(-6, hairY - 3, -3, hairY - 10, 1, hairY - 1);
      g.fillTriangle(0, hairY - 2, 3, hairY - 11, 7, hairY);
    }
  }

  setVelocity(vx: number, vy: number): void {
    this.vx = vx;
    this.vy = vy;
    if (vx !== 0 || vy !== 0) {
      this.clearTapTarget();
    }
  }

  setTapTarget(worldX: number, worldY: number): void {
    this.tapTargetX = worldX;
    this.tapTargetY = worldY;

    if (this.tapMarker) {
      this.tapMarker.destroy();
    }
    this.tapMarker = this.scene.add.circle(worldX, worldY, 6, 0xffd700, 0.5);
    this.tapMarker.setDepth(8);
    this.scene.tweens.add({
      targets: this.tapMarker,
      alpha: 0,
      scale: 2,
      duration: 600,
      onComplete: () => {
        if (this.tapMarker) {
          this.tapMarker.destroy();
          this.tapMarker = null;
        }
      },
    });
  }

  private clearTapTarget(): void {
    this.tapTargetX = null;
    this.tapTargetY = null;
  }

  update(delta: number): void {
    const dt = delta / 1000;

    let moveVx = this.vx;
    let moveVy = this.vy;

    if (this.tapTargetX !== null && this.tapTargetY !== null && moveVx === 0 && moveVy === 0) {
      const dx = this.tapTargetX - this.sprite.x;
      const dy = this.tapTargetY - this.sprite.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 6) {
        this.clearTapTarget();
      } else {
        moveVx = (dx / dist) * SPEED;
        moveVy = (dy / dist) * SPEED;
      }
    }

    let nx = this.sprite.x + moveVx * dt;
    let ny = this.sprite.y + moveVy * dt;

    const wallT = SHOP.wallThickness;
    nx = Phaser.Math.Clamp(nx, wallT + COLLISION_HALF, SHOP.width - wallT - COLLISION_HALF);
    ny = Phaser.Math.Clamp(ny, wallT + COLLISION_HALF, SHOP.height - wallT - COLLISION_HALF);

    if (!collidesWithFurniture(nx, ny, COLLISION_HALF, COLLISION_HALF)) {
      this.sprite.x = nx;
      this.sprite.y = ny;
    } else if (!collidesWithFurniture(nx, this.sprite.y, COLLISION_HALF, COLLISION_HALF)) {
      this.sprite.x = nx;
    } else if (!collidesWithFurniture(this.sprite.x, ny, COLLISION_HALF, COLLISION_HALF)) {
      this.sprite.y = ny;
    } else {
      this.clearTapTarget();
    }

    const wasMoving = this.isMoving;
    this.isMoving = Math.abs(moveVx) > 1 || Math.abs(moveVy) > 1;

    if (this.isMoving) {
      this.animTimer += dt;
      this.bobOffset = Math.sin(this.animTimer * 12) * 1.5;
      if (Math.abs(moveVy) > Math.abs(moveVx)) {
        this.direction = moveVy < 0 ? 'up' : 'down';
      } else {
        this.direction = moveVx < 0 ? 'left' : 'right';
      }
      this.footstepTimer += dt;
      if (this.footstepTimer > 0.3) {
        this.footstepTimer = 0;
        SoundManager.footstep();
      }
    } else {
      this.animTimer = 0;
      this.bobOffset = 0;
      this.footstepTimer = 0;
    }

    if (this.isMoving || wasMoving) {
      this.drawCharacter(this.bobOffset);
    }
  }

  get x(): number {
    return this.sprite.x;
  }

  get y(): number {
    return this.sprite.y;
  }

  handleKeyboardInput(cursors: Phaser.Types.Input.Keyboard.CursorKeys, wasd: Record<string, Phaser.Input.Keyboard.Key>): void {
    let vx = 0;
    let vy = 0;

    const left = cursors.left?.isDown || wasd.a?.isDown;
    const right = cursors.right?.isDown || wasd.d?.isDown;
    const up = cursors.up?.isDown || wasd.w?.isDown;
    const down = cursors.down?.isDown || wasd.s?.isDown;

    if (left) vx -= 1;
    if (right) vx += 1;
    if (up) vy -= 1;
    if (down) vy += 1;

    if (vx !== 0 && vy !== 0) {
      const diag = 1 / Math.SQRT2;
      vx *= diag;
      vy *= diag;
    }

    this.setVelocity(vx * SPEED, vy * SPEED);
  }
}
