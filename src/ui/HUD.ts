import Phaser from 'phaser';
import { GameState } from '../data/GameState';

export class HUD {
  private scene: Phaser.Scene;
  private container!: Phaser.GameObjects.Container;
  private cashText!: Phaser.GameObjects.Text;
  private dayText!: Phaser.GameObjects.Text;
  private levelText!: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.create();
  }

  private create(): void {
    const style: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: '"Segoe UI", Arial, sans-serif',
      fontSize: '14px',
      color: '#ffffff',
    };

    const titleText = this.scene.add.text(0, 0, 'TCG EMPIRE', {
      ...style,
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#ffd700',
    });

    this.cashText = this.scene.add.text(0, 24, '', style);
    this.dayText = this.scene.add.text(0, 44, '', style);
    this.levelText = this.scene.add.text(0, 64, '', style);

    const bg = this.scene.add.rectangle(75, 42, 170, 96, 0x000000, 0.5);
    bg.setStrokeStyle(1, 0xffd700, 0.3);

    this.container = this.scene.add.container(0, 0, [
      bg,
      titleText,
      this.cashText,
      this.dayText,
      this.levelText,
    ]);

    this.container.setDepth(200);
    this.container.setScrollFactor(0);

    this.updatePosition();
    this.refresh();
  }

  refresh(): void {
    const cash = GameState.cash.toLocaleString('en-GB');
    this.cashText.setText(`Cash: £${cash}`);
    this.dayText.setText(`Day: ${GameState.day}`);
    this.levelText.setText(`Shop Level: ${GameState.shopLevel}`);
  }

  updatePosition(): void {
    const cam = this.scene.cameras.main;
    this.container.setPosition(
      cam.scrollX + 12,
      cam.scrollY + 12
    );
  }

  update(): void {
    this.updatePosition();
    this.refresh();
  }
}
