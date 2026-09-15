import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { ShopRenderer } from '../systems/ShopRenderer';
import { InteractionSystem } from '../systems/InteractionSystem';
import { HUD } from '../ui/HUD';
import { TouchControls } from '../ui/TouchControls';
import { SHOP, PLAYER_START } from '../config/shop-layout';

const SPEED = 160;

export class ShopScene extends Phaser.Scene {
  private player!: Player;
  private hud!: HUD;
  private touchControls!: TouchControls;
  private interaction!: InteractionSystem;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: Record<string, Phaser.Input.Keyboard.Key>;
  private interactKey!: Phaser.Input.Keyboard.Key;
  private interactHint!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'ShopScene' });
  }

  create(): void {
    this.cameras.main.fadeIn(400, 0, 0, 0);

    const shopRenderer = new ShopRenderer(this);
    shopRenderer.draw();

    this.player = new Player(this, PLAYER_START.x, PLAYER_START.y);

    this.interaction = new InteractionSystem(this);

    this.hud = new HUD(this);

    this.touchControls = new TouchControls(this);
    this.touchControls.create();

    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasd = {
        w: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        a: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        s: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        d: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      };
      this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    }

    this.interactHint = this.add.text(0, 0, '[E] Interact', {
      fontFamily: '"Segoe UI", Arial, sans-serif',
      fontSize: '12px',
      color: '#ffd700',
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: { x: 6, y: 3 },
    });
    this.interactHint.setOrigin(0.5);
    this.interactHint.setDepth(99);
    this.interactHint.setVisible(false);

    this.cameras.main.setBounds(0, 0, SHOP.width, SHOP.height);
    this.cameras.main.startFollow(this.player.sprite, true, 0.1, 0.1);

    this.scale.on('resize', () => {
      this.touchControls.updateLayout();
    });
  }

  update(_time: number, delta: number): void {
    this.handleInput();
    this.player.update(delta);
    this.hud.update();
    this.updateInteractHint();
    this.handleInteraction();
  }

  private handleInput(): void {
    if (this.cursors) {
      this.player.handleKeyboardInput(this.cursors, this.wasd);
    }

    if (this.touchControls.visible && (this.touchControls.dirX !== 0 || this.touchControls.dirY !== 0)) {
      this.player.setVelocity(
        this.touchControls.dirX * SPEED,
        this.touchControls.dirY * SPEED
      );
    }
  }

  private handleInteraction(): void {
    const keyboardInteract = this.interactKey && Phaser.Input.Keyboard.JustDown(this.interactKey);
    const touchInteract = this.touchControls.consumeInteract();

    if (keyboardInteract || touchInteract) {
      this.interaction.interact(this.player.x, this.player.y);
    }
  }

  private updateInteractHint(): void {
    const nearby = this.interaction.hasNearbyInteractable(this.player.x, this.player.y);
    this.interactHint.setVisible(nearby);
    if (nearby) {
      this.interactHint.setPosition(this.player.x, this.player.y - 28);
      if (this.touchControls.visible) {
        this.interactHint.setText('Tap E');
      }
    }
  }
}
