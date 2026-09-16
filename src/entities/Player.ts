import Phaser from 'phaser';
import { SHOP } from '../config/shop-layout';

const SPEED = 160;
const SIZE = 24;

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

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;

    const hasTextures = scene.textures.exists('player-down-0');

    if (hasTextures) {
      this.playerImage = scene.add.image(0, 0, 'player-down-0');
      this.sprite = scene.add.container(x, y, [this.playerImage]);
    } else {
      const g = this.drawFallbackCharacter(scene);
      this.sprite = scene.add.container(x, y, [g]);
    }

    this.sprite.setSize(SIZE, SIZE);
    this.sprite.setDepth(10);
  }

  private drawFallbackCharacter(scene: Phaser.Scene): Phaser.GameObjects.Graphics {
    const g = scene.add.graphics();
    g.fillStyle(0x000000, 0.18);
    g.fillEllipse(0, SIZE / 2 + 3, SIZE + 8, 10);
    g.fillStyle(0x2c3e6b);
    g.fillRoundedRect(-7, 5, 6, 13, 2);
    g.fillRoundedRect(1, 5, 6, 13, 2);
    g.fillStyle(0x8b2252);
    g.fillRoundedRect(-10, -8, 20, 15, 4);
    g.fillStyle(0x2c2c4a);
    g.fillRoundedRect(-9, 0, 18, 7, 2);
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
  }

  update(delta: number): void {
    const dt = delta / 1000;
    let nx = this.sprite.x + this.vx * dt;
    let ny = this.sprite.y + this.vy * dt;

    const half = SIZE / 2;
    const wallT = SHOP.wallThickness;
    nx = Phaser.Math.Clamp(nx, wallT + half, SHOP.width - wallT - half);
    ny = Phaser.Math.Clamp(ny, wallT + half, SHOP.height - wallT - half);

    this.sprite.x = nx;
    this.sprite.y = ny;

    this.isMoving = Math.abs(this.vx) > 1 || Math.abs(this.vy) > 1;

    if (this.isMoving) {
      if (Math.abs(this.vy) > Math.abs(this.vx)) {
        this.direction = this.vy < 0 ? 'up' : 'down';
      } else {
        this.direction = this.vx < 0 ? 'left' : 'right';
      }
    }

    if (this.playerImage) {
      this.animTimer += dt;
      if (this.isMoving) {
        if (this.animTimer > 0.18) {
          this.animTimer = 0;
          this.animFrame = (this.animFrame + 1) % 3;
        }
      } else {
        this.animFrame = 0;
        this.animTimer = 0;
      }

      const key = `player-${this.direction}-${this.animFrame}`;
      if (this.scene.textures.exists(key)) {
        this.playerImage.setTexture(key);
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
