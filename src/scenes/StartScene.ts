import Phaser from 'phaser';

export class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: 'StartScene' });
  }

  create(): void {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor('#1a1a2e');

    const title = this.add.text(width / 2, height * 0.28, 'TCG EMPIRE', {
      fontFamily: '"Georgia", "Times New Roman", serif',
      fontSize: '48px',
      color: '#ffd700',
      fontStyle: 'bold',
      stroke: '#8b6914',
      strokeThickness: 3,
    });
    title.setOrigin(0.5);

    const taglines = [
      'Build your shop.',
      'Build your collection.',
      'Build your empire.',
    ];

    const tagY = height * 0.44;
    taglines.forEach((line, i) => {
      const t = this.add.text(width / 2, tagY + i * 28, line, {
        fontFamily: '"Segoe UI", Arial, sans-serif',
        fontSize: '18px',
        color: '#cccccc',
      });
      t.setOrigin(0.5);
      t.setAlpha(0);
      this.tweens.add({
        targets: t,
        alpha: 1,
        y: t.y - 5,
        duration: 600,
        delay: 300 + i * 200,
        ease: 'Power2',
      });
    });

    const btnW = 180;
    const btnH = 50;
    const btnY = height * 0.72;

    const btnBg = this.add.rectangle(width / 2, btnY, btnW, btnH, 0xc0392b);
    btnBg.setStrokeStyle(2, 0xe74c3c);
    btnBg.setInteractive({ useHandCursor: true });

    const btnText = this.add.text(width / 2, btnY, 'PLAY', {
      fontFamily: '"Segoe UI", Arial, sans-serif',
      fontSize: '22px',
      color: '#ffffff',
      fontStyle: 'bold',
    });
    btnText.setOrigin(0.5);

    btnBg.on('pointerover', () => {
      btnBg.setFillStyle(0xe74c3c);
      this.tweens.add({ targets: [btnBg, btnText], scaleX: 1.05, scaleY: 1.05, duration: 100 });
    });

    btnBg.on('pointerout', () => {
      btnBg.setFillStyle(0xc0392b);
      this.tweens.add({ targets: [btnBg, btnText], scaleX: 1, scaleY: 1, duration: 100 });
    });

    btnBg.on('pointerdown', () => {
      this.cameras.main.fadeOut(400, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('ShopScene');
      });
    });

    const cardColors = [0xe74c3c, 0x3498db, 0x2ecc71, 0xf39c12, 0x9b59b6];
    for (let i = 0; i < 5; i++) {
      const cx = width * 0.15 + (width * 0.7 / 4) * i;
      const cy = height * 0.92;
      const card = this.add.rectangle(cx, cy, 28, 40, cardColors[i], 0.4);
      card.setStrokeStyle(1, 0xffffff, 0.2);
      card.setAngle(-10 + i * 5);
    }

    this.handleResize();
    this.scale.on('resize', () => this.handleResize());
  }

  private handleResize(): void {
    const { width, height } = this.scale;

    this.children.each((child) => {
      if (child instanceof Phaser.GameObjects.Text || child instanceof Phaser.GameObjects.Rectangle) {
        // We recreate on resize for simplicity — scenes are lightweight
      }
    });

    if (width < 500) {
      this.children.each((child) => {
        if (child instanceof Phaser.GameObjects.Text) {
          const currentSize = parseInt(child.style.fontSize as string);
          if (currentSize > 30) {
            child.setFontSize(32);
          }
        }
      });
    }
  }
}
