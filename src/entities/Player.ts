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

    // Shadow — soft ellipse
    g.fillStyle(0x000000, 0.18);
    g.fillEllipse(0, SIZE / 2 + 3, SIZE + 8, 10);

    // Legs — dark denim
    g.fillStyle(0x2c3e6b);
    g.fillRoundedRect(-7, 5, 6, 13, 2);
    g.fillRoundedRect(1, 5, 6, 13, 2);

    // Shoes — polished brown
    g.fillStyle(0x5c3a1e);
    g.fillRoundedRect(-8, 16, 8, 4, 2);
    g.fillRoundedRect(0, 16, 8, 4, 2);
    // Shoe soles
    g.fillStyle(0x3a2512);
    g.fillRect(-8, 19, 8, 1);
    g.fillRect(0, 19, 8, 1);

    // Torso — deep burgundy polo
    g.fillStyle(0x8b2252);
    g.fillRoundedRect(-10, -8, 20, 15, 4);

    // Collar — V-neck detail
    g.fillStyle(0x9b3262);
    g.fillTriangle(-4, -8, 4, -8, 0, -3);

    // Polo button line
    g.fillStyle(0xd4a854, 0.6);
    g.fillCircle(0, -5, 1);
    g.fillCircle(0, -2, 1);

    // Apron — shop keeper's apron
    g.fillStyle(0x2c2c4a);
    g.fillRoundedRect(-9, 0, 18, 7, 2);
    // Apron pocket
    g.fillStyle(0x3a3a5c);
    g.fillRect(-4, 1, 8, 4);
    // Apron strap hints
    g.lineStyle(1, 0x2c2c4a, 0.6);
    g.lineBetween(-9, 0, -8, -6);
    g.lineBetween(9, 0, 8, -6);

    // Arms — matching polo
    g.fillStyle(0x8b2252);
    g.fillRoundedRect(-14, -6, 5, 11, 2);
    g.fillRoundedRect(9, -6, 5, 11, 2);

    // Hands — warm skin
    g.fillStyle(0xf0be8a);
    g.fillCircle(-11, 7, 3);
    g.fillCircle(11, 7, 3);

    // Neck
    g.fillStyle(0xf0be8a);
    g.fillRect(-3, -12, 6, 5);

    // Head — warm skin tone
    g.fillStyle(0xf0be8a);
    g.fillCircle(0, -18, 10);

    // Hair — styled dark brown, slightly tousled
    g.fillStyle(0x3a2210);
    g.fillEllipse(0, -24, 20, 11);
    g.fillRoundedRect(-10, -26, 20, 10, 5);
    // Side hair
    g.fillRoundedRect(-11, -22, 4, 6, 2);
    g.fillRoundedRect(7, -22, 4, 6, 2);

    // Ears
    g.fillStyle(0xe8b07a);
    g.fillCircle(-10, -18, 2.5);
    g.fillCircle(10, -18, 2.5);

    // Eyes — expressive with whites
    g.fillStyle(0xffffff);
    g.fillEllipse(-4, -18, 5, 4);
    g.fillEllipse(4, -18, 5, 4);
    g.fillStyle(0x2c1810);
    g.fillCircle(-4, -18, 1.5);
    g.fillCircle(4, -18, 1.5);
    // Eye highlights
    g.fillStyle(0xffffff, 0.8);
    g.fillCircle(-3.5, -19, 0.7);
    g.fillCircle(4.5, -19, 0.7);

    // Eyebrows
    g.lineStyle(1.5, 0x3a2210);
    g.lineBetween(-6, -21, -2, -21.5);
    g.lineBetween(2, -21.5, 6, -21);

    // Nose
    g.fillStyle(0xe0a878, 0.5);
    g.fillCircle(0, -16, 1);

    // Mouth — friendly smile
    g.lineStyle(1, 0xcc8866);
    g.beginPath();
    g.arc(0, -13, 3, 0.3, Math.PI - 0.3);
    g.strokePath();

    // Name tag on apron
    g.fillStyle(0xffffff, 0.9);
    g.fillRoundedRect(-7, 1, 14, 5, 1);
    g.lineStyle(0.5, 0xd4a854);
    g.strokeRoundedRect(-7, 1, 14, 5, 1);
    g.fillStyle(0x666666);
    g.fillRect(-5, 2.5, 10, 1);
    g.fillRect(-4, 4, 6, 1);

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
