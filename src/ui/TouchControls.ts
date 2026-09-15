import Phaser from 'phaser';

export class TouchControls {
  private scene: Phaser.Scene;
  private joystickBase!: Phaser.GameObjects.Arc;
  private joystickThumb!: Phaser.GameObjects.Arc;
  private interactButton!: Phaser.GameObjects.Container;
  private active = false;
  private startX = 0;
  private startY = 0;
  private pointerId: number | null = null;

  dirX = 0;
  dirY = 0;
  interactPressed = false;

  visible = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  create(): void {
    if (!this.scene.sys.game.device.input.touch) return;

    this.visible = true;
    const cam = this.scene.cameras.main;

    this.joystickBase = this.scene.add.circle(0, 0, 50, 0x000000, 0.25);
    this.joystickBase.setStrokeStyle(2, 0xffffff, 0.3);
    this.joystickBase.setScrollFactor(0);
    this.joystickBase.setDepth(300);
    this.joystickBase.setAlpha(0);

    this.joystickThumb = this.scene.add.circle(0, 0, 20, 0xffffff, 0.4);
    this.joystickThumb.setScrollFactor(0);
    this.joystickThumb.setDepth(301);
    this.joystickThumb.setAlpha(0);

    const btnBg = this.scene.add.circle(0, 0, 30, 0xffd700, 0.5);
    btnBg.setStrokeStyle(2, 0xffd700, 0.8);
    const btnText = this.scene.add.text(0, 0, 'E', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '20px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.interactButton = this.scene.add.container(0, 0, [btnBg, btnText]);
    this.interactButton.setScrollFactor(0);
    this.interactButton.setDepth(300);
    this.interactButton.setSize(60, 60);
    this.interactButton.setInteractive();

    this.interactButton.on('pointerdown', () => {
      this.interactPressed = true;
    });

    this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (pointer.x < cam.width * 0.6 && this.pointerId === null) {
        this.active = true;
        this.pointerId = pointer.id;
        this.startX = pointer.x;
        this.startY = pointer.y;
        this.joystickBase.setPosition(pointer.x, pointer.y);
        this.joystickThumb.setPosition(pointer.x, pointer.y);
        this.joystickBase.setAlpha(1);
        this.joystickThumb.setAlpha(1);
      }
    });

    this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (!this.active || pointer.id !== this.pointerId) return;

      const dx = pointer.x - this.startX;
      const dy = pointer.y - this.startY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 40;

      if (dist > 0) {
        const clampedDist = Math.min(dist, maxDist);
        const nx = (dx / dist) * clampedDist;
        const ny = (dy / dist) * clampedDist;
        this.joystickThumb.setPosition(this.startX + nx, this.startY + ny);

        const deadzone = 8;
        if (dist > deadzone) {
          this.dirX = dx / dist;
          this.dirY = dy / dist;
        } else {
          this.dirX = 0;
          this.dirY = 0;
        }
      }
    });

    this.scene.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      if (pointer.id === this.pointerId) {
        this.active = false;
        this.pointerId = null;
        this.dirX = 0;
        this.dirY = 0;
        this.joystickBase.setAlpha(0);
        this.joystickThumb.setAlpha(0);
      }
    });

    this.updateLayout();
  }

  updateLayout(): void {
    if (!this.visible) return;
    const cam = this.scene.cameras.main;
    this.interactButton.setPosition(cam.width - 60, cam.height - 60);
  }

  consumeInteract(): boolean {
    if (this.interactPressed) {
      this.interactPressed = false;
      return true;
    }
    return false;
  }
}
