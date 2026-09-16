import Phaser from 'phaser';

export class TouchControls {
  private scene: Phaser.Scene;
  private joystickBase!: Phaser.GameObjects.Arc;
  private joystickThumb!: Phaser.GameObjects.Arc;
  private interactButton!: Phaser.GameObjects.Container;
  private interactBtnBg!: Phaser.GameObjects.Arc;
  private interactBtnText!: Phaser.GameObjects.Text;
  private active = false;
  private baseX = 0;
  private baseY = 0;
  private pointerId: number | null = null;

  dirX = 0;
  dirY = 0;
  interactPressed = false;

  visible = false;
  private interactVisible = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  create(): void {
    if (!this.scene.sys.game.device.input.touch) return;

    this.visible = true;

    const vw = this.scene.scale.width;
    const vh = this.scene.scale.height;

    this.baseX = 90;
    this.baseY = vh - 110;

    this.joystickBase = this.scene.add.circle(this.baseX, this.baseY, 52, 0x000000, 0.3);
    this.joystickBase.setStrokeStyle(2, 0xffffff, 0.25);
    this.joystickBase.setScrollFactor(0);
    this.joystickBase.setDepth(300);

    this.joystickThumb = this.scene.add.circle(this.baseX, this.baseY, 22, 0xffffff, 0.35);
    this.joystickThumb.setScrollFactor(0);
    this.joystickThumb.setDepth(301);

    this.interactBtnBg = this.scene.add.circle(0, 0, 32, 0xd4a854, 0.7);
    this.interactBtnBg.setStrokeStyle(2, 0xffd700, 0.9);
    this.interactBtnText = this.scene.add.text(0, 0, 'TALK', {
      fontFamily: '"Segoe UI", Arial, sans-serif',
      fontSize: '13px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.interactButton = this.scene.add.container(vw - 70, vh - 110, [this.interactBtnBg, this.interactBtnText]);
    this.interactButton.setScrollFactor(0);
    this.interactButton.setDepth(300);
    this.interactButton.setSize(70, 70);
    this.interactButton.setInteractive();
    this.interactButton.setVisible(false);

    this.interactButton.on('pointerdown', () => {
      this.interactPressed = true;
      this.scene.tweens.add({
        targets: this.interactButton,
        scaleX: 0.9, scaleY: 0.9,
        duration: 60,
        yoyo: true,
      });
    });

    this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.pointerId !== null) return;
      const dx = pointer.x - this.baseX;
      const dy = pointer.y - this.baseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 90) {
        this.active = true;
        this.pointerId = pointer.id;
        this.joystickBase.setAlpha(1);
        this.joystickThumb.setAlpha(1);
      }
    });

    this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (!this.active || pointer.id !== this.pointerId) return;

      const dx = pointer.x - this.baseX;
      const dy = pointer.y - this.baseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 42;

      if (dist > 0) {
        const clampedDist = Math.min(dist, maxDist);
        const nx = (dx / dist) * clampedDist;
        const ny = (dy / dist) * clampedDist;
        this.joystickThumb.setPosition(this.baseX + nx, this.baseY + ny);

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
        this.joystickThumb.setPosition(this.baseX, this.baseY);
        this.joystickBase.setAlpha(0.6);
        this.joystickThumb.setAlpha(0.5);
      }
    });

    this.joystickBase.setAlpha(0.6);
    this.joystickThumb.setAlpha(0.5);

    this.updateLayout();
  }

  showInteractButton(label: string): void {
    if (!this.visible) return;
    if (!this.interactVisible) {
      this.interactButton.setVisible(true);
      this.interactButton.setAlpha(0);
      this.scene.tweens.add({ targets: this.interactButton, alpha: 1, duration: 120 });
      this.interactVisible = true;
    }
    this.interactBtnText.setText(label);
  }

  hideInteractButton(): void {
    if (!this.visible) return;
    if (this.interactVisible) {
      this.interactButton.setVisible(false);
      this.interactVisible = false;
    }
  }

  updateLayout(): void {
    if (!this.visible) return;
    const vw = this.scene.scale.width;
    const vh = this.scene.scale.height;

    this.baseX = 90;
    this.baseY = vh - 110;

    this.joystickBase.setPosition(this.baseX, this.baseY);
    if (!this.active) {
      this.joystickThumb.setPosition(this.baseX, this.baseY);
    }

    this.interactButton.setPosition(vw - 70, vh - 110);
  }

  consumeInteract(): boolean {
    if (this.interactPressed) {
      this.interactPressed = false;
      return true;
    }
    return false;
  }
}
