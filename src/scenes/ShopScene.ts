import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { ShopRenderer } from '../systems/ShopRenderer';
import { InteractionSystem } from '../systems/InteractionSystem';
import { CustomerManager } from '../systems/CustomerManager';
import { DayManager } from '../systems/DayManager';
import { HUD } from '../ui/HUD';
import { TouchControls } from '../ui/TouchControls';
import { UIOverlay } from '../ui/UIOverlay';
import { ComputerPanel } from '../ui/ComputerPanel';
import { ShelfPanel } from '../ui/ShelfPanel';
import { CheckoutPanel } from '../ui/CheckoutPanel';
import { DaySummaryPanel } from '../ui/DaySummaryPanel';
import { StoragePanel } from '../ui/StoragePanel';
import { PackOpeningPanel } from '../ui/PackOpeningPanel';
import { CollectionPanel } from '../ui/CollectionPanel';
import { SHOP, PLAYER_START } from '../config/shop-layout';
import { Inventory } from '../data/Inventory';
import { SaveManager } from '../data/SaveManager';

const SPEED = 160;

export class ShopScene extends Phaser.Scene {
  private player!: Player;
  private hud!: HUD;
  private touchControls!: TouchControls;
  private interaction!: InteractionSystem;
  private customerManager!: CustomerManager;
  private dayManager!: DayManager;
  private shopRenderer!: ShopRenderer;

  private overlay!: UIOverlay;
  private computerPanel!: ComputerPanel;
  private shelfPanel!: ShelfPanel;
  private checkoutPanel!: CheckoutPanel;
  private daySummaryPanel!: DaySummaryPanel;
  private storagePanel!: StoragePanel;
  private packOpeningPanel!: PackOpeningPanel;
  private collectionPanel!: CollectionPanel;

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: Record<string, Phaser.Input.Keyboard.Key>;
  private interactKey!: Phaser.Input.Keyboard.Key;
  private interactHint!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'ShopScene' });
  }

  create(): void {
    this.cameras.main.fadeIn(400, 0, 0, 0);

    if (!SaveManager.hasSave()) {
      Inventory.moveToShelf('dragon-booster', 5);
      Inventory.moveToShelf('ocean-booster', 5);
      Inventory.moveToShelf('forest-booster', 3);
    }

    this.shopRenderer = new ShopRenderer(this);
    this.shopRenderer.draw();

    this.player = new Player(this, PLAYER_START.x, PLAYER_START.y);

    this.interaction = new InteractionSystem(this);
    this.setupInteractions();

    this.customerManager = new CustomerManager(this);

    this.dayManager = new DayManager();
    this.dayManager.setOnSummary((summary) => {
      this.customerManager.pause();
      SaveManager.save();
      this.daySummaryPanel.show(summary, () => {
        this.dayManager.startNextDay();
        this.customerManager.resetDailyStats();
        this.customerManager.resume();
      });
    });

    this.hud = new HUD(this);
    this.hud.setOnEndDay(() => {
      if (this.overlay.isVisible()) return;
      this.dayManager.endDay(
        this.customerManager.customersServedToday,
        this.customerManager.revenueToday
      );
    });

    this.overlay = new UIOverlay();
    this.computerPanel = new ComputerPanel(this.overlay);
    this.shelfPanel = new ShelfPanel(this.overlay);
    this.checkoutPanel = new CheckoutPanel(this.overlay);
    this.daySummaryPanel = new DaySummaryPanel(this.overlay);
    this.storagePanel = new StoragePanel(this.overlay);
    this.packOpeningPanel = new PackOpeningPanel(this.overlay);
    this.collectionPanel = new CollectionPanel(this.overlay);

    this.storagePanel.setOnOpenPacks(() => {
      this.packOpeningPanel.show(() => {});
    });

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

  private setupInteractions(): void {
    this.interaction.onInteract('counter', () => {
      if (this.overlay.isVisible()) return;
      const waiting = this.customerManager.getWaitingCustomer();
      if (waiting && waiting.desiredProduct) {
        this.checkoutPanel.show(waiting, () => {}, (revenue) => {
          this.customerManager.customersServedToday++;
          this.customerManager.revenueToday += revenue;
          this.hud.flashCash();
          this.shopRenderer.refreshProducts();
        });
      } else {
        this.interaction.showPopup('No customers waiting.', this.player.x, this.player.y - 40);
      }
    });

    this.interaction.onInteract('shelf-left', () => {
      if (this.overlay.isVisible()) return;
      this.shelfPanel.show(() => {}, () => {
        this.shopRenderer.refreshProducts();
      });
    });

    this.interaction.onInteract('shelf-right', () => {
      if (this.overlay.isVisible()) return;
      this.shelfPanel.show(() => {}, () => {
        this.shopRenderer.refreshProducts();
      });
    });

    this.interaction.onInteract('computer', () => {
      if (this.overlay.isVisible()) return;
      this.computerPanel.show(() => {});
    });

    this.interaction.onInteract('storage', () => {
      if (this.overlay.isVisible()) return;
      this.storagePanel.show(() => {});
    });
  }

  update(_time: number, delta: number): void {
    if (this.overlay.isVisible()) return;

    this.handleInput();
    this.player.update(delta);

    if (this.dayManager.isOpen()) {
      this.customerManager.update(delta);
    }

    this.hud.setCustomerCount(this.customerManager.getCustomerCount());
    this.hud.update(delta);
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
