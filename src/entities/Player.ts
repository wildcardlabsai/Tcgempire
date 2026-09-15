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

    const body = scene.add.rectangle(0, 0, SIZE, SIZE, 0xe07050, 1);
    body.setStrokeStyle(2, 0xc05030);

    const head = scene.add.circle(0, -SIZE / 2 - 4, 8, 0xf5c6a0);
    head.setStrokeStyle(1.5, 0xd4a07a);

    this.sprite = scene.add.container(x, y, [body, head]);
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
