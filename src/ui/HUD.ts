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
    this.customerText = this.scene.add.text(0, 84, '', { ...style, fontSize: '12px', color: '#aaaaaa' });
    this.ratingText = this.scene.add.text(0, 100, '', { ...style, fontSize: '12px', color: '#ffd700' });

    const bg = this.scene.add.rectangle(80, 60, 180, 140, 0x000000, 0.5);
    bg.setStrokeStyle(1, 0xffd700, 0.3);

    this.container = this.scene.add.container(0, 0, [
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

    const btnBg = this.scene.add.rectangle(0, 0, 90, 30, 0xc0392b);
    btnBg.setStrokeStyle(1, 0xe74c3c);
    const btnText = this.scene.add.text(0, 0, 'End Day', {
      fontFamily: '"Segoe UI", Arial, sans-serif',
      fontSize: '12px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.endDayButton = this.scene.add.container(0, 0, [btnBg, btnText]);
    this.endDayButton.setSize(90, 30);
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

    this.updatePosition();
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

  updatePosition(): void {
    const cam = this.scene.cameras.main;
    this.container.setPosition(cam.scrollX + 12, cam.scrollY + 12);
    this.endDayButton.setPosition(cam.scrollX + cam.width - 60, cam.scrollY + 24);
  }

  update(delta: number): void {
    if (this.cashFlashTimer > 0) {
      this.cashFlashTimer -= delta / 1000;
    }
    this.updatePosition();
    this.refresh();
  }
}
