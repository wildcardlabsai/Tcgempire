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
    const vw = this.scene.scale.width;
    const y = 52 + this.toasts.length * 36;

    const text = this.scene.add.text(0, 0, message, {
      fontFamily: '"Segoe UI", Arial, sans-serif',
      fontSize: '12px',
      color: color,
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5);

    const bg = this.scene.add.rectangle(0, 0, text.width + 24, 28, 0x0a0a1a, 0.85);
    bg.setStrokeStyle(1, Phaser.Display.Color.HexStringToColor(color).color, 0.5);

    const toast = this.scene.add.container(vw / 2, y, [bg, text]);
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
    const vw = this.scene.scale.width;
    const barH = 34;

    const barBg = this.scene.add.rectangle(vw / 2, barH / 2, vw, barH, 0x1a1a2e, 0.9);
    barBg.setStrokeStyle(1, 0xd4a854, 0.3);

    const accentLine = this.scene.add.rectangle(vw / 2, barH, vw, 1.5, 0xd4a854, 0.4);

    const valFont: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: '"Segoe UI", Arial, sans-serif',
      fontSize: '12px',
      color: '#ffffff',
      fontStyle: 'bold',
    };
    const dimFont: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: '"Segoe UI", Arial, sans-serif',
      fontSize: '9px',
      color: '#aaaaaa',
    };

    let xPos = 10;

    const cashIcon = this.scene.add.text(xPos, barH / 2, '£', {
      fontFamily: '"Georgia", serif',
      fontSize: '13px',
      color: '#d4a854',
      fontStyle: 'bold',
    }).setOrigin(0, 0.5);
    xPos += cashIcon.width + 2;
    this.cashText = this.scene.add.text(xPos, barH / 2, '', valFont).setOrigin(0, 0.5);
    xPos += 60;

    const divider1 = this.scene.add.rectangle(xPos, barH / 2, 1, 16, 0xd4a854, 0.2);
    xPos += 8;

    const dayLabel = this.scene.add.text(xPos, barH / 2, 'D', { ...dimFont, fontSize: '8px', color: '#8a7a5a' }).setOrigin(0, 0.5);
    xPos += dayLabel.width + 2;
    this.dayText = this.scene.add.text(xPos, barH / 2, '', valFont).setOrigin(0, 0.5);
    xPos += 24;

    const divider2 = this.scene.add.rectangle(xPos, barH / 2, 1, 16, 0xd4a854, 0.2);
    xPos += 8;

    const lvlLabel = this.scene.add.text(xPos, barH / 2, 'LV', { ...dimFont, fontSize: '8px', color: '#8a7a5a' }).setOrigin(0, 0.5);
    xPos += lvlLabel.width + 2;
    this.levelText = this.scene.add.text(xPos, barH / 2, '', valFont).setOrigin(0, 0.5);
    xPos += 20;

    const divider3 = this.scene.add.rectangle(xPos, barH / 2, 1, 16, 0xd4a854, 0.2);
    xPos += 8;

    this.customerText = this.scene.add.text(xPos, barH / 2, '', { ...dimFont, fontSize: '10px' }).setOrigin(0, 0.5);
    xPos += 22;

    this.ratingText = this.scene.add.text(xPos, barH / 2, '', {
      ...dimFont,
      color: '#d4a854',
      fontSize: '10px',
    }).setOrigin(0, 0.5);

    this.container = this.scene.add.container(0, 0, [
      barBg,
      accentLine,
      cashIcon,
      this.cashText,
      divider1,
      dayLabel,
      this.dayText,
      divider2,
      lvlLabel,
      this.levelText,
      divider3,
      this.customerText,
      this.ratingText,
    ]);
    this.container.setDepth(200);
    this.container.setScrollFactor(0);

    const btnW = 80;
    const btnH = 26;

    const btnShadow = this.scene.add.rectangle(1, 1, btnW, btnH, 0x000000, 0.3);

    const btnBg = this.scene.add.graphics();
    btnBg.fillStyle(0x8b2252, 1);
    btnBg.fillRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 6);
    btnBg.fillStyle(0xa63272, 0.3);
    btnBg.fillRoundedRect(-btnW / 2 + 2, -btnH / 2 + 2, btnW - 4, btnH / 2, { tl: 4, tr: 4, bl: 0, br: 0 });
    btnBg.lineStyle(1, 0xd4a854, 0.5);
    btnBg.strokeRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 6);

    const btnText = this.scene.add.text(0, 0, '☾ End Day', {
      fontFamily: '"Segoe UI", Arial, sans-serif',
      fontSize: '10px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.endDayButton = this.scene.add.container(0, 0, [btnShadow, btnBg, btnText]);
    this.endDayButton.setSize(btnW, btnH);
    this.endDayButton.setInteractive({ useHandCursor: true });
    this.endDayButton.setDepth(201);
    this.endDayButton.setScrollFactor(0);

    this.endDayButton.on('pointerdown', () => {
      if (this.onEndDay) this.onEndDay();
    });
    this.endDayButton.on('pointerover', () => {
      this.scene.tweens.add({ targets: this.endDayButton, scaleX: 1.05, scaleY: 1.05, duration: 80 });
    });
    this.endDayButton.on('pointerout', () => {
      this.scene.tweens.add({ targets: this.endDayButton, scaleX: 1, scaleY: 1, duration: 80 });
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
    this.customerText.setText(`👤${this.customerCount}`);

    const rating = Decorations.getRating();
    let stars = '';
    for (let i = 1; i <= 5; i++) {
      stars += i <= Math.round(rating) ? '★' : '☆';
    }
    this.ratingText.setText(stars);
  }

  private updateButtonPosition(): void {
    const vw = this.scene.scale.width;
    this.endDayButton.setPosition(vw - 48, 17);

    const barBg = this.container.getAt(0) as Phaser.GameObjects.Rectangle;
    const accentLine = this.container.getAt(1) as Phaser.GameObjects.Rectangle;
    barBg.setPosition(vw / 2, 17);
    barBg.setSize(vw, 34);
    accentLine.setPosition(vw / 2, 34);
    accentLine.setSize(vw, 1.5);
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
