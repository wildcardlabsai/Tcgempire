import Phaser from 'phaser';
import { SHOP } from '../config/shop-layout';

const SPEED = 160;
const SIZE = 24;

export class Player {
  sprite: Phaser.GameObjects.Container;
  private scene: Phaser.Scene;
  private vx = 0;
  private vy = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;

    const g = scene.add.graphics();

    // Shadow
    g.fillStyle(0x000000, 0.2);
    g.fillEllipse(0, SIZE / 2 + 2, SIZE + 4, 8);

    // Legs
    g.fillStyle(0x3b5998);
    g.fillRoundedRect(-8, 4, 6, 12, 2);
    g.fillRoundedRect(2, 4, 6, 12, 2);
    // Shoes
    g.fillStyle(0x4a3728);
    g.fillRoundedRect(-9, 14, 8, 4, 1);
    g.fillRoundedRect(1, 14, 8, 4, 1);

    // Torso
    g.fillStyle(0xd44030);
    g.fillRoundedRect(-10, -8, 20, 14, 3);
    // Shirt collar
    g.fillStyle(0xf0f0f0);
    g.fillTriangle(-4, -8, 4, -8, 0, -4);
    // Pocket
    g.fillStyle(0xb83020);
    g.fillRect(3, -2, 5, 4);

    // Arms
    g.fillStyle(0xd44030);
    g.fillRoundedRect(-14, -6, 5, 10, 2);
    g.fillRoundedRect(9, -6, 5, 10, 2);
    // Hands
    g.fillStyle(0xf5c6a0);
    g.fillCircle(-11, 6, 3);
    g.fillCircle(11, 6, 3);

    // Neck
    g.fillStyle(0xf5c6a0);
    g.fillRect(-3, -12, 6, 5);

    // Head
    g.fillStyle(0xf5c6a0);
    g.fillCircle(0, -18, 10);
    // Hair
    g.fillStyle(0x5c3317);
    g.fillEllipse(0, -23, 18, 10);
    g.fillRoundedRect(-9, -24, 18, 8, 4);
    // Eyes
    g.fillStyle(0x333333);
    g.fillCircle(-3, -18, 1.5);
    g.fillCircle(3, -18, 1.5);
    // Mouth
    g.lineStyle(1, 0xcc8866);
    g.beginPath();
    g.arc(0, -14, 3, 0.2, Math.PI - 0.2);
    g.strokePath();

    // Name tag on shirt
    g.fillStyle(0xffffff, 0.8);
    g.fillRoundedRect(-7, -4, 14, 5, 1);
    g.fillStyle(0x666666);
    g.fillRect(-5, -3, 10, 1);
    g.fillRect(-4, -1, 8, 1);

    this.sprite = scene.add.container(x, y, [g]);
    this.sprite.setSize(SIZE, SIZE);
    this.sprite.setDepth(10);
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
