import Phaser from 'phaser';
import { GameState } from '../data/GameState';
import { Decorations } from '../data/Decorations';

export class HUD {
  private scene: Phaser.Scene;
  private container!: Phaser.GameObjects.Container;
  private cashText!: Phaser.GameObjects.Text;
  private dayText!: Phaser.GameObjects.Text;
  private levelText!: Phaser.GameObjects.Text;
  private customerText!: Phaser.GameObjects.Text;
  private ratingText!: Phaser.GameObjects.Text;

  private endDayButton!: Phaser.GameObjects.Container;
  private onEndDay: (() => void) | null = null;

  private customerCount = 0;
  private cashFlashTimer = 0;

  private toasts: { container: Phaser.GameObjects.Container; timer: number }[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.create();
  }

  setOnEndDay(cb: () => void): void {
    this.onEndDay = cb;
  }

  setCustomerCount(count: number): void {
    this.customerCount = count;
  }

  flashCash(): void {
    this.cashFlashTimer = 0.5;
  }

  showToast(message: string, color: string = '#2ecc71'): void {
    const y = 60 + this.toasts.length * 36;

    const text = this.scene.add.text(0, 0, message, {
      fontFamily: '"Segoe UI", Arial, sans-serif',
      fontSize: '13px',
      color: color,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const bg = this.scene.add.rectangle(0, 0, text.width + 20, 28, 0x000000, 0.7);
    bg.setStrokeStyle(1, Phaser.Display.Color.HexStringToColor(color).color, 0.5);

    const cam = this.scene.cameras.main;
    const toast = this.scene.add.container(cam.width / 2, y, [bg, text]);
    toast.setDepth(250);
    toast.setScrollFactor(0);
    toast.setAlpha(0);

    this.scene.tweens.add({
      targets: toast,
      alpha: 1,
      y: y - 10,
      duration: 200,
      ease: 'Back.easeOut',
    });

    this.toasts.push({ container: toast, timer: 2.0 });
  }

  private create(): void {
    const style: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: '"Segoe UI", Arial, sans-serif',
      fontSize: '14px',
      color: '#ffffff',
    };

    const titleText = this.scene.add.text(10, 8, 'TCG EMPIRE', {
      ...style,
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#ffd700',
    });

    this.cashText = this.scene.add.text(10, 30, '', style);
    this.dayText = this.scene.add.text(10, 48, '', style);
    this.levelText = this.scene.add.text(10, 66, '', style);
    this.customerText = this.scene.add.text(10, 88, '', { ...style, fontSize: '12px', color: '#aaaaaa' });
    this.ratingText = this.scene.add.text(10, 104, '', { ...style, fontSize: '12px', color: '#ffd700' });

    const bg = this.scene.add.rectangle(0, 0, 180, 128, 0x000000, 0.5);
    bg.setOrigin(0, 0);
    bg.setStrokeStyle(1, 0xffd700, 0.3);

    this.container = this.scene.add.container(6, 6, [
      bg,
      titleText,
      this.cashText,
      this.dayText,
      this.levelText,
      this.customerText,
      this.ratingText,
    ]);
    this.container.setDepth(200);
    this.container.setScrollFactor(0);

    const btnBg = this.scene.add.rectangle(0, 0, 100, 34, 0xc0392b);
    btnBg.setStrokeStyle(1, 0xe74c3c);
    const btnText = this.scene.add.text(0, 0, 'End Day', {
      fontFamily: '"Segoe UI", Arial, sans-serif',
      fontSize: '14px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.endDayButton = this.scene.add.container(0, 0, [btnBg, btnText]);
    this.endDayButton.setSize(100, 34);
    this.endDayButton.setInteractive({ useHandCursor: true });
    this.endDayButton.setDepth(201);
    this.endDayButton.setScrollFactor(0);

    this.endDayButton.on('pointerdown', () => {
      if (this.onEndDay) this.onEndDay();
    });
    this.endDayButton.on('pointerover', () => {
      btnBg.setFillStyle(0xe74c3c);
    });
    this.endDayButton.on('pointerout', () => {
      btnBg.setFillStyle(0xc0392b);
    });

    this.updateButtonPosition();
    this.refresh();
  }

  refresh(): void {
    const cash = GameState.cash.toLocaleString('en-GB');
    if (this.cashFlashTimer > 0) {
      this.cashText.setColor('#2ecc71');
    } else {
      this.cashText.setColor('#ffffff');
    }
    this.cashText.setText(`Cash: £${cash}`);
    this.dayText.setText(`Day: ${GameState.day}`);
    this.levelText.setText(`Shop Level: ${GameState.shopLevel}`);
    this.customerText.setText(`Customers in shop: ${this.customerCount}`);

    const rating = Decorations.getRating();
    let stars = '';
    for (let i = 1; i <= 5; i++) {
      stars += i <= Math.round(rating) ? '★' : '☆';
    }
    this.ratingText.setText(`Rating: ${stars}`);
  }

  private updateButtonPosition(): void {
    const cam = this.scene.cameras.main;
    this.endDayButton.setPosition(cam.width - 64, 24);
  }

  update(delta: number): void {
    const dt = delta / 1000;
    if (this.cashFlashTimer > 0) {
      this.cashFlashTimer -= dt;
    }
    this.updateButtonPosition();
    this.refresh();

    this.toasts = this.toasts.filter((t) => {
      t.timer -= dt;
      if (t.timer <= 0) {
        this.scene.tweens.add({
          targets: t.container,
          alpha: 0,
          y: t.container.y - 20,
          duration: 200,
          onComplete: () => t.container.destroy(),
        });
        return false;
      }
      return true;
    });
  }
}
