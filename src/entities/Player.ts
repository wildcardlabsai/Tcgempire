import Phaser from 'phaser';
import { SHOP, collidesWithFurniture } from '../config/shop-layout';

const SPEED = 160;
const DISPLAY_SIZE = 56;
const COLLISION_HALF = 10;

type Direction = 'down' | 'up' | 'left' | 'right';

export class Player {
  sprite: Phaser.GameObjects.Container;
  private scene: Phaser.Scene;
  private vx = 0;
  private vy = 0;
  private direction: Direction = 'down';
  private animFrame = 0;
  private animTimer = 0;
  private isMoving = false;
  private playerImage: Phaser.GameObjects.Image | null = null;
  private hasSprites = false;

  private tapTargetX: number | null = null;
  private tapTargetY: number | null = null;
  private tapMarker: Phaser.GameObjects.Arc | null = null;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;
    this.hasSprites = scene.textures.exists('player-down-0');

    if (this.hasSprites) {
      this.playerImage = scene.add.image(0, 0, 'player-down-0');
      this.playerImage.setDisplaySize(DISPLAY_SIZE, DISPLAY_SIZE * 1.2);
      this.sprite = scene.add.container(x, y, [this.playerImage]);
    } else {
      const g = this.drawFallbackCharacter(scene);
      this.sprite = scene.add.container(x, y, [g]);
    }

    this.sprite.setSize(DISPLAY_SIZE * 0.5, DISPLAY_SIZE * 0.5);
    this.sprite.setDepth(10);
  }

  private drawFallbackCharacter(scene: Phaser.Scene): Phaser.GameObjects.Graphics {
    const g = scene.add.graphics();
    g.fillStyle(0x000000, 0.18);
    g.fillEllipse(0, 14, 28, 10);
    g.fillStyle(0x8b2252);
    g.fillRoundedRect(-10, -8, 20, 15, 4);
    g.fillStyle(0xf0be8a);
    g.fillCircle(0, -18, 10);
    g.fillStyle(0x3a2210);
    g.fillEllipse(0, -24, 20, 11);
    g.fillStyle(0xffffff);
    g.fillEllipse(-4, -18, 5, 4);
    g.fillEllipse(4, -18, 5, 4);
    g.fillStyle(0x2c1810);
    g.fillCircle(-4, -18, 1.5);
    g.fillCircle(4, -18, 1.5);
    return g;
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

    this.isMoving = Math.abs(moveVx) > 1 || Math.abs(moveVy) > 1;

    if (this.isMoving) {
      if (Math.abs(moveVy) > Math.abs(moveVx)) {
        this.direction = moveVy < 0 ? 'up' : 'down';
      } else {
        this.direction = moveVx < 0 ? 'left' : 'right';
      }
    }

    if (this.playerImage && this.hasSprites) {
      this.animTimer += dt;
      if (this.isMoving) {
        if (this.animTimer > 0.15) {
          this.animTimer = 0;
          this.animFrame = (this.animFrame + 1) % 4;
        }
      } else {
        this.animFrame = 0;
        this.animTimer = 0;
      }

      const key = `player-${this.direction}-${this.animFrame}`;
      if (this.scene.textures.exists(key)) {
        this.playerImage.setTexture(key);
        this.playerImage.setDisplaySize(DISPLAY_SIZE, DISPLAY_SIZE * 1.2);
      }
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
