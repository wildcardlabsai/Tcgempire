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
    const cam = this.scene.cameras.main;
    const y = 52 + this.toasts.length * 36;

    const text = this.scene.add.text(0, 0, message, {
      fontFamily: '"Segoe UI", Arial, sans-serif',
      fontSize: '13px',
      color: color,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const bg = this.scene.add.rectangle(0, 0, text.width + 20, 28, 0x000000, 0.7);
    bg.setStrokeStyle(1, Phaser.Display.Color.HexStringToColor(color).color, 0.5);

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
    const cam = this.scene.cameras.main;

    // Top bar background — full width, compact
    const barHeight = 36;
    const barBg = this.scene.add.rectangle(cam.width / 2, barHeight / 2, cam.width, barHeight, 0x1a1a2e, 0.85);
    barBg.setStrokeStyle(1, 0xd4a854, 0.4);

    // Gold accent line at bottom of bar
    const accentLine = this.scene.add.rectangle(cam.width / 2, barHeight, cam.width, 2, 0xd4a854, 0.5);

    const iconStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: '"Segoe UI", Arial, sans-serif',
      fontSize: '13px',
      color: '#d4a854',
      fontStyle: 'bold',
    };
    const valStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: '"Segoe UI", Arial, sans-serif',
      fontSize: '13px',
      color: '#ffffff',
    };
    const dimStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: '"Segoe UI", Arial, sans-serif',
      fontSize: '11px',
      color: '#aaaaaa',
    };

    // Layout: left section has cash + day + level, right has customers + rating + end day
    let xPos = 12;

    // Cash icon + value
    const cashIcon = this.scene.add.text(xPos, barHeight / 2, '£', iconStyle).setOrigin(0, 0.5);
    xPos += cashIcon.width + 2;
    this.cashText = this.scene.add.text(xPos, barHeight / 2, '', valStyle).setOrigin(0, 0.5);
    xPos += 70;

    // Day
    const dayIcon = this.scene.add.text(xPos, barHeight / 2, 'Day', iconStyle).setOrigin(0, 0.5);
    xPos += dayIcon.width + 4;
    this.dayText = this.scene.add.text(xPos, barHeight / 2, '', valStyle).setOrigin(0, 0.5);
    xPos += 30;

    // Level
    const lvlIcon = this.scene.add.text(xPos, barHeight / 2, 'Lv', iconStyle).setOrigin(0, 0.5);
    xPos += lvlIcon.width + 4;
    this.levelText = this.scene.add.text(xPos, barHeight / 2, '', valStyle).setOrigin(0, 0.5);
    xPos += 30;

    // Customers
    this.customerText = this.scene.add.text(xPos, barHeight / 2, '', dimStyle).setOrigin(0, 0.5);
    xPos += 60;

    // Rating — stars
    this.ratingText = this.scene.add.text(xPos, barHeight / 2, '', {
      ...dimStyle,
      color: '#d4a854',
    }).setOrigin(0, 0.5);

    this.container = this.scene.add.container(0, 0, [
      barBg,
      accentLine,
      cashIcon,
      this.cashText,
      dayIcon,
      this.dayText,
      lvlIcon,
      this.levelText,
      this.customerText,
      this.ratingText,
    ]);
    this.container.setDepth(200);
    this.container.setScrollFactor(0);

    // End Day button — polished style
    const btnW = 90;
    const btnH = 28;
    const btnBg = this.scene.add.rectangle(0, 0, btnW, btnH, 0x8b2252);
    btnBg.setStrokeStyle(1, 0xd4a854, 0.6);
    const btnText = this.scene.add.text(0, 0, 'End Day', {
      fontFamily: '"Segoe UI", Arial, sans-serif',
      fontSize: '12px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.endDayButton = this.scene.add.container(0, 0, [btnBg, btnText]);
    this.endDayButton.setSize(btnW, btnH);
    this.endDayButton.setInteractive({ useHandCursor: true });
    this.endDayButton.setDepth(201);
    this.endDayButton.setScrollFactor(0);

    this.endDayButton.on('pointerdown', () => {
      if (this.onEndDay) this.onEndDay();
    });
    this.endDayButton.on('pointerover', () => {
      btnBg.setFillStyle(0xa63272);
      this.scene.tweens.add({ targets: [btnBg, btnText], scaleX: 1.05, scaleY: 1.05, duration: 80 });
    });
    this.endDayButton.on('pointerout', () => {
      btnBg.setFillStyle(0x8b2252);
      this.scene.tweens.add({ targets: [btnBg, btnText], scaleX: 1, scaleY: 1, duration: 80 });
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
    this.cashText.setText(cash);
    this.dayText.setText(`${GameState.day}`);
    this.levelText.setText(`${GameState.shopLevel}`);
    this.customerText.setText(`${this.customerCount}`);

    const rating = Decorations.getRating();
    let stars = '';
    for (let i = 1; i <= 5; i++) {
      stars += i <= Math.round(rating) ? '★' : '☆';
    }
    this.ratingText.setText(stars);
  }

  private updateButtonPosition(): void {
    const cam = this.scene.cameras.main;
    this.endDayButton.setPosition(cam.width - 56, 18);
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
